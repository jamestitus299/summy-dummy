# react-code-canvas

<p align="center">
  <img src="./public/rrc.png" alt="react-code-canvas preview" width="160" height="160" />
</p>

A browser-based canvas for rendering React components live.

`react-code-canvas` is useful when you need to preview JSX from strings and for artifacts.

## Installation

```bash
bun add react-code-canvas@latest
```

```bash
npm install react-code-canvas@latest
```

```bash
yarn add react-code-canvas@latest
```

## Usage

### Render a React Component

```tsx
import { ReactCanvas } from "react-code-canvas";

<ReactCanvas
  code={CODE}
  showPreview={true}
  showEditor={false}
  showError={true}
  scope={SCOPE}
/>;
```

You can use a Tailwind CDN script in the host app if the rendered code depends on Tailwind utility classes.

#### Props

| Prop | Type | Description |
| --- | --- | --- |
| `code` | `string` | React functional component code, usually `export default function...`, without import statements. |
| `showPreview` | `boolean` | Displays the rendered output. |
| `showEditor` | `boolean` | Shows the code editor. |
| `showError` | `boolean` | Shows an error toast in the top-right of the viewport for runtime or compile-time errors. |
| `errorComponent` | `React.ReactNode \| ((error: string, dismiss: () => void) => React.ReactNode)` | Replaces the built-in toast. Receives the message and a `dismiss` callback. Requires `showError`. |
| `dismissibleError` | `boolean` | Shows a close button on the built-in toast. Defaults to `true`. |
| `scope` | `Record<string, any>` | Components, values, and libraries available to the rendered code. |
| `persistKey` | `string` | Optional `localStorage` key. When set, edited code is saved on change and restored on reload. |
| `onCodeChange` | `(code: string) => void` | Called whenever the code changes in the editor. Use it to persist code yourself (URL, backend, etc.). |
| `showLoader` | `boolean` | Shows a full-screen spinner overlay while the code is being compiled and evaluated. Defaults to `!showEditor`. Enabling it defers the initial evaluation by one macrotask so the spinner can actually paint; later edits stay synchronous. |
| `loader` | `React.ReactNode` | Replaces the default spinner with your own node. |
| `onError` | `(error: string) => void` | Called when non-empty code evaluates without throwing but never renders anything. |

### Validate React Code

Static analysis, no DOM and no React render — safe to run in Node (CI, batch audits,
migrations):

```ts
import { analyzeReactCode } from "react-code-canvas";

const result = await analyzeReactCode(CODE);
// {
//   valid: boolean,
//   issues: [{ type, message, name?, line?, column? }],
//   unknownGlobals: string[],   // names that will throw ReferenceError
//   referencedGlobals: string[],
//   hasDefaultExport: boolean,
// }
```

It parses, transpiles with sucrase, and compiles with `new Function` (constructed,
never called), then checks every referenced name against the scope. It does **not**
execute the code, so it cannot catch logic errors or failures that only surface once
mounted — render it with `ReactCanvas` and its `onError` for that.

#### Options

| Option | Type | Description |
| --- | --- | --- |
| `scope` | `Record<string, unknown>` | Omit to check against exactly what the canvas would load for this code. Passing one replaces that entirely. |
| `allowedGlobals` | `string[]` | Extra host-injected names to treat as available. |
| `forbidImports` | `boolean` | Report `import` statements. Default `true` — the canvas strips them, so the bindings are undefined at runtime. |

### Editable React Code Canvas

```tsx
import { EditTextReactCanvas } from "react-code-canvas";

<EditTextReactCanvas
  code={CODE}
  scope={SCOPE}
  showPreview={true}
  showEditor={false}
  showError={true}
  onSaveFinalCode={handleSave}
  onError={handleError}
/>;
```

`EditTextReactCanvas` adds text editing behavior to rendered React code (beta).

### Build a standalone website

Turn a code string into a deployable static site — `index.html` plus hashed `assets/`, with React,
every library the code references and compiled Tailwind bundled in. No CDN, no network at runtime.

```js
// Node only. Ships as a separate entry so nothing here reaches your browser bundle.
import { writeStandaloneSite } from "react-code-canvas/builder";

await writeStandaloneSite(CODE, "./out");
// -> out/index.html, out/assets/app-<hash>.js, out/assets/style-<hash>.css
```

