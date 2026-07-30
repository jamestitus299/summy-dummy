import { useState, useRef, useEffect, createElement, ReactElement } from 'react'

import { Runner } from './Runner'
import { RunnerOptions } from './types'

export type UseRunnerProps = RunnerOptions & {
  /** whether to cache previous element when error occurs with current code */
  disableCache?: boolean
  /** called when non-empty code evaluates cleanly but produces no element --
   * i.e. it never called `render(...)` / never set a default export. Reported
   * synchronously (the condition is known the moment evaluation returns), and
   * at most once per mount so editor keystrokes don't spam it. */
  onError?: (error: string) => void
}

export type UseRunnerReturn = {
  element: ReactElement | null
  error: string | null
  /** true once the current code has produced real (non-null) content at least once;
   * stays true afterwards even if a later edit errors, so callers can show a
   * loading state only before the very first successful render. */
  hasRendered: boolean
}

export const useRunner = ({
  code,
  scope,
  disableCache,
  onError,
}: UseRunnerProps): UseRunnerReturn => {
  const isMountRef = useRef(true)
  const elementRef = useRef<ReactElement | null>(null)
  const [hasRendered, setHasRendered] = useState(false)
  // Report "produced nothing" at most once per mount.
  const noElementReportedRef = useRef(false)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  const makeRunnerElement = (): ReactElement => {
    const element = createElement(Runner, {
      code,
      scope,
      onRendered: (error, hasElement) => {
        if (hasElement) setHasRendered(true)

        if (error) {
          setState((prev) => ({
            ...prev,
            element: disableCache ? null : elementRef.current,
            error: error.toString(),
          }))
          return
        }

        if (!hasElement && code?.trim() && !noElementReportedRef.current) {
          noElementReportedRef.current = true
          const message = 'Code did not render anything'
          setState((prev) => ({ ...prev, error: message }))
          onErrorRef.current?.(message)
          return
        }

        elementRef.current = element
      },
    })
    return element
  }

  const [state, setState] = useState<Omit<UseRunnerReturn, 'hasRendered'>>(() => ({
    element: makeRunnerElement(),
    error: null,
  }))

  useEffect(() => {
    if (isMountRef.current) {
      isMountRef.current = false
      return
    }

    setState({ element: makeRunnerElement(), error: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, scope, disableCache])

  return { ...state, hasRendered }
}
