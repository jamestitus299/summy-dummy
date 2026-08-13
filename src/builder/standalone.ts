// Node-only. Builds a canvas code string into a self-contained static site.
//
// This file must never be reachable from src/index.ts -- it imports esbuild,
// node:* builtins and react-dom/server, none of which belong in the browser
// bundle that ReactCanvas consumers load. It ships as a separate
// `react-code-canvas/builder` entry instead.
//
// The pure string half lives in ./entry, which is where anything a jest test
// needs to import has to live: `import.meta.url` below is a syntax error under
// jest's CJS runtime.

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve as resolvePath, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";

import {
  loadTransformer,
  transformEditableTextToJSX,
} from "../coreComponents/core/custom-transformer";
import { generateElement } from "../coreComponents/core/utils";
import { resolveScope } from "../scopes/lazyScope";
import { entryFor, escapeHtml, extractCandidates, splitHoisted } from "./entry";

export { entryFor, extractCandidates, importLines } from "./entry";

/** Where esbuild and require.resolve look for bare specifiers. See bundleEntry. */
const BUILDER_DIR = fileURLToPath(new URL(".", import.meta.url));
const requireFrom = createRequire(import.meta.url);

export type StandaloneOptions = {
  /** <title> to use when the code emits none of its own */
  title?: string;
  /** <html lang>, default 'en' */
  lang?: string;
  /** compile Tailwind for the classes found in the code. Default true */
  tailwind?: boolean;
  /** extra CSS, appended after the compiled Tailwind */
  css?: string;
  /** raw HTML appended to <head> -- fonts, favicon, OG tags, analytics */
  head?: string;
  /** bake the initial markup into the HTML. Default true */
  prerender?: boolean;
  /** default true */
  minify?: boolean;
  /** esbuild target. Default 'es2020' */
  target?: string;
};

/* -------------------------------------------------------------------------- */
/* optional peers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * esbuild and tailwindcss are optional peers: a hard dependency would make
 * every ReactCanvas consumer download a ~10MB platform binary for a feature
 * most never call. Imported at point of use so the failure is actionable.
 */
async function loadEsbuild() {
  try {
    return await import("esbuild");
  } catch {
    throw new Error(
      "react-code-canvas: buildStandaloneSite needs esbuild. Run `npm i -D esbuild`."
    );
  }
}

async function loadTailwind() {
  try {
    return await import("tailwindcss");
  } catch {
    throw new Error(
      "react-code-canvas: this code uses Tailwind classes. Run `npm i -D tailwindcss`, " +
        "or pass { tailwind: false } to skip CSS compilation."
    );
  }
}

/* -------------------------------------------------------------------------- */
/* pipeline                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Machine-generated <EditableText> tags come back from an EditTextReactCanvas
 * session. A deployed site should not carry click-to-edit fields, so reverse
 * them to plain JSX. Guarded because the round-trip regenerates the whole file
 * through Babel with retainLines -- no reason to put untouched code through it.
 */
