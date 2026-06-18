---
title: EditTextReactCanvas
description: Render React code and edit text content in place.
---

# EditTextReactCanvas

`EditTextReactCanvas` renders component code and enables text editing behavior for rendered text nodes.

```tsx
import { EditTextReactCanvas } from 'react-code-canvas';

<EditTextReactCanvas
  code={code}
  scope={scope}
  showPreview={true}
  showEditor={false}
  showError={true}
  onSaveFinalCode={(updatedCode) => {
    setCode(updatedCode);
  }}
  onError={(error) => {
    setError(error);
  }}
/>;
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `code` | `string` | React code to render and transform for editing. |
| `scope` | `Record<string, any>` | Values available to the rendered code. |
| `showPreview` | `boolean` | Shows the rendered output. Defaults to `true`. |
| `showEditor` | `boolean` | Shows the code editor. Defaults to `false`. |
| `showError` | `boolean` | Shows runtime or transform errors. Defaults to `false`. |
| `onSaveFinalCode` | `(jsxCode: string) => void` | Receives updated JSX after text edits. |
| `onError` | `(error: string) => void` | Receives transform or render errors. |
| `persistKey` | `string` | Optional `localStorage` key. When set, the final saved JSX is persisted and restored on reload. |
| `onCodeChange` | `(jsxCode: string) => void` | Called with the final JSX whenever it changes, alongside `onSaveFinalCode`. |

## Persisting code

Pass a `persistKey` to save and restore edits across reloads via `localStorage`:

```tsx
<EditTextReactCanvas code={code} persistKey="my-editable-draft" />
```

Persistence here operates on the **final saved JSX** (the clean output), not the intermediate `EditableText` representation — so a restored value transforms back into edit mode correctly. Use `onCodeChange` if you want to persist the final JSX in your own store instead.

## Status

This API is still evolving. Treat it as beta and test it with the shapes of JSX your product generates.
