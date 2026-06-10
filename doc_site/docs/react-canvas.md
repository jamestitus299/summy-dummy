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

## Usage Notes

- Prefer default-exported function components.
- Keep code strings focused on JSX and component logic.
- Use `scope` for dependencies instead of import statements.
