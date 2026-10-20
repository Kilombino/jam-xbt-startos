# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

## This repo

- **Don't import from the node packages** to get their host ids and ports — `knots-blake2b-startos` is on SDK 2 and breaks `tsc` here; `nodes` in `startos/utils.ts` copies both contracts (knots-blake2b: 18443; bitcoind POW: 8332).
- **Never drop the `chain` oneshot**: `bitcoind` is also SHA256d Bitcoin's id.
- **Don't run the daemon as root**: the image refuses it; the `cookie` oneshot is the only root step.
- **Packing before the image is on ghcr**: `s9pk pack` runs `docker create --platform=<arch>` on `dockerTag`, so the local Docker must hold that tag *for the arch being packed*. Load the amd64 build, `make x86`; then load the arm64 build under the same tag, `make arm`. Build with a `docker-container` buildx builder (`BUILDX_BUILDER=<name> make`).
