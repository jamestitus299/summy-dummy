import React from "react";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { Runner } from "../Runner";
import * as Utils from "../utils";

describe("Runner", () => {
  test("code update", () => {
    const onRendered = jest.fn();
    const spy = jest.spyOn(Utils, "generateElement");

    const { container, rerender } = render(
      <Runner code="hello" onRendered={onRendered} />
    );
    expect(container.firstChild).toBeNull(); // null initial render
    expect(onRendered).toHaveBeenCalledTimes(1);
    expect(onRendered).toHaveBeenCalledWith(
      new ReferenceError("hello is not defined")
    );
    expect(spy).toHaveBeenCalledTimes(1);

    rerender(<Runner code="<div>hello</div>" onRendered={onRendered} />);
    expect(container).toHaveTextContent("hello");
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(onRendered).toHaveBeenCalledTimes(2);
    expect(onRendered).toHaveBeenLastCalledWith(undefined);
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  test("scope update", () => {
    const spy = jest.spyOn(Utils, "generateElement");

    const { container, rerender } = render(
      <Runner code="<div>hello {value}</div>" scope={{ value: "react" }} />
    );
    expect(container).toHaveTextContent("hello react");
    expect(spy).toHaveBeenCalledTimes(1);

    rerender(
      <Runner
        code="<div>hello {value}</div>"
        scope={{ value: "react-runner" }}
      />
    );
    expect(container).toHaveTextContent("hello react-runner");
    expect(spy).toHaveBeenCalledTimes(2);

    rerender(
      <Runner
        code="<div>hello! {value}</div>"
        scope={{ value: "react-runner" }}
      />
    );
    expect(container).toHaveTextContent("hello! react-runner");
    expect(spy).toHaveBeenCalledTimes(3);

    spy.mockRestore();
  });

  test("handle react error", () => {
    const onRendered = jest.fn();
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(
      <Runner code="() => <div>{value}</div>" onRendered={onRendered} />
    );
    expect(container.firstChild).toBeNull();
    expect(onRendered).toHaveBeenCalledTimes(1);
    expect(onRendered).toHaveBeenCalledWith(
      new ReferenceError("value is not defined")
    );

    spy.mockRestore();
  });

  test("handle async react error", () => {
    jest.useFakeTimers();
    const onRendered = jest.fn();
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(
      <Runner
        code={`export default () => {
          const [loaded, setLoaded] = React.useState(false)
        
          React.useEffect(() => {
            setTimeout(() => setLoaded(true), 10)
          })
        
          if (!loaded) return 'loading'
          return <Foo />
        }`}
        onRendered={onRendered}
      />
    );

    expect(container).toHaveTextContent("loading");
    expect(onRendered).toHaveBeenCalledWith(undefined);

    jest.runOnlyPendingTimers(); // triggers state change

    expect(container.firstChild).toBeNull(); // Foo not defined, so error
    expect(onRendered).toHaveBeenCalledTimes(2);
    expect(onRendered).toHaveBeenLastCalledWith(
      new ReferenceError("Foo is not defined")
    );

    spy.mockRestore();
    jest.useRealTimers();
  });

  test("without React in scope", () => {
    const { container } = render(
      <Runner code="<div>hello</div>" scope={{ React: undefined }} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("custom jsxFragmentPragma", () => {
    const { container } = render(
      <Runner
        code="<>hello</>"
        scope={{ React: { ...React, Fragment: "em" } }}
      />
    );

    const element = container.querySelector("em");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("hello");
  });
});
