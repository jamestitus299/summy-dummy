# Known-good page skeletons

Copy-paste starting points that satisfy every constraint in SKILL.md and every
rule in [performance.md](performance.md). All are `valid: true` under
`analyzeReactCode` with the default scope.

## Static page (cheapest possible: base scope + a few icons)

```jsx
export default function LandingPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Rocket size={28} />
        <h1 style={{ margin: 0 }}>Acme Launch</h1>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <p>Ship faster with less.</p>
        <button style={{ padding: '0.5rem 1.25rem' }}>
          Get started <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
        </button>
      </section>
    </main>
  );
}
```

Loads: two ~0.8 KB gz icon files. Nothing else.

## Interactive page (hooks are free — they're base scope)

```jsx
export default function FaqPage() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'What is this?', a: 'A page.' },
    { q: 'How much?', a: 'Nothing.' },
  ];
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem' }}>
      <h1>FAQ</h1>
      {faqs.map((f, i) => (
        <div key={i} style={{ borderBottom: '1px solid #ddd' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', textAlign: 'left', padding: '0.75rem 0' }}
          >
            {f.q} {open === i ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
          {open === i && <p>{f.a}</p>}
        </div>
      ))}
    </main>
  );
}
```

Note the prefix-free names are all safe here: `FaqPage` is not a scope name, and
the icons are referenced literally so the loader finds them.

## Chart page (recharts loads whole — commit to it)

```jsx
const REVENUE = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 5200 },
  { month: 'Mar', value: 4800 },
];

export default function RevenuePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Revenue</h1>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={REVENUE}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
}
```

Referencing one recharts name loads the whole library, so a page either charts or
it doesn't — a lone `<Tooltip>` outside a chart tree costs the same 145 KB and is
a collision bug besides (SKILL.md .4). `REVENUE` at module level is fine: it is
data, not work.

## Animated page (motion loads whole — same commitment)

```jsx
export default function HeroPage() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome
      </motion.h1>
    </main>
  );
}
```

Prefer CSS transitions (`style={{ transition: 'opacity .3s' }}`) for simple
fades/moves — free. Reach for `motion` only when you need springs, gestures, or
exit animations.

## Data-driven page (shell first — Rule 4)

```jsx
export default function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setFailed(true));
  }, []);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      {/* paints on first evaluation -- this is the LCP candidate */}
      <header>
        <h1>Products</h1>
        <p>Everything we sell, updated daily.</p>
      </header>

      {failed && <p>Could not load products. <RefreshCw size={14}/> Retry later.</p>}
      {!failed && !products && (
        <div aria-busy="true" style={{ display: 'grid', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 72, background: '#eee', borderRadius: 8 }} />
          ))}
        </div>
      )}
      {products && products.map((p) => (
        <article key={p.id} style={{ padding: '1rem 0', borderBottom: '1px solid #eee' }}>
          <h2>{p.name}</h2>
          <p>{p.blurb}</p>
        </article>
      ))}
    </main>
  );
}
```

## Legacy Font Awesome page (grandfathered — do not write new ones)

```jsx
// Pre-5.0 stored page. Every Fa* name resolves; the first one loads the whole
// ~420 KB gz pack. Correct move when editing such a page: migrate the icons to
// lucide (FaUser -> User, FaHome -> House, ...) rather than extending the Fa set.
export default function LegacyProfile() {
  return (
    <div>
      <FaUser size={18} /> Profile
      <FaHome size={18} /> Home
    </div>
  );
}
```

## Anti-pattern gallery (all evaluate, all slow or broken)

```jsx
// ❌ comment loads recharts (Rule 2)
// styled like a BarChart
export default function A() { return <div/> }
```

```jsx
// ❌ module-level work re-runs on every evaluation (Rule 3)
const parsed = JSON.parse(HUGE_BLOB);
export default function B() { return <div>{parsed.length}</div> }
```

```jsx
// ❌ null until fetch resolves -- blank LCP (Rule 4)
export default function C() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch('/api/d').then(r => r.json()).then(setD); }, []);
  return d ? <div>{d.title}</div> : null;
}
```

```jsx
// ❌ shadows an injected global -- duplicate `new Function` parameter,
//    compile error for the entire page (SKILL.md .4)
const Activity = () => <span>busy</span>;
export default function D() { return <Activity/> }
```
