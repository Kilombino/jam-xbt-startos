export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Jam': 0,
  'BLAKE2b node': 1,
  'Waiting for the node to publish its RPC': 2,
  'not installed. Install it, or pick the other node with the action Choose BLAKE2b node': 3,
  'Web Interface': 4,
  'The web interface is ready': 5,
  'The web interface is not ready': 6,
  'Update the BLAKE2b node: Jam needs 1.0.0:30 or later, installed is': 7,
  'The BLAKE2b node is stopped': 8,

  // actions/chooseNode.ts
  'Automatic uses Bitcoin Knots (BLAKE2b) Companion if it is installed, otherwise Bitcoin (bitcoind). Jam checks that the node follows the BLAKE2b chain before using it.': 9,
  Automatic: 10,
  'Choose BLAKE2b node': 11,
  'Which installed node Jam reads the chain from': 12,

  // interfaces.ts
  'Web UI': 13,
  'Jam, the JoinMarket wallet': 14,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
