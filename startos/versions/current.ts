import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt7 (image tag 0.43.0-xbt7). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:7',
  releaseNotes: {
    en_US:
      'JoinBlaket 0.43.0-xbt7. When a collaborative send (CoinJoin) fails, Jam now says why on screen, in your language, instead of only "the collaborative flow has stopped". The send form shows the most one CoinJoin can send from the chosen jar: jar 0 does not combine coins that did not come from a CoinJoin (for your privacy), so one CoinJoin can spend at most your largest single coin, minus fees. Larger amounts are blocked with the way out (send less, or consolidate first by sending the coins to yourself without CoinJoin). The "wait for 5 confirmations" advice now appears only when waiting actually helps. From 0.43.0-xbt6: RPC filter, Jam has no direct access to the node. Your wallets are kept. Jam v2.0.0-beta.4-xbt7.',
    es_ES:
      'JoinBlaket 0.43.0-xbt7. Cuando un envío colaborativo (CoinJoin) falla, Jam ahora dice por qué en pantalla y en tu idioma, en vez de solo «el proceso colaborativo se ha detenido». El formulario de envío muestra lo máximo que un CoinJoin puede enviar desde el bote elegido: el bote 0 no junta monedas que no vienen de un CoinJoin (por tu privacidad), así que un CoinJoin puede gastar como mucho tu moneda más grande, menos comisiones. Los importes mayores se bloquean indicando la salida (enviar menos, o juntar antes las monedas enviándotelas a ti mismo sin CoinJoin). El consejo de «esperar 5 confirmaciones» solo aparece cuando esperar sirve de algo. De la 0.43.0-xbt6: filtro RPC, Jam no tiene acceso directo al nodo. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt7.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
