---
title: Quick Start
description: Render your first React component with react-code-canvas.
---

# Quick Start

Import `ReactCanvas` and pass it a code string:

```tsx
import { ReactCanvas } from 'react-code-canvas';

const code = `
export default function Card() {
  return (
    <section style={{ padding: 24 }}>
      <h2>Hello canvas</h2>
      <p>This component was rendered from a string.</p>
    </section>
  );
}
`;

export function Example() {
  return (
    <ReactCanvas
      code={code}
      showPreview
      showError
      scope={{}}
    />
  );
}
```

## Imports

Do not place import statements inside the rendered code string. Inject dependencies through `scope` instead.

```tsx
<ReactCanvas
  code={code}
  scope={{
    Button,
    SparklesIcon,
  }}
/>
```

Then the code string can reference `Button` and `SparklesIcon` directly.
