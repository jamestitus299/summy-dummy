import React, { useState, useEffect, useMemo } from 'react';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live-runner';
import { scope as defaultscope } from '../scopes/Scope';

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
