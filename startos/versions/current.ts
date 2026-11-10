import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt1 (image tag 0.43.0-xbt1). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:1',
  releaseNotes: {
    en_US:
      'The app is now called JoinBlaket (same app, same data). JoinBlaket 0.43.0-xbt1: based on JoinMarket-NG 0.43.0, with its denial-of-service and wallet daemon fixes. The BLAKE2b protections stay the same (unified sighash 0x21, "xbt" network, only makers with a fidelity bond, fees from your own node). Security fix: the wallet daemon used by Jam now also refuses the Neutrino backend. Your wallets are kept. Jam v2.0.0-beta.4-xbt3.',
    es_ES:
      'La app pasa a llamarse JoinBlaket (la misma app, los mismos datos). JoinBlaket 0.43.0-xbt1: basado en JoinMarket-NG 0.43.0, con sus arreglos contra denegación de servicio y del daemon del monedero. Las protecciones de BLAKE2b no cambian (sighash unificado 0x21, red "xbt", solo makers con bono de fidelidad, comisiones de tu propio nodo). Arreglo de seguridad: el daemon que usa Jam ahora también rechaza el backend Neutrino. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt3.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
