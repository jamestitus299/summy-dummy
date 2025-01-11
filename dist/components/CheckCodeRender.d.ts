import React, { Component } from "react";
export interface CheckCodeRenderProps {
    code: string;
    returnError: (error: string | null) => void;
    scope?: Record<string, React.ComponentType | unknown>;
}
interface CheckCodeRenderState {
    element: React.ReactNode;
    error: string | null;
}
export default class CheckCodeRender extends Component<CheckCodeRenderProps, CheckCodeRenderState> {
    constructor(props: CheckCodeRenderProps);
    runCode(): import("react-runner").UseRunnerReturn;
    componentDidMount(): void;
    render(): React.JSX.Element;
}
export {};
