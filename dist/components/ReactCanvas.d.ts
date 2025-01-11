import React from 'react';
export interface ReactCanvasProps {
    code: string;
    scope?: Record<string, React.ComponentType | unknown>;
    showpreview?: boolean;
    showeditor?: boolean;
    showerror?: boolean;
}
export default function ReactCanvas({ code, scope, showpreview, showeditor, showerror, }: ReactCanvasProps): React.JSX.Element;
