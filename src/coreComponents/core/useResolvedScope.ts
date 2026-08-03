import { useEffect, useState } from 'react'

import { resolveScope } from '../../scopes/lazyScope'
import { Scope } from './types'

export type ResolvedScope = {
  /** the scope to evaluate `readyCode` against; undefined until the first resolve */
  scope: Scope | undefined
  /** the code whose dependencies have finished loading */
  readyCode: string
}

/**
 * Resolves the scope the given code needs, asynchronously.
 *
 * Returns `readyCode` rather than a boolean flag so the caller can only ever
 * evaluate code whose scope is actually loaded. Before the first resolve that
 * is `''`, which evaluates to nothing and lets the loading overlay show. On a
 * later code change the previous code keeps rendering until the new scope
 * arrives, so typing in the editor never blanks the preview or flashes a
 * ReferenceError for an icon that is still in flight.
 *
 * Already-loaded modules resolve in a microtask, so steady-state editing costs
 * one tick, not a round trip.
 */
export const useResolvedScope = (code: string, extra?: Scope): ResolvedScope => {
  const [resolved, setResolved] = useState<ResolvedScope>({
    scope: undefined,
    readyCode: '',
  })

  useEffect(() => {
    let cancelled = false
    resolveScope(code, extra).then((scope) => {
      if (!cancelled) setResolved({ scope, readyCode: code })
    })
    return () => {
      cancelled = true
    }
  }, [code, extra])

  return resolved
}
