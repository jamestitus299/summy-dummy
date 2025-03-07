import React, { useMemo } from 'react';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live-runner';
import { scope as defaultscope } from '../utils/Scope';
import { Helmet } from 'react-helmet';

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
        <Helmet>
          <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
          <link rel="stylesheet" href="https://jamestitus299.github.io/css_server/jstyles.css" />
        </Helmet>
        {showPreview && <LivePreview />}
        {showError && <LiveError />}
        {showEditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
