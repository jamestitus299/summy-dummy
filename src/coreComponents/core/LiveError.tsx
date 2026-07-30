import React, { ComponentPropsWithoutRef, useState } from 'react'

import { useLiveContext } from './LiveContext'

export type LiveErrorProps = ComponentPropsWithoutRef<'pre'> & {
  /** style overrides for the toast container (not the message element) */
  containerStyle?: React.CSSProperties
  /** replaces the default toast markup entirely. Receives the error message and
   * a `dismiss` callback wired to the same per-message dismissal the built-in
   * toast uses. When set, `id` and the styles below are not applied — the caller
   * owns the markup, including keeping `#react-code-error` if they depend on it. */
  render?: (error: string, dismiss: () => void) => React.ReactNode
  /** allow dismissal. `false` hides the built-in close button and makes the
   * `dismiss` callback a no-op, so the toast clears only when code compiles. */
  dismissible?: boolean
}

/**
 * Error toast, pinned to the top-right of the viewport. Renders nothing when
 * there is no error, so it clears itself once the code compiles again.
 *
 * Dismissal is tracked by message, not by a boolean: a *different* error after
 * a dismiss shows the toast again, while re-renders of the same error stay
 * hidden. No effect needed to reset it.
 *
 * Two layout constraints worth preserving if you restyle this:
 *
 * 1. `#react-code-error` must never itself be `position: fixed`. Downstream
 *    consumers poll it with
 *      err.offsetParent !== null && err.textContent.trim().length > 0
 *    to detect "this code cannot render" without waiting out a full timeout,
 *    and `offsetParent` is null for fixed-position elements. The container may
 *    be fixed — offsetParent then resolves to it — but the id must stay on a
 *    statically positioned descendant.
 *
 * 2. Incoming props (including `id`) are spread onto that inner `<pre>`, whose
 *    textContent is only the message. The warning glyph and dismiss button sit
 *    outside it so scraped error text stays clean.
 */
export const LiveError = ({
    style,
    containerStyle,
    render,
    dismissible = true,
    ...rest
}: LiveErrorProps) => {
    const { error } = useLiveContext()
    const [dismissedError, setDismissedError] = useState<string | null>(null)

    if (!error) return null

    // Gate BEFORE the custom-render branch so a custom component gets the same
    // dismissal behavior as the built-in toast, not just the default markup.
    if (dismissible && error === dismissedError) return null

    if (render) return <>{render(error, () => setDismissedError(error))}</>

    return (
        <div
            style={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                width: 'min(420px, calc(100vw - 32px))',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #fca5a5',
                background: '#fef2f2',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                ...containerStyle,
            }}
            role="alert"
            aria-live="assertive"
        >
            <span aria-hidden style={{ flexShrink: 0, lineHeight: 1.4, color: '#dc2626' }}>
                ⚠
            </span>

            {/* Keep the id on this statically positioned element -- see note above. */}
            <pre
                {...rest}
                style={{
                    margin: 0,
                    flex: 1,
                    minWidth: 0,
                    maxHeight: 180,
                    overflow: 'auto',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#991b1b',
                    fontSize: 12,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    ...style,
                }}
            >
                {error}
            </pre>

            {dismissible && (
                <button
                    type="button"
                    aria-label="Dismiss error"
                    onClick={() => setDismissedError(error)}
                    style={{
                        flexShrink: 0,
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        border: 'none',
                        borderRadius: 4,
                        background: 'transparent',
                        color: '#991b1b',
                        fontSize: 14,
                        lineHeight: 1,
                        cursor: 'pointer',
                    }}
                >
                    <span aria-hidden>×</span>
                </button>
            )}
        </div>
    )
}
