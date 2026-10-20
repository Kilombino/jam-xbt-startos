import { T } from '@start9labs/start-sdk'
import { dependencies } from './dependencies'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { chosenNode, cookieCopy, nodeMount, nodes, uiPort } from './utils'

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

  const sub = await sdk.SubContainer.of(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      })
      // Read-only, for the RPC cookie: no password is generated, stored or handed around.
      .mountDependency<NodeManifest>({
        dependencyId: nodeId,
        volumeId: 'main',
        subpath: null,
        mountpoint: nodeMount,
        readonly: true,
      }),
    'jam',
  )

  const rpcUrl = `http://${rpc}`

  return (
    sdk.Daemons.of(effects)
      // The image runs as uid 1000 and refuses root: hand it /data and a copy of the
      // node's cookie it can read. Runs on every start, so a new cookie is picked up.
      .addOneshot('cookie', {
        subcontainer: sub,
        exec: {
          command: [
            'sh',
            '-c',
            `chown 1000:1000 /data && chmod 700 /data && install -o 1000 -g 1000 -m 0400 ${nodeMount}/.cookie ${cookieCopy}`,
          ],
          user: 'root',
        },
        requires: [],
      })
      // Waits for the node to answer, then refuses anything but the BLAKE2b chain
      // (`bitcoind` is also the id of SHA256d Bitcoin) and anything but mainnet:
      // the image's own check, the same one the wallet backend makes.
      .addOneshot('chain', {
        subcontainer: sub,
        exec: {
          command: ['python', '/usr/local/lib/jm-xbt/preflight.py'],
          env: {
            BITCOIN__RPC_URL: rpcUrl,
            BITCOIN__RPC_COOKIE_FILE: cookieCopy,
            JM_XBT_PREFLIGHT_TIMEOUT: '31536000',
            // keep the check's own settings files out of /data
            JOINMARKET_DATA_DIR: '/tmp/jm-preflight',
            HOME: '/tmp',
          },
        },
        requires: ['cookie'],
      })
      .addDaemon('jam', {
        subcontainer: sub,
        exec: {
          // tini -g -- jm-xbt-entrypoint: Tor, the orderbook watcher and jmwalletd (Jam).
          command: sdk.useEntrypoint(),
          runAsInit: true,
          // Let a CoinJoin in progress finish.
          sigtermTimeout: 60_000,
          env: {
            BITCOIN_RPC_URL: rpcUrl,
            BITCOIN_RPC_COOKIE: cookieCopy,
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
        requires: ['chain'],
      })
  )
})
