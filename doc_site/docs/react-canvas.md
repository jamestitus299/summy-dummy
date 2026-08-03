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
| `onError` | `(error: string) => void` | Called whenever non-empty code fails to produce output — it threw, **or** it evaluated cleanly and never rendered anything. |

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

Transform and evaluation are synchronous, but they cannot start until the code's scope has loaded — and scope resolution is async (see [Scope](./scope.md)). The canvas evaluates only code whose dependencies have finished arriving, which before the first resolve is the empty string.

So the first commit renders nothing regardless of `showLoader`, and that is the window the overlay paints in. Consequences:

- **Output is never present in the first commit.** Tests that mount and immediately assert on rendered output must flush at least a microtask, whatever `showLoader` is set to. `showLoader={false}` removes the overlay, not the wait.
- **The window can be very short.** With every module already in the browser's cache, resolution settles in a microtask and the overlay may never get a frame. It is not a guaranteed paint.
- **Later edits do not blank the preview.** While a new code string's scope is in flight the previous code keeps rendering, so typing never flashes the loader or a `ReferenceError` for an icon still being fetched.

The overlay never appears for empty or whitespace-only `code` (which renders nothing at all), nor once an error is present — an error is a resolved outcome, and covering it with a spinner would hide the explanation.

It is also not a general "waiting for data" indicator. If you fetch code asynchronously, that wait happens while `code` is still empty, which shows nothing. Render your own placeholder for that phase:

```tsx
{isFetching ? <MySkeleton /> : <ReactCanvas code={code} />}
```

## Reporting failures

`onError` covers **both** ways code can fail to produce output:

- **It threw** — a compile error or a runtime error during evaluation. Reported every time it happens, because each is a distinct failure a host may need to react to.
- **It rendered nothing** — valid JavaScript that never calls `render(...)` and has no default export. Nothing is thrown, so without `onError` this fails silently. Reported at most once per mount, so editor keystrokes through a half-written component do not spam it.

```tsx
<ReactCanvas
  code={code}
  showError
  onError={(message) => console.warn(message)} // e.g. "Code did not render anything"
/>;
```

Both are reported synchronously, as soon as evaluation returns. `showError` controls whether the message is also *displayed*; `onError` fires either way.

This is what a host uses to swap in a fallback page — it needs the throws, not just the silent case.

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

Use `analyzeReactCode()` instead when you only want validation — it never renders, so it never re-runs anything.

## Usage Notes

- Prefer default-exported function components.
- Keep code strings focused on JSX and component logic.
- Use `scope` for dependencies instead of import statements.
