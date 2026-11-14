<p align="center">
  <img src="icon.png" alt="JoinBlaket Logo" width="21%">
</p>

# JoinBlaket on StartOS

> Everything not listed in this document should behave the same as upstream
> JoinBlaket (JoinMarket-NG for Bitcoin BLAKE2b) and Jam. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

JoinMarket-NG built for Bitcoin BLAKE2b (BTC) —
[Kilombino/joinblaket](https://github.com/Kilombino/joinblaket), branch `xbt` — with
the Jam web wallet ([Kilombino/jam](https://github.com/Kilombino/jam), branch `xbt`): CoinJoin
as a taker or a maker, against a BLAKE2b node.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, `ghcr.io/kilombino/jam-xbt` (x86_64 and aarch64), built reproducibly by
`xbt-docker/build.sh` in the joinblaket repo. Its entrypoint (`tini -g -- jm-xbt-entrypoint`,
PID 1 here) drops to uid 1000 (it never runs JoinBlaket as root), starts Tor, checks the node
(`preflight.py`), then the orderbook watcher and `jmwalletd`, which serves the Jam UI and
launches the taker, maker and tumbler when Jam asks. If one process exits the container
exits and StartOS restarts it. Two subcontainers of the same image:

- `rpc-filter`: daemon `rpc-filter`, JoinBlaket's RPC filter (`rpc_filter.py`, listening on
  127.0.0.1:28187). The only subcontainer that mounts the node's volume (read-only, for the
  `.cookie`, read again when the node writes a new one). It passes on to the node only the 26
  RPCs JoinBlaket uses, and only on its own wallets (`jm_<8 hex>_mainnet`); everything else gets
  "method not allowed" (list and how it was derived: joinblaket's XBT.md, "RPC filter").
- `jam`: oneshots `perms` (as root: `chown` of `/data` to 1000 and removal of the
  `/data/.rpc-cookie` copy older versions kept) and `chain` (the preflight through the filter:
  waits for the node, then exits 2 unless it is BLAKE2b and on mainnet), then the daemon `jam`
  with `JM_XBT_RPC_FILTER=external` and only the filter's URL and credentials (random, new on
  every start). It has no access to the node's cookie.

## Volume and Data Layout

One volume, `main`, mounted at `/data` in `jam`. The node's `main` volume is mounted read-only
at `/mnt/node` in `rpc-filter` only, for its `.cookie`.

| Path | What |
|---|---|
| `wallets/*.jmdat` | the encrypted wallets |
| `cmtdata/` | PoDLE commitments used and blacklisted |
| `wallet_metadata_*.jsonl`, `history.csv`, `state/` | labels, CoinJoin history, state |
| `tor/`, `ssl/`, `obwatcher/` | Tor state, an unused certificate, the watcher's data |
| `startos-store.json` | the node choice (action *Choose BLAKE2b node*) |

## File Models

`startos-store.json` (`node`: `auto`, `knots-blake2b` or `bitcoind`), written by the action.
The application's `config.toml` is not managed: every setting comes from the image's
environment (BLAKE2b JoinMarket directory, `require_verified` nick authentication, Tor ports) plus
`BITCOIN_RPC_URL`/`USER`/`PASS` (the filter's), `JM_XBT_RPC_FILTER=external` and
`JMWALLETD_NO_TLS=true` set by `main.ts`.
Environment variables win over a hand-edited `/data/config.toml`. The image makes takers use only
makers with a fidelity bond (`TAKER__BONDLESS_MAKERS_ALLOWANCE=0`, no fallback to bondless ones:
the CoinJoin fails with "Not enough makers with a fidelity bond"), `TAKER__MINIMUM_MAKERS=1`.

## Dependencies

One BLAKE2b node, running, with its wallet feature on (jmwalletd creates a watch-only
wallet `jm_<fingerprint>_mainnet` in it): `knots-blake2b` (Bitcoin Knots (BLAKE2b)
Companion, `>=1.0.0:30`, RPC port 18443) or `bitcoind` (Bitcoin on the BLAKE2b chain, RPC
port 8332). Both are optional dependencies; the one in use is the chosen one, or with
`auto` the companion if installed, else `bitcoind`. Authentication is the node's cookie, read
by the RPC filter only.

## Network Access and Interfaces

One interface, `ui` (type `ui`), port 28183, plain HTTP: jmwalletd's API, websocket
(`/jmws`) and the Jam UI. StartOS terminates TLS. Inside the container Tor (SOCKS 28185,
control 28186), the orderbook watcher (28184) and the maker's onion listener listen on
127.0.0.1 only. Outbound: Tor to the BLAKE2b JoinMarket directory
`f3tfzgk5ilwfapx427yx5ckeh7ptuvskfxnfnicfo747jyq5mgzdtvad.onion:5222` and to peers' onions;
the maker publishes an ephemeral onion through its own Tor while *Earn* is on.

## Installation and First-Run Flow

Nothing to configure. Install a BLAKE2b node, install Jam, start it, open the UI and create
or restore a wallet there (12 words, Jam's own password).

## Actions

- **Choose BLAKE2b node** (`choose-node`): which node to use (`auto`, `knots-blake2b`,
  `bitcoind`). Run it when both are installed and the wrong one is used. It writes
  `startos-store.json` and restarts the service. Idempotent; no outputs.

## Tasks

None.

## Health Checks

- `jam` (*Web Interface*): port 28183 listening.
- `rpc-filter` (*RPC filter*): one `getblockchaininfo` through the filter (`rpc_filter.py
  --check`); fails when the filter or the node does not answer. Jam then shows the node as
  unreachable.
- `node-rpc` (*BLAKE2b node*), only while the chosen node publishes no RPC: says whether it is
  missing, too old or stopped.
- The `chain` oneshot fails (exit 2, "REFUSING TO START" in the logs) on a node that is not
  BLAKE2b or not mainnet; the service then stays stopped.

## Backups and Restore

The whole `main` volume. The wallets in it are encrypted with the user's Jam password; the
12 words restore the coins without it (but not the CoinJoin history or labels).

## Limitations and Differences

- Talks only to JoinMarket peers on the BLAKE2b chain; cannot talk to JoinMarket on the SHA-256 chain.
- Every signature uses sighash 0x21 (unified): nothing is replayable on the SHA-256 chain.
- Settings → View in Kilowallet: Jam reads jmwalletd's read-only
  `GET /api/v1/wallet/{name}/watch-export` (the five jar xpubs + bond timenumbers/locktimes + the master key
  fingerprint, no private key) and shows it as a QR for Kilowallet's watch-only JoinMarket wallet.
- Jam caches jmwalletd's settings in the browser session: lock and unlock after a change.
- Takers use only makers with a fidelity bond; earning needs one (created from Jam, it locks the
  coins until the chosen date). Cold-storage / hardware-wallet bonds are not supported.

---

## Quick Reference for AI Consumers

```yaml
package_id: jam-xbt
image: ghcr.io/kilombino/jam-xbt
architectures: [x86_64, aarch64]
subcontainers: [jam]
volumes:
  main: /data
file_models:
  - startos-store.json
startos_managed_env_vars:
  - BITCOIN_RPC_URL
  - BITCOIN_RPC_COOKIE
  - JMWALLETD_NO_TLS
dependencies: [knots-blake2b, bitcoind]
interfaces:
  ui: { type: ui, port: 28183 }
actions:
  - choose-node
tasks: []
health_checks:
  - jam
  - node-rpc
```
