import React, { useMemo } from 'react';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live-runner';
import { scope as defaultscope } from '../scopes/Scope';
// import { Helmet } from 'react-helmet';

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
      {/* <Helmet defer={false}>
        <link rel="stylesheet" href="https://jamestitus299.github.io/css_server/jstyles.css" />
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      </Helmet> */}
      <LiveProvider code={code} scope={finalScope}>
        {showPreview && <LivePreview />}
        {showError && <LiveError />}
        {showEditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
