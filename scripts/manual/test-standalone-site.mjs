/**
 * End-to-end check for the standalone site builder.
 *
 * Lives here rather than in the jest suite because it needs the built
 * dist/builder.mjs: the builder is ESM-only and uses `import.meta.url`, which
 * is a syntax error under jest's CJS runtime. The pure half is covered by
 * src/builder/__tests__/entry.test.js, which does run in CI.
 *
 *   bun run build && bun run test:manual:site
 *
 * Pass a file to build that instead of the built-in suite. The file holds the
 * same canvas-format string ReactCanvas takes -- a default export (or a
 * render(...) call) and no import statements, with dependencies coming from the
 * scope:
 *
 *   bun run test:manual:site ./MyPage.jsx
 *   bun run test:manual:site ./MyPage.jsx ./out
 */

import { readFile, rm } from "node:fs/promises";
import { buildStandaloneSite, writeStandaloneSite } from "../../dist/builder.mjs";

const OUT = "/tmp/react-code-canvas-site";

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "  FAIL"} ${label}${detail ? ` -- ${detail}` : ""}`);
  if (!ok) failures++;
};

const rootOf = (html) => html.match(/<div id="root">([\s\S]*?)<\/div>\n<script/)?.[1] ?? "";
const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} KB`;

/* -------------------------------------------------------------------------- */
/* file mode                                                                  */
/* -------------------------------------------------------------------------- */

const [fileArg, outArg] = process.argv.slice(2);

if (fileArg) {
  const outDir = outArg ?? "out";

  let code;
  try {
    code = await readFile(fileArg, "utf8");
  } catch {
    console.error(`\ncannot read ${fileArg}\n`);
    process.exit(1);
  }

  console.log(`\nbuilding ${fileArg} -> ${outDir}/`);

  // Imports do resolve here, unlike in the canvas: sucrase rewrites them to
  // `require(...)` and esbuild bundles those calls (verified -- no `require`
  // survives in the output). Worth flagging anyway, because the same file
  // pasted into a ReactCanvas would render unstyled or throw.
  if (/^\s*import\s/m.test(code)) {
    console.log(
      "\n  note: this file has import statements. They resolve here because the\n" +
        "  builder bundles, but the canvas strips them -- the same file would not\n" +
        "  render in a ReactCanvas. Drop them to keep it portable.\n"
    );
  }

  let files;
  try {
    files = await buildStandaloneSite(code, { title: fileArg.split("/").pop() });
  } catch (err) {
    console.error(`\n${err.message}\n`);
    process.exit(1);
  }

  const html = files["index.html"];
  const js = files[Object.keys(files).find((k) => k.includes("app-"))];
  const css = files[Object.keys(files).find((k) => k.includes("style-"))];
  const markup = rootOf(html);

  console.log("");
  for (const [name, contents] of Object.entries(files)) {
    console.log(`  ${name.padEnd(32)} ${kb(contents)}`);
  }
  console.log("");
  console.log(`  prerendered   ${markup ? `yes, ${kb(markup)} of markup` : "no -- client-only shell (see warning above)"}`);
  console.log(`  stylesheet    ${css ? "yes, Tailwind compiled" : "none -- no className in the code"}`);
  console.log(`  bundle        ${kb(js)}`);

  await rm(outDir, { recursive: true, force: true });
  const written = await writeStandaloneSite(code, outDir, {
    title: fileArg.split("/").pop(),
  });
  console.log(`\n  wrote ${written.length} files\n\n  npx serve ${outDir}\n`);
  process.exit(0);
}

// --- a full page: hooks, an icon, Helmet, a <style> tag, Tailwind classes -----
const page = `
export default function Page() {
  const [n, setN] = useState(0);
  return (
    <main className="flex flex-col gap-4 p-8 bg-slate-900 text-white">
      <Helmet><title>Counter</title><meta name="description" content="demo" /></Helmet>
      <h1 className="text-3xl font-bold">Count: {n}</h1>
      <Camera />
      <button className="rounded bg-blue-600 px-4 py-2" onClick={() => setN(n + 1)}>inc</button>
    </main>
  );
}
`;

console.log("\nfull page");
const t0 = Date.now();
const files = await buildStandaloneSite(page, { title: "Fallback" });
const ms = Date.now() - t0;
const html = files["index.html"];
const js = files[Object.keys(files).find((k) => k.includes("app-"))];
const css = files[Object.keys(files).find((k) => k.includes("style-"))];

