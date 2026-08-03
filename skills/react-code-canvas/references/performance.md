# Performance rules for canvas code

How the canvas loads things, and what that means for the code you write. Each rule
names the internal mechanism so the reasoning survives library upgrades — if the
mechanism changes, the rule may too.

## How loading works (the 30-second model)

Before evaluating your code, the canvas scans the **entire source string** with an
identifier regex and loads what it finds:

- a lucide icon name → one dynamic import, ~0.8 KB gz for that icon's file
- any recharts name → the whole recharts library (~145 KB gz) in one import
- any motion name → the whole motion library (~61 KB gz) in one import
- any `Fa*` (Font Awesome) name → the whole `react-icons/fa` pack (~420 KB gz,
  1.3 MB raw) in one import — there are no per-icon files to split

All fetches run in parallel, and the browser caches modules, so a name is only
paid for once per session. The scan is a plain regex: it cannot tell code from
comments or string literals. A name **anywhere** in the source triggers its load.

Evaluation is `new Function(...scopeNames, code)` — synchronous, on the main
thread, re-run on **every** code change and after every failed-edit recovery.

## Rule 1 — lucide over Font Awesome (~500x cheaper)

```jsx
// ❌ 420 KB gz: the single Fa reference fetches the whole pack
export default function ProfileBadge() {
  return <div><FaUser size={18}/> Signed in</div>;
}

// ✅ 0.8 KB gz: per-icon file
export default function ProfileBadge() {
  return <div><User size={18}/> Signed in</div>;
}
```

Common migrations: `FaUser`→`User`, `FaHome`→`House`, `FaCog`→`Settings`,
`FaSearch`→`Search`, `FaEnvelope`→`Mail`, `FaTrash`→`Trash2`, `FaEdit`→`Pencil`,
`FaCheck`→`Check`, `FaTimes`→`X`, `FaArrowRight`→`ArrowRight`,
`FaGithub`→`Github`, `FaStar`→`Star`, `FaHeart`→`Heart`.

If a page already renders one `Fa*` icon, additional `Fa*` icons are free — the
pack is a single fetch. Mixing sets on one page pays both loaders; pick one.

## Rule 2 — library names in comments and strings still cost

```jsx
// ❌ this comment costs ~145 KB gz — "LineChart" matches the recharts name list
// TODO: maybe swap this table for a LineChart later
export default function StatsTable() { ... }

// ❌ same trap in strings
const hint = "Upgrade to see the AreaChart view";

// ✅ describe without naming
// TODO: maybe swap this table for a chart later
const hint = "Upgrade to see the chart view";
```

Over-matching is deliberate in the canvas (a wasted fetch is harmless; a missed
one breaks the render), so the author side of the contract is: don't spell scope
names you don't use. Icon names in comments cost only ~0.8 KB gz — the rule matters
for **recharts, motion, and `Fa*`**, where one word is a whole library.

## Rule 3 — module level runs on every evaluation

Top-level statements execute on: first render, every editor keystroke that
reaches evaluation, and the automatic re-run of the last good code after a failed
edit. Data at module level is fine; work and side effects are not.

```jsx
// ❌ recomputed on every evaluation, blocks the main thread each time
const rows = expensiveTransform(RAW_DATA);
document.title = "Dashboard";              // side effect, re-fires on recovery

// ✅ constants only at module level…
const RAW_DATA = [ /* ... */ ];

export default function Dashboard() {
  // …memoised work inside the component…
  const rows = useMemo(() => expensiveTransform(RAW_DATA), []);

  // …side effects in effects (and guarded if they must run once per page)
  useEffect(() => { document.title = "Dashboard"; }, []);

  return <DashboardTable rows={rows} />;
}
```

For DOM injection that must survive re-evaluation exactly once:

```jsx
useEffect(() => {
  if (document.getElementById('my-widget-script')) return;
  const s = document.createElement('script');
  s.id = 'my-widget-script';
  s.src = 'https://example.com/widget.js';
  document.head.appendChild(s);
}, []);
```

## Rule 4 — paint the shell, then the data

The host page's LCP is measured on what the canvas paints first. A component that
renders `null` (or a bare spinner) until a fetch resolves converts a
network round-trip into blank screen time.

```jsx
// ❌ LCP waits on the API
export default function NewsPage() {
  const [items, setItems] = useState(null);
  useEffect(() => { fetch('/api/news').then(r => r.json()).then(setItems); }, []);
  if (!items) return null;
  return <NewsList items={items} />;
}

// ✅ header/hero paint immediately; data streams into its slot
export default function NewsPage() {
  const [items, setItems] = useState(null);
  useEffect(() => { fetch('/api/news').then(r => r.json()).then(setItems); }, []);
  return (
    <main>
      <PageHero title="Today's news" />            {/* paints on first eval */}
      {items ? <NewsList items={items} /> : <ListSkeleton rows={6} />}
    </main>
  );
}
```

Same logic for images: give the hero image explicit `width`/`height` (no layout
shift) and never `loading="lazy"` on the LCP image — lazy-load only below-fold
media.

## Rule 5 — keep the source small

The code string travels over the host's transport (a websocket in the Reflex
apps), then is transpiled and evaluated on the main thread on every change. Big
inline data blobs multiply all three costs.

- Inline data beyond a few hundred rows: fetch it instead (Rule 4 shape).
- Don't inline base64 images; reference URLs.
- Repeated markup: map over an array instead of unrolling.

## Rule 6 — style inline, not with Tailwind

Every Tailwind class in canvas code is a bet that the host loaded Tailwind — and
for arbitrary generated classes that means the Play CDN: ~124 KB of JS that
recompiles CSS in the browser on **every visit**, the single largest line item in
the consumer site's PageSpeed audit. Inline `style` (plus a `<style>` tag for
hover/media/keyframes, see SKILL.md .5) costs nothing, works on every host, and
removes the host's reason to load that script at all.

```jsx
// ❌ depends on a ~124 KB host-side script to not render unstyled
<button className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800">

// ✅ zero dependency, identical result
<button className="cta" style={{ padding: '0.5rem 1.25rem', borderRadius: 8,
  background: '#000', color: '#fff' }}>
// with, once per page: <style>{`.cta:hover { background: #333; }`}</style>
```

## What you cannot influence (don't try)

- The first commit is always empty — scope loading happens before evaluation.
  The host's loader covers it.
- Fetch parallelism, module caching, chunk sizes — canvas/bundler concerns.
