import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt6 (image tag 0.43.0-xbt6). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:6',
  releaseNotes: {
    en_US:
      "JoinBlaket 0.43.0-xbt6. Jam no longer has the node's RPC access: a small RPC filter, in its own container and the only one that can read the node's cookie, passes on just the 26 calls JoinBlaket uses, and only on JoinBlaket's own wallets. Jam and everything that talks to the network get the filter's credentials, new on every start; the copy of the node's cookie that older versions kept in Jam's data is deleted. New health check: RPC filter. If the filter is down, Jam shows the node as unreachable. From 0.43.0-xbt5: a CoinJoin with only 1 maker works. Your wallets are kept. Jam v2.0.0-beta.4-xbt6.",
    es_ES:
      'JoinBlaket 0.43.0-xbt6. Jam ya no tiene acceso RPC al nodo: un pequeño filtro RPC, en su propio contenedor y el único que puede leer la cookie del nodo, deja pasar solo las 26 llamadas que JoinBlaket usa, y solo sobre sus propias carteras. Jam y todo lo que habla con la red reciben las credenciales del filtro, nuevas en cada arranque; se borra la copia de la cookie del nodo que las versiones anteriores guardaban en los datos de Jam. Nueva comprobación de salud: Filtro RPC. Si el filtro está caído, Jam muestra el nodo como inalcanzable. De la 0.43.0-xbt5: funciona un coinjoin con un solo maker. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt6.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
