---
name: react-code-canvas
metadata:
  version: 0.0.5
  library-version: "^5.0.0"
description: "Constraints for authoring React component code that will be rendered by react-code-canvas (ReactCanvas / EditTextReactCanvas) or built into a static site with buildStandaloneSite. Use whenever generating, editing, reviewing, or validating a code string that gets passed to the canvas as its `code` prop or to the site builder — including LLM prompt construction in the host app. Covers the injected scope, forbidden patterns, entry shape, name collisions, React DOM property casing, standalone-build rules (Tailwind, prerender safety), performance, and programmatic validation."
---

# react-code-canvas — authoring constraints

Code passed to the canvas is **not** an ordinary module. It is transpiled with sucrase
and executed via `new Function(...scopeKeys, code)`, with dependencies handed in as
function parameters rather than resolved as imports.

Everything below follows from that. Violations mostly fail at *runtime*, inside the
rendered page, not at build time — so they are easy to ship unnoticed.

## 1. Entry shape

The canvas needs exactly one of:

```jsx
export default function Page() { return <div/>; }   // preferred
```

```jsx
render(<Page />);                                    // also supported
```

Neither present → the code compiles, produces nothing, and the canvas renders blank.
It reports `Code did not render anything` via `onError`, but nothing is displayed.

A bare leading expression also works — `<div/>`, `function(`, `()=>`, `class ` at the
start of the source get an implicit `export default` prepended. Do not rely on this;
be explicit.

## 2. No import statements

```jsx
import { useState } from 'react';        // ❌ throws `Module not found: 'react'`
import { motion } from 'motion/react';   // ❌
```

An import whose binding is **used** becomes a `require(...)` call, and the canvas
provides no modules to require — the whole component throws `Module not found` the
moment it evaluates. An import whose binding is never used is elided entirely and
does no harm (which is why the analyzer reports `import-statement` as non-fatal).
Either way: everything you need is already a global. Use it directly:

```jsx
export default function Page() {
  const [open, setOpen] = useState(false);   // ✅ already in scope
  return <motion.div animate={{ opacity: 1 }} />;
}
```

## 3. What is in scope

| Group | Names | Load cost when referenced |
|---|---|---|
| React | `React`, `useState`, `useEffect`, `useContext`, `useReducer`, `useRef`, `useMemo`, `useCallback` | free (base) |
| Icons (preferred) | all **5841** `lucide-react` exports, e.g. `<Activity/>`, `<User/>`, `<ChevronRight/>` | ~0.8 KB gz per icon |
| Icons (legacy) | all **1611** `react-icons/fa` exports, e.g. `<FaUser/>`, `<FaHome/>` | **whole pack, ~420 KB gz** — one `Fa*` name fetches all of it |
| Charts | all **101** `recharts` exports, e.g. `ResponsiveContainer`, `LineChart`, `XAxis`, `CartesianGrid` | whole library, ~158 KB gz |
| Animation | `motion` (as `<motion.div>`) plus motion's **383** hooks/components | whole library, ~64 KB gz |
| Head | `Helmet`, `HelmetProvider` | free (base) |
| Entry | `render`, `exports`, `require` | free (base) |

Prefer lucide for icons in new code. The `Fa*` set exists so pages written before
the lucide switch keep rendering — see [performance](references/performance.md)
for why one stray `Fa*` name is the single most expensive token you can emit.

Plus every normal browser/JS global — `document`, `window`, `fetch`, `localStorage`,
`setTimeout`, `Math`, `JSON`, `Intl`, and so on. These all work.

### Names must appear literally in the source

The canvas does not ship those libraries up front. It scans your code for
identifiers and loads only what it finds — one file per icon, and recharts or motion
only if you reference them. Which means **a name the source never spells out is
never loaded**:

```jsx
const Icon = dark ? Moon : Sun;          // ✅ both names appear literally
const which = 'Activity';
const Icon = globalThis[which];          // ❌ nothing to find; undefined at runtime
```

