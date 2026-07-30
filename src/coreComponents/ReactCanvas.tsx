import React, { useEffect, useMemo } from "react";

import { LiveProvider } from "./core/LiveProvider";
import { LiveEditor } from "./core/LiveEditor";
import { LiveError } from "./core/LiveError";
import { LivePreview } from "./core/LivePreview";
import { LiveLoadingOverlay } from "./core/LiveLoadingOverlay";

import { scope as defaultscope } from "../scopes/Scope";

export interface ReactCanvasProps {
  code: string;
  scope?: Record<string, React.ComponentType | unknown>;
  showPreview?: boolean;
  showEditor?: boolean;
  showError?: boolean;
  /** localStorage key to persist edited code across page reloads; omit to disable */
  persistKey?: string;
  /** called whenever the code changes in the editor */
  onCodeChange?: (code: string) => void;
  /** full-page overlay shown until the first successful render. Defaults to
   * `!showEditor` -- the overlay is `position: fixed; inset: 0`, so it covers
   * the editor too; if it defaulted to on with an editor visible, the very
   * first (near-certain to be incomplete/invalid) keystroke into an empty
   * canvas would block the whole screen, editor included, until valid code
   * exists. Pass explicitly to override either way. */
  showLoader?: boolean;
  /** replace the default spinner overlay with a custom node */
  loader?: React.ReactNode;
  /** called when non-empty code evaluates cleanly but renders nothing (in
   * addition to the error being shown via LiveError) */
  onError?: (error: string) => void;
}

export default function ReactCanvas({
  code,
  scope,
  showPreview = true,
  showEditor = false,
  showError = false,
  persistKey,
  onCodeChange,
  showLoader = !showEditor,
  loader,
  onError,
}: ReactCanvasProps) {

  // Merge scopes; only depend on `scope` so memo is stable.
  const finalScope = useMemo(() => {
    return { ...defaultscope, ...(scope ?? {}) };
  }, [scope]);

  return (
    <div>
      <LiveProvider
        code={code}
        scope={finalScope}
        persistKey={persistKey}
        onCodeChange={onCodeChange}
        onError={onError}
      >
        {showLoader && (loader ?? <LiveLoadingOverlay />)}
        {showPreview && <LivePreview id="react-code-canvas" />}
        {showError && <LiveError id="react-code-error"/>}
        {showEditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
