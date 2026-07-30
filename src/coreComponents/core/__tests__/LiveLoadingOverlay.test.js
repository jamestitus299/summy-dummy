/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, act } from '@testing-library/react'

import { LiveContext } from '../LiveContext'
import { LiveLoadingOverlay } from '../LiveLoadingOverlay'
import ReactCanvas from '../../ReactCanvas'

const renderWithContext = (ctx) =>
  render(
    <LiveContext.Provider value={ctx}>
      <LiveLoadingOverlay />
    </LiveContext.Provider>
  )

describe('LiveLoadingOverlay', () => {
  it('renders nothing when code is empty, even if not yet rendered', () => {
    const { container } = renderWithContext({ code: '', hasRendered: false })
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when code is only whitespace', () => {
    const { container } = renderWithContext({ code: '   ', hasRendered: false })
    expect(container.firstChild).toBeNull()
  })

  it('shows the spinner when code is present but not yet rendered', () => {
    const { container } = renderWithContext({ code: 'render(<div/>)', hasRendered: false })
    expect(container.querySelector('div[style*="position: fixed"]')).not.toBeNull()
  })

  it('renders nothing once hasRendered is true, even with code present', () => {
    const { container } = renderWithContext({ code: 'render(<div/>)', hasRendered: true })
    expect(container.firstChild).toBeNull()
  })

  // An error is a resolved outcome. If the spinner stayed up it would sit on
  // top of the message explaining why nothing rendered.
  it('yields to an error instead of spinning on top of it', () => {
    const { container } = renderWithContext({
      code: 'const a = 1',
      hasRendered: false,
      error: 'Code did not render anything',
    })
    expect(container.firstChild).toBeNull()
  })
})

// Wired through the real ReactCanvas + useRunner pipeline (not a fake context).
//
// `deferFirstRender` (set from `showLoader`) moves the initial transform+eval to
// the next macrotask, so the pending commit gets painted first. That is what
// makes the overlay observable at all: transform+eval are synchronous, so
// without the deferral the very first commit already holds the finished output.
//
// "settle" below flushes that macrotask.
describe('LiveLoadingOverlay end-to-end', () => {
  const overlaySelector = 'div[style*="position: fixed"]'
  const GOOD = "render(<div id='x'>hi</div>)"
  const settle = () => act(async () => { await new Promise((r) => setTimeout(r, 0)) })

  it('shows the overlay on mount, before the code has been evaluated', () => {
    const { container } = render(<ReactCanvas code={GOOD} />)
    expect(container.querySelector(overlaySelector)).not.toBeNull()
    expect(container.querySelector('#x')).toBeNull()
  })

  // Stable handle for tests, automation and the SSpinnerCheck harness, matching
  // the existing #react-code-canvas / #react-code-error convention.
  it('exposes the overlay as #react-code-loader', () => {
    const { container } = render(<ReactCanvas code={GOOD} />)
    expect(container.querySelector('#react-code-loader')).not.toBeNull()
  })

  it('removes #react-code-loader once evaluation completes', async () => {
    const { container } = render(<ReactCanvas code={GOOD} />)
    await settle()
    expect(container.querySelector('#react-code-loader')).toBeNull()
  })

  it('replaces the overlay with the rendered output once evaluation completes', async () => {
    const { container } = render(<ReactCanvas code={GOOD} />)
    await settle()
    expect(container.querySelector(overlaySelector)).toBeNull()
    expect(container.querySelector('#x')).not.toBeNull()
  })

  it('shows a custom loader during the pending window, then clears it', async () => {
    const { container } = render(
      <ReactCanvas code={GOOD} loader={<div data-testid="my-loader">loading</div>} />
    )
    expect(container.querySelector('[data-testid="my-loader"]')).not.toBeNull()

    await settle()
    expect(container.querySelector('[data-testid="my-loader"]')).toBeNull()
    expect(container.querySelector('#x')).not.toBeNull()
  })

  // Same input, only showEditor differs -> opposite outcomes, so this actually
  // discriminates rather than passing for unrelated reasons.
  it('suppresses the overlay when an editor is visible (showLoader defaults to !showEditor)', () => {
    const { container } = render(<ReactCanvas code={GOOD} showEditor />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  it('respects an explicit showLoader={false}, staying fully synchronous', () => {
    const { container } = render(<ReactCanvas code={GOOD} showLoader={false} />)
    expect(container.querySelector(overlaySelector)).toBeNull()
    // no deferral: content is present in the very first commit
    expect(container.querySelector('#x')).not.toBeNull()
  })

  it('is not shown for empty code', () => {
    const { container } = render(<ReactCanvas code="" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  it('is not left on screen when the code errors', async () => {
    const { container } = render(<ReactCanvas code="throw new Error('boom')" />)
    await settle()
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  it('is not left on screen when the code renders nothing', async () => {
    const { container } = render(<ReactCanvas code="const a = 1" />)
    await settle()
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  // Typing in the editor must not reflash the loader on every keystroke.
  it('does not reappear on later code changes', async () => {
    const { container, rerender } = render(<ReactCanvas code={GOOD} />)
    await settle()

    rerender(<ReactCanvas code={"render(<div id='second'>b</div>)"} />)
    expect(container.querySelector(overlaySelector)).toBeNull()
    expect(container.querySelector('#second')).not.toBeNull()
  })
})
