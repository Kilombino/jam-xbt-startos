import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt4 (image tag 0.43.0-xbt4). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:4',
  releaseNotes: {
    en_US:
      "JoinBlaket 0.43.0-xbt4. Your fee limits (Settings › Adjust fee limits) are kept after a restart. When creating a fidelity bond you can set its mining fee in sat/vB (empty: your node's estimate). The Telegram bot saved in Jam is turned on again at every start. From 0.43.0-xbt3: a bond can be funded with any unfrozen coin, with a warning; Settings › Community opens the BIP110 Telegram group and Discord. Your wallets are kept. Jam v2.0.0-beta.4-xbt6.",
    es_ES:
      'JoinBlaket 0.43.0-xbt4. Tus límites de comisión (Ajustes › Ajustar límites de comisión) se guardan tras un reinicio. Al crear una fianza puedes poner su comisión de minado en sat/vB (vacío: la estimación de tu nodo). El bot de Telegram guardado en Jam se vuelve a activar en cada arranque. De la 0.43.0-xbt3: la fianza se puede pagar con cualquier moneda no congelada, con aviso; Ajustes › Comunidad abre el Telegram BIP110 y el Discord. Tus carteras se conservan. Jam v2.0.0-beta.4-xbt6.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
