# ***react-code-canvas***

A library for rendering, editing (text) plain React code.

---

## **Installation**

```bash
npm install react-code-canvas
# or
yarn add react-code-canvas
```

---

## **Usage**

### **Render a React component**

```tsx
import { ReactCanvas } from "react-code-canvas";

<ReactCanvas
  code={CODE}
  showPreview={true}
  showEditor={false}
  showError={true}
  scope={SCOPE}
/>
```

##### Note: You can use Tailwind CDN script to style. https://cdn.tailwindcss.com

#### **Props**

| Prop          | Type                  | Description                                                                              |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `code`        | `string`              | React functional component code (`export default function...`) without import statements |
| `showPreview` | `boolean`             | Display the rendered output                                                              |
| `showEditor`  | `boolean`             | Show the code editor                                                                     |
| `showError`   | `boolean`             | Display runtime or compile-time errors                                                   |
| `scope`       | `Record<string, any>` | Components, variables, and libraries available inside sandbox execution, can pass custom                   |

---

### **Validate React code by rendering in the frontend but hidden**

```tsx
import { CheckReactCode } from "react-code-canvas";

<CheckReactCode 
  code={CODE}
  scope={SCOPE}
  returnError={handleError} // returnError?: (error: string | null) => string | null | void;
/>
```

#### **Props**

| Prop           | Type                            | Description                                         |
| -------------- | ------------------------------- | --------------------------------------------------- |
| `code`         | `string`                        | React code to validate                              |
| `scope`        | `Record<string, any>`           | Additional scope values required for execution      |
| `returnError` | `(err: string \| null) => void` | Returns a string error message (or `null` if valid) |

---

### **Editable React code canvas - Text**

```tsx
import { EditTextReactCanvas } from "react-code-canvas";

<EditTextReactCanvas 
  code={CODE}
  scope={SCOPE}
  showPreview={true}
  showEditor={false}
  showError={true}
  onSaveFinalCode={func} // onSaveFinalCode?: (jsxCode: string) => void;
/>
```

Allows text editing capabilities to react code.

Note: This feature is still in development.

---

## **Notes**

* Ensure your code is **exported** using `export default function ComponentName() {}`
* Do **not** include `import` statements; use the `scope` prop to inject dependencies
* Include libraries in scope: ```recharts, lucide-react, react-icons/fa```

---

## **Changelog**

See **CHANGELOG.md** for version updates and features.

---
