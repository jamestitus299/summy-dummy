// Small, SSR-safe localStorage helpers used for code persistence.
// All access is guarded and wrapped so a disabled/full storage never throws.

export const canUseStorage = (): boolean =>
  typeof window !== 'undefined' && !!window.localStorage

export const readStored = (key?: string): string | undefined => {
  if (!key || !canUseStorage()) return undefined
  try {
    return window.localStorage.getItem(key) ?? undefined
  } catch {
    return undefined
  }
}

export const writeStored = (key: string | undefined, value: string): void => {
  if (!key || !canUseStorage()) return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage full or unavailable — keep the in-memory value */
  }
}
