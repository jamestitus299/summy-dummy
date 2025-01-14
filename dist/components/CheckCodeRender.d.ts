import React from 'react';
export interface CheckCodeRenderProps {
    code: string;
    return_error: (error: string | null) => void;
    scope?: Record<string, React.ComponentType | unknown>;
}
export default function CheckReactCode({ code, scope, return_error, }: CheckCodeRenderProps): React.JSX.Element;
