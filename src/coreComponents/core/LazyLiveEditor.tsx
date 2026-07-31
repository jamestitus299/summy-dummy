import React, { Suspense, lazy } from 'react'

import type { LiveEditorProps } from './LiveEditor'

/**
 * The editor drags in prism-react-renderer and react-simple-code-editor (~27 KB
 * brotli) for a feature that is off by default -- `showEditor` defaults to
 * false, and the canvas is normally used to render, not to edit. Splitting it
 * out keeps that weight off the first chunk for everyone who never opens one.
 *
 * The import targets the module rather than the two packages directly because
 * they are used as components in JSX, which a dynamic import cannot express.
 */
const LiveEditorImpl = lazy(() =>
  import('./LiveEditor').then((mod) => ({ default: mod.LiveEditor }))
)

/**
 * `fallback={null}` rather than a spinner: the editor only mounts when the
 * caller asks for it, the chunk is small, and a flash of loading UI inside a
 * code editor is worse than a blank pane for one tick.
 */
export const LazyLiveEditor = (props: LiveEditorProps) => (
  <Suspense fallback={null}>
    <LiveEditorImpl {...props} />
  </Suspense>
)
