import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.41.0 = JoinMarket-NG 0.41.0, XBT build xbt3 (image tag 0.41.0-xbt3). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.41.0:3',
  releaseNotes: {
    en_US:
      'View in Kilowallet now also carries the wallet’s master key fingerprint, so a hardware signer such as SeedSigner can recognise its keys when you spend a fidelity bond from Kilowallet. Scan it again in Kilowallet to add it. JoinMarket-NG 0.41.0, Jam v2.0.0-beta.4, XBT build xbt3.',
    es_ES:
      'Ver en Kilowallet ahora lleva también la huella de la clave maestra de la cartera, para que un firmador como SeedSigner reconozca sus claves cuando gastes un fidelity bond desde Kilowallet. Vuelve a escanearlo en Kilowallet para añadirla. JoinMarket-NG 0.41.0, Jam v2.0.0-beta.4, compilación XBT xbt3.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
