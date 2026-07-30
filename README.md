# react-code-canvas

<p align="center">
  <img src="./public/rrc.png" alt="react-code-canvas preview" width="160" height="160" />
</p>

A browser-based canvas for rendering React components live.

`react-code-canvas` is useful when you need to preview JSX from strings and for artifacts.

## Installation

```bash
npm install react-code-canvas
```

```bash
yarn add react-code-canvas
```

```bash
bun add react-code-canvas
```

## Usage

### Render a React Component

```tsx
import { ReactCanvas } from "react-code-canvas";

<ReactCanvas
  code={CODE}
  showPreview={true}
  showEditor={false}
  showError={true}
  scope={SCOPE}
/>;
```

You can use a Tailwind CDN script in the host app if the rendered code depends on Tailwind utility classes.

#### Props

| Prop | Type | Description |
| --- | --- | --- |
| `code` | `string` | React functional component code, usually `export default function...`, without import statements. |
| `showPreview` | `boolean` | Displays the rendered output. |
| `showEditor` | `boolean` | Shows the code editor. |
| `showError` | `boolean` | Displays runtime or compile-time errors. |
| `scope` | `Record<string, any>` | Components, values, and libraries available to the rendered code. |
| `persistKey` | `string` | Optional `localStorage` key. When set, edited code is saved on change and restored on reload. |
| `onCodeChange` | `(code: string) => void` | Called whenever the code changes in the editor. Use it to persist code yourself (URL, backend, etc.). |
| `showLoader` | `boolean` | Shows a full-screen overlay while non-empty code has not produced output yet. Defaults to `!showEditor`. |
| `loader` | `React.ReactNode` | Replaces the default spinner with your own node. |
| `onError` | `(error: string) => void` | Called when non-empty code evaluates without throwing but never renders anything. |

### Validate React Code

```tsx
import { CheckReactCode } from "react-code-canvas";

<CheckReactCode
  code={CODE}
  scope={SCOPE}
  returnError={handleError}
/>;
```

#### Props

| Prop | Type | Description |
| --- | --- | --- |
| `code` | `string` | React code to validate. |
| `scope` | `Record<string, any>` | Scope values required for execution. |
| `returnError` | `(err: string \| null) => void` | Receives an error message, or `null` when the code is valid. |

### Editable React Code Canvas

```tsx
import { EditTextReactCanvas } from "react-code-canvas";

<EditTextReactCanvas
  code={CODE}
  scope={SCOPE}
  showPreview={true}
  showEditor={false}
  showError={true}
  onSaveFinalCode={handleSave}
  onError={handleError}
/>;
```

`EditTextReactCanvas` adds text editing behavior to rendered React code (beta).

## Notes

- Code should export a default component, for example `export default function ComponentName() {}`.
- Do not include import statements in rendered code. Inject dependencies through the `scope` prop.
- Common scoped libraries include `recharts`, `lucide-react`, and `react-icons/fa`.
- Empty or whitespace-only `code` renders nothing at all — no output and no loader.
- When an edit fails to compile, `ReactCanvas` keeps the previous successful render on screen and reports the error. Doing so re-executes the previous code, so any top-level side effects in it (analytics calls, script injection, DOM mutation) run again. Guard side effects if that matters. `CheckReactCode` opts out of this and only reports the error.
- This package evaluates provided code in the browser. Do not execute untrusted code without an additional isolation strategy appropriate for your application.

## Development

This repository uses Bun for dependency management and CI.

```bash
bun install --frozen-lockfile
bun run test
bun run build
```

Run Storybook locally:

```bash
bun run dev
```

Other useful commands:

```bash
bun run build-storybook
bun run size
```

The committed lockfile is `bun.lock`. Do not commit `package-lock.json`.

## Documentation Site

The package documentation lives in `doc_site` and is deployed to GitHub Pages from the `master` branch.

```bash
bun run docs:dev
bun run docs:build
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

All participants are expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version updates.

## License

MIT. See [LICENSE](./LICENSE).
