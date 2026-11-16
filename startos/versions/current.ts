import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt8 (image tag 0.43.0-xbt8). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:8',
  releaseNotes: {
    en_US:
      'JoinBlaket 0.43.0-xbt8. You can now create another fidelity bond while you already have one (Earn › Create Fidelity Bond), for example a bigger one or one locked until a later date, before the first expires. Bonds do not add up: your offer advertises only the one with the highest value, so a new bond only helps if it is worth more. The button works only with Earn stopped and no CoinJoin running; the wizard does not offer the month of a bond you already have, and existing bonds are never spent to create the new one. From 0.43.0-xbt7: Jam says why a CoinJoin failed and the most one CoinJoin can send from a jar. Your wallets are kept. Jam v2.0.0-beta.4-xbt8.',
    es_ES:
      'JoinBlaket 0.43.0-xbt8. Ya puedes crear otro bono de fidelidad aunque tengas uno (Ganar › Crear bono de fidelidad), por ejemplo uno mayor o con una fecha de vencimiento más lejana, antes de que venza el primero. Los bonos no se suman: tu oferta anuncia solo el de mayor valor, así que un bono nuevo solo te sirve si vale más. El botón solo funciona con Ganar parado y sin ningún CoinJoin en curso; el asistente no ofrece el mes de un bono que ya tengas y nunca gasta tus bonos actuales para crear el nuevo. De la 0.43.0-xbt7: Jam dice por qué falló un CoinJoin y lo máximo que un CoinJoin puede enviar desde un bote. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt8.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
