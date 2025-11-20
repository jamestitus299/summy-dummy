import React, { useMemo } from 'react';

import { install } from '@twind/core';
import presetTailwind from '@twind/preset-tailwind';

import { LiveProvider } from './core/LiveProvider';
import { LiveEditor } from './core/LiveEditor';
import { LiveError } from './core/LiveError';
import { LivePreview } from './core/LivePreview';

import { scope as defaultscope } from '../scopes/Scope';

// Initialize Twind (This acts as the "Observer")
// This is outside the component to prevent re-initialization on re-renders.
// The 'install' function sets up a MutationObserver on the document body.
const TWIND_FLAG = "__TWIND_INIT__";
try {
  if (!(window as any)[TWIND_FLAG]) {
    install({
      presets: [presetTailwind()],
    }, true);
    (window as any)[TWIND_FLAG] = true;
  }
} catch (e) {
  // Twind already loaded
  // console.warn("Twind already initialized");
}


export interface ReactCanvasProps {
  code: string;
  scope?: Record<string, React.ComponentType | unknown>;
  showPreview?: boolean;
  showEditor?: boolean;
  showError?: boolean;
}

export default function ReactCanvas({
  code,
  scope,
  showPreview = true,
  showEditor = false,
  showError = false,
}: ReactCanvasProps) {
  const finalScope = useMemo(
    () => ({ ...defaultscope, ...scope }),
    [defaultscope, scope]
  );
  return (
    <div>
      <LiveProvider code={code} scope={finalScope}>
        {showPreview && <LivePreview />}
        {showError && <LiveError />}
        {showEditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