Writing names out in full is the normal thing to do, so this rarely bites. Building
component names by string concatenation never worked here anyway — the scope arrives
as `new Function` parameters, not as an object you can index.

### Not in scope

No other library is available. No `lodash`, no `axios`, no `ReactDOM`, no `Babel`,
no icon set beyond lucide and `react-icons/fa`. If the host app injects extra globals
via the `scope` prop, they are available too — but do not assume any beyond the
table above.

## 4. Name collisions — the sharpest edge

The scope draws on ~7950 flat global names. Declaring a component or variable with a
name that already exists silently shadows it, or worse, your JSX resolves to a chart
primitive.

Loading on demand does **not** save you here: mentioning `Activity` anywhere is what
puts `Activity` in scope, so `const Activity = ...` at module level is still a
duplicate declaration.

**Recharts owns these generic words:**

`Text` `Label` `Legend` `Tooltip` `Line` `Bar` `Cell` `Area` `Pie` `Customized`
`Brush` `Cross` `Curve` `Dot` `Polygon` `Rectangle` `Sector`

So `<Text>hello</Text>` is a *chart* component, not a text element. Use them only
inside a chart tree. For generic UI use plain tags (`<span>`, `<p>`) or a distinctly
named component.

**Lucide owns most common UI nouns.** Measured against `isIconName`, **54 of 70**
everyday component names collide — `Navigation`, `Menu`, `Image`, `Link`, `Table`,
`Search`, `Layout`, `Grid`, `Map`, `User`, `File`, `Folder`, `Calendar`, `Settings`
and so on.

A useful few do *not*, and are safe to use unprefixed: `Card`, `Header`, `Footer`,
`Button`, `Input`, `Modal`, `Panel`, `Alert`, `Tabs`, `Dialog`, `Chart`. That list is
only as stable as the lucide version, though — a future release adding a `Card` icon
turns a working page into a duplicate declaration.

Therefore: **prefix your own components anyway.** `SiteNavigation`, not `Navigation`.
`DataTable`, not `Table`. `AppSearch`, not `Search`. Prefixing costs nothing and does
not depend on which names lucide happens to ship today.

Never declare a module-scope name matching an injected global — including React hooks,
lucide icons, recharts components, motion exports, or the editing helpers
(`EditableText`, `__applyEditableTextPatch`).

## 5. Styling

**Default to inline `style` (or a `<style>` tag in the component).** The canvas
ships no CSS framework, so in-code styles are the only styling that works
everywhere, on every host, with zero extra download.

Tailwind classes work **only if the host page provides Tailwind** — and the usual
way hosts do that for arbitrary generated classes is the Play CDN, a ~124 KB
script that JIT-compiles CSS in the browser on every visit. Absent it,
`className` values are inert and the component renders unstyled. So Tailwind in
canvas code is both a hard host dependency and a per-visit performance cost that
inline styles simply don't have.

Use Tailwind only when the host explicitly guarantees it; never mix — a page
half-styled by each is the worst of both.

**Exception — code destined for `buildStandaloneSite`.** The site builder compiles Tailwind for real and ships the CSS with
the output, so there is no host to depend on and no CDN. If you know the code is
being built into a standalone site rather than rendered in someone's canvas,
Tailwind is fully available and costs nothing at runtime. The guidance above is
about the *canvas*, where no such compile step exists.

```jsx
// ✅ self-contained, styled on any host
<div style={{ display: 'flex', gap: 12, padding: '2rem' }}>

// ⚠️ renders unstyled unless the host loads Tailwind
<div className="flex gap-3 p-8">
```

For pseudo-classes, media queries, and keyframes — the things inline `style`
cannot express — emit one `<style>` tag inside the component:

```jsx
export default function PricingPage() {
  return (
    <main>
      <style>{`
        .pp-card { transition: transform .2s; }
        .pp-card:hover { transform: translateY(-4px); }
        @media (max-width: 640px) { .pp-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="pp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="pp-card">…</div>
      </div>
    </main>
  );
}
```

Prefix such class names (`pp-`) like component names — the document is shared
with the host page.

## 6. Behavior worth designing around

**Empty code renders nothing** — no output, no loader. Not an error.

**Errors appear in a toast** pinned top-right, with the message in `#react-code-error`.

