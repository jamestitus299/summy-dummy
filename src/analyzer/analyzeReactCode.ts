import { loadTransformer, getBabelHelpers } from "../coreComponents/core/custom-transformer";
import { transform, normalizeCode } from "../coreComponents/core/transform";
import {
  baseScope,
  isFaName,
  isIconName,
  isMotionName,
  isRechartsName,
  scopeNamesFor,
} from "../scopes/lazyScope";

export type IssueType =
  | "empty"
  | "syntax"
  | "transform"
  | "compile"
  | "import-statement"
  | "unknown-identifier"
  | "no-default-export";

export type CodeIssue = {
  type: IssueType;
  message: string;
  /** identifier name, for unknown-identifier */
  name?: string;
  line?: number;
  column?: number;
};

export type AnalysisResult = {
  /** false when any issue would stop the code rendering in the canvas */
  valid: boolean;
  issues: CodeIssue[];
  /** globals the code relies on that the scope does provide */
  referencedGlobals: string[];
  /** globals the code relies on that nothing provides -- these throw at runtime */
  unknownGlobals: string[];
  hasDefaultExport: boolean;
};

export type AnalyzeOptions = {
  /** scope the code will run against. Omit to check against what the canvas
   * itself would load for this code (base scope plus the lucide/recharts/motion
   * names it references). Passing one replaces that entirely. */
  scope?: Record<string, unknown>;
  /** extra names to treat as available (host-injected globals, etc.) */
  allowedGlobals?: string[];
  /** treat `import` statements as an issue. Default true -- the canvas strips
   * them, so imported bindings resolve to undefined at runtime. */
  forbidImports?: boolean;
};

/**
 * Globals the browser/JS runtime provides. The canvas evaluates code with
 * `new Function`, so anything here resolves normally at runtime and must not be
 * reported as unknown.
 */
const RUNTIME_GLOBALS = new Set([
  // injected by the canvas itself
  "React", "render", "exports", "require", "module",
  // language
  "globalThis", "undefined", "NaN", "Infinity", "console",
  "Object", "Array", "String", "Number", "Boolean", "Symbol", "BigInt",
  "Math", "JSON", "Date", "RegExp", "Error", "TypeError", "RangeError",
  "SyntaxError", "Promise", "Map", "Set", "WeakMap", "WeakSet", "Proxy",
  "Reflect", "Intl", "Function", "ArrayBuffer", "Uint8Array", "Int32Array",
  "Float64Array", "DataView", "structuredClone", "queueMicrotask",
  "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent",
  "decodeURIComponent", "encodeURI", "decodeURI", "escape", "unescape",
  // browser
  "window", "document", "navigator", "location", "history", "screen",
  "localStorage", "sessionStorage", "fetch", "Headers", "Request", "Response",
  "URL", "URLSearchParams", "FormData", "Blob", "File", "FileReader",
  "AbortController", "setTimeout", "clearTimeout", "setInterval",
  "clearInterval", "requestAnimationFrame", "cancelAnimationFrame",
  "requestIdleCallback", "alert", "confirm", "prompt", "atob", "btoa",
  "getComputedStyle", "matchMedia", "IntersectionObserver", "ResizeObserver",
  "MutationObserver", "CustomEvent", "Event", "Image", "Audio", "Option",
  "WebSocket", "Worker", "crypto", "performance", "CSS", "DOMParser",
  "HTMLElement", "Node", "Element",
]);

/**
 * Mirror how `evalCode` builds the parameter list for `new Function`, so the
 * compile check below fails for exactly the reasons the real runtime would.
 * `default` and `import` are reserved words and cannot be parameters, which is
 * why the runtime strips them too.
 */
function buildScopeParamNames(scope: Record<string, unknown>): string[] {
  const names = new Set<string>(["React", "require", "render", "exports"]);
  for (const key of Object.keys(scope)) {
    if (key === "default" || key === "import") continue;
    names.add(key);
  }
  return [...names];
}

/**
 * Statically check whether a code string can render in the canvas -- no DOM and
 * no React rendering required, so it is safe to run in Node (CI, migrations,
 * batch audits).
 *
 * Runs the same stages the canvas does, stopping short of execution:
 *   1. parse (Babel)      -- for the AST used by the scope checks below
 *   2. transform (sucrase) -- the actual transpiler the canvas uses
 *   3. compile (`new Function`, constructed but never called)
 *
 * Catches the failures that matter in practice:
 *  - syntax errors (the code never parses)
 *  - transform errors from sucrase specifically
 *  - compile errors, notably redeclaring an injected global such as
 *    `const useState = 1`, which is valid standalone JS but a duplicate
 *    declaration once scope entries become function parameters
 *  - references to names nothing provides, in both expression and JSX position
 *    -- a runtime ReferenceError that transpiling alone never reveals, and the
 *    usual symptom of code written against a different scope than it now runs
 *    against
 *  - code that compiles but produces no component (no default export, no
 *    `render(...)` call), which renders blank
 *
 * It does NOT execute the code, so it cannot catch logic errors or anything
 * that only fails once mounted.
 */
