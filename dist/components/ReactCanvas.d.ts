import React from 'react';
export interface ReactCanvasProps {
    code: string;
    scope?: Record<string, React.ComponentType | unknown>;
    showPreview?: boolean;
    showEditor?: boolean;
    showError?: boolean;
}
export default function ReactCanvas({ code, scope, showPreview, showEditor, showError, }: ReactCanvasProps): React.JSX.Element;
