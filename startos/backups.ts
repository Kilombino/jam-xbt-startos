import { sdk } from './sdk'

// wallets/*.jmdat (the encrypted wallets), cmtdata/ (PoDLE commitments already used),
// wallet metadata, CoinJoin history and state. tor/ and ssl/ are regenerated.
export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) => sdk.Backups.ofVolumes('main'),
)
