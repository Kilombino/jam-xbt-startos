import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// 0.43.0 = JoinMarket-NG 0.43.0, XBT build xbt9 (image tag 0.43.0-xbt9). See UPDATING.md.
export const current = VersionInfo.of({
  version: '0.43.0:9',
  releaseNotes: {
    en_US:
      'JoinBlaket 0.43.0-xbt9. JoinBlaket now has three directories, the meeting points where makers announce their offers and takers find them: ours and two more run by trusted people. The app uses all three by default, so if one is down the market keeps working, and makers are seen by takers on any of them. Nothing to do on your side.',
    es_ES:
      'JoinBlaket 0.43.0-xbt9. JoinBlaket tiene ahora tres directorios, los puntos de encuentro donde los makers anuncian sus ofertas y los takers las encuentran: el nuestro y dos más de gente de confianza. La app usa los tres por defecto, así que si uno se cae el mercado sigue funcionando, y los takers ven a los makers en cualquiera de ellos. No tienes que hacer nada.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
