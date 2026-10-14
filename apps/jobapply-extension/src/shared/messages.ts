export const OPEN_OVERLAY = 'OPEN_OVERLAY'
export const CLOSE_OVERLAY = 'CLOSE_OVERLAY'

export type ExtensionMessage =
  | { type: typeof OPEN_OVERLAY }
  | { type: typeof CLOSE_OVERLAY }