**A failed edit re-executes the previous good code.** The canvas keeps the last
successful render on screen while showing the error, and doing so re-runs that code's
module-level side effects. Guard anything that must happen once:

```jsx
if (!document.getElementById('my-script')) {
  // inject once
}
```

**Module-level code runs on every evaluation.** Keep top-level work cheap; heavy
synchronous work there blocks the main thread and freezes the page.

**Evaluation is synchronous.** `render()` must be called in the same tick —
`setTimeout(() => render(<X/>), 0)` never renders.

**The first render is not.** The canvas fetches the icons/charts/animation your code
references before it can evaluate anything, so the first frame is empty and the
loading overlay is shown whenever that loading spans a paint (with everything
already cached, resolution can land in a microtask and no overlay frame appears).
Evaluation itself is still synchronous once the scope has landed; it just cannot
start on the first commit. Nothing to do about this while authoring — it only
matters if you are writing tests against the canvas, which must await the render
rather than assert immediately.

## 7. React DOM properties, not HTML attributes

JSX takes React's camelCase property names, not the HTML attribute spellings. Copying
markup from an HTML snippet or a docs page is the usual way this gets in.

React warns, then does one of two things — and the second is the dangerous one:

```jsx
// ⚠️ warns, but renders anyway (React passes unknown lowercase attributes through)
<p class="p-4">          <label for="x">          <input maxlength="10" />

// ❌ warns and is SILENTLY DROPPED from the output
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<input autofocus readonly />
```

That `crossorigin` case is the one that bites: the `<link>` still renders, so the page
looks fine, but the preconnect has lost its CORS mode and the font never benefits.
Same shape for `autofocus` and `readonly` — the element renders, the behaviour is gone.

