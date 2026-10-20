<p align="center">
  <img src="icon.png" alt="JoinMarket XBT (Jam) Logo" width="21%">
</p>

# JoinMarket XBT (Jam) on StartOS

> Everything not listed in this document should behave the same as upstream
> JoinMarket-NG XBT and Jam. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

JoinMarket-NG built for Bitcoin BLAKE2b (XBT) —
[Kilombino/joinmarket-ng](https://github.com/Kilombino/joinmarket-ng), branch `xbt` — with
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
`xbt-docker/build.sh` in the joinmarket-ng repo. It runs as uid 1000 and refuses root. Its
entrypoint (`tini -g -- jm-xbt-entrypoint`, PID 1 here) starts Tor, checks the node
(`preflight.py`), then the orderbook watcher and `jmwalletd`, which serves the Jam UI and
launches the taker, maker and tumbler when Jam asks. If one process exits the container
exits and StartOS restarts it. One subcontainer, `jam`, runs two oneshots before the daemon:
`cookie` (as root: `chown` of `/data` to 1000 and a copy of the node's `.cookie` to
`/data/.rpc-cookie`, mode 0400) and `chain` (the preflight: waits for the node, then exits 2
unless it is BLAKE2b and on mainnet).

## Volume and Data Layout

One volume, `main`, mounted at `/data`. The node's `main` volume is mounted read-only at
`/mnt/node` for its `.cookie`.

| Path | What |
|---|---|
| `wallets/*.jmdat` | the encrypted wallets |
| `cmtdata/` | PoDLE commitments used and blacklisted |
| `wallet_metadata_*.jsonl`, `history.csv`, `state/` | labels, CoinJoin history, state |
| `tor/`, `ssl/`, `obwatcher/` | Tor state, an unused certificate, the watcher's data |
| `.rpc-cookie` | copy of the node's cookie, rewritten on every start |
| `startos-store.json` | the node choice (action *Choose BLAKE2b node*) |

## File Models

`startos-store.json` (`node`: `auto`, `knots-blake2b` or `bitcoind`), written by the action.
The application's `config.toml` is not managed: every setting comes from the image's
environment (XBT directory, `require_verified` nick authentication, Tor ports) plus
`BITCOIN_RPC_URL`, `BITCOIN_RPC_COOKIE` and `JMWALLETD_NO_TLS=true` set by `main.ts`.
Environment variables win over a hand-edited `/data/config.toml`. The image makes takers use only
makers with a fidelity bond (`TAKER__BONDLESS_MAKERS_ALLOWANCE=0`, no fallback to bondless ones:
the CoinJoin fails with "Not enough makers with a fidelity bond"), `TAKER__MINIMUM_MAKERS=4`.

## Dependencies

One BLAKE2b node, running, with its wallet feature on (jmwalletd creates a watch-only
wallet `jm_<fingerprint>_mainnet` in it): `knots-blake2b` (Bitcoin Knots (BLAKE2b)
Companion, `>=1.0.0:30`, RPC port 18443) or `bitcoind` (Bitcoin on the BLAKE2b chain, RPC
port 8332). Both are optional dependencies; the one in use is the chosen one, or with
`auto` the companion if installed, else `bitcoind`. Authentication is the node's cookie.

## Network Access and Interfaces

One interface, `ui` (type `ui`), port 28183, plain HTTP: jmwalletd's API, websocket
(`/jmws`) and the Jam UI. StartOS terminates TLS. Inside the container Tor (SOCKS 28185,
control 28186), the orderbook watcher (28184) and the maker's onion listener listen on
127.0.0.1 only. Outbound: Tor to the XBT directory
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
- `node-rpc` (*BLAKE2b node*), only while the chosen node publishes no RPC: says whether it is
  missing, too old or stopped.
- The `chain` oneshot fails (exit 2, "REFUSING TO START" in the logs) on a node that is not
  BLAKE2b or not mainnet; the service then stays stopped.

## Backups and Restore

The whole `main` volume. The wallets in it are encrypted with the user's Jam password; the
12 words restore the coins without it (but not the CoinJoin history or labels).

## Limitations and Differences

- Talks only to XBT JoinMarket peers; cannot talk to JoinMarket on the SHA-256 chain.
- Every signature uses sighash 0x21 (unified): nothing is replayable on the SHA-256 chain.
- Settings → View in Kilowallet: Jam reads jmwalletd's read-only
  `GET /api/v1/wallet/{name}/watch-export` (the five jar xpubs + bond timenumbers/locktimes + the master key
  fingerprint, no private key) and shows it as a QR for Kilowallet's watch-only JoinMarket wallet.
- Jam caches jmwalletd's settings in the browser session: lock and unlock after a change.
- If the node restarts with a new cookie, Jam reconnects only after the service restarts.
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
