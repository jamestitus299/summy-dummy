import React from 'react';
export interface CheckCodeRenderProps {
    code: string;
    returnError: (error: string | null) => void;
}
export default function CheckCodeRender({ code, returnError }: CheckCodeRenderProps): React.JSX.Element;
