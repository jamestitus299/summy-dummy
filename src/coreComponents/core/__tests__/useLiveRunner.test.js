/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'

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
