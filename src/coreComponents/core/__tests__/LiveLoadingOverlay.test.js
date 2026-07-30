/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'

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
})

// Wired through the real ReactCanvas + useRunner pipeline (not a fake context).
describe('LiveLoadingOverlay end-to-end', () => {
  const overlaySelector = 'div[style*="position: fixed"]'

  // `const a = 1` evaluates cleanly but never calls render(), so there's no
  // element and hasRendered stays false while code is non-empty -- the one
  // real input where the overlay actually displays. Used as the positive case
  // so the showEditor pair below genuinely discriminates.
  const RENDERS_NOTHING = 'const a = 1'

  it('shows the overlay when code renders nothing and no editor is visible', () => {
    const { container } = render(<ReactCanvas code={RENDERS_NOTHING} />)
    expect(container.querySelector(overlaySelector)).not.toBeNull()
  })

  it('suppresses the overlay when an editor is visible (showLoader defaults to !showEditor)', () => {
    const { container } = render(<ReactCanvas code={RENDERS_NOTHING} showEditor />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  it('respects an explicit showLoader={false} even with no editor', () => {
    const { container } = render(<ReactCanvas code={RENDERS_NOTHING} showLoader={false} />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  // The eval path is fully synchronous, so successfully-rendering code never
  // leaves the overlay on screen at all -- no deferral, hence no black flash.
  it('never shows the overlay for code that renders successfully', () => {
    const { container } = render(<ReactCanvas code="render(<div id='x'>hi</div>)" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
    expect(container.querySelector('#x')).not.toBeNull()
  })

  it('never shows the overlay for empty code', () => {
    const { container } = render(<ReactCanvas code="" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })
})
