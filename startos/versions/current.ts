import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.41.0 = JoinMarket-NG 0.41.0, XBT build xbt1 (image tag 0.41.0-xbt1). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.41.0:1',
  releaseNotes: {
    en_US:
      'New icon. JoinMarket-NG 0.41.0 for Bitcoin BLAKE2b (XBT) with the Jam web wallet (v2.0.0-beta.4, XBT build xbt1), on your BLAKE2b node, with the XBT directory preconfigured.',
    es_ES:
      'Icono nuevo. JoinMarket-NG 0.41.0 para Bitcoin BLAKE2b (XBT) con la cartera web Jam (v2.0.0-beta.4, compilación XBT xbt1), sobre tu nodo BLAKE2b, con el directorio XBT ya configurado.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
