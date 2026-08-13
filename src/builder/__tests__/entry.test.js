import {
  candidatesFor,
  entryFor,
  extractCandidates,
  importLines,
  splitHoisted,
} from '../entry'

/** The import line for a package, or undefined if the entry does not import it. */
const importOf = (entry, pkg) =>
  entry.split('\n').find((line) => line.endsWith(`from "${pkg}";`))

describe('importLines', () => {
  it('emits React even when the source never spells it', () => {
    expect(importLines([])).toBe('import React from "react";')
  })

  it('routes hooks to react and helmet to react-helmet-async', () => {
    const out = importLines(['useState', 'Helmet'])
    expect(out).toContain('import { useState } from "react";')
    expect(out).toContain('import { Helmet } from "react-helmet-async";')
  })

  // The alias table is generated and inverts 1029 names; SortDesc is a rename,
  // not a mechanical kebab-case of its file (arrow-down-wide-narrow).
  it('resolves a lucide alias to the bare package', () => {
    expect(importLines(['SortDesc'])).toContain(
      'import { SortDesc } from "lucide-react";'
    )
  })

  // Eleven names exist in both lucide and recharts. Recharts wins at runtime
  // today, so it must win here -- this is the rule most likely to flip silently.
  it('gives recharts the names it shares with lucide', () => {
    const out = importLines(['Text', 'LineChart'])
    expect(out).toContain('import { LineChart, Text } from "recharts";')
    expect(out).not.toContain('lucide-react')
  })

  it('keeps motion lowercase and takes it from motion/react', () => {
    expect(importLines(['motion'])).toContain(
      'import { motion } from "motion/react";'
    )
  })

  it('takes Fa icons from react-icons/fa', () => {
    expect(importLines(['FaUser'])).toContain(
      'import { FaUser } from "react-icons/fa";'
    )
  })

  it('does not import runtime globals', () => {
    const out = importLines(['document', 'Math', 'fetch'])
    expect(out).toBe('import React from "react";')
  })
})

describe('entryFor', () => {
  // The whole reason the builder reads analyzeReactCode's referencedGlobals
  // instead of lazyScope's regex scanner: the regex matches inside strings and
  // would pull ~145KB of recharts in for a component that renders none of it.
  it('ignores a package name that only appears inside a string', async () => {
    const entry = await entryFor(
      'export default () => { const s = "LineChart"; return <p>{s}</p> }'
    )
    expect(importOf(entry, 'recharts')).toBeUndefined()
  })

  // A local declaration shadowing an injected global would otherwise be
  // imported AND declared -- a duplicate declaration, and a bundle error.
  it('ignores a local declaration that shadows a lucide icon', async () => {
    const entry = await entryFor(
      'function Card(){ return <p>x</p> } export default () => <Card/>'
    )
    expect(importOf(entry, 'lucide-react')).toBeUndefined()
  })

  // <motion.div> is a JSX member expression whose lowercase object is a real
  // binding. The analyzer used to skip it along with intrinsic tags like <div>,
  // so no import was emitted and the built page died with `motion is not
  // defined` -- taking the whole app down, not just the animation.
  it('imports motion for a <motion.div> member expression', async () => {
    const entry = await entryFor('export default () => <motion.div animate={{ x: 1 }}/>')
    expect(importOf(entry, 'motion/react')).toBe(
      'import { motion } from "motion/react";'
    )
  })

  it('still ignores intrinsic lowercase tags', async () => {
    const entry = await entryFor('export default () => <div><span>hi</span></div>')
    expect(entry.split('\n').filter((l) => l.startsWith('import '))).toEqual([
      'import React from "react";',
      'import { createRoot, hydrateRoot } from "react-dom/client";',
    ])
  })

  it('imports an icon the code actually references', async () => {
    const entry = await entryFor('export default () => <Camera/>')
    expect(importOf(entry, 'lucide-react')).toBe(
      'import { Camera } from "lucide-react";'
    )
  })

  it.each([
    ['export default', 'export default () => <p>hi</p>'],
    ['render()', 'render(<p>hi</p>)'],
    // Only becomes a default export after normalizeCode, so analysing the raw
    // source would reject it for having no default export.
    ['bare expression', '<p>hi</p>'],
  ])('accepts the %s entry shape', async (_label, code) => {
    const entry = await entryFor(code)
    expect(entry).toContain('hydrateRoot')
    expect(entry).toContain('createRoot')
  })

  it('rejects code referencing something nothing provides', async () => {
    await expect(entryFor('export default () => <MissingWidget/>')).rejects.toThrow(
      /MissingWidget/
    )
  })
})

