import { readFileSync } from "node:fs"

import { analyzeReactCode } from "../../src/analyzer/analyzeReactCode"

// Pass a file to check your own component instead of the samples:
//   bun run scripts/manual/test-analyze-react-code.js path/to/Component.jsx
const fileArg = process.argv[2]

// One sample per issue type the analyzer can report, so the output doubles as a
// reference for what each verdict looks like.
const SAMPLES = [
    {
        label: "valid component",
        code: `export default function Dashboard() {
  const [n, setN] = useState(0);
  return <div className="p-4"><Activity /><span>{n}</span></div>;
}`,
    },
    {
        label: "valid — render() entry shape",
        code: `render(<div className="p-4">hello</div>)`,
    },
    {
        label: "empty",
        code: `   `,
    },
    {
        label: "syntax error",
        code: `export default function Broken( {`,
    },
    {
        label: "compile error — redeclares an injected global",
        code: `const useState = 1;
export default function A() { return <div>{useState}</div>; }`,
    },
    {
        label: "unknown identifier — JSX position",
        code: `export default function Old() {
  return <div><FaUser /><MissingWidget /></div>;
}`,
    },
    {
        label: "unknown identifier — expression position",
        code: `export default function A() {
  return <div>{formatCurrency(10)}</div>;
}`,
    },
    {
        label: "import statement (reported, but not fatal)",
        code: `import X from 'somewhere';
export default function A() { return <div>ok</div>; }`,
    },
    {
        label: "no default export and no render() call",
        code: `const a = 1;`,
    },
    {
        label: "shadowing inside a function body is legal",
        code: `export default function A() {
  const Activity = () => <b>local</b>;
  return <Activity />;
}`,
    },
]

function report(label, result) {
    console.log(`\n--- ${label} ${"-".repeat(Math.max(0, 62 - label.length))}`)
    console.log(`valid: ${result.valid}`)

    if (result.issues.length === 0) {
        console.log("issues: none")
    } else {
        console.log("issues:")
        for (const issue of result.issues) {
            const at = issue.line ? ` (line ${issue.line}, col ${issue.column})` : ""
            console.log(`  [${issue.type}]${at} ${issue.message}`)
        }
    }

    if (result.unknownGlobals.length) {
        console.log(`unknownGlobals: ${result.unknownGlobals.join(", ")}`)
    }
    // Truncated: a component using a dozen lucide icons would otherwise bury the
    // rest of the output.
    if (result.referencedGlobals.length) {
        const shown = result.referencedGlobals.slice(0, 12).join(", ")
        const more = result.referencedGlobals.length - 12
        console.log(`referencedGlobals: ${shown}${more > 0 ? ` (+${more} more)` : ""}`)
    }
    console.log(`hasDefaultExport: ${result.hasDefaultExport}`)
}

if (fileArg) {
    const code = readFileSync(fileArg, "utf8")
    report(fileArg, await analyzeReactCode(code))
} else {
    for (const { label, code } of SAMPLES) {
        report(label, await analyzeReactCode(code))
    }
    console.log("\nPass a file path as an argument to analyze your own component.")
}
