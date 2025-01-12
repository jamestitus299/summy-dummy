import React from 'react';
export interface CheckCodeRenderProps {
    code: string;
    returnError: (error: string | null) => void;
    scope?: Record<string, React.ComponentType | unknown>;
}
export default function CheckReactCode({ code, scope, returnError, }: CheckCodeRenderProps): React.JSX.Element;
