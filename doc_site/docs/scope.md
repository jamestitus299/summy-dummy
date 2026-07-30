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

The package includes defaults for common UI and visualization libraries used by the project, including `recharts`, `lucide-react`, `motion/react`, and `react-helmet-async`.

:::caution `react-icons/fa` was removed
Up to 4.2.0-beta.18 the default scope also injected all 1611 Font Awesome icons from `react-icons/fa`. That was ~424KB gzipped — roughly half the bundle — duplicating what `lucide-react` already covers with 5673 icons. Code referencing `Fa*` names now fails with a `ReferenceError`; switch to the lucide equivalent, or re-add the icons yourself through the `scope` prop.
:::

Pass your own values to extend or override what is available.

## Practical Guidance

- Keep scope small and explicit.
- Avoid exposing sensitive data.
- Prefer stable component names.
- Document any custom scope values your generated code depends on.
