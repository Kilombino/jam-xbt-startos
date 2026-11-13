import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'jam-xbt',
  title: 'JoinBlaket',
  license: 'MIT',
  packageRepo: 'https://github.com/Kilombino/jam-xbt-startos',
  upstreamRepo: 'https://github.com/Kilombino/joinblaket',
  marketingUrl: 'https://github.com/Kilombino/joinblaket/blob/xbt/XBT.md',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    // Built reproducibly from Kilombino/joinblaket (branch xbt, xbt-docker/build.sh)
    // with the Jam fork Kilombino/jam (branch xbt). See UPDATING.md.
    jam: {
      source: { dockerTag: 'ghcr.io/kilombino/jam-xbt:0.43.0-xbt4' },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
