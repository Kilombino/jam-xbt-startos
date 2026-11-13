import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt2 (image tag 0.43.0-xbt2). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:2',
  releaseNotes: {
    en_US:
      'JoinBlaket 0.43.0-xbt2. Telegram notices for makers, set from Jam: Settings › Telegram notices (bot token and chat id, a test button, turn off). The token stays on your server and is never shown again. A CoinJoin now needs at least 1 maker by default (it was 4), and if there are fewer makers than you ask for it goes on with those there are, so the first CoinJoins can happen while the market is small; with a single maker, that maker can link your input to your output. Makers still need a fidelity bond. Your wallets are kept. Jam v2.0.0-beta.4-xbt4.',
    es_ES:
      'JoinBlaket 0.43.0-xbt2. Avisos por Telegram para makers, desde Jam: Ajustes › Avisos por Telegram (token del bot e id del chat, botón de prueba, apagar). El token se queda en tu servidor y no se vuelve a mostrar. Un coinjoin necesita ahora como mínimo 1 maker por defecto (antes 4), y si hay menos makers de los que pides sigue con los que haya, para que haya coinjoins aunque el mercado sea pequeño; con un solo maker, ese maker puede relacionar tu entrada con tu salida. Los makers siguen necesitando bono de fidelidad. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt4.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
