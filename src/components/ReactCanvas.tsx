import React, { useMemo } from 'react';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live-runner';
import { scope as defaultscope } from '../utils/Scope';

export interface ReactCanvasProps {
  code: string;
  scope?: Record<string, React.ComponentType | unknown>;
  showpreview?: boolean;
  showeditor?: boolean;
  showerror?: boolean;
}

export default function ReactCanvas({
  code,
  scope,
  showpreview = true,
  showeditor = false,
  showerror = false,
}: ReactCanvasProps) {
  const finalScope = useMemo(
    () => ({ ...defaultscope, ...scope }),
    [defaultscope, scope]
  );
  return (
    <div>
      <LiveProvider code={code} scope={finalScope}>
        {showpreview && <LivePreview />}
        {showerror && <LiveError />}
        {showeditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
