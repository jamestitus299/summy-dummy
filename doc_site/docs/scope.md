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

The package includes defaults for common UI and visualization libraries used by the project, including `recharts`, `lucide-react`, `react-icons/fa`, `motion/react`, and `react-helmet-async`.

Pass your own values to extend or override what is available.

## Practical Guidance

- Keep scope small and explicit.
- Avoid exposing sensitive data.
- Prefer stable component names.
- Document any custom scope values your generated code depends on.
