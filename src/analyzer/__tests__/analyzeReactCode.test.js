import { analyzeReactCode } from '../analyzeReactCode'

const GOOD = `export default function Hello() {
  const [n, setN] = useState(0);
  return <div className="p-4"><Activity /><span>{n}</span></div>;
}`

describe('analyzeReactCode', () => {
  it('accepts a valid component using scope globals', async () => {
    const r = await analyzeReactCode(GOOD)
    expect(r.valid).toBe(true)
    expect(r.issues).toEqual([])
    expect(r.hasDefaultExport).toBe(true)
    expect(r.referencedGlobals).toContain('useState')
    expect(r.referencedGlobals).toContain('Activity')
  })

  it('accepts the render() entry shape', async () => {
    const r = await analyzeReactCode('render(<div>hi</div>)')
    expect(r.valid).toBe(true)
  })

  it('reports empty code', async () => {
    const r = await analyzeReactCode('   ')
    expect(r.valid).toBe(false)
    expect(r.issues[0].type).toBe('empty')
  })

  it('reports syntax errors with a line number', async () => {
    const r = await analyzeReactCode('export default function Broken( {')
    expect(r.valid).toBe(false)
    expect(r.issues[0].type).toBe('syntax')
    expect(typeof r.issues[0].line).toBe('number')
  })

  // JSX component names are JSXIdentifiers, not plain Identifiers -- a naive
  // identifier walk misses them entirely, so this is the case that matters.
  it('catches JSX component names the scope does not provide', async () => {
    const r = await analyzeReactCode(`export default function Old() {
  return <div><MissingWidget /><AnotherMissing /></div>;
}`)
    expect(r.valid).toBe(false)
    expect(r.unknownGlobals).toEqual(['AnotherMissing', 'MissingWidget'])
    expect(r.issues.every((i) => i.type === 'unknown-identifier')).toBe(true)
    expect(r.issues[0].message).toContain('ReferenceError')
  })

  // Fa icons resolve through the lazy scope, so legacy stored code that predates
  // the lucide switch must not be reported as broken.
  it('accepts Font Awesome names, which load lazily', async () => {
    const r = await analyzeReactCode(
      `export default function A() { return <div><FaUser /><FaHome /></div>; }`,
    )
    expect(r.valid).toBe(true)
    expect(r.unknownGlobals).toEqual([])
  })

  it('catches unknown names in expression position too', async () => {
    const r = await analyzeReactCode(`export default function A() {
  return <div>{formatCurrency(10)}</div>;
}`)
    expect(r.valid).toBe(false)
    expect(r.unknownGlobals).toEqual(['formatCurrency'])
  })

  it('accepts components the scope does provide', async () => {
    const r = await analyzeReactCode(`export default function New() {
  return <div><User /><Settings /><ResponsiveContainer /></div>;
}`)
    expect(r.valid).toBe(true)
  })

  it('does not flag intrinsic HTML tags', async () => {
    const r = await analyzeReactCode('render(<div><span><p>hi</p></span></div>)')
    expect(r.unknownGlobals).toEqual([])
  })

  it('does not flag locally declared bindings', async () => {
    const r = await analyzeReactCode(`export default function Local() {
  const Thing = () => <b>x</b>;
  const items = [1, 2];
  return <div>{items.map((i) => <Thing key={i} />)}</div>;
}`)
    expect(r.unknownGlobals).toEqual([])
    expect(r.valid).toBe(true)
  })

  it('does not flag browser or JS runtime globals', async () => {
    const r = await analyzeReactCode(`export default function Web() {
  useEffect(() => {
    const t = setTimeout(() => console.log(JSON.stringify(Date.now())), 10);
    fetch('/x').then((res) => res.json());
    return () => clearTimeout(t);
  }, []);
  return <div>{Math.max(1, 2)}</div>;
}`)
    expect(r.unknownGlobals).toEqual([])
    expect(r.valid).toBe(true)
  })

  it('reports code that compiles but produces no component', async () => {
    const r = await analyzeReactCode('const a = 1;')
    expect(r.valid).toBe(false)
    expect(r.issues.map((i) => i.type)).toContain('no-default-export')
  })

  it('flags import statements without failing otherwise-valid code', async () => {
    const r = await analyzeReactCode(`import X from 'somewhere';
export default function A() { return <div>ok</div>; }`)
    expect(r.issues.map((i) => i.type)).toContain('import-statement')
    // imports are stripped by the canvas, so this still renders
    expect(r.valid).toBe(true)
  })

  it('honours allowedGlobals for host-injected names', async () => {
    const code = `export default function A() { return <div>{MY_HOST_FLAG}</div>; }`
    expect((await analyzeReactCode(code)).valid).toBe(false)
    const r = await analyzeReactCode(code, { allowedGlobals: ['MY_HOST_FLAG'] })
    expect(r.valid).toBe(true)
  })

  it('honours a custom scope', async () => {
    const code = `export default function A() { return <Custom />; }`
    expect((await analyzeReactCode(code)).valid).toBe(false)
    const r = await analyzeReactCode(code, { scope: { Custom: () => null } })
    // custom scope replaces the default, so lucide names would now be unknown
    expect(r.valid).toBe(true)
  })

  // Stage 3 (compile). Scope entries become `new Function` parameters, so
  // redeclaring one at top level is a duplicate declaration -- valid standalone
  // JS that parses fine, but throws in the real pipeline. Parsing alone misses it.
  it('catches redeclaring an injected global (compile stage)', async () => {
    const r = await analyzeReactCode(`const useState = 1;
export default function A() { return <div>{useState}</div>; }`)
    expect(r.valid).toBe(false)
    expect(r.issues.map((i) => i.type)).toContain('compile')
    expect(r.issues.find((i) => i.type === 'compile').message).toContain(
      'already been declared'
    )
  })

  it('catches redeclaring a lucide icon name', async () => {
    const r = await analyzeReactCode(`const Activity = () => <b/>;
export default function A() { return <Activity/>; }`)
    expect(r.valid).toBe(false)
    expect(r.issues.map((i) => i.type)).toContain('compile')
  })

  it('allows shadowing inside a function body, which is legal', async () => {
    const r = await analyzeReactCode(`export default function A() {
  const Activity = () => <b>local</b>;
  return <Activity/>;
}`)
    expect(r.valid).toBe(true)
  })

  it('reports each unknown name once, not per occurrence', async () => {
    const r = await analyzeReactCode(`export default function A() {
  return <div><MissingWidget /><MissingWidget /><MissingWidget /></div>;
}`)
    expect(r.unknownGlobals).toEqual(['MissingWidget'])
    expect(r.issues).toHaveLength(1)
  })
})
