/**
 * @jest-environment jsdom
 */
import React from 'react'
import { renderHook, render, act } from '@testing-library/react'

import { useLiveRunner } from '../useLiveRunner'

/**
 * Scope resolution is asynchronous -- the canvas only loads the lucide/recharts/
 * motion pieces the code actually references, so nothing can be evaluated until
 * those imports settle. Flush that before asserting on rendered output.
 */
const settle = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe('useLiveRunner persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('seeds code from initialCode when no persistKey is set', async () => {
    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: 'const a = 1' })
    )
    expect(result.current.code).toBe('const a = 1')
    await settle()
  })

  it('persists code to localStorage on change when persistKey is set', async () => {
    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: 'x', persistKey: 'canvas-1' })
    )

    act(() => result.current.onChange('hello world'))

    expect(result.current.code).toBe('hello world')
    expect(localStorage.getItem('canvas-1')).toBe('hello world')
    await settle()
  })

  it('restores persisted code on mount, overriding initialCode', async () => {
    localStorage.setItem('canvas-1', 'restored code')

    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: 'default code', persistKey: 'canvas-1' })
    )

    expect(result.current.code).toBe('restored code')
    await settle()
  })

  it('does not write to storage when persistKey is omitted', async () => {
    const { result } = renderHook(() => useLiveRunner({ initialCode: '' }))

    act(() => result.current.onChange('abc'))

    expect(localStorage.length).toBe(0)
    await settle()
  })

  it('calls onCodeChange with the new code on every change', async () => {
    const onCodeChange = jest.fn()
    const { result } = renderHook(() =>
      useLiveRunner({ initialCode: '', onCodeChange })
    )

    act(() => result.current.onChange('abc'))

    expect(onCodeChange).toHaveBeenCalledWith('abc')
    await settle()
  })

  it('isolates code by persistKey', async () => {
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
    await settle()
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

  it('is false for code that has not produced content yet', async () => {
    let latest
    render(<Harness initialCode="" onState={(s) => (latest = s)} />)
    await settle()
    expect(latest.hasRendered).toBe(false)
  })

  it('flips true after the first successful render, and never resets even if a later edit errors', async () => {
    let latest
    const onState = (s) => (latest = s)

    const { rerender } = render(
      <Harness initialCode="render(<div>ok</div>)" onState={onState} />
    )
    await settle()
    expect(latest.hasRendered).toBe(true)
    expect(latest.error).toBeNull()

    rerender(<Harness initialCode="throw new Error('boom')" onState={onState} />)
    await settle()
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

  it('reports as soon as evaluation returns, when non-empty code renders nothing', async () => {
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
    await settle()

    // No timers or retries: the condition is known the moment evaluation
    // returns. The only wait here is for the scope to load.
    expect(onError).toHaveBeenCalledWith('Code did not render anything')
    expect(latest.error).toBe('Code did not render anything')
    expect(latest.hasRendered).toBe(false)
  })

  it('does not report for empty code', async () => {
    const onError = jest.fn()
    render(<Harness initialCode="" onState={() => {}} onError={onError} />)
    await settle()
    expect(onError).not.toHaveBeenCalled()
  })

  it('does not report when code renders successfully', async () => {
    let latest
    const onError = jest.fn()
    render(
      <Harness
        initialCode="render(<div>ok</div>)"
        onState={(s) => (latest = s)}
        onError={onError}
      />
    )
    await settle()
    expect(onError).not.toHaveBeenCalled()
    expect(latest.error).toBeNull()
  })

  // Regression: throws used to set `error` but never reach onError, so a host
  // swapping in a fallback page on failure saw nothing for the commonest failure.
  it('reports thrown errors through onError, not just "rendered nothing"', async () => {
    const onError = jest.fn()
    render(
      <Harness
        initialCode="throw new Error('boom')"
        onState={() => {}}
        onError={onError}
      />
    )
    await settle()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toContain('boom')
  })

  it('preserves a real evaluation error instead of replacing it', async () => {
    let latest
    const onError = jest.fn()
    render(
      <Harness
        initialCode="throw new Error('always broken')"
        onState={(s) => (latest = s)}
        onError={onError}
      />
    )
    await settle()
    // the actual diagnostic survives; no generic message clobbers it
    expect(latest.error).toContain('always broken')
    expect(latest.error).not.toContain('did not render anything')
  })

  it('reports at most once per mount, so editor keystrokes do not spam', async () => {
    const onError = jest.fn()
    const { rerender } = render(
      <Harness initialCode="const a = 1" onState={() => {}} onError={onError} />
    )
    await settle()
    expect(onError).toHaveBeenCalledTimes(1)

    rerender(<Harness initialCode="const ab = 1" onState={() => {}} onError={onError} />)
    await settle()
    rerender(<Harness initialCode="const abc = 1" onState={() => {}} onError={onError} />)
    await settle()

    expect(onError).toHaveBeenCalledTimes(1)
  })
})

