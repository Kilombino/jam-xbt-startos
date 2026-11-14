import { T } from '@start9labs/start-sdk'
import { randomBytes } from 'crypto'
import { dependencies } from './dependencies'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  chosenNode,
  filterPort,
  filterUser,
  nodeMount,
  nodes,
  oldCookieCopy,
  uiPort,
} from './utils'

// What Jam needs from either node's manifest (one of them is on an older SDK).
type NodeManifest = T.SDKManifest & {
  id: 'knots-blake2b' | 'bitcoind'
  volumes: ['main', 'i2pd']
}

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Jam'))

  const nodeId = await chosenNode(effects)
  const node = nodes[nodeId]

  // The node's RPC over the LXC bridge. Null while the node publishes no binding;
  // .const() restarts main when it appears.
  const rpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: nodeId,
      hostId: node.rpcHostId,
      internalPort: node.rpcPort,
    })
    .const()
  if (!rpc) {
    return sdk.Daemons.of(effects).addHealthCheck('node-rpc', {
      ready: {
        display: i18n('BLAKE2b node'),
        gracePeriod: 0,
        trigger: sdk.trigger.cooldownTrigger(30_000),
        fn: async () => {
          // Say exactly what is missing: StartOS's own "unmet dependencies" does not.
          const check = await dependencies.check(effects, [nodeId])
          const installed = check.infoFor(nodeId).result.installedVersion
          if (!installed)
            return {
              result: 'loading',
              message: `${node.title} (${nodeId}): ${i18n('not installed. Install it, or pick the other node with the action Choose BLAKE2b node')}`,
            }
          if (!check.installedVersionSatisfied(nodeId))
            return {
              result: 'failure',
              message: `${i18n('Update the BLAKE2b node: Jam needs 1.0.0:30 or later, installed is')} ${installed}`,
            }
          if (!check.runningSatisfied(nodeId))
            return {
              result: 'loading',
              message: i18n('The BLAKE2b node is stopped'),
            }
          return {
            result: 'loading',
            message: i18n('Waiting for the node to publish its RPC'),
          }
        },
      },
      requires: [],
    })
  }

  // Jam, jmwalletd, the maker, the taker and the orderbook watcher talk to the network:
  // their container gets no access to the node's volume (cookie) at all.
  const sub = await sdk.SubContainer.of(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'jam',
  )

  // JoinBlaket's RPC filter: the only container that can read the node's RPC cookie
  // (read-only, read again when the node writes a new one). It passes on only the RPCs
  // JoinBlaket uses, on its own wallets (see rpc_filter.py in the image).
  const filterSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of().mountDependency<NodeManifest>({
      dependencyId: nodeId,
      volumeId: 'main',
      subpath: null,
      mountpoint: nodeMount,
      readonly: true,
    }),
    'rpc-filter',
  )

  const rpcUrl = `http://${rpc}`
  const filterUrl = `http://127.0.0.1:${filterPort}`
  // The filter's own credentials: new on every start, only in these two containers.
  const filterPass = randomBytes(32).toString('hex')
  const filterEnv = {
    JM_RPC_FILTER_LISTEN: `127.0.0.1:${filterPort}`,
    JM_RPC_FILTER_CLIENT_USER: filterUser,
    JM_RPC_FILTER_CLIENT_PASS: filterPass,
  }

  return (
    sdk.Daemons.of(effects)
      // The image starts as root only to drop to uid 1000; hand /data to that uid, and
      // delete the copy of the node's cookie that versions up to 0.43.0:5 kept there.
      .addOneshot('perms', {
        subcontainer: sub,
        exec: {
          command: [
            'sh',
            '-c',
            `chown 1000:1000 /data && chmod 700 /data && rm -f ${oldCookieCopy}`,
          ],
          user: 'root',
        },
        requires: [],
      })
      .addDaemon('rpc-filter', {
        subcontainer: filterSub,
        exec: {
          command: ['python', '/usr/local/lib/jm-xbt/rpc_filter.py'],
          // root only to read the node's cookie (owned by the node's user); this
          // container has nothing else: no wallet data, no network-facing service.
          user: 'root',
          env: {
            ...filterEnv,
            JM_RPC_FILTER_NODE_URL: rpcUrl,
            JM_RPC_FILTER_NODE_COOKIE: `${nodeMount}/.cookie`,
            PYTHONUNBUFFERED: '1',
          },
        },
        ready: {
          display: i18n('RPC filter'),
          fn: () =>
            sdk.healthCheck.runHealthScript(
              [
                'env',
                ...Object.entries(filterEnv).map(([k, v]) => `${k}=${v}`),
                'python',
                '/usr/local/lib/jm-xbt/rpc_filter.py',
                '--check',
              ],
              filterSub,
              {
                timeout: 30_000,
                errorMessage: i18n(
                  'The RPC filter or the node does not answer',
                ),
                message: () => i18n('The node answers through the RPC filter'),
              },
            ),
        },
        requires: [],
      })
      // Waits for the node to answer (through the filter), then refuses anything but the
      // BLAKE2b chain (`bitcoind` is also the id of SHA256d Bitcoin) and anything but
      // mainnet: the image's own check, the same one the wallet backend makes.
      .addOneshot('chain', {
        subcontainer: sub,
        exec: {
          command: ['python', '/usr/local/lib/jm-xbt/preflight.py'],
          user: '1000',
          env: {
            BITCOIN__RPC_URL: filterUrl,
            BITCOIN__RPC_USER: filterUser,
            BITCOIN__RPC_PASSWORD: filterPass,
            JM_XBT_PREFLIGHT_TIMEOUT: '31536000',
            // keep the check's own settings files out of /data
            JOINMARKET_DATA_DIR: '/tmp/jm-preflight',
            HOME: '/tmp',
          },
        },
        requires: ['perms', 'rpc-filter'],
      })
      .addDaemon('jam', {
        subcontainer: sub,
        exec: {
          // tini -g -- jm-xbt-entrypoint: Tor, the orderbook watcher and jmwalletd (Jam),
          // as uid 1000, with the filter's URL and credentials only.
          command: sdk.useEntrypoint(),
          runAsInit: true,
          // Let a CoinJoin in progress finish.
          sigtermTimeout: 60_000,
          env: {
            BITCOIN_RPC_URL: filterUrl,
            BITCOIN_RPC_USER: filterUser,
            BITCOIN_RPC_PASS: filterPass,
            JM_XBT_RPC_FILTER: 'external',
            // StartOS terminates TLS on .local and .onion.
            JMWALLETD_NO_TLS: 'true',
          },
        },
        ready: {
          display: i18n('Web Interface'),
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, uiPort, {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not ready'),
            }),
        },
        // Not 'rpc-filter' itself: a node blip would then restart Jam mid-CoinJoin.
        requires: ['chain'],
      })
  )
})