check("built in under 2s", ms < 2000, `${ms}ms`);
check("emits index.html + hashed js + hashed css", Object.keys(files).length === 3, Object.keys(files).join(", "));
check("prerendered the markup", html.includes("Count: "));
check("prerendered the lucide icon as real svg", html.includes("<svg"));
check("hoisted the code's own <title> into <head>", /<head>[\s\S]*<title>Counter<\/title>/.test(html));
check("the code's title beat the title option", !html.includes("Fallback"));
check("hoisted <meta name=\"description\"> into <head>", /<head>[\s\S]*<meta name="description"/.test(html));
check("linked the stylesheet", /<link rel="stylesheet" href="assets\/style-/.test(html));
check("compiled every Tailwind utility used",
  ["flex", "flex-col", "gap-4", "p-8", "bg-slate-900", "text-white", "text-3xl", "font-bold", "rounded", "bg-blue-600", "px-4", "py-2"]
    .every((c) => css.includes(`.${c}`)));
check("bundled react + deps, no CDN", js.length > 100_000 && !js.includes("https://esm.sh"));
check("emitted both hydrate and render branches", js.includes("hydrateRoot") || js.includes("hydrateRoot"));
check("#root has no stray whitespace", !/<div id="root">\s/.test(html));

// --- motion + recharts: the two that a naive scan gets wrong ------------------
// <motion.div> is a JSX member expression whose lowercase object is a real
// binding; missing it shipped a bundle that died on `motion is not defined` and
// took the whole page with it. LineChart exists in both lucide and recharts.
console.log("\nmotion + recharts");
const charty = await buildStandaloneSite(`
export default () => (
  <div>
    <motion.div animate={{ rotate: 360 }} />
    <LineChart width={300} height={150} data={[{ n: "a", v: 1 }]}>
      <Line dataKey="v" stroke="#abcdef" />
    </LineChart>
  </div>
)`);
const chartyJs = charty[Object.keys(charty).find((k) => k.includes("app-"))];
check("bundled motion/react", /framer|motion/i.test(chartyJs));
check("bundled recharts, not the lucide LineChart icon",
  chartyJs.includes("recharts") || chartyJs.length > 400_000);
check("did not prerender a lucide icon in place of the chart",
  !charty["index.html"].includes('class="lucide lucide-chart'));

// --- prerender falls back rather than failing the build ----------------------
console.log("\nprerender fallback (module-level document access)");
const shell = await buildStandaloneSite('export default () => { const t = document.title; return <p>{t}</p> }');
check("still produced a site", !!shell["index.html"]);
check("#root is empty so the client calls createRoot", rootOf(shell["index.html"]) === "");

// --- the analyzer gate -------------------------------------------------------
console.log("\nvalidation gate");
let threw = null;
try { await buildStandaloneSite("export default () => <MissingWidget/>"); } catch (e) { threw = e; }
check("rejects an unresolvable identifier", !!threw && threw.message.includes("MissingWidget"));

// --- no className means tailwindcss is never needed --------------------------
console.log("\ninline-styled page");
const inline = await buildStandaloneSite('export default () => <p style={{ color: "red" }}>hi</p>');
check("emits no stylesheet", !Object.keys(inline).some((k) => k.endsWith(".css")), Object.keys(inline).join(", "));

// --- EditableText is stripped back to plain JSX ------------------------------
console.log("\nEditTextReactCanvas output");
const edited = await buildStandaloneSite(
  'export default () => <EditableText elementType="p" tailwindStyles="text-lg" textContent="Hello" nodeId="n1"/>'
);
check("reversed EditableText to a plain tag", /<p[^>]*>Hello<\/p>/.test(edited["index.html"]), rootOf(edited["index.html"]));
check("compiled the class it carried", Object.keys(edited).some((k) => k.endsWith(".css")));

// --- writeStandaloneSite -----------------------------------------------------
console.log("\nwriteStandaloneSite");
await rm(OUT, { recursive: true, force: true });
const written = await writeStandaloneSite(page, OUT);
check("created the nested assets/ directory", written.some((p) => p.includes("/assets/")), written.length + " files");

console.log(
  failures ? `\n${failures} check(s) failed\n` : `\nall checks passed -- serve ${OUT} to view\n`
);
process.exit(failures ? 1 : 0);
