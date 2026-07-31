---
name: react-code-canvas
metadata:
  version: 0.0.1
  library-version: ^5.0.0
description: "Constraints for authoring React component code that will be rendered by react-code-canvas (ReactCanvas / EditTextReactCanvas). Use whenever generating, editing, reviewing, or validating a code string that gets passed to the canvas as its `code` prop — including LLM prompt construction in the host app. Covers the injected scope, forbidden patterns, entry shape, name collisions, and programmatic validation."
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
import { useState } from 'react';        // ❌ stripped — binding is undefined
import { motion } from 'motion/react';   // ❌
```

Imports are removed by the transform. The names then resolve to nothing and throw at
runtime. Everything you need is already a global. Use it directly:

```jsx
export default function Page() {
  const [open, setOpen] = useState(false);   // ✅ already in scope
  return <motion.div animate={{ opacity: 1 }} />;
}
```

## 3. What is in scope

| Group | Names |
|---|---|
| React | `React`, `useState`, `useEffect`, `useContext`, `useReducer`, `useRef`, `useMemo`, `useCallback` |
| Icons | all **5670** `lucide-react` exports, e.g. `<Activity/>`, `<User/>`, `<ChevronRight/>` |
| Charts | all **101** `recharts` exports, e.g. `ResponsiveContainer`, `LineChart`, `XAxis`, `CartesianGrid` |
| Animation | `motion` (as `<motion.div>`) plus motion's **383** hooks/components |
| Head | `Helmet`, `HelmetProvider` |
| Entry | `render`, `exports`, `require` |

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
no other icon set. If the host app injects extra globals via the `scope` prop, they are
available too — but do not assume any beyond the table above.

## 4. Name collisions — the sharpest edge

The scope draws on ~6100 flat global names. Declaring a component or variable with a
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

**Lucide owns most common UI nouns.** Of 70 everyday component names checked
(`Navigation`, `Menu`, `Image`, `Link`, `Table`, `Search`, `Layout`, `Grid`, `Map`,
`Card`-adjacent words, …), **68 collide** with a lucide icon.

Therefore: **prefix your own components.** `SiteNavigation`, not `Navigation`.
`ProductCard`, not `Card`. `PageHeader`, not `Header`.

Never declare a module-scope name matching an injected global — including React hooks,
lucide icons, recharts components, motion exports, or the editing helpers
(`EditableText`, `__applyEditableTextPatch`).

## 5. Styling

Tailwind classes are fine, but **the canvas does not load Tailwind** — the host page
must provide it (CDN script or its own build). If it is absent, `className` values are
inert and the component renders unstyled. Inline `style` always works.

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
references before it can evaluate anything, so the first frame is always empty and the
loading overlay is always shown (unless `showLoader={false}`). Evaluation itself is
still synchronous once the scope has landed; it just cannot start on the first commit.
Nothing to do about this while authoring — it only matters if you are writing tests
against the canvas, which must await the render rather than assert immediately.

## 7. Security

Code is evaluated in the **host page's own context** — same origin, full access to
`document`, `window`, cookies, `localStorage`, and authenticated `fetch`. There is no
iframe sandbox. Never pass untrusted or unreviewed code to the canvas without adding
isolation appropriate to your application.

## 8. Validate programmatically

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
standalone JS that parses fine but throws in the canvas. That is §4 caught mechanically.

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
- [ ] own components prefixed so they cannot shadow the ~6100 injected globals
- [ ] every scope name spelled out literally, never built from strings
- [ ] `Text`/`Label`/`Tooltip`/`Line`/`Bar`/etc. used only inside chart trees
- [ ] top-level side effects guarded against re-execution
- [ ] `analyzeReactCode()` returns `valid: true`
