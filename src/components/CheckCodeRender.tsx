import React, { useEffect } from 'react';
import { useRunner } from 'react-runner';
import { scope } from '../utils/Scope';

export interface CheckCodeRenderProps {
  code: string;
  returnError: (error: string | null) => void;
}

export default function CheckCodeRender({ code, returnError }: CheckCodeRenderProps) {
  const { element, error } = useRunner({
    code,
    scope,
    disableCache: true,
  });

  useEffect(() => {
    returnError(error);
  }, [element, error, returnError]);

  return <div style={{ display: 'none' }}>{element}</div>;
}