/**
 * @jest-environment jsdom
 */
import React from 'react'
import { renderHook, render, act } from '@testing-library/react'

import { useLiveRunner } from '../useLiveRunner'

describe('useLiveRunner persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('seeds code from initialCode when no persistKey is set', () => {
    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: 'const a = 1' })
    )
    expect(result.current.code).toBe('const a = 1')
  })

  it('persists code to localStorage on change when persistKey is set', () => {
    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: 'x', persistKey: 'canvas-1' })
    )

    act(() => result.current.onChange('hello world'))

    expect(result.current.code).toBe('hello world')
    expect(localStorage.getItem('canvas-1')).toBe('hello world')
  })

  it('restores persisted code on mount, overriding initialCode', () => {
    localStorage.setItem('canvas-1', 'restored code')

    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: 'default code', persistKey: 'canvas-1' })
    )

    expect(result.current.code).toBe('restored code')
  })

  it('does not write to storage when persistKey is omitted', () => {
    const { result } = renderHook(() => useLiveRunner({ initialCode: '' }))

    act(() => result.current.onChange('abc'))

    expect(localStorage.length).toBe(0)
  })

  it('calls onCodeChange with the new code on every change', () => {
    const onCodeChange = jest.fn()
    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: '', onCodeChange })
    )

    act(() => result.current.onChange('abc'))

    expect(onCodeChange).toHaveBeenCalledWith('abc')
  })

  it('isolates code by persistKey', () => {
    localStorage.setItem('key-a', 'A code')
    localStorage.setItem('key-b', 'B code')

    const { result: a } = renderHook(() =>
      useLiveRunner({ initialCode: '', persistKey: 'key-a' })
    )
    const { result: b } = renderHook(() =>
      useLiveRunner({ initialCode: '', persistKey: 'key-b' })
    )

    expect(a.current.code).toBe('A code')
    expect(b.current.code).toBe('B code')
  })
})

describe('useLiveRunner hasRendered', () => {
  // Mounts the hook's returned `element` for real, so Runner's class lifecycle
  // (componentDidMount/componentDidUpdate) actually fires.
  function Harness({ initialCode, onState }) {
    const state = useLiveRunner({ initialCode })
    onState(state)
    return state.element
  }

  it('is false for code that has not produced content yet', () => {
    let latest
    render(<Harness initialCode="" onState={(s) => (latest = s)} />)
    expect(latest.hasRendered).toBe(false)
  })

  it('flips true after the first successful render, and never resets even if a later edit errors', () => {
    let latest
    const onState = (s) => (latest = s)

    const { rerender } = render(
      <Harness initialCode="render(<div>ok</div>)" onState={onState} />
    )
    expect(latest.hasRendered).toBe(true)
    expect(latest.error).toBeNull()

    act(() => {
      rerender(<Harness initialCode="throw new Error('boom')" onState={onState} />)
    })
    expect(latest.error).toContain('boom')
    expect(latest.hasRendered).toBe(true)
  })
})

describe('useLiveRunner "rendered nothing" reporting', () => {
  function Harness({ initialCode, onState, onError }) {
    const state = useLiveRunner({ initialCode, onError })
    onState(state)
    return state.element
  }

  it('reports synchronously when non-empty code evaluates cleanly but renders nothing', () => {
    let latest
    const onError = jest.fn()

    // valid JS, never calls render() -> no element, no throw
    render(
      <Harness
        initialCode="const unused = 1"
        onState={(s) => (latest = s)}
        onError={onError}
      />
    )

    // no waiting, no timers -- known the moment evaluation returns
    expect(onError).toHaveBeenCalledWith('Code did not render anything')
    expect(latest.error).toBe('Code did not render anything')
    expect(latest.hasRendered).toBe(false)
  })

  it('does not report for empty code', () => {
    const onError = jest.fn()
    render(<Harness initialCode="" onState={() => {}} onError={onError} />)
    expect(onError).not.toHaveBeenCalled()
  })

  it('does not report when code renders successfully', () => {
    let latest
    const onError = jest.fn()
    render(
      <Harness
        initialCode="render(<div>ok</div>)"
        onState={(s) => (latest = s)}
        onError={onError}
      />
    )
    expect(onError).not.toHaveBeenCalled()
    expect(latest.error).toBeNull()
  })

  it('preserves a real evaluation error instead of replacing it', () => {
    let latest
    const onError = jest.fn()
    render(
      <Harness
        initialCode="throw new Error('always broken')"
        onState={(s) => (latest = s)}
        onError={onError}
      />
    )
    // the actual diagnostic survives; no generic message clobbers it
    expect(latest.error).toContain('always broken')
    expect(latest.error).not.toContain('did not render anything')
  })

  it('reports at most once per mount, so editor keystrokes do not spam', () => {
    const onError = jest.fn()
    const { rerender } = render(
      <Harness initialCode="const a = 1" onState={() => {}} onError={onError} />
    )
    expect(onError).toHaveBeenCalledTimes(1)

    act(() => {
      rerender(<Harness initialCode="const ab = 1" onState={() => {}} onError={onError} />)
    })
    act(() => {
      rerender(<Harness initialCode="const abc = 1" onState={() => {}} onError={onError} />)
    })

    expect(onError).toHaveBeenCalledTimes(1)
  })
})

