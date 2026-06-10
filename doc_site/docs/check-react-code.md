---
title: CheckReactCode
description: Validate React code by rendering it invisibly.
---

# CheckReactCode

`CheckReactCode` validates a code string by rendering it in a hidden container and returning any error.

```tsx
import { CheckReactCode } from 'react-code-canvas';

<CheckReactCode
  code={code}
  scope={scope}
  returnError={(error) => {
    setError(error);
  }}
/>;
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `code` | `string` | React code to validate. |
| `scope` | `Record<string, React.ComponentType \| unknown>` | Values required by the code. |
| `returnError` | `(error: string \| null) => string \| null \| void` | Receives an error message or `null`. |

## When To Use It

Use this component before saving generated code, before publishing user-created UI, or before showing a preview in an editor flow.
