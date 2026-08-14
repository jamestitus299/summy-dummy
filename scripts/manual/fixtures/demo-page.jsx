// A canvas-format page for eyeballing a built site in a real browser.
//
//   bun run build && bun run demo:site && npx serve demo-site
//
// Deliberately combines the things contract-level assertions cannot judge:
// hydration (the counter is in the prerendered HTML but dead until JS runs),
// a <motion.div> member expression, a recharts chart whose name also exists in
// lucide, Helmet tags that must reach <head>, an in-component <style> block, and
// Tailwind classes that only work if the compile step ran. The two bugs this
// caught -- `motion is not defined` and <LineChart> rendering as a 24x24 icon --
// now have regression tests, but the combination is still the fastest way to see
// whether a change broke something a browser would notice.

export default function Dashboard() {
  const [count, setCount] = useState(0);

  const data = [
    { name: "Mon", v: 12 }, { name: "Tue", v: 19 }, { name: "Wed", v: 8 },
    { name: "Thu", v: 24 }, { name: "Fri", v: 17 }, { name: "Sat", v: 29 },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <Helmet>
        <title>Standalone Demo</title>
        <meta name="description" content="Built by react-code-canvas/builder" />
      </Helmet>

      <style>{`
        .demo-card { transition: transform .2s ease, border-color .2s ease; }
        .demo-card:hover { transform: translateY(-3px); border-color: #38bdf8; }
        @media (max-width: 700px) { .demo-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <header className="flex items-center gap-3 mb-8">
        <Rocket />
        <h1 className="text-3xl font-bold">Standalone site demo</h1>
      </header>

      <p className="text-slate-400 mb-8 max-w-2xl">
        Everything on this page was bundled from a single code string. No CDN, no network.
        Turn off your wifi and reload — it still works.
      </p>

      <div className="demo-grid grid gap-6 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="demo-card rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity />
            <h2 className="text-xl font-semibold">Interactivity</h2>
          </div>
          <p className="text-slate-400 mb-4">Proves hydration: this button only works after the JS loads.</p>
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 font-medium"
              onClick={() => setCount(count + 1)}
            >
              clicked {count} times
            </button>
            <button className="rounded-lg border border-slate-700 px-4 py-2" onClick={() => setCount(0)}>
              reset
            </button>
          </div>
        </div>

        <div className="demo-card rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles />
            <h2 className="text-xl font-semibold">Animation</h2>
          </div>
          <p className="text-slate-400 mb-4">motion/react, bundled and tree-shaken.</p>
          <motion.div
            className="h-12 w-12 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      <div className="demo-card rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ChartColumn />
          <h2 className="text-xl font-semibold">recharts</h2>
        </div>
        <LineChart width={640} height={260} data={data}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
          <Line type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={2} />
        </LineChart>
      </div>
    </main>
  );
}
