import { useState, useEffect, useRef, useCallback } from 'react'

import { useRunner } from './useRunner'
import { UseRunnerProps } from './useRunner'
import { UseRunnerReturn } from './useRunner'
import { readStored, writeStored } from './storage'

export type UseLiveRunnerProps = Omit<UseRunnerProps, 'code'> & {
  /** initial code for the live runner */
  initialCode?: string
  /** transform the code before transpiling */
  transformCode?: (code: string) => string
  /** localStorage key to persist edited code across reloads; omit to disable */
  persistKey?: string
  /** called whenever the code changes (e.g. the user edits in the editor) */
  onCodeChange?: (code: string) => void
}

export type UseLiveRunnerRetrun = UseRunnerReturn & {
  code: string
  onChange: (value: string) => void
}

export const useLiveRunner = ({
  initialCode = '',
  transformCode,
  persistKey,
  onCodeChange,
  ...rest
}: UseLiveRunnerProps): UseLiveRunnerRetrun => {
  // Restore persisted code on first render, falling back to initialCode.
  const [code, setCode] = useState(() => readStored(persistKey) ?? initialCode)

  const onChange = useCallback(
    (value: string) => {
      setCode(value)
      writeStored(persistKey, value)
      onCodeChange?.(value)
    },
    [persistKey, onCodeChange]
  )

  const { element, error } = useRunner({
    code: transformCode ? transformCode(code) : code,
    ...rest,
  })

  // Resync when the parent changes `initialCode`, but skip the initial mount
  // so a restored/persisted value isn't clobbered by the default code prop.
  const isMountRef = useRef(true)
  useEffect(() => {
    if (isMountRef.current) {
      isMountRef.current = false
      return
    }
    onChange(initialCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode])

  return { element, error, code, onChange }
}
