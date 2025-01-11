import React, { useEffect } from "react";
import { useRunner } from "react-runner";
import { scope as defaultscope } from "../utils/Scope";

export interface CheckCodeRenderProps {
  code: string;
  returnError: (error: string | null) => void;
  scope?: Record<string, React.ComponentType | unknown>;
}

export default function CheckCodeRender({
  code,
  scope,
  returnError,
}: CheckCodeRenderProps) {
  const finalScope = { ...defaultscope, ...scope };
  const { element, error } = useRunner({
    code,
    disableCache: false,
    scope: finalScope,
  });

  // if (error) {
  //   returnError(error);
  // } else {
  //   returnError(null);
  // }
  useEffect(() => {
    returnError(error);
    
  }, []);

  return <div style={{ display: "none" }}>{element}</div>;
}
