---
title: Scope
description: Inject dependencies into rendered code.
---

# Scope

The `scope` prop controls what the rendered code can reference.

Instead of writing imports inside the code string:

```tsx
import { Button } from './button';
```

pass the dependency into scope:

```tsx
<ReactCanvas
  code={code}
  scope={{
    Button,
    data,
    theme,
  }}
/>
```

The code string can then reference those names:

```tsx
export default function Example() {
  return <Button>{theme.label}</Button>;
}
```

## Built-In Scope

The package injects a default scope on top of whatever you pass. Two tiers:

**Always present** (shipped in the entry chunk, no extra fetch):

- React and its hooks — `React`, `useState`, `useEffect`, `useContext`, `useReducer`, `useRef`, `useMemo`, `useCallback`
- `react-helmet-async` — `Helmet`, `HelmetProvider` (~6KB, not worth a round trip)
- the editing helpers used by `EditTextReactCanvas`

**Loaded on demand**, only when the code actually mentions a name from the group:

| Group | Names | Fetched when referenced |
| --- | --- | --- |
| `lucide-react` | 5841 exports across 1703 icon files | ~0.8KB gz — one file for that icon alone |
| `recharts` | 101 exports | ~145KB gz — the whole library |
| `motion/react` | 383 exports (incl. `motion` itself) | ~61KB gz — the whole library |
| `react-icons/fa` | 1611 exports | **~420KB gz — the whole pack** |

Before each evaluation the canvas scans the source with an identifier regex and imports only the matching groups. Fetches run in parallel and the browser caches modules, so a name costs at most one round trip per session.

The scan is a regex, not a parse — it cannot tell code from comments or strings. `// TODO: try a LineChart here` pulls in all 145KB of recharts. Over-matching is deliberate: a wasted fetch is harmless, a missed one breaks the render.

:::caution `react-icons/fa` is expensive
`react-icons/fa` ships as one module with no per-icon files, so a single `Fa*` reference fetches all 1611 icons — ~420KB gzipped, larger than everything else in the scope combined. The `lucide-react` equivalent is a ~0.8KB file. Prefer lucide (`FaUser` → `User`, `FaHome` → `House`); the Font Awesome set exists so pages written before the lucide switch keep rendering.

It was removed entirely in 4.2.0-beta.18 and restored as a lazy group in 5.0.0-beta.3, so `Fa*` names work again — they just carry that cost when used.
:::

Names must appear **literally** in the source. `globalThis['Activity']` finds nothing, because the scope arrives as `new Function` parameters rather than an object you can index.

Values you pass via `scope` are merged last, so they extend the defaults and override them on a name collision.

## Practical Guidance

- Keep scope small and explicit.
- Avoid exposing sensitive data.
- Prefer stable component names.
- Document any custom scope values your generated code depends on.
