// The pure half of the site builder: source string in, source string out.
//
// Split from standalone.ts purely so it is testable. standalone.ts needs
// `import.meta.url` for esbuild's resolveDir, and jest runs as CJS, where that
// is a hard syntax error -- so nothing importable from a test may live in the
// same file. Everything here is plain string and AST work with no node:
// builtins, no bundler and no filesystem.

import { analyzeReactCode } from "../analyzer/analyzeReactCode";
import { transform, normalizeCode } from "../coreComponents/core/transform";
import {
  baseScope,
  isFaName,
  isIconName,
  isMotionName,
  isRechartsName,
} from "../scopes/lazyScope";

// Order matters and mirrors the canvas: resolveScope spreads the recharts and
// motion namespaces over the per-icon assignments, and SKILL.md documents
// recharts as the owner of Text/Label/Legend/Tooltip. Eleven names collide
// between lucide and recharts (AreaChart BarChart Brush Cross Dot Funnel
// LineChart PieChart Radar ScatterChart Text) -- recharts wins here because it
// wins at runtime today.
const GROUPS: [string, (name: string) => boolean][] = [
  ["recharts", isRechartsName],
  ["motion/react", isMotionName],
  ["react-icons/fa", isFaName],
  ["lucide-react", isIconName],
];

/**
 * Turn the globals the code relies on into real import statements.
 *
 * Bare specifiers only -- `lucide-react`, not the per-icon
 * `lucide-react/dist/esm/icons/*.js` paths ICON_LOADERS uses. The canvas needs
 * per-file dynamic imports because it has no bundler at runtime; here there is
 * one, and every one of these packages sets `sideEffects: false`, so esbuild
 * drops what the code does not reference. Measured: two lucide icons bundle to
 * 2.2 KB, one Fa icon to 3 KB out of 1611.
 */
export function importLines(referencedGlobals: string[]): string {
  const byPackage = new Map<string, Set<string>>();
  const add = (pkg: string, name: string) => {
    const names = byPackage.get(pkg) ?? new Set<string>();
    names.add(name);
    byPackage.set(pkg, names);
  };

  for (const name of referencedGlobals) {
    // Emitted unconditionally below -- sucrase produces React.createElement
    // whether or not the source ever spells `React`.
    if (name === "React") continue;

    if (name in baseScope) {
      add(
        name === "Helmet" || name === "HelmetProvider"
          ? "react-helmet-async"
          : "react",
        name
      );
      continue;
    }

    const group = GROUPS.find(([, test]) => test(name));
    if (group) add(group[0], name);
    // Anything else is a runtime global (document, Math, fetch) -- no import.
  }

  return [
    'import React from "react";',
    ...[...byPackage].map(
      ([pkg, names]) =>
        `import { ${[...names].sort().join(", ")} } from "${pkg}";`
    ),
  ].join("\n");
}

/**
 * The module esbuild bundles.
 *
 * The code is run through the same `transform(normalizeCode(...))` the canvas
 * uses, so client semantics are byte-identical. Sucrase compiles ESM to CJS,
 * which means the output writes to `exports` and may call
 * `Object.defineProperty(exports, ...)`; declaring `exports` and `render` as
 * locals satisfies all three supported entry shapes (export default,
 * render(...), bare expression) without an esbuild plugin or a virtual module.
 */
export async function entryFor(code: string): Promise<string> {
  // normalizeCode first: it is what the canvas evaluates, and a bare leading
  // expression only becomes a default export after it. Analysing the raw source
  // instead would reject `<h1>hi</h1>` for having no default export, which the
  // canvas renders happily. Idempotent -- the regex needs a leading
  // `<`/`function`/`()`/`class`, which normalised code no longer has.
  const normalized = normalizeCode(code);
  const analysis = await analyzeReactCode(normalized);
  if (!analysis.valid) {
    throw new Error(
      "react-code-canvas: code cannot be built:\n" +
        analysis.issues.map((i) => `  - [${i.type}] ${i.message}`).join("\n")
    );
  }

  return [
    importLines(analysis.referencedGlobals),
    'import { createRoot, hydrateRoot } from "react-dom/client";',
    "const exports = {};",
    "const render = (v) => { exports.default = v; };",
    transform(normalized),
    // The same three result shapes generateElement resolves (core/utils.ts).
    "const __r = exports.default;",
    "const __tree = React.isValidElement(__r) ? __r",
    '  : typeof __r === "function" ? React.createElement(__r)',
    '  : typeof __r === "string" ? __r : null;',
    'const __root = document.getElementById("root");',
    // firstChild is the prerender flag: empty means the prerender was skipped
    // or threw, and hydrateRoot on an empty container would warn and re-render
    // anyway. Nothing to keep in sync -- the DOM carries the signal.
    "if (__root.firstChild) hydrateRoot(__root, __tree);",
    "else createRoot(__root).render(__tree);",
  ].join("\n");
}

// Every string and template literal in the source. Over-matching is free:
// Tailwind's build() ignores candidates that are not utilities, so a prose
// string like "Hello world" contributes nothing. Under-matching would ship an
// unstyled page. Same trade collectIdentifiers makes in lazyScope, for the same
// reason -- and it catches every className form, including both branches of
// `className={ok ? "bg-green-500" : "bg-red-500"}` and the static chunks of a
// template literal, without parsing JSX attributes.
const STRING_LITERALS =
  /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;

/**
 * Candidate class names to hand to Tailwind's `build()`.
 *
 * MUST be given transpiled JS, not raw JSX -- see candidatesFor. JSX text is not
 * a string literal, so an apostrophe in prose ("Founder's Series") looks like an
 * opening quote to this regex and desynchronises every quote pair after it,
 * silently dropping the class names in the rest of the file.
 */
export function extractCandidates(code: string): string[] {
  const found = new Set<string>();
  for (const match of code.matchAll(STRING_LITERALS)) {
    const value = match[1] ?? match[2] ?? match[3] ?? "";
    // ${...} splits a template literal into its static chunks; the interpolated
    // expression cannot be known statically and is skipped.
    for (const token of value.split(/[\s${}]+/)) {
      if (token) found.add(token);
    }
  }
  return [...found];
}

// React 19 flushes hoistable tags at the front of the render. Leaving them
// inside #root puts <meta name="description"> in <body> where crawlers ignore
// it, and puts component <style> rules after the content they style. Moving
// them to <head> is also where React looks for them when hydrating.
const HOISTED =
  /^\s*(<title\b[^>]*>[\s\S]*?<\/title>|<style\b[^>]*>[\s\S]*?<\/style>|<(?:meta|link)\b[^>]*\/?>)/;

export function splitHoisted(markup: string): { head: string; body: string } {
  let head = "";
  let body = markup;
  let match: RegExpExecArray | null;
  while ((match = HOISTED.exec(body))) {
    head += match[1];
    body = body.slice(match[0].length);
  }
  return { head, body };
}

/**
 * The Tailwind candidates for a source file.
 *
 * Transpiles first, deliberately. After sucrase, JSX text is a properly quoted
 * string literal and every className -- static, conditional, or template -- is a
 * real string in the output, so the scan can no longer be thrown off by an
 * apostrophe in prose. Scanning raw JSX dropped every class after the first
 * `Founder's` in the file, which shipped a half-styled page with no error.
 */
export function candidatesFor(code: string): string[] {
  return extractCandidates(transform(normalizeCode(code)));
}

export const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string
  );
