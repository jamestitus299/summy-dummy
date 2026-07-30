/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { LiveContext } from '../LiveContext'
import { LiveError } from '../LiveError'
import ReactCanvas from '../../ReactCanvas'

const withError = (error, props = {}) =>
  render(
    <LiveContext.Provider value={{ error }}>
      <LiveError id="react-code-error" {...props} />
    </LiveContext.Provider>
  )

describe('LiveError toast', () => {
  it('renders nothing when there is no error', () => {
    const { container } = withError(null)
    expect(container.firstChild).toBeNull()
  })

  it('shows the error message when there is one', () => {
    const { container } = withError('SyntaxError: Unexpected token')
    expect(container.querySelector('#react-code-error').textContent).toContain(
      'SyntaxError: Unexpected token'
    )
  })

  it('is announced to assistive tech', () => {
    const { container } = withError('boom')
    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeNull()
    expect(alert.getAttribute('aria-live')).toBe('assertive')
  })

  it('is pinned to the top-right of the viewport', () => {
    const { container } = withError('boom')
    const toast = container.firstChild
    expect(toast.style.position).toBe('fixed')
    expect(toast.style.top).toBe('16px')
    expect(toast.style.right).toBe('16px')
  })

  // Downstream contract: vvp-admin's Playwright poll treats the canvas as
  // errored via `#react-code-error` when
  //   err.offsetParent !== null && err.textContent.trim().length > 0
  // `offsetParent` is null only when the element ITSELF is position:fixed, so
  // the fixed container is fine but the id must stay on a static descendant.
  // jsdom has no layout, so assert the style contract instead.
  it('keeps #react-code-error itself non-fixed so offsetParent stays non-null', () => {
    const { container } = withError('boom')
    const msg = container.querySelector('#react-code-error')
    expect(msg.style.position).not.toBe('fixed')
    // and it lives inside the positioned container, which is what offsetParent resolves to
    expect(msg.closest('[role="alert"]').style.position).toBe('fixed')
  })

  it('keeps textContent of #react-code-error limited to the message', () => {
    const { container } = withError('SyntaxError: bad')
    // the ⚠ glyph lives outside the id-carrying element, so scraped text stays clean
    expect(container.querySelector('#react-code-error').textContent.trim()).toBe(
      'SyntaxError: bad'
    )
  })

  it('has a dismiss button that hides the toast', () => {
    const { container } = withError('boom')
    const close = container.querySelector('[aria-label="Dismiss error"]')
    expect(close).not.toBeNull()

    fireEvent.click(close)
    expect(container.querySelector('#react-code-error')).toBeNull()
  })

  it('dismiss button text does not pollute the scraped message', () => {
    const { container } = withError('SyntaxError: bad')
    // the × glyph is in the button, outside the id-carrying element
    expect(container.querySelector('#react-code-error').textContent.trim()).toBe(
      'SyntaxError: bad'
    )
  })

  it('shows again when a different error arrives after a dismiss', () => {
    // dismissal is tracked by message, so a new error is not swallowed
    const Wrapper = ({ error }) => (
      <LiveContext.Provider value={{ error }}>
        <LiveError id="react-code-error" />
      </LiveContext.Provider>
    )
    const { container, rerender } = render(<Wrapper error="first boom" />)

    fireEvent.click(container.querySelector('[aria-label="Dismiss error"]'))
    expect(container.querySelector('#react-code-error')).toBeNull()

    rerender(<Wrapper error="second boom" />)
    expect(container.querySelector('#react-code-error').textContent).toContain(
      'second boom'
    )
  })

  it('stays hidden on re-render of the same dismissed error', () => {
    const Wrapper = ({ error }) => (
      <LiveContext.Provider value={{ error }}>
        <LiveError id="react-code-error" />
      </LiveContext.Provider>
    )
    const { container, rerender } = render(<Wrapper error="same boom" />)

    fireEvent.click(container.querySelector('[aria-label="Dismiss error"]'))
    rerender(<Wrapper error="same boom" />)

    expect(container.querySelector('#react-code-error')).toBeNull()
  })

  it('dismissible={false} removes the close button', () => {
    const { container } = withError('boom', { dismissible: false })
    expect(container.querySelector('[aria-label="Dismiss error"]')).toBeNull()
    expect(container.querySelector('#react-code-error')).not.toBeNull()
  })

  it('render prop replaces the default markup entirely', () => {
    const { container } = withError('boom', {
      render: (message) => <div data-testid="custom">custom: {message}</div>,
    })
    expect(container.querySelector('[data-testid="custom"]').textContent).toBe(
      'custom: boom'
    )
    expect(container.querySelector('#react-code-error')).toBeNull()
  })

  it('passes a working dismiss callback to the render prop', () => {
    const { container } = withError('boom', {
      render: (message, dismiss) => (
        <div data-testid="custom">
          {message}
          <button onClick={dismiss} aria-label="Close mine">
            close
          </button>
        </div>
      ),
    })
    expect(container.querySelector('[data-testid="custom"]')).not.toBeNull()

    fireEvent.click(container.querySelector('[aria-label="Close mine"]'))
    expect(container.querySelector('[data-testid="custom"]')).toBeNull()
  })

  it('custom render dismissal is per-message, like the built-in toast', () => {
    const Wrapper = ({ error }) => (
      <LiveContext.Provider value={{ error }}>
        <LiveError
          render={(message, dismiss) => (
            <div data-testid="custom">
              {message}
              <button onClick={dismiss} aria-label="Close mine" />
            </div>
          )}
        />
      </LiveContext.Provider>
    )
    const { container, rerender } = render(<Wrapper error="first" />)

    fireEvent.click(container.querySelector('[aria-label="Close mine"]'))
    expect(container.querySelector('[data-testid="custom"]')).toBeNull()

    // a different error must surface again
    rerender(<Wrapper error="second" />)
    expect(container.querySelector('[data-testid="custom"]').textContent).toContain(
      'second'
    )
  })

  it('dismissible={false} makes the custom dismiss callback a no-op', () => {
    const { container } = withError('boom', {
      dismissible: false,
      render: (message, dismiss) => (
        <div data-testid="custom">
          {message}
          <button onClick={dismiss} aria-label="Close mine" />
        </div>
      ),
    })

    fireEvent.click(container.querySelector('[aria-label="Close mine"]'))
    expect(container.querySelector('[data-testid="custom"]')).not.toBeNull()
  })
})

