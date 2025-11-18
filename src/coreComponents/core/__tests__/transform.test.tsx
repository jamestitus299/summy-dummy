import { transform, normalizeCode } from "../transform";

describe("transform", () => {
  test("react component", () => {
    const result = transform(`<div>react-runner</div>`);
    expect(result).toBe(`React.createElement('div', null, "react-runner")`);
  });

  test("react component (arrow function)", () => {
    const result = transform(`() => <div>react-runner</div>`);
    expect(result).toBe(`() => React.createElement('div', null, "react-runner")`);
  });

  test("react component with TypeScript", () => {
    const result = transform(`(props: { foo?: number }) => <div>react-runner</div>`);
    expect(result).toBe(`(props) => React.createElement('div', null, "react-runner")`);
  });

  test("imports", () => {
    const code = `
      import { useState, useEffect } from 'react'
      import styled from 'styled-components'
      
      const Button = styled.button\`
        color: steelblue;
      \`
      
      render(<Button>Click me</Button>)
    `;

    const result = transform(code);

    // You can still use inline snapshots for long outputs, they're OK here
    expect(result).toMatchInlineSnapshot(`
      " function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
          var _styledcomponents = require('styled-components'); var _styledcomponents2 = _interopRequireDefault(_styledcomponents);
          
          const Button = _styledcomponents2.default.button\`
            color: steelblue;
          \`
          
          render(React.createElement(Button, null, \\"Click me\\" ))"
    `);
  });
});

describe("normalizeCode", () => {
  test("normalize inline JSX", () => {
    expect(normalizeCode(`\n\n  <>`)).toBe(`
      
      export default <>`);
    expect(normalizeCode(`\n\n  a<>`)).toBe(`
      
      a<>`);
    expect(normalizeCode(`\n\n  <a>`)).toBe(`
      
      export default <a>`);
  });

  test("normalize inline function component", () => {
    expect(normalizeCode(`\n\n  function`)).toBe(`
      
      function`);

    expect(normalizeCode(`\n\n  function(`)).toBe(`
      
      export default function(`);

    expect(normalizeCode(`\n\n  function `)).toBe(`
      
      export default function `);

    expect(normalizeCode(`\n\n  function A`)).toBe(`
      
      export default function A`);

    expect(normalizeCode(`\n\n  functionA`)).toBe(`
      
      functionA`);
  });

  test("normalize inline arrow function component", () => {
    expect(normalizeCode(`\n\n  ()=>`)).toBe(`
      
      export default ()=>`);

    expect(normalizeCode(`\n\n  () a`)).toBe(`
      
      export default () a`);

    expect(normalizeCode(`\n\n  (a) `)).toBe(`
      
      (a) `);

    expect(normalizeCode(`\n\n  ()a`)).toBe(`
      
      ()a`);
  });

  test("normalize inline class component", () => {
    expect(normalizeCode(`\n\n  class`)).toBe(`
      
      class`);

    expect(normalizeCode(`\n\n  classA`)).toBe(`
      
      classA`);

    expect(normalizeCode(`\n\n  class `)).toBe(`
      
      export default class `);

    expect(normalizeCode(`\n\n  class A`)).toBe(`
      
      export default class A`);
  });
});
