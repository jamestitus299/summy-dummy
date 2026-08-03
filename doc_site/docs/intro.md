---
title: Introduction
description: What react-code-canvas does and when to use it.
---

# react-code-canvas

`react-code-canvas` is a React package for rendering React UI components from code strings in the browser.

Use it when your application needs to:

- Preview generated JSX before saving it.
- Render React component code without import statements.
- Provide a controlled scope of components, libraries, and values.
- Validate code and capture render errors.
- Let users edit rendered text content and receive updated JSX.

## Public API

| Export | Purpose |
| --- | --- |
| `ReactCanvas` | Renders component code with optional preview, editor, and error output. |
| `EditTextReactCanvas` | Renders component code with text editing behavior. |
| `analyzeReactCode` | Static analysis of a code string. No DOM and no render, so it runs in Node — for CI, batch audits and migrations. |

## Core Idea

Code passed to the package should not include imports. Instead, your app injects allowed dependencies through the `scope` prop.

```tsx
<ReactCanvas code={code} scope={{ Button, Chart }} />
```

This makes the runtime explicit and keeps generated code focused on UI.
