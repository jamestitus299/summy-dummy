import { createRequire, evalCode, generateElement, importCode } from '../utils'

describe('createRequire', () => {
    it('throws an error for unknown modules', () => {
        const require = createRequire({})
        expect(() => require('dummy')).toThrow("Module not found: 'dummy'")
    })
})


describe('evalCode', () => {
    it('evaluates code using scope variables', () => {
        const result = evalCode('return a + b', { a: 2, b: 3 })
        expect(result).toBe(5)
    })

    it('injects React into the scope', () => {
        const code = `return React.createElement("div", null, "Hello")`
        const el = evalCode(code, {})
        expect(el.type).toBe('div')
        expect(el.props.children).toBe('Hello')
    })

    it('provides a restricted require function', () => {
        const code = `return require("x")`
        const imports = { x: 42 }
        const result = evalCode(code, { import: imports })
        expect(result).toBe(42)
    })

    it('removes reserved keys "default" and "import"', () => {
        const scope = { default: 123, import: {}, value: 10 }
        const result = evalCode('return value', scope)
        expect(result).toBe(10)
    })
})

describe('generateElement', () => {
    it('returns null for empty code', () => {
        const result = generateElement({ code: '   ', scope: {} })
        expect(result).toBeNull()
    })

    it('renders a simple JSX element', () => {
        const code = `
      render(<div>Hello</div>)
    `
        const result = generateElement({ code, scope: {} })

        expect(result.type).toBe('div')
        expect(result.props.children).toBe('Hello')
    })

    it('renders a component function', () => {
        const code = `
      function App() {
        return <span>Hi</span>
      }
      render(App)
    `
        const result = generateElement({ code, scope: {} })
        // console.log(result)
        // {
        //     '$$typeof': Symbol(react.element),
        //     type: [Function: App],
        //     key: null,
        //     ref: null,
        //     props: {},
        //     _owner: null,
        //     _store: {}
        // }

        expect(result.props.children).toBe(undefined)
    })

    it('returns a string as a React element', () => {
        const code = `
      render("hello world")
    `
        const result = generateElement({ code, scope: {} })

        expect(result).toBe('hello world')
    })

    it('supports using scope variables', () => {
        const code = `
      render(<Custom>Hello</Custom>)
    `

        const Custom = ({ children }) => <p>{children}</p>

        const result = generateElement({ code, scope: { Custom } })

        expect(result.type).toBe(Custom)
        expect(result.props.children).toBe('Hello')
    })
})

describe('importCode', () => {
  it('returns exported values from evaluated code', () => {
    const code = `
      exports.a = 123
      exports.foo = () => "hello"
    `
    const result = importCode(code)

    expect(result.a).toBe(123)
    expect(result.foo()).toBe('hello')
  })

  it('supports scope variables', () => {
    const code = `
      exports.sum = add(2, 3)
    `

    const result = importCode(code, {
      add: (a, b) => a + b
    })

    expect(result.sum).toBe(5)
  })

  it('returns empty object when no exports are assigned', () => {
    const result = importCode(`const x = 1`)
    expect(result).toEqual({})
  })
})
