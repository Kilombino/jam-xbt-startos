import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt5 (image tag 0.43.0-xbt5). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:5',
  releaseNotes: {
    en_US:
      'JoinBlaket 0.43.0-xbt5. A CoinJoin with only 1 maker now works: Jam let you pick 1 collaborator but the wallet refused it ("counterparties: Input should be greater than or equal to 2"). This matters when only one maker\'s limits cover your amount. With a single maker, that maker can link your input to your output: privacy is only against outside observers. From 0.43.0-xbt4: fee limits kept after a restart, mining fee for the fidelity bond, Telegram bot turned on at every start. Your wallets are kept. Jam v2.0.0-beta.4-xbt6.',
    es_ES:
      'JoinBlaket 0.43.0-xbt5. Ya funciona un coinjoin con un solo maker: Jam dejaba elegir 1 colaborador pero la cartera lo rechazaba ("counterparties: Input should be greater than or equal to 2"). Importa cuando solo los límites de un maker cubren tu importe. Con un solo maker, ese maker puede relacionar tu entrada con tu salida: la privacidad es solo frente a observadores externos. De la 0.43.0-xbt4: límites de comisión que se guardan tras reiniciar, comisión de minado para la fianza y bot de Telegram activo en cada arranque. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt6.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