async function stripEditableText(code: string): Promise<string> {
  if (!code.includes("EditableText")) return code;

  await loadTransformer();
  const { transformedCode, error } = transformEditableTextToJSX(code) as {
    transformedCode: string | null;
    error: unknown;
  };
  if (error || !transformedCode) {
    throw new Error(
      `react-code-canvas: could not convert EditableText back to JSX: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
  return transformedCode;
}

/** Bundle an already-assembled entry module into a single IIFE. */
export async function bundleEntry(
  entry: string,
  { minify = true, target = "es2020" }: StandaloneOptions = {}
): Promise<string> {
  const esbuild = await loadEsbuild();

  const result = await esbuild.build({
    stdin: {
      contents: entry,
      loader: "js",
      sourcefile: "canvas-entry.js",
      // The builder's own directory, deliberately not process.cwd(). Node
      // resolution walks up from here into this package's node_modules (where
      // recharts/lucide/motion/react-icons always live, they are hard deps) and
      // then on to the consumer's (react, react-dom -- the peers). Under pnpm's
      // strict layout the consumer root cannot see recharts at all, but our own
      // directory always can.
      resolveDir: BUILDER_DIR,
    },
    bundle: true,
    write: false,
    // Not esm: an `assets/app.js` loaded as type="module" hits CORS over
    // file://, so a locally-opened build would silently render nothing.
    format: "iife",
    platform: "browser",
    // react-dom reads this; without the define the bundle throws on `process`.
    define: { "process.env.NODE_ENV": '"production"' },
    minify,
    target,
    legalComments: "none",
  });

  return result.outputFiles[0].text;
}

/* -------------------------------------------------------------------------- */
/* css                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Resolve `@import "tailwindcss"` and the relative theme/preflight/utilities
 * imports inside it. Tailwind v4 is pure JS with no runtime dependencies -- the
 * Rust scanner lives in the separate @tailwindcss/oxide package and exists only
 * to find candidates by scanning files on disk, which we do not need because we
 * already hold the source.
 */
const loadStylesheet = async (id: string, base: string) => {
  const path =
    id === "tailwindcss"
      ? requireFrom.resolve("tailwindcss/index.css")
      : resolvePath(base, id);
  return { path, base: dirname(path), content: readFileSync(path, "utf8") };
};

async function compileCss(
  code: string,
  { tailwind = true, css = "", minify = true }: StandaloneOptions
): Promise<string> {
  let out = "";

  // Never reached for code with no className, so a project that styles inline
  // never needs the tailwindcss dependency at all.
  if (tailwind && code.includes("className")) {
    const { compile } = await loadTailwind();
    const compiler = await compile('@import "tailwindcss";', { loadStylesheet });
    out = compiler.build(extractCandidates(code));
  }

  out += css;
  if (!out.trim()) return "";

  if (minify) {
    const esbuild = await loadEsbuild();
    // esbuild is already needed here, so this avoids pulling Lightning CSS in
    // for the sake of minification alone.
    out = (await esbuild.transform(out, { loader: "css", minify: true })).code;
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* prerender                                                                  */
/* -------------------------------------------------------------------------- */

async function prerenderMarkup(code: string): Promise<string> {
  try {
    const scope = await resolveScope(code);
    const element = generateElement({ code, scope });
    return element ? renderToString(element) : "";
  } catch (err: unknown) {
    // Prerender is an SEO optimisation, never a correctness requirement -- the
    // client bundle renders the same tree either way. The usual cause is
    // module-level document/window access, which SKILL.md actively recommends.
    //
    // ponytail: no timeout -- renderToString is synchronous and uninterruptible.
    // Move it to a worker_threads Worker with terminate() if a build ever hangs.
    console.warn(
      "[react-code-canvas] prerender failed, emitting a client-only shell:",
      err instanceof Error ? err.message : String(err)
    );
    return "";
  }
}

const hash = (content: string): string =>
  createHash("sha256").update(content).digest("hex").slice(0, 8);

/* -------------------------------------------------------------------------- */
/* public api                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Build a canvas code string into a static site.
 *
 * Returns a path -> contents map rather than writing anything, so the caller
 * decides delivery and the whole thing stays testable without a temp directory.
 * Use writeStandaloneSite to put it on disk.
 */
export async function buildStandaloneSite(
  code: string,
  options: StandaloneOptions = {}
): Promise<Record<string, string>> {
  const { title, lang = "en", head = "", prerender = true } = options;

  const source = await stripEditableText(code);
  const entry = await entryFor(source);

  const [js, css] = await Promise.all([
    bundleEntry(entry, options),
    compileCss(source, options),
  ]);

  const markup = prerender ? await prerenderMarkup(source) : "";
  const { head: hoisted, body } = splitHoisted(markup);

  const files: Record<string, string> = {};
  const jsPath = `assets/app-${hash(js)}.js`;
  files[jsPath] = js;

  let cssLink = "";
  if (css) {
    const cssPath = `assets/style-${hash(css)}.css`;
    files[cssPath] = css;
    cssLink = `<link rel="stylesheet" href="${cssPath}">`;
  }

  // The code's own <title> wins; `title` is the fallback for code that emits none.
  const titleTag =
    hoisted.includes("<title") || !title
      ? ""
      : `<title>${escapeHtml(title)}</title>`;

  // #root must contain no stray whitespace: the client checks root.firstChild
  // to decide hydrate vs render, and a newline would be a text node.
  const html = `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${titleTag}${hoisted}${cssLink}${head}
</head>
<body>
<div id="root">${body}</div>
<script src="${jsPath}"></script>
</body>
</html>
`;

  files["index.html"] = html;
  return files;
}

/** buildStandaloneSite, written to disk. Returns the paths written. */
export async function writeStandaloneSite(
  code: string,
  outDir: string,
  options: StandaloneOptions = {}
): Promise<string[]> {
  const files = await buildStandaloneSite(code, options);
  const written: string[] = [];

  for (const [name, contents] of Object.entries(files)) {
    const target = join(outDir, name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents, "utf8");
    written.push(target);
  }
  return written;
}
