import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt3 (image tag 0.43.0-xbt3). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:3',
  releaseNotes: {
    en_US:
      'JoinBlaket 0.43.0-xbt3. A fidelity bond can now be funded with any coin that is not frozen, not only CoinJoin outputs (there are no CoinJoins yet without makers); Jam warns that such a coin can be traced to its origin. Settings › Community now opens the BIP110 Telegram group and the JoinBlaket Discord. Telegram notices: the field now says "Your Telegram id" and refuses the bot\'s own number, a common mistake. From 0.43.0-xbt2: Telegram notices for makers set from Jam; a CoinJoin needs at least 1 maker and goes on with fewer makers than asked; makers still need a fidelity bond. Your wallets are kept. Jam v2.0.0-beta.4-xbt5.',
    es_ES:
      'JoinBlaket 0.43.0-xbt3. La fianza (bono de fidelidad) se puede pagar ahora con cualquier moneda no congelada, no solo con salidas de coinjoin (sin makers aún no hay coinjoins); Jam avisa de que esa moneda se puede rastrear hasta su origen. Ajustes › Comunidad abre ahora el grupo de Telegram BIP110 y el Discord de JoinBlaket. Avisos por Telegram: el campo dice "Tu id de Telegram" y rechaza el número del propio bot, una confusión habitual. De la 0.43.0-xbt2: avisos por Telegram para makers desde Jam; un coinjoin necesita como mínimo 1 maker y sigue con menos makers de los pedidos; los makers siguen necesitando bono de fidelidad. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt5.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
