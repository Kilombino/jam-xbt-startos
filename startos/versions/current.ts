import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.41.0 = JoinMarket-NG 0.41.0, XBT build xbt2 (image tag 0.41.0-xbt2). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.41.0:2',
  releaseNotes: {
    en_US:
      'Settings › Wallet › View in Kilowallet (read-only): a QR code to follow this wallet from your phone with Kilowallet (balance of the five jars and fidelity bonds, with an alert when a bond unlocks). No private key leaves Jam. Jam also shows the new icon in the browser tab. JoinMarket-NG 0.41.0, Jam v2.0.0-beta.4, XBT build xbt2.',
    es_ES:
      'Ajustes › Cartera › Ver en Kilowallet (solo lectura): un código QR para seguir esta cartera desde el móvil con Kilowallet (saldo de los cinco botes y fidelity bonds, con aviso cuando un bond se desbloquea). Ninguna clave privada sale de Jam. Jam también muestra el icono nuevo en la pestaña del navegador. JoinMarket-NG 0.41.0, Jam v2.0.0-beta.4, compilación XBT xbt2.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