```jsx
// ✅
<p className="p-4">
<label htmlFor="x">
<input maxLength={10} autoFocus readOnly />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

The ones worth memorising, because they are the ones people paste:

| HTML | JSX |
| --- | --- |
| `class` | `className` |
| `for` | `htmlFor` |
| `crossorigin` | `crossOrigin` |
| `charset` | `charSet` |
| `http-equiv` | `httpEquiv` |
| `srcset` | `srcSet` |
| `tabindex` | `tabIndex` |
| `maxlength` / `minlength` | `maxLength` / `minLength` |
| `autofocus` / `autocomplete` | `autoFocus` / `autoComplete` |
| `readonly` / `novalidate` | `readOnly` / `noValidate` |
| `colspan` / `rowspan` | `colSpan` / `rowSpan` |
| `referrerpolicy` | `referrerPolicy` |
| `playsinline` / `autoplay` | `playsInline` / `autoPlay` |
| `datetime` | `dateTime` |
| `enctype` | `encType` |
| `spellcheck` / `contenteditable` | `spellCheck` / `contentEditable` |

`data-*` and `aria-*` keep their dashes and are the only exceptions.

Inline `style` is an object with camelCase keys, never a string — `style="color:red"`
throws. Unitless numbers become px: `{{ padding: 16 }}` is `16px`, `{{ lineHeight: 1.5 }}`
stays unitless.

```jsx
<div style={{ backgroundColor: '#111', paddingTop: 16, borderRadius: 8 }}>
```

## 8. Building to a standalone site

Code that renders in the canvas can also be built into a deployable static site with
`buildStandaloneSite` (see the `react-code-canvas/builder` entry). The contract is the
same — default export, no imports, scope-provided dependencies — with four differences
worth writing for up front.

**Tailwind is available.** The builder compiles the classes your code uses into a real
stylesheet, so the warning in §5 does not apply to a page you know is being built. Write
`className="flex gap-4 p-8"` freely. It still will not work in a bare canvas, so if the
same code must do both, stay with inline `style`.

**Core Tailwind only — no plugins, no custom theme.** The builder compiles
`@import "tailwindcss"` with stock defaults. There is no config file, so anything that
would come from a plugin or a `theme.extend` block produces no CSS and the element
renders unstyled. The classes that bite most often:

| Class | From | Instead |
| --- | --- | --- |
| `animate-in`, `slide-in-from-top-2`, `fade-in` | `tailwindcss-animate` plugin | a `<style>` block with `@keyframes` |
| `prose`, `prose-lg` | `@tailwindcss/typography` | style the elements directly |
| `bg-brand-500`, `text-primary` | a custom `theme.extend` palette | the arbitrary value: `bg-[#0071E3]` |

**Arbitrary values are core and do work** — verified compiling: `text-[#1D1D1F]`,
`w-[80vw]`, `bg-white/10`, `hover:bg-black/[0.02]`, `focus:border-[#0071E3]`,
`lg:col-span-5`. So any brand colour or one-off size is available without a config;
write it inline rather than inventing a theme name.

**Class names must appear literally.** Same rule as scope names: the compiler collects
candidates from the source, so a fully computed class is invisible and its CSS is never
emitted.

```jsx
// ✅ both branches are in the source
<div className={active ? "bg-green-500" : "bg-red-500"}>
// ✅ static chunks of a template are collected
<div className={`p-4 ${extra}`}>
// ❌ nothing to collect -- renders unstyled
<div className={`bg-${color}-500`}>
```

**Your own class names need a `<style>` block.** A class Tailwind does not recognise is
simply dropped, so `className="apple-card"` styles nothing unless the component also
defines it:

```jsx
<style>{`.apple-card { border-radius: 18px; backdrop-filter: blur(20px); }`}</style>
<div className="apple-card p-8">…</div>
```

That CSS ships inside the JS bundle and works — it is not Tailwind's to compile.

**Guard DOM access during render, or lose the prerender.** The builder renders the first
frame in Node, where there is no DOM. Touching `document` or `window` *while rendering*
throws; the build warns and falls back to a client-only shell, so the page still works but
ships empty HTML and loses the SEO the prerender existed for. `useEffect` never runs
during prerender, so it is always safe.

```jsx
// ✅ prerenders
const dark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
// ✅ prerenders -- effects do not run server-side
useEffect(() => { document.title = 'Ready'; }, []);
// ❌ throws in Node, drops the whole page to a client-only shell
const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

**`<Helmet>` becomes real.** In the canvas it is a no-op unless the host renders a
provider; in a built site React 19 hoists its tags and the builder lifts them into
`<head>`. Use it for `<title>` and `<meta name="description">` — that is what crawlers
read.

One thing that does not prerender at all: **recharts**. Charts render nothing server-side
and appear on hydration. Everything around them still prerenders, so this only matters if
a chart is your above-the-fold content.

## 9. Performance — standalone builds

**Load time of the built site.** For canvas-only code, skip to §9b.

The builder already does the page-level work for you, so do not hand-write it: the
CSS is inlined when small (no render-blocking request), the script is `defer`red in
`<head>` (discovered immediately, never blocks the parse), asset names are
content-hashed (safe to cache immutably), and the markup is prerendered. A built page
is **two requests**: the HTML and the JS.

What is left is entirely decided by what you write.

### The payload

Measured, brotli, over the wire:

| Page contains | JS | Δ |
| --- | --- | --- |
| nothing but React | **51 KB** | the floor — unavoidable |
| + 8 lucide icons | 52 KB | ~1 KB total |
| + one `Fa*` icon | 52 KB | ~1 KB — esbuild tree-shakes the other 1610 |
| + `motion` | 86 KB | **+35 KB** |
| + `recharts` | 123 KB | **+72 KB** |

**`motion` and `recharts` are the only levers.** Together they roughly quadruple the
payload. Everything else is noise: icons are ~free, and Tailwind output measured 1.2 KB
brotli for a small page, 2.2 KB at ~30 utilities, inlined either way.

So: do not import a charting library to draw one sparkline, and do not pull in `motion`
for an effect a CSS transition does. A `<style>` block with `transition` or
`@keyframes` costs bytes already in the HTML; `motion` costs 35 KB.

The canvas rules about names in comments do **not** apply here — imports come from an
AST, so `// like a LineChart` costs nothing.

### First contentful paint

The prerendered HTML paints before any of that 51 KB parses, so FCP is almost entirely
about not throwing that away:

1. **Never touch `document`/`window` during render.** One unguarded access drops the
   *whole page* to an empty shell (§8) and FCP becomes "after React boots". This is the
   most expensive mistake available and the easiest to make.
2. **Keep charts below the fold.** recharts renders nothing server-side, so a chart at
   the top means an empty first paint no matter what else you do. Lead with text.
3. **Render the shell, not `null`.** Returning `null` until a `fetch` resolves throws
   away the prerendered HTML you already paid for. Prerender a skeleton; fill it in on
   the client.
4. **Nothing above the fold starts invisible.** An element animating in from
   `opacity: 0` is blank to a crawler and to a slow connection. Animate below the fold,
   or start visible.

### Images and assets

**The builder bundles code, not files.** Nothing on disk is copied — `<img
src="./photo.png" />` emits markup and no file, so the built site 404s.

```jsx
// ✅ absolute URL to something you already host
<img src="https://cdn.example.com/photo.avif" alt="" width={800} height={450} />
// ✅ data URI for small assets -- no extra request
<img src="data:image/svg+xml;base64,PHN2Zy…" alt="" />
```

Data URIs only for genuinely small assets: base64 adds ~33 %, cannot be cached
separately, and is markup the prerender has to carry.

- **Always set `width` and `height`.** Prerendered HTML means the image box exists
  before the image does; without dimensions every image is a layout shift.
- **`loading="lazy"` and `decoding="async"`** below the fold — plain lowercase
  attributes, no React casing needed.
- **Never lazy-load the hero.** It delays the LCP element by a round trip.
- **Prefer lucide icons over image files** — they are inline SVG in the bundle, so they
  cost no request and cannot shift layout.
- **Fonts: preconnect, and mind the casing.** `crossOrigin` — the HTML spelling is
  silently dropped (§7) and the preconnect then does nothing.
- **Set `font-display`.** The default blocks text for up to 3 s, and invisible text is
  not a contentful paint, so FCP waits on the font. `swap` paints immediately in a
  fallback but reflows when the real font lands; `optional` gets the fast paint with no
  shift, at the cost of some first visits using the fallback. Prefer `optional` unless
  the brand font is non-negotiable.

```jsx
<Helmet>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
</Helmet>
<style>{`@font-face { font-family: 'X'; src: url(…); font-display: optional; }`}</style>
```

A system font stack avoids all of it — no request, no invisible text, no shift — and is
the fastest option whenever the design allows. Tailwind's default `font-sans` already is
one.

## 9b. Performance — canvas rendering

Different machine, different rules. The canvas has no bundler: it scans the source with
a **regex** and fetches whole packages at runtime, and re-evaluates the entire string on
every change. So authoring choices are directly load-time and main-thread choices:

1. **Never emit an `Fa*` name unless the page already uses Font Awesome.** One
   `Fa*` reference fetches the whole ~420 KB gz pack; the lucide equivalent is
   one ~0.8 KB file. `FaUser` → `User`, `FaHome` → `House`.
2. **Do not mention chart/animation names you don't render.** The scanner is a
   regex over the whole source — `recharts` (~158 KB gz) and `motion` (~64 KB gz)
   load even when the name only appears in a **comment or string literal**.
   `// like a LineChart` costs 158 KB.
3. **Keep module level empty.** Top-level statements re-run on every evaluation,
   including the re-execution after a failed edit. Constants are fine; work is not.
4. **Render the shell before the data.** The canvas paints as soon as evaluation
   returns — a component that returns `null` until a `fetch` resolves wastes that
   paint and pushes the host page's LCP onto your network call.
5. **Style inline, not with Tailwind.** Tailwind classes only render if the host
   ships a ~124 KB browser JIT on every visit; inline `style` (plus a `<style>`
   tag for hover/media/keyframes) costs nothing and works everywhere. See .5.

Full guidance with copy-paste patterns:

- [references/performance.md](references/performance.md) — the canvas rules above
  in depth, with the internals that explain them
- [references/patterns.md](references/patterns.md) — known-good page skeletons
  (static page, chart page, animated page, data-driven page)

## 10. Security

Code is evaluated in the **host page's own context** — same origin, full access to
`document`, `window`, cookies, `localStorage`, and authenticated `fetch`. There is no
iframe sandbox. Never pass untrusted or unreviewed code to the canvas without adding
isolation appropriate to your application.

## 11. Validate programmatically

Do not rely on review alone. The library ships a static analyzer that runs in Node —
no DOM, no React render — suitable for CI, batch audits, and migrations:

```js
import { analyzeReactCode } from 'react-code-canvas';

const result = await analyzeReactCode(code);
// {
//   valid: boolean,
//   issues: [{ type, message, name?, line?, column? }],
//   unknownGlobals: string[],   // names that will throw ReferenceError
//   referencedGlobals: string[],
//   hasDefaultExport: boolean,
// }
```

Issue types: `empty`, `syntax`, `transform`, `compile`, `import-statement`,
`unknown-identifier`, `no-default-export`. Only `import-statement` is non-fatal (the
code may still render if the binding is never used).

`compile` is the one worth knowing about: scope entries become `new Function`
parameters, so a module-scope `const useState = 1` is a duplicate declaration — valid
standalone JS that parses fine but throws in the canvas. That is .4 caught mechanically.

Options:

```js
await analyzeReactCode(code, {
  // Omit to check against exactly what the canvas would load for THIS code.
  // Passing one replaces that, so lucide/recharts/motion stop being available.
  scope,
  allowedGlobals: ['MY_FLAG'],// extra host-injected names
  forbidImports: true,        // default
});
```

It catches syntax errors, references to names nothing provides (this is how you find
stored code still using `Fa*` icons), and code that compiles but produces no
component. It does **not** execute the code, so it cannot catch logic errors or
failures that only surface once mounted. For that, render it with `ReactCanvas` and
watch its `onError` callback.

## Checklist

- [ ] default export (or `render()` call) present
- [ ] zero `import` statements
- [ ] own components prefixed so they cannot shadow the ~7950 injected globals
- [ ] every scope name spelled out literally, never built from strings
- [ ] `Text`/`Label`/`Tooltip`/`Line`/`Bar`/etc. used only inside chart trees
- [ ] top-level side effects guarded against re-execution
- [ ] lucide icons, not `Fa*`, unless the page already pays for Font Awesome
- [ ] no recharts/motion names in comments or strings unless the page charts/animates
- [ ] static shell renders before any data fetch resolves
- [ ] styled with inline `style` / in-code `<style>`, not Tailwind (unless the host guarantees it, or it is being built to a standalone site)
- [ ] DOM props in React casing — `className`, `htmlFor`, `crossOrigin`, `autoFocus`, `readOnly` — never the HTML spelling
- [ ] `style` is an object with camelCase keys, never a string
- [ ] if building to a standalone site: class names written literally, DOM access during render guarded with `typeof window !== 'undefined'`
- [ ] no plugin classes (`animate-in`, `slide-in-from-*`, `prose`) and no custom theme names (`bg-brand-500`) — core Tailwind and arbitrary values only
- [ ] every non-Tailwind class used is defined in a `<style>` block in the component
- [ ] images use absolute URLs or data URIs — local file paths are not copied into the build
- [ ] every `<img>` has `width`/`height`; below-the-fold ones have `loading="lazy"`, the hero does not
- [ ] nothing above the fold starts invisible (`opacity: 0`) or depends on a chart
- [ ] `analyzeReactCode()` returns `valid: true`
