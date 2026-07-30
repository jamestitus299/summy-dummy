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
| `showError` | `boolean` | Shows an error toast for compile-time or runtime errors. Defaults to `false`. |
| `errorComponent` | `React.ReactNode \| ((error: string, dismiss: () => void) => React.ReactNode)` | Replaces the built-in toast. Receives the message and a `dismiss` callback. Requires `showError`. |
| `dismissibleError` | `boolean` | Shows a close button on the built-in toast. Defaults to `true`. |
| `persistKey` | `string` | Optional `localStorage` key. When set, edited code is saved on change and restored on reload. |
| `onCodeChange` | `(code: string) => void` | Called whenever the code changes in the editor. |
| `showLoader` | `boolean` | Shows a full-screen overlay while non-empty code has not produced output yet. Defaults to `!showEditor`. |
| `loader` | `React.ReactNode` | Replaces the default spinner with your own node. |
| `onError` | `(error: string) => void` | Called when non-empty code evaluates without throwing but never renders anything. |

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

## Loading state

`showLoader` renders a full-screen overlay (a spinner on a dark background) while the canvas is compiling and evaluating the code. It hides once output is produced and stays hidden, so later broken edits do not bring it back.

It defaults to `!showEditor`. The overlay is `position: fixed; inset: 0`, so it would cover an editor as well as the preview — with `showEditor` on you almost never want it. Pass it explicitly to override either way:

```tsx
<ReactCanvas code={code} showLoader={false} />          // never show it
<ReactCanvas code={code} showEditor showLoader />        // show it even with an editor
```

Swap the spinner for your own node with `loader`. It is subject to the same visibility rules, so it cannot get stuck on screen:

```tsx
<ReactCanvas code={code} loader={<MyBrandedSpinner />} />
```

### How the loader gets a chance to appear

Transform and evaluation are **synchronous**. Left alone, the first commit would already contain the finished output, and the browser would never paint a loading state — you would see nothing, then content.

So when `showLoader` is on, the canvas defers the *initial* evaluation by one macrotask: it commits the empty pending state, lets the browser paint the loader, then compiles and evaluates. That costs one extra tick on mount and is why the loader is visible even for fast code.

Two consequences worth knowing:

- **Output is no longer present in the first commit.** With `showLoader` on, `code` is evaluated just after mount rather than during it. Tests that mount and immediately assert on rendered output need to flush a tick first, or pass `showLoader={false}`.
- **Only the first evaluation is deferred.** Later code changes — every editor keystroke — are evaluated synchronously, so typing does not flash the loader.

`showLoader={false}` skips the deferral entirely and keeps the original fully synchronous behavior.

The overlay never appears for empty or whitespace-only `code` (which renders nothing at all), nor once an error is present — an error is a resolved outcome, and covering it with a spinner would hide the explanation.

It is also not a general "waiting for data" indicator. If you fetch code asynchronously, that wait happens while `code` is still empty, which shows nothing. Render your own placeholder for that phase:

```tsx
{isFetching ? <MySkeleton /> : <ReactCanvas code={code} />}
```

## Reporting code that renders nothing

Code can be valid JavaScript and still produce no component — for example if it never calls `render(...)` and has no default export. That is not a compile error, so nothing is thrown, and without `onError` it fails silently.

```tsx
<ReactCanvas
  code={code}
  showError
  onError={(message) => console.warn(message)} // "Code did not render anything"
/>;
```

This is reported synchronously, as soon as evaluation returns, and at most once per mount so editor keystrokes do not spam it. Genuine compile and runtime errors are surfaced separately through `showError` and are never replaced by this message.

## Showing errors

With `showError`, errors appear in a toast pinned to the top-right of the viewport. It clears itself as soon as the code compiles again, and carries a close button by default (`dismissibleError={false}` removes it). Dismissal is tracked per message, so dismissing one error does not hide a *different* one that arrives later.

### Supplying your own error component

`errorComponent` takes **an element or a render function** — not a component type. The render function receives the error message and a `dismiss` callback.

Write an ordinary component:

```tsx
function CanvasErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        maxWidth: 420,
        padding: '12px 14px',
        borderRadius: 8,
        border: '1px solid #fca5a5',
        background: '#fef2f2',
        color: '#991b1b',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 4 }}>Could not render</strong>

      {/* Keep the message in #react-code-error if you scrape it — see the note below */}
      <pre
        id="react-code-error"
        style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', background: 'none', border: 'none', padding: 0 }}
      >
        {message}
      </pre>

      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss error">
          Dismiss
        </button>
      )}
    </div>
  );
}
```

Then pass it as a render function. The function receives **two** arguments — the error message and a `dismiss` callback:

```tsx
<ReactCanvas
  code={code}
  showError
  errorComponent={(message, dismiss) => (
    <CanvasErrorBanner message={message} onDismiss={dismiss} />
  )}
/>;
```

`dismiss` is the same mechanism the built-in toast's close button uses, so a custom component gets identical behavior: dismissal is tracked per message, meaning a *different* error arriving later still surfaces, while re-renders of the same dismissed error stay hidden. Ignore the second argument if you do not want a close control, and set `dismissibleError={false}` to disable dismissal entirely — that makes `dismiss` a no-op.

A static element works too when the text does not need the message — useful for a generic fallback:

```tsx
<ReactCanvas code={code} showError errorComponent={<GenericFailure />} />;
```

Any node is valid, so an existing design-system toast drops straight in:

```tsx
<ReactCanvas
  code={code}
  showError
  errorComponent={(message) => <Alert severity="error">{message}</Alert>}
/>;
```

:::danger Do not pass the component itself
`errorComponent={CanvasErrorBanner}` looks right but fails silently. A function
component *is* a function, so it gets called as `CanvasErrorBanner(message)` —
with the message string where props belong. `props.message` is then `undefined`
and you get an empty banner, with no error and no warning.

```tsx
errorComponent={CanvasErrorBanner}                                   // ❌ renders blank
errorComponent={(message, dismiss) =>                                // ✅
  <CanvasErrorBanner message={message} onDismiss={dismiss} />}
```
:::

:::note Scraping the error from a headless browser
The built-in toast puts the message in `#react-code-error`, and keeps that element statically positioned inside the fixed container on purpose: `offsetParent` is `null` for `position: fixed` elements, so a check like
`el.offsetParent !== null && el.textContent.trim().length > 0`
would never fire if the id sat on the fixed element. If you replace the toast via `errorComponent` and depend on that check, preserve the same arrangement.
:::

## Behavior on a failed edit

When an edit fails to compile, the canvas keeps the previous successful render on screen and shows the error alongside it, so the preview does not blank out while you type.

Restoring that previous render re-executes the previous code. Any top-level side effects in it run a second time — analytics calls, script injection, `document` mutation. Guard them if repetition matters:

```jsx
if (!document.getElementById('my-script')) {
  // inject once
}
```

It also means a broken keystroke costs two evaluations: the failed attempt plus a re-run of the last good code. For large components that is worth knowing when the editor feels slow.

Use `CheckReactCode` instead when you only want validation — it skips this behavior and reports the error alone.

## Usage Notes

- Prefer default-exported function components.
- Keep code strings focused on JSX and component logic.
- Use `scope` for dependencies instead of import statements.
