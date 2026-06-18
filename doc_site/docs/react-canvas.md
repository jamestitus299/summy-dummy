---
title: ReactCanvas
description: Render React component code in the browser.
---

# ReactCanvas

`ReactCanvas` is the primary rendering component.

```tsx
import { ReactCanvas } from 'react-code-canvas';

<ReactCanvas
  code={code}
  scope={scope}
  showPreview={true}
  showEditor={false}
  showError={true}
/>;
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `code` | `string` | React component code to render. |
| `scope` | `Record<string, React.ComponentType \| unknown>` | Values available to the rendered code. |
| `showPreview` | `boolean` | Shows the rendered output. Defaults to `true`. |
| `showEditor` | `boolean` | Shows the code editor. Defaults to `false`. |
| `showError` | `boolean` | Shows compile-time or runtime errors. Defaults to `false`. |
| `persistKey` | `string` | Optional `localStorage` key. When set, edited code is saved on change and restored on reload. |
| `onCodeChange` | `(code: string) => void` | Called whenever the code changes in the editor. |

## Persisting code

By default the editor keeps code in memory only, so a page refresh resets it. There are two ways to make it persist:

**Built-in `localStorage`** — pass a `persistKey` and the canvas saves on every edit and restores on reload:

```tsx
<ReactCanvas code={defaultCode} showEditor persistKey="my-canvas-draft" />
```

**Your own storage** — use `onCodeChange` to save wherever you like (URL, backend, app state) and feed it back through `code`:

```tsx
const [code, setCode] = useState(() => loadFromBackend());

<ReactCanvas
  code={code}
  showEditor
  onCodeChange={(next) => {
    setCode(next);
    saveToBackend(next); // debounce this for remote saves
  }}
/>;
```

You can use both together — `persistKey` for instant durability and `onCodeChange` to sync elsewhere.

## Usage Notes

- Prefer default-exported function components.
- Keep code strings focused on JSX and component logic.
- Use `scope` for dependencies instead of import statements.
