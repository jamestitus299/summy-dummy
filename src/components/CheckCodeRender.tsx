import React, { useEffect, useMemo } from 'react';
import { useRunner } from 'react-runner';
import { scope as defaultscope } from '../utils/Scope';

export interface CheckCodeRenderProps {
  code: string;
  return_error: (error: string | null) => void;
  scope?: Record<string, React.ComponentType | unknown>;
}

export default function CheckReactCode({
  code,
  scope,
  return_error = () => {},
}: CheckCodeRenderProps) {
  const finalScope = useMemo(
    () => ({ ...defaultscope, ...scope }),
    [defaultscope, scope]
  );
  const { element, error } = useRunner({
    code,
    scope: finalScope,
  });

  useEffect(() => {
    return_error(error);
    // console.log(errorMessage);
  }, [error, return_error]);

  return <div style={{ display: 'none' }}>{element}</div>;
}
