/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, act } from '@testing-library/react'

import EditTextReactCanvas from '../../EditReactCanvas'
import { isTransformerLoaded } from '../custom-transformer'

// @babel/standalone is loaded on demand so it can be code-split out of bundles
// that only use ReactCanvas. That made EditTextReactCanvas's mount path async,
// so these cover it end to end.
const flush = () => act(async () => { await Promise.resolve(); await new Promise((r) => setTimeout(r, 0)) })

const CODE = `export default function Doc() {
  return <p>editable text</p>;
}`

describe('EditTextReactCanvas with the on-demand transformer', () => {
  it('loads the transformer and renders the transformed code', async () => {
    const { container } = render(<EditTextReactCanvas code={CODE} showLoader={false} />)

    await flush()

    expect(isTransformerLoaded()).toBe(true)
    expect(container.textContent).toContain('editable text')
  })

  it('does not report an error for valid code', async () => {
    const onError = jest.fn()
    render(<EditTextReactCanvas code={CODE} showLoader={false} onError={onError} />)

    await flush()

    expect(onError).not.toHaveBeenCalled()
  })

  it('reports a transform error for invalid code', async () => {
    const onError = jest.fn()
    render(
      <EditTextReactCanvas code={'export default function Broken( {'} showLoader={false} onError={onError} />
    )

    await flush()

    expect(onError).toHaveBeenCalled()
  })

  it('unmounting before the transformer resolves does not throw', async () => {
    const { unmount } = render(<EditTextReactCanvas code={CODE} showLoader={false} />)
    unmount() // cancels the in-flight load callback
    await flush()
  })
})
