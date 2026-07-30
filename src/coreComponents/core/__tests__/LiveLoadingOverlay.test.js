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
// IMPORTANT: the overlay is currently unreachable through this path. Evaluation
// is synchronous, so every non-empty code string resolves within one commit to
// exactly one of:
//   renders content       -> hasRendered true -> gated off
//   throws                -> error set        -> gated off
//   evaluates, no element -> error set        -> gated off
// and empty code is gated off as well. No input leaves the canvas genuinely
// pending. These tests pin that reality down; if the overlay becomes reachable
// (a host-driven `pending` prop, or a suspending component) replace them with
// positive assertions.
describe('LiveLoadingOverlay end-to-end (currently unreachable)', () => {
  const overlaySelector = 'div[style*="position: fixed"]'

  it('is not shown for code that renders successfully', () => {
    const { container } = render(<ReactCanvas code="render(<div id='x'>hi</div>)" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
    expect(container.querySelector('#x')).not.toBeNull()
  })

  it('is not shown for empty code', () => {
    const { container } = render(<ReactCanvas code="" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  it('is not shown for code that evaluates but renders nothing (error wins)', () => {
    const { container } = render(<ReactCanvas code="const a = 1" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  it('is not shown for code that throws', () => {
    const { container } = render(<ReactCanvas code="throw new Error('boom')" />)
    expect(container.querySelector(overlaySelector)).toBeNull()
  })

  // A custom `loader` must pass through the same visibility gate as the default
  // overlay, otherwise it renders unconditionally and sticks on screen.
  it('does not leave a custom loader stuck on screen', () => {
    const { container } = render(
      <ReactCanvas
        code="render(<div>ok</div>)"
        loader={<div data-testid="my-loader">loading</div>}
      />
    )
    expect(container.querySelector('[data-testid="my-loader"]')).toBeNull()
  })
})
