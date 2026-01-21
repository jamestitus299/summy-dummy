import React, { useEffect, useMemo } from "react";

import { LiveProvider } from "./core/LiveProvider";
import { LiveEditor } from "./core/LiveEditor";
import { LiveError } from "./core/LiveError";
import { LivePreview } from "./core/LivePreview";

import { scope as defaultscope } from "../scopes/Scope";

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

  // Merge scopes; only depend on `scope` so memo is stable.
  const finalScope = useMemo(() => {
    return { ...defaultscope, ...(scope ?? {}) };
  }, [scope]);

  return (
    <div>
      <LiveProvider code={code} scope={finalScope}>
        {showPreview && <LivePreview id="react-code-canvas" />}
        {showError && <LiveError id="react-code-error"/>}
        {showEditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
