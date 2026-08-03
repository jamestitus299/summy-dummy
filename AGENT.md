# AGENT.md

Agent instructions for working in this repository. Read this before making changes.

## What this project is

**`react-code-canvas`** is a published React/TypeScript **library** (npm package, currently `4.2.0-beta.18`). It provides a browser-based canvas that **renders React components from code strings at runtime** and supports live text editing of the rendered output.

Primary use cases: previewing JSX from strings, exposing a scoped set of components/libraries to evaluated code, and validating generated React code before saving it.

> ⚠️ The library evaluates provided code in the browser via `new Function`. It is **not** a sandbox. Do not execute untrusted code without an additional isolation strategy.

## Public API

The package entry is `src/index.ts`. It exports two components, their prop types, and a static analyzer:

| Export | Source | Purpose |
| --- | --- | --- |
| `ReactCanvas` | `src/coreComponents/ReactCanvas.tsx` | Render React code with optional preview / editor / error panes. |
| `EditTextReactCanvas` | `src/coreComponents/EditReactCanvas.tsx` | Render + live text editing of the output (in development). |
| `analyzeReactCode` | `src/analyzer/analyzeReactCode.ts` | Statically validate a code string in Node; no DOM, no render. |

Prop types `ReactCanvasProps` and `EditReactCanvasProps` are exported alongside, plus the analyzer's `AnalysisResult`, `AnalyzeOptions`, `CodeIssue` and `IssueType`.

**Contract for consumer-supplied `code`:** must `export default` a component (or call `render(...)`), must **not** contain `import` statements — dependencies are injected through the `scope` prop instead.

**Code persistence:** `ReactCanvas` and `EditTextReactCanvas` accept `persistKey?: string` (saves/restores code in `localStorage`) and `onCodeChange?: (code: string) => void` (notifies on change so the host can persist however it likes). For `EditTextReactCanvas` these operate on the **final saved JSX**, not the intermediate EditableText form. Shared, SSR-safe storage helpers live in `src/coreComponents/core/storage.ts`.

## Repository structure

Top-level layout (build artifacts and `node_modules` omitted):

```
.
├── src/                  # library source — the published code (see Architecture)
├── dist/                 # build output: CJS + ESM bundles + .d.ts  (gitignored)
├── doc_site/             # Docusaurus documentation site (own package + bun.lock)
├── scripts/
│   └── manual/           # manual, run-by-hand scripts (e.g. transformer walkthrough)
├── public/               # static assets (e.g. rrc.png used by the README)
├── storybook-static/     # built static Storybook  (gitignored)
├── coverage/             # jest coverage output  (gitignored)
├── .storybook/           # Storybook config (main + preview)
├── .github/              # workflows (test, deploy-docs), issue/PR templates
├── rollup.config.mjs     # library bundler config
├── babel.config.js       # babel presets used by jest (babel-jest)
├── jest.config.js        # currently empty → jest defaults
├── tsconfig.json         # TS config; emits declarations to dist/
├── package.json          # name, version, exports/types, scripts, deps
├── bun.lock              # the committed lockfile (never commit package-lock.json)
├── AGENT.md              # this file — source of truth
├── README.md             # consumer-facing docs
├── CHANGELOG.md          # release notes
├── CONTRIBUTING.md / CODE_OF_CONDUCT.md / LICENSE
└── bundle-analysis.html  # rollup-plugin-visualizer output  (gitignored via *.html)
```

## Commands

Bun is the package manager; the committed lockfile is `bun.lock` (never commit `package-lock.json`).

```bash
bun install --frozen-lockfile
bun run test            # jest
bun run build           # rollup -c  -> dist/
bun run dev             # storybook dev on :6006
bun run build-storybook # static Storybook -> storybook-static/
bun run size            # size-limit check
bun run docs:dev        # docusaurus site in doc_site/
bun run docs:build
```

## CI & deployment

- `.github/workflows/test.yml` — runs the test suite.
- `.github/workflows/deploy-docs.yml` — on push to `master`, builds `doc_site/` and deploys to GitHub Pages.
- Docs live in `doc_site/` (Docusaurus), independent of the library build.

## Conventions

- **Storybook is dev-only** — `*.stories.*` and `.storybook/**` are excluded from the Rollup and Babel builds; never import them from library source.
- **Build artifacts are gitignored:** `dist/`, `storybook-static/`, `coverage/`, `bundle-analysis.html`. Don't commit them.
- **Branches:** default/PR base is `master`.
