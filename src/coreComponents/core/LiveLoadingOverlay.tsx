import React, { ComponentPropsWithoutRef } from 'react'

import { useLiveContext } from './LiveContext'

export type LiveLoadingOverlayProps = ComponentPropsWithoutRef<'div'> & {
  /** spinner leaf color; defaults to white (readable on the default black overlay) */
  spinnerColor?: string
  /** overall spinner box size in px; ~20px matches Radix UI's <Spinner size="3"> */
  spinnerSize?: number
}

const LEAF_COUNT = 8
const DURATION_S = 0.8

/**
 * Full-page overlay shown until the current code produces its first real
 * (non-null) render. Stays hidden forever after that first success, even if
 * a later code edit briefly errors — it covers the initial load only, not
 * every keystroke in the editor. Empty code renders nothing at all (same
 * "no code given" check as generateElement), not the spinner.
 *
 * Visually matches Radix UI's <Spinner> (used as rx.spinner() in the Reflex
 * consumer apps): 8 bars radiating from center, rotated 45deg apart, each
 * fading out in sequence.
 */
export const LiveLoadingOverlay = ({
  style,
  spinnerColor = '#fff',
  spinnerSize = 20,
  ...rest
}: LiveLoadingOverlayProps) => {
  const { hasRendered, code } = useLiveContext()

  if (hasRendered || !code?.trim()) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          position: 'relative',
          display: 'block',
          width: spinnerSize,
          height: spinnerSize,
        }}
      >
        {Array.from({ length: LEAF_COUNT }).map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: '43.75%',
              width: '12.5%',
              height: '100%',
              transform: `rotate(${i * 45}deg)`,
              animation: `react-code-canvas-leaf-fade ${DURATION_S}s linear infinite`,
              animationDelay: `${(-(LEAF_COUNT - i) / LEAF_COUNT) * DURATION_S}s`,
            }}
          >
            <span
              style={{
                display: 'block',
                width: '100%',
                height: '30%',
                borderRadius: 2,
                background: spinnerColor,
              }}
            />
          </span>
        ))}
      </span>
      <style>
        {'@keyframes react-code-canvas-leaf-fade { 0% { opacity: 1 } to { opacity: .25 } }'}
      </style>
    </div>
  )
}
