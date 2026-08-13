---
sidebar_position: 7
title: Standalone site
---

# Build a standalone website

The canvas renders code inside a host page. `buildStandaloneSite` takes the same code string and
turns it into a **deployable static site** — `index.html` plus hashed `assets/` — with React, every
library the code references, and compiled Tailwind bundled in.

No CDN, no import map, no network at runtime. Copy the directory to Netlify, Vercel, S3, GitHub
Pages, or any host that serves files.

:::info Node only
This ships as a separate entry, `react-code-canvas/builder`. It imports `esbuild`, `node:*` builtins
and `react-dom/server`, so it must never reach a browser bundle. Importing
`react-code-canvas` itself never pulls any of it in.
:::

## Install

```bash
npm i -D esbuild
npm i -D tailwindcss   # only if your code uses className
```

Both are **optional peer dependencies**, loaded on demand. Code styled entirely with inline `style`
never needs `tailwindcss` at all.

## Usage

```js
import { writeStandaloneSite } from "react-code-canvas/builder";

const CODE = `
export default function Page() {
  const [n, setN] = useState(0);
  return (
    <main className="flex flex-col gap-4 p-8 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold">Count: {n}</h1>
      <button className="rounded bg-blue-600 px-4 py-2" onClick={() => setN(n + 1)}>
        increment
      </button>
    </main>
  );
}
`;

await writeStandaloneSite(CODE, "./out");
```

```
out/
├── index.html
└── assets/
    ├── app-8bf13721.js       react + everything the code imports
    └── style-067d3221.css    compiled Tailwind
```

```bash
npx serve out
```

For full control over delivery, use `buildStandaloneSite`, which returns a `path -> contents` map and
touches no filesystem:

```js
import { buildStandaloneSite } from "react-code-canvas/builder";

const files = await buildStandaloneSite(CODE);
// { 'index.html': '<!doctype html>…', 'assets/app-<hash>.js': '…', … }
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | `<title>` for code that emits none. A `<Helmet><title>` in the code wins. |
| `lang` | `string` | `'en'` | `<html lang>`. |
| `tailwind` | `boolean` | `true` | Compile Tailwind for the classes found in the code. |
| `css` | `string` | — | Extra CSS, appended after the compiled Tailwind. |
| `head` | `string` | — | Raw HTML appended to `<head>` — fonts, favicon, OG tags, analytics. |
| `prerender` | `boolean` | `true` | Bake initial markup into the HTML, then hydrate. |
| `minify` | `boolean` | `true` | Minify both the JS and the CSS. |
| `target` | `string` | `'es2020'` | esbuild target. |

## Styling

All three styling approaches work, and none of them need anything from a host page:

- **Inline `style={{…}}`** — carried into the bundle as ordinary props.
- **In-component `<style>` tags** — the CSS text is part of the bundle. This is how you express
  pseudo-classes, media queries and keyframes.
- **Tailwind `className`** — compiled into a real stylesheet at build time.

This is the one place the [Scope](./scope.md) guidance about avoiding Tailwind does not apply. That
advice is about the canvas, where classes are inert unless the host loads Tailwind. Here there is a
compile step, so they simply work.

Class names are collected from every string and template literal in the source, which covers
conditional and template forms:

```jsx
<p className={active ? "bg-green-500" : "bg-red-500"} />
<p className={`p-4 ${spacing}`} />
```

Only the static parts of a template literal can be seen, so a fully computed class name
(`` `bg-${color}-500` ``) will not be compiled. Write the alternatives out in full.

## Prerendering

By default the initial markup is rendered in Node and baked into `index.html`, then hydrated on the
client — so crawlers and a slow first paint both see real content.

Prerendering **executes your code in Node**, where there is no DOM. It is best-effort:

- `useEffect` never runs during prerender. Always safe.
- Touching `document` or `window` *during render* throws. The build warns and emits a client-only
  shell rather than failing. The page still works; it just starts empty.

```jsx
// prerenders
const isDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

// falls back to a client-only shell
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
```

Pass `prerender: false` to skip it entirely.

`<Helmet>` is genuinely useful here: React 19 hoists its `<title>` and `<meta>` tags, and the builder
lifts them into `<head>` where crawlers read them. In the canvas, `<Helmet>` has no effect unless the
host renders a provider.

**recharts charts do not prerender.** Measured: they render nothing server-side, whether sized
explicitly or wrapped in `ResponsiveContainer`, and appear once the client hydrates. Everything else
on the page still prerenders, so only the chart area is blank in the initial HTML — fine for a
dashboard, worth knowing if a chart is your above-the-fold content.

## Notes

- The code contract is the same as the canvas: `export default` a component (or call `render(...)`),
  and **no `import` statements** — dependencies come from the scope. The builder validates with
  [`analyzeReactCode`](./react-canvas.md) first and throws with the specific issues if the code
  cannot render.
- Machine-generated `<EditableText>` tags from an `EditTextReactCanvas` session are reversed back to
  plain JSX. A deployed page does not keep click-to-edit fields.
- Only what the code references is bundled. Two lucide icons cost about 2 KB, not the whole pack.
- Asset filenames are content-hashed, so a redeploy busts caches on its own.
