import React, { useEffect, useMemo } from "react";

import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

import { LiveProvider } from "./core/LiveProvider";
import { LiveEditor } from "./core/LiveEditor";
import { LiveError } from "./core/LiveError";
import { LivePreview } from "./core/LivePreview";

import { scope as defaultscope } from "../scopes/Scope";

// Tailwind flag
const TWIND_FLAG = "__TWIND_INIT__";

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
  // Safe client-only initialization of Twind (runs once)
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    try {
      if (!(window as any)[TWIND_FLAG]) {
        install(
          {
            presets: [presetTailwind()],
          },
          true
        );
        (window as any)[TWIND_FLAG] = true;
      }
    } catch (err) {
      // if (process.env.NODE_ENV === "development") {
      //   // eslint-disable-next-line no-console
      //   console.warn("Twind init failed or already initialized:", err);
      // }
    }
  }, []);

  // Merge scopes; only depend on `scope` so memo is stable.
  const finalScope = useMemo(() => {
    return { ...defaultscope, ...(scope ?? {}) };
  }, [scope]);

  return (
    <div id="react-code-canvas">
      <LiveProvider code={code} scope={finalScope}>
        {showPreview && <LivePreview />}
        {showError && <LiveError />}
        {showEditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}
