export const short = {
  en_US:
    'CoinJoin on Bitcoin BLAKE2b (XBT): JoinMarket with the Jam web wallet',
  es_ES: 'CoinJoin en Bitcoin BLAKE2b (XBT): JoinMarket con la cartera web Jam',
}

export const long = {
  en_US:
    "JoinMarket-NG built for the Bitcoin BLAKE2b chain (XBT), with the Jam web wallet. Mix your coins with other people's in CoinJoins (as a taker), only with makers that hold a fidelity bond, or offer them to others and earn (as a maker, with a fidelity bond of your own); coins never leave your wallet. Reads the chain from your own BLAKE2b node and refuses any other. Talks to the XBT JoinMarket directory over its own Tor, with verified nick authentication. Every signature uses the unified sighash (0x21), so nothing can be replayed on the SHA-256 chain. It cannot talk to JoinMarket on the SHA-256 chain. Nothing to configure.",
  es_ES:
    'JoinMarket-NG hecho para la cadena Bitcoin BLAKE2b (XBT), con la cartera web Jam. Mezcla tus monedas con las de otros en CoinJoins (como taker), solo con makers que tienen bono de fidelidad, u ofrécelas a otros y gana (como maker, con tu propio bono de fidelidad); las monedas nunca salen de tu cartera. Lee la cadena de tu propio nodo BLAKE2b y se niega con cualquier otro. Habla con el directorio JoinMarket XBT por su propio Tor, con autenticación de nick verificada. Todas las firmas usan el sighash unificado (0x21): nada se puede repetir en la cadena SHA-256. No habla con JoinMarket de la cadena SHA-256. Nada que configurar.',
}

export const nodeDescription = {
  en_US:
    'Jam keeps a watch-only wallet in your own BLAKE2b node (its wallet feature must be on), reads balances and history from it and broadcasts through it. Either one works: Bitcoin Knots (BLAKE2b) Companion, or Bitcoin on the BLAKE2b chain.',
  es_ES:
    'Jam guarda una cartera de solo vigilancia en tu propio nodo BLAKE2b (con su función de cartera activada), lee de él saldos e historial y emite a través de él. Vale cualquiera de los dos: Bitcoin Knots (BLAKE2b) Companion, o Bitcoin en la cadena BLAKE2b.',
}
