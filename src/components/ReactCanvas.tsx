import React, {useState} from 'react';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live-runner';
import { scope } from '../utils/Scope';

export interface ReactCanvasProps {
  code: string;
  showpreview?: boolean;
  showeditor?: boolean;
  showerror?: boolean;
}

export default function ReactCanvas({
  code,
  showpreview = true,
  showeditor = false,
  showerror = false,
}: ReactCanvasProps) {
  return (
    <div>
      <LiveProvider code={code} scope={scope}>
        {showpreview && <LivePreview />}
        {showerror && <LiveError />}
        {showeditor && <LiveEditor />}
      </LiveProvider>
    </div>
  );
}