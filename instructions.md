# JoinMarket XBT (Jam)

CoinJoin on Bitcoin BLAKE2b (XBT) with the Jam wallet. *Español abajo.*

## Documentation

- Tutorial (Spanish): <https://github.com/Kilombino/joinmarket-ng/blob/xbt/TUTORIAL-LINUX-ES.md>
- XBT notes: <https://github.com/Kilombino/joinmarket-ng/blob/xbt/XBT.md>

## Getting set up

1. Install a BLAKE2b node: **Bitcoin Knots (BLAKE2b) Companion** or **Bitcoin** on the
   BLAKE2b chain, with its wallet feature on (the default). If both are installed, the action
   *Choose BLAKE2b node* picks one.
2. Start Jam and open its web interface.
3. **Create new wallet**, choose a name and a password, and write the **12 words** on paper.

## Using Jam

- **Receive**, wait for 5 confirmations, then **Send** as a *collaborative transaction* to mix.
  Jam only mixes with makers that hold a **fidelity bond**; with fewer than 4 it stops and the logs
  say "Not enough makers with a fidelity bond".
- **Earn** offers your coins to other people's CoinJoins; they never leave your wallet. It needs a
  **fidelity bond**, or nobody takes your offer: *Earn → Create fidelity bond*. A bond **locks the
  coins in it until the date you choose**; they cannot be moved before. Keep Jam running while
  Earn is on. Bonds from a hardware wallet or cold storage are not supported for now.
- Jam refuses to start on a node that is not on the BLAKE2b chain. It only talks to XBT JoinMarket.
- Use a new set of words made in Jam, never one from the SHA-256 chain, and small amounts while
  the market is young.

---

# JoinMarket XBT (Jam) — español

1. Instala un nodo BLAKE2b: **Bitcoin Knots (BLAKE2b) Companion** o **Bitcoin** en la cadena
   BLAKE2b. Si tienes los dos, la acción *Elegir nodo BLAKE2b* escoge uno.
2. Arranca Jam y abre su interfaz web.
3. **Crear cartera nueva** → nombre y contraseña → apunta en papel las **12 palabras**.
4. **Recibir**, espera 5 confirmaciones, y **Enviar** como *transacción colaborativa* para
   mezclar. Solo se mezcla con makers que tienen **bono de fidelidad**.
5. **Ganar** ofrece tus monedas a otros y necesita un **bono de fidelidad** (si no, nadie acepta tu
   oferta): *Ganar → Crear bono de fidelidad*. El bono **bloquea las monedas hasta la fecha que
   elijas**; antes no se pueden mover. Bonos desde cartera hardware: por ahora no.

Jam no arranca con un nodo que no sea de la cadena BLAKE2b. Usa palabras nuevas creadas en Jam y
cantidades pequeñas mientras el mercado es joven.
