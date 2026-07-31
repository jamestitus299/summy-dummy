import {
  assignNamespace,
  collectIdentifiers,
  iconLoaderFor,
  isIconName,
  isMotionName,
  isRechartsName,
  resolveScope,
  scopeNamesFor,
  toKebab,
} from '../lazyScope'

describe('toKebab', () => {
  it('matches how lucide names its icon files', () => {
    expect(toKebab('ChevronRight')).toBe('chevron-right')
    expect(toKebab('Activity')).toBe('activity')
    expect(toKebab('ArrowDownAZ')).toBe('arrow-down-az')
  })
})

describe('collectIdentifiers', () => {
  it('picks up names in both JSX and expression position', () => {
    const ids = collectIdentifiers('render(<div><Activity/>{format(1)}</div>)')
    expect(ids.has('Activity')).toBe(true)
    expect(ids.has('format')).toBe(true)
  })

  // Over-matching only costs a needless fetch; under-matching would break the
  // render, so the regex deliberately errs the harmless way.
  it('over-matches into strings rather than missing anything', () => {
    expect(collectIdentifiers('const s = "LineChart"').has('LineChart')).toBe(true)
  })
})

describe('iconLoaderFor', () => {
  it('resolves a plain icon name', () => {
    expect(iconLoaderFor('ChevronRight')).toBeInstanceOf(Function)
  })

  it('resolves the Icon-suffixed and Lucide-prefixed spellings', () => {
    expect(iconLoaderFor('ActivityIcon')).toBeInstanceOf(Function)
    expect(iconLoaderFor('LucideActivity')).toBeInstanceOf(Function)
  })

  // Real renames, which no amount of string munging would find.
  it('resolves genuine aliases through the generated table', () => {
    expect(iconLoaderFor('SortDesc')).toBeInstanceOf(Function)
    expect(iconLoaderFor('Verified')).toBeInstanceOf(Function)
  })

  it('returns undefined for names lucide does not export', () => {
    expect(iconLoaderFor('MissingWidget')).toBeUndefined()
  })

  // Regression: lucide has an `Import` icon, so a lowercase `import` keyword
  // used to match icons/import.js, land in the scope, and then throw
  // "Unexpected token 'import'" as a `new Function` parameter.
  it('ignores lowercase names, so keywords cannot match icon files', () => {
    expect(iconLoaderFor('import')).toBeUndefined()
    expect(iconLoaderFor('code')).toBeUndefined()
  })
})

describe('group membership', () => {
  it('recognises recharts and motion names', () => {
    expect(isRechartsName('ResponsiveContainer')).toBe(true)
    expect(isMotionName('AnimatePresence')).toBe(true)
    expect(isIconName('User')).toBe(true)
  })

  // Regression: a module namespace object carries `default`, so the generated
  // lists used to include it -- making every `export default` look like a
  // recharts reference and pulling 138 KB in for nothing.
  it('does not treat `default` as a library name', () => {
    expect(isRechartsName('default')).toBe(false)
    expect(isMotionName('default')).toBe(false)
  })
})

describe('assignNamespace', () => {
  // Tested against a synthetic namespace rather than through resolveScope:
  // under Jest's CJS interop the real recharts namespace has no `default` key,
  // so going through resolveScope would assert nothing. A real ESM namespace
  // always has one, and `default` is a reserved word that cannot be a
  // `new Function` parameter.
  it('copies every export except `default`', () => {
    const scope = {}
    assignNamespace(scope, { XAxis: 1, YAxis: 2, default: 3 })

    expect(scope).toEqual({ XAxis: 1, YAxis: 2 })
    expect(Object.keys(scope)).not.toContain('default')
  })
})

describe('scopeNamesFor', () => {
  it('always includes the base scope', () => {
    const names = scopeNamesFor('render(<div/>)')
    expect(names).toContain('React')
    expect(names).toContain('useState')
  })

  it('adds only the icons the code references', () => {
    const names = scopeNamesFor('render(<Activity/>)')
    expect(names).toContain('Activity')
    expect(names).not.toContain('ChevronRight')
  })

  it('pulls in every recharts name once one is referenced', () => {
    const withChart = scopeNamesFor('render(<ResponsiveContainer/>)')
    expect(withChart).toContain('ResponsiveContainer')
    expect(withChart).toContain('XAxis')

    expect(scopeNamesFor('render(<div/>)')).not.toContain('XAxis')
  })

  // These names become `new Function` parameters, so a reserved word among them
  // is a compile error for every piece of code, not just code that uses it.
  it('produces only valid parameter names', () => {
    const names = scopeNamesFor(
      'import X from "y"; export default function A(){ return <Activity/> }'
    )
    for (const name of names) {
      expect(name).toMatch(/^[A-Za-z_$][\w$]*$/)
    }
    expect(() => new Function(...names, 'return 1')).not.toThrow()
  })
})

describe('resolveScope', () => {
  it('loads a referenced icon and keys it by the referenced name', async () => {
    const scope = await resolveScope('render(<Activity/>)')
    expect(typeof scope.Activity).not.toBe('undefined')
  })

  it('keys an alias under the alias, not the canonical name', async () => {
    const scope = await resolveScope('render(<SortDesc/>)')
    expect(typeof scope.SortDesc).not.toBe('undefined')
  })

  it('does not load icons the code never mentions', async () => {
    const scope = await resolveScope('render(<Activity/>)')
    expect(scope.ChevronRight).toBeUndefined()
  })

  it('loads recharts only when referenced', async () => {
    expect((await resolveScope('render(<div/>)')).ResponsiveContainer).toBeUndefined()

    const scope = await resolveScope('render(<ResponsiveContainer/>)')
    expect(typeof scope.ResponsiveContainer).not.toBe('undefined')
    // the whole namespace arrives together
    expect(typeof scope.XAxis).not.toBe('undefined')
  })

  it('loads motion only when referenced, keeping the `motion` name', async () => {
    expect((await resolveScope('render(<div/>)')).motion).toBeUndefined()

    const scope = await resolveScope('render(<motion.div/>)')
    expect(typeof scope.motion).not.toBe('undefined')
  })

  it('never puts `default` in the scope', async () => {
    const scope = await resolveScope('export default function A(){ return <XAxis/> }')
    expect(Object.keys(scope)).not.toContain('default')
  })

  it('always provides the base scope, even for empty code', async () => {
    const scope = await resolveScope('')
    expect(scope.React).toBeDefined()
    expect(scope.useState).toBeDefined()
  })

  it('lets a caller-supplied scope win', async () => {
    const sentinel = () => null
    const scope = await resolveScope('render(<Activity/>)', { Activity: sentinel })
    expect(scope.Activity).toBe(sentinel)
  })
})
