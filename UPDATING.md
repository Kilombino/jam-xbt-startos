# Updating the upstream version

Upstream is the image `ghcr.io/kilombino/jam-xbt`, built from Kilombino/joinmarket-ng (branch
`xbt`) and Kilombino/jam (branch `xbt`) by `xbt-docker/build.sh`, which is reproducible.

## Determining the upstream version

The image tag is `<joinmarket-ng version>-xbt<N>` (e.g. `0.41.0-xbt1`), set in
`startos/manifest/index.ts` (`images.jam.source.dockerTag`). The latest is the newest tag on
`ghcr.io/kilombino/jam-xbt` (`docker buildx imagetools inspect`), matching the XBT.md of
the `xbt` branch.

## Applying the bump

- New joinmarket-ng version: set `dockerTag` to `<version>-xbt1` and `version` in
  `startos/versions/current.ts` to `<version>:0`.
- New XBT build of the same version (`-xbt<N+1>`): set `dockerTag`, and bump the downstream
  revision (`0.41.0:0` → `0.41.0:1`). ExVer would order a `-xbt` suffix as a prerelease,
  below the plain version, so it is not carried into the package version.