Then deploy `out/` anywhere that serves files. Use `buildStandaloneSite` instead to get a
`path -> contents` map and handle delivery yourself.

Requires the optional peers it actually uses: `npm i -D esbuild`, plus `tailwindcss` if your code
uses `className`. Neither is loaded otherwise.

#### Options

| Option | Type | Description |
| --- | --- | --- |
| `title` | `string` | `<title>` for code that emits none of its own. A `<Helmet><title>` in the code wins. |
| `lang` | `string` | `<html lang>`. Default `'en'`. |
| `tailwind` | `boolean` | Compile Tailwind for the classes found in the code. Default `true`; only runs when the code contains `className`. |
| `css` | `string` | Extra CSS, appended after the compiled Tailwind. |
| `head` | `string` | Raw HTML appended to `<head>` — fonts, favicon, OG tags, analytics. |
| `prerender` | `boolean` | Bake the initial markup into the HTML for SEO, then hydrate. Default `true`. |
| `minify` | `boolean` | Default `true`. |
| `target` | `string` | esbuild target. Default `'es2020'`. |

Notes:

- **Styling all works**: inline `style` objects, in-component `<style>` tags, and Tailwind classes
  are compiled into a real stylesheet. Unlike the canvas, the built site does not need the host to
  provide Tailwind.
- **Prerendering is best-effort.** Code that touches `document` or `window` *during render* throws
  in Node; the build warns and emits a client-only shell instead of failing. Guard with
  `typeof document !== "undefined"` to keep the prerender. `useEffect` never runs during prerender,
  so it is always safe.
- `<Helmet>` finally does something here — React 19 hoists its `<title>`/`<meta>` and the builder
  lifts them into `<head>`, where crawlers read them.
- Machine-generated `<EditableText>` tags from an `EditTextReactCanvas` session are reversed back to
  plain JSX; a deployed page does not keep click-to-edit fields.
- **recharts charts do not prerender** — measured: they render nothing server-side, fixed size or
  not, and appear on hydration. The rest of the page still prerenders normally, so only the chart
  area is blank in the initial HTML.

## Notes

- Code should export a default component, for example `export default function ComponentName() {}`.
- Do not include import statements in rendered code. Inject dependencies through the `scope` prop.
- The default scope ships React, its hooks and `react-helmet-async` up front, and lazily fetches `lucide-react` (~0.8KB gz per icon), `recharts` (~145KB gz), `motion/react` (~61KB gz) and `react-icons/fa` (~420KB gz) only when the code mentions a name from that group. Prefer lucide icons — one `Fa*` reference pulls the entire Font Awesome pack, which has no per-icon files. See [Scope](doc_site/docs/scope.md).
- Empty or whitespace-only `code` renders nothing at all — no output and no loader.
- The built-in error toast keeps the message in `#react-code-error`. If you replace it with `errorComponent` and rely on scraping that element (for example from a headless browser), keep the id on a statically positioned element — `offsetParent` is `null` on `position: fixed` elements.
- `errorComponent` takes an **element or a render function**, not a component type. Passing the component itself (`errorComponent={MyToast}`) calls it with the message string in place of props, so it renders blank with no warning. Use `errorComponent={(message, dismiss) => <MyToast message={message} onDismiss={dismiss} />}` — the second argument wires your own close control to the same per-message dismissal the built-in toast uses.
- When an edit fails to compile, `ReactCanvas` keeps the previous successful render on screen and reports the error. Doing so re-executes the previous code, so any top-level side effects in it (analytics calls, script injection, DOM mutation) run again. Guard side effects if that matters.
- This package evaluates provided code in the browser. Do not execute untrusted code without an additional isolation strategy appropriate for your application.

## Development

This repository uses Bun for dependency management and CI.

```bash
bun install --frozen-lockfile
bun run test
bun run build
```

Run Storybook locally:

```bash
bun run dev
```

Other useful commands:

```bash
bun run build-storybook
bun run size
```

The committed lockfile is `bun.lock`. Do not commit `package-lock.json`.

## Documentation Site

The package documentation lives in `doc_site` and is deployed to GitHub Pages from the `master` branch.

```bash
bun run docs:dev
bun run docs:build
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

All participants are expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version updates.

## License

MIT. See [LICENSE](./LICENSE).
