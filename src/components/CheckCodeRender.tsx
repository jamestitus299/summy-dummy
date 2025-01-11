// import React, { useEffect } from "react";
// import { useRunner } from "react-runner";
// import { scope as defaultscope } from "../utils/Scope";

// export interface CheckCodeRenderProps {
//   code: string;
//   returnError: (error: string | null) => void;
//   scope?: Record<string, React.ComponentType | unknown>;
// }

// export default function CheckCodeRender({
//   code,
//   scope,
//   returnError,
// }: CheckCodeRenderProps) {
//   const finalScope = { ...defaultscope, ...scope };
//   const { element, error } = useRunner({
//     code,
//     disableCache: false,
//     scope: finalScope,
//   });

//   // if (error) {
//   //   returnError(error);
//   // } else {
//   //   returnError(null);
//   // }
//   useEffect(() => {
//     returnError(error);
    
//   }, []);

//   return <div style={{ display: "none" }}>{element}</div>;
// }



import React, { Component } from "react";
import { useRunner } from "react-runner";
import { scope as defaultscope } from "../utils/Scope";

export interface CheckCodeRenderProps {
  code: string;
  returnError: (error: string | null) => void;
  scope?: Record<string, React.ComponentType | unknown>;
}

interface CheckCodeRenderState {
  element: React.ReactNode;
  error: string | null;
}

export default class CheckCodeRender extends Component<
  CheckCodeRenderProps,
  CheckCodeRenderState
> {
  constructor(props: CheckCodeRenderProps) {
    super(props);

    // Run the `useRunner` hook manually using an external function
    const { element, error } = this.runCode();

    this.state = {
      element,
      error,
    };
  }

  runCode() {
    const { code, scope } = this.props;
    const finalScope = { ...defaultscope, ...scope };
    return useRunner({
      code,
      disableCache: false,
      scope: finalScope,
    });
  }

  componentDidMount() {
    const { returnError } = this.props;
    const { error } = this.state;

    // Return the error message when the component mounts
    returnError(error);
  }

  render() {
    const { element } = this.state;

    return <div style={{ display: "none" }}>{element}</div>;
  }
}
