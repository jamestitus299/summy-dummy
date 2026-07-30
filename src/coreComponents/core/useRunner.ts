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
  /** Evaluate the initial code on the next macrotask instead of during the
   * first render.
   *
   * Transform + eval are synchronous, so by default the very first commit
   * already contains the finished output and a loading state can never be
   * painted. Deferring the first evaluation commits an empty pending state,
   * lets the browser paint it, then evaluates — which is what makes a loader
   * actually visible. Costs one macrotask on initial mount, so it is opt-in:
   * only turn it on when something is actually rendered during that window.
   *
   * Applies to the first evaluation only. Later code changes (editor
   * keystrokes) stay synchronous, so typing does not flash a loader. */
  deferFirstRender?: boolean
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
  deferFirstRender,
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

  // Nothing to defer for empty code -- it produces no output either way.
  const deferInitial = !!deferFirstRender && !!code?.trim()

  const [state, setState] = useState<Omit<UseRunnerReturn, 'hasRendered'>>(() => ({
    element: deferInitial ? null : makeRunnerElement(),
    error: null,
  }))

  useEffect(() => {
    if (isMountRef.current) {
      isMountRef.current = false
      if (!deferInitial) return

      // setTimeout rather than requestAnimationFrame: rAF never fires in a
      // hidden/background tab, which would leave the canvas permanently blank.
      // A macrotask yields to the browser so the pending commit gets painted.
      const timer = setTimeout(
        () => setState({ element: makeRunnerElement(), error: null }),
        0
      )
      return () => clearTimeout(timer)
    }

    setState({ element: makeRunnerElement(), error: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, scope, disableCache])

  return { ...state, hasRendered }
}
