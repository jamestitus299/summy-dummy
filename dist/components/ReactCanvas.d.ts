import React from 'react';
export interface ReactCanvasProps {
    code: string;
    showpreview?: boolean;
    showeditor?: boolean;
    showerror?: boolean;
}
export default function ReactCanvas({ code, showpreview, showeditor, showerror, }: ReactCanvasProps): React.JSX.Element;
