import React from "react";
import { render, screen } from "@testing-library/react";
import { generateElement, createRequire, importCode } from "../utils";

describe("generateElement", () => {
  test("empty code", () => {
    const element = generateElement({ code: `` });
    expect(element).toBeNull();
  });

  test("console", () => {
    const element = generateElement({ code: `console` });
    expect(element).toBeNull();
  });

  test("console.log", () => {
    const element = generateElement({ code: `console.log('react-runner')` });
    expect(element).toBeNull();
  });

  test("invalid code", () => {
    expect(() =>
      generateElement({
        code: `
        <>
          <div>{value}</div>
          <div>react-runner</div>
        </>
      `,
      })
    ).toThrowError(`value is not defined`);
  });

  test("inline element", () => {
    const element = generateElement({
      code: `
      <>
        <div>Hello</div>
        <div>react-runner</div>
      </>
    `,
    });

    // Instead of snapshot:
    const { container } = render(element!);
    expect(container).toHaveTextContent("Hello");
    expect(container).toHaveTextContent("react-runner");
  });

  test("function component", () => {
    const element = generateElement({
      code: `
      function Counter() {
        const [count, setCount] = React.useState(0)

        return (
          <>
            <div>{count}</div>
            <button onClick={() => setCount(count => count + 1)}>+</button>
            <button onClick={() => setCount(count => count - 1)}>-</button>
          </>
        )
      }
    `,
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("0");
    expect(container).toHaveTextContent("+");
    expect(container).toHaveTextContent("-");
  });

  test("class component", () => {
    const element = generateElement({
      code: `
      class Counter extends React.Component {
        state = { count: 0 }

        onIncrement = () => this.setState(({ count }) => ({ count: count + 1 }));
        onDecrement = () => this.setState(({ count }) => ({ count: count - 1 }));

        render() {
          return (
            <>
              <div>{this.state.count}</div>
              <button onClick={this.onIncrement}>+</button>
              <button onClick={this.onDecrement}>-</button>
            </>
          )
        }
      }
    `,
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("0");
    expect(container).toHaveTextContent("+");
    expect(container).toHaveTextContent("-");
  });

  test("export default", () => {
    const element = generateElement({
      code: `
      const value = 'react-runner'

      export default () => (
        <>
          <div>Hello</div>
          <div>{value}</div>
        </>
      )
    `,
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("Hello");
    expect(container).toHaveTextContent("react-runner");
  });

  test("render", () => {
    const element = generateElement({
      code: `
      const value = 'react-runner'

      render(
        <>
          <div>Hello</div>
          <div>{value}</div>
        </>
      )
    `,
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("Hello");
    expect(container).toHaveTextContent("react-runner");
  });

  test("render string", () => {
    const element = generateElement({ code: `render("hello")` });
    expect(element).toBe("hello");
  });

  test("render object", () => {
    const element = generateElement({ code: `render({})` });
    expect(element).toBeNull();
  });

  test("scope", () => {
    const element = generateElement({
      code: `
      <>
        <div>{value}</div>
        <div>react-runner</div>
      </>`,
      scope: { value: "Hello" },
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("Hello");
    expect(container).toHaveTextContent("react-runner");
  });

  test("default in scope", () => {
    const element = generateElement({
      code: ``,
      scope: { default: "Hello" },
    });
    expect(element).toBeNull();
  });

  test("imports", () => {
    const element = generateElement({
      code: `import Foo from 'foo'
      render(<Foo />)`,
      scope: { import: { foo: () => "hello" } },
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("hello");
  });

  test("invalid imports", () => {
    expect(() =>
      generateElement({
        code: `import Foo from 'foo'
        render(<Foo />)`,
        scope: { import: { bar: () => "hello" } },
      })
    ).toThrowError(`Module not found: 'foo'`);
  });

  test("override imports via require", () => {
    const element = generateElement({
      code: `import Foo from 'foo'
        render(<Foo />)`,
      scope: {
        import: { bar: () => "hello" },
        require: createRequire({ foo: () => "hello" }),
      },
    });

    const { container } = render(element!);
    expect(container).toHaveTextContent("hello");
  });
});

describe("importCode", () => {
  test("empty code", () => {
    expect(importCode("")).toEqual({});
  });

  test("exports code", () => {
    expect(importCode(`export const Foo='react'`)).toEqual({ Foo: "react" });
  });

  test("exports with scope", () => {
    expect(
      importCode(
        `import bar from 'bar'
        export const foo='Foo'
        export default bar`,
        {
          import: { bar: "Bar" },
        }
      )
    ).toEqual({
      foo: "Foo",
      default: "Bar",
    });
  });
});
