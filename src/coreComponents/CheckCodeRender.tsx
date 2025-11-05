import React, { useEffect, useMemo } from 'react';
import { useRunner } from './core/useRunner';
import { scope as defaultscope } from '../scopes/Scope';

export interface CheckCodeRenderProps {
  code: string;
  returnError?: (error: string | null) => string | null | void;
  scope?: Record<string, React.ComponentType | unknown>;
}

export default function CheckReactCode({
  code,
  scope,
  returnError = () => {},
}: CheckCodeRenderProps) {
  const finalScope = useMemo(
    () => ({ ...defaultscope, ...scope }),
    [defaultscope, scope]
  );
  const { element, error } = useRunner({
    code,
    scope: finalScope,
    disableCache: true
  });

  useEffect(() => {
    returnError(error);
    // console.log(errorMessage);
  }, [error, returnError]);

  return <div style={{ display: 'none' }}>{element}</div>;
}