describe('ReactCanvas errorComponent', () => {
  // valid JS that never calls render() -> sets an error without throwing
  const RENDERS_NOTHING = 'const a = 1'

  it('shows the built-in toast when showError is set', () => {
    const { container } = render(<ReactCanvas code={RENDERS_NOTHING} showError />)
    expect(container.querySelector('#react-code-error').textContent).toContain(
      'did not render anything'
    )
  })

  it('accepts a function errorComponent and passes the message', () => {
    const { container } = render(
      <ReactCanvas
        code={RENDERS_NOTHING}
        showError
        errorComponent={(message) => <p data-testid="mine">{message}</p>}
      />
    )
    expect(container.querySelector('[data-testid="mine"]').textContent).toContain(
      'did not render anything'
    )
    expect(container.querySelector('#react-code-error')).toBeNull()
  })

  it('forwards the dismiss callback through errorComponent', () => {
    const { container } = render(
      <ReactCanvas
        code={RENDERS_NOTHING}
        showError
        errorComponent={(message, dismiss) => (
          <div data-testid="mine">
            {message}
            <button onClick={dismiss} aria-label="Close mine" />
          </div>
        )}
      />
    )
    expect(container.querySelector('[data-testid="mine"]')).not.toBeNull()

    fireEvent.click(container.querySelector('[aria-label="Close mine"]'))
    expect(container.querySelector('[data-testid="mine"]')).toBeNull()
  })

  it('accepts a plain node errorComponent', () => {
    const { container } = render(
      <ReactCanvas
        code={RENDERS_NOTHING}
        showError
        errorComponent={<span data-testid="static">Something broke</span>}
      />
    )
    expect(container.querySelector('[data-testid="static"]')).not.toBeNull()
  })

  // Documented footgun: a function component IS a function, so it gets invoked
  // as errorComponent(message) with the string where props belong. Pinned here
  // so the docs' :::danger note stays true.
  it('passing a component type (not an element/render fn) yields no message', () => {
    function MyErrorToast({ message }) {
      return <div data-testid="mine">Error: {message}</div>
    }
    const { container } = render(
      <ReactCanvas code={RENDERS_NOTHING} showError errorComponent={MyErrorToast} />
    )
    // renders, but the message is lost -- exactly why the docs say not to do this
    expect(container.querySelector('[data-testid="mine"]').textContent).toBe('Error: ')
  })

  it('renders no error UI when showError is false, even with errorComponent', () => {
    const { container } = render(
      <ReactCanvas
        code={RENDERS_NOTHING}
        errorComponent={<span data-testid="static">nope</span>}
      />
    )
    expect(container.querySelector('[data-testid="static"]')).toBeNull()
  })
})