describe('extractCandidates', () => {
  it('pulls class names out of a plain className', () => {
    expect(extractCandidates('<p className="flex gap-3 p-8"/>')).toEqual(
      expect.arrayContaining(['flex', 'gap-3', 'p-8'])
    )
  })

  // The form an attribute-only regex would miss: neither branch is the value of
  // the className attribute, they are operands inside an expression container.
  it('pulls both branches of a conditional className', () => {
    const out = extractCandidates(
      '<p className={ok ? "bg-green-500" : "bg-red-500"}/>'
    )
    expect(out).toEqual(expect.arrayContaining(['bg-green-500', 'bg-red-500']))
  })

  it('pulls the static chunks of a template literal', () => {
    const out = extractCandidates('<p className={`p-4 ${x} m-2`}/>')
    expect(out).toEqual(expect.arrayContaining(['p-4', 'm-2']))
    expect(out).not.toContain('${x}')
  })

  it('returns nothing for code with no literals', () => {
    expect(extractCandidates('export default () => <p>{x}</p>')).toEqual([])
  })
})

describe('candidatesFor', () => {
  // The bug this exists to prevent. JSX text is not a string literal, so an
  // apostrophe in prose reads as an opening quote. A lone one is harmless -- it
  // finds no partner and matches nothing -- but a SECOND apostrophe closes the
  // fake string, and every className between the two is swallowed. Real prose
  // has apostrophes in pairs constantly ("Founder's", "What's", "Can't"), so on
  // a 1872-line page this silently dropped whole sections of the stylesheet and
  // deployed a half-styled site with no error anywhere.
  it('is not thrown off by apostrophes in JSX text', () => {
    const code = `export default () => (
      <div>
        <p className="text-lg">Founder's Series</p>
        <div className="mt-8 justify-end">between</div>
        <p className="py-5">What's Included</p>
      </div>
    )`
    // the raw-JSX trap: everything between the two apostrophes disappears
    const raw = extractCandidates(code)
    expect(raw).not.toContain('mt-8')
    expect(raw).not.toContain('justify-end')

    expect(candidatesFor(code)).toEqual(
      expect.arrayContaining(['text-lg', 'mt-8', 'justify-end', 'py-5'])
    )
  })

  it('still collects conditional and template classes', () => {
    const code = `export default () => (
      <div className={ok ? "bg-green-500" : "bg-red-500"}>
        <p className={\`p-4 \${x} m-2\`}>Don't break</p>
      </div>
    )`
    expect(candidatesFor(code)).toEqual(
      expect.arrayContaining(['bg-green-500', 'bg-red-500', 'p-4', 'm-2'])
    )
  })
})

describe('splitHoisted', () => {
  it('moves leading title/meta out of the body', () => {
    const { head, body } = splitHoisted(
      '<title>T</title><meta name="description" content="d"/><div>hi</div>'
    )
    expect(head).toBe('<title>T</title><meta name="description" content="d"/>')
    expect(body).toBe('<div>hi</div>')
  })

  // Degrades to today's behaviour rather than reordering anything.
  it('leaves markup alone when nothing is hoisted', () => {
    const { head, body } = splitHoisted('<div>hi</div>')
    expect(head).toBe('')
    expect(body).toBe('<div>hi</div>')
  })
})