export async function analyzeReactCode(
  code: string,
  options: AnalyzeOptions = {}
): Promise<AnalysisResult> {
  const { scope, allowedGlobals = [], forbidImports = true } = options;
  // A caller-supplied scope replaces the canvas's own entirely, so the
  // lucide/recharts/motion names stop being available.
  const usingDefaultScope = !scope;

  const issues: CodeIssue[] = [];
  const empty: AnalysisResult = {
    valid: false,
    issues,
    referencedGlobals: [],
    unknownGlobals: [],
    hasDefaultExport: false,
  };

  if (!code || !code.trim()) {
    issues.push({ type: "empty", message: "No code given." });
    return empty;
  }

  await loadTransformer();
  const { parser, traverse, t } = getBabelHelpers();

  let ast: any;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  } catch (err: any) {
    issues.push({
      type: "syntax",
      message: err?.message ? String(err.message) : String(err),
      line: err?.loc?.line,
      column: err?.loc?.column,
    });
    return empty;
  }

  // ---- Stage 2: the real transform (sucrase), not just Babel's parser -------
  // The canvas transpiles with sucrase, a different implementation to the Babel
  // parser used above, so parsing successfully does not prove it transpiles.
  let transformed: string | null = null;
  try {
    transformed = transform(normalizeCode(code));
  } catch (err: any) {
    issues.push({
      type: "transform",
      message: err?.message ? String(err.message) : String(err),
    });
    return empty;
  }

  // ---- Stage 3: the real compile step --------------------------------------
  // `new Function` COMPILES its body on construction and throws on invalid
  // code, but does not execute it until called -- so this is a genuine compile
  // check with no execution and no side effects.
  //
  // This is what catches redeclaring an injected global: scope entries arrive as
  // function parameters, so `const useState = 1` at top level is a duplicate
  // declaration. Parsing alone cannot see that.
  try {
    const paramNames = usingDefaultScope
      ? scopeNamesFor(code)
      : buildScopeParamNames(scope as Record<string, unknown>);
    // eslint-disable-next-line no-new-func
    new Function(...paramNames, transformed);
  } catch (err: any) {
    issues.push({
      type: "compile",
      message: err?.message ? String(err.message) : String(err),
    });
    return { ...empty, valid: false };
  }

  const available = new Set<string>([
    ...Object.keys(scope ?? baseScope),
    ...allowedGlobals,
    ...RUNTIME_GLOBALS,
  ]);

  // The icon/chart/animation names are checked by predicate rather than by
  // enumerating ~6000 strings into a Set on every call.
  const isAvailable = (name: string): boolean =>
    available.has(name) ||
    (usingDefaultScope &&
      (isIconName(name) ||
        isRechartsName(name) ||
        isMotionName(name) ||
        isFaName(name)));

  const referenced = new Set<string>();
  const unknown = new Map<string, CodeIssue>();
  let hasDefaultExport = false;
  let hasRenderCall = false;

  traverse(ast, {
    ExportDefaultDeclaration() {
      hasDefaultExport = true;
    },
    CallExpression(path: any) {
      // `render(<App />)` is the other supported entry shape
      if (t.isIdentifier(path.node.callee, { name: "render" })) hasRenderCall = true;
    },
    ImportDeclaration(path: any) {
      if (!forbidImports) return;
      issues.push({
        type: "import-statement",
        message:
          `Import statements are stripped by the canvas; ` +
          `"${path.node.source.value}" will be undefined at runtime. ` +
          `Provide it through the scope instead.`,
        line: path.node.loc?.start?.line,
        column: path.node.loc?.start?.column,
      });
    },
    ReferencedIdentifier(path: any) {
      const { node } = path;
      const name = node.name;
      if (!name) return;

      // Lowercase JSX names are intrinsic HTML tags (<div>), not identifiers --
      // except when the name is the object of a member expression. In
      // `<motion.div>` the `motion` half is a real binding that has to come from
      // the scope, while the `div` half is still just a property. Skipping both
      // hid `motion` from referencedGlobals entirely, which the canvas survives
      // (its regex scanner finds it anyway) but the site builder does not: it
      // derives the bundle's import statements from this list, so the name went
      // unimported and the page died with `motion is not defined`.
      const isMemberObject =
        t.isJSXMemberExpression(path.parent) && path.parent.object === node;
      if (t.isJSXIdentifier(node) && /^[a-z]/.test(name) && !isMemberObject)
        return;

      // Locally declared (params, consts, function names, imports) -> fine.
      if (path.scope.hasBinding(name, true)) return;

      if (isAvailable(name)) {
        referenced.add(name);
        return;
      }

      if (!unknown.has(name)) {
        unknown.set(name, {
          type: "unknown-identifier",
          name,
          message:
            `"${name}" is not defined by the scope and is not a runtime global. ` +
            `It will throw a ReferenceError when the code runs.`,
          line: node.loc?.start?.line,
          column: node.loc?.start?.column,
        });
      }
    },
  });

  issues.push(...unknown.values());

  if (!hasDefaultExport && !hasRenderCall) {
    issues.push({
      type: "no-default-export",
      message:
        "No default export and no render() call, so the canvas produces no " +
        "component and renders nothing.",
    });
  }

  return {
    // import-statement is reported but not fatal on its own: the code may still
    // render if it never uses the imported binding.
    valid: !issues.some(
      (i) => i.type !== "import-statement"
    ),
    issues,
    referencedGlobals: [...referenced].sort(),
    unknownGlobals: [...unknown.keys()].sort(),
    hasDefaultExport,
  };
}
