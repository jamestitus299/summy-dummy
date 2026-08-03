import { rechartsScope } from "./rechartScope";
import { lucideScope } from "./lucidreactScope";
import { editComponentScope } from "./editComponentScope";
import motion, { motionHooksComponents } from "./motionScope";
import helmetScope from "./helmetScope"

import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
} from "react";

// react scope
const reactScope = {
  React,
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
};

// Export all the components and scope needed.
//
// react-icons/fa was removed: it added ~424KB gzipped (roughly half the
// bundle) for 1611 icons that duplicate what lucide-react already covers with
// 5673. Code that referenced `Fa*` names must switch to lucide equivalents.
export const scope: any = {
  ...lucideScope,
  ...rechartsScope,
  ...reactScope,
  ...editComponentScope,
  motion, // has to be named motion - <motion.div>
  ...motionHooksComponents, // motion hooks, components
  ...helmetScope,
};
