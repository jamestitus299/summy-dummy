import { rechartsScope } from "./rechartScope";
import { lucideScope } from "./lucidreactScope";
import {reactIconsFaScope} from "./reactIconsScope";
import { motion } from "motion/react";
// import { shadcnScope } from "./shadcnScope";
// import { materialUIScope } from "./materialUiScope";

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

// Export all the components and scope needed
export const scope = {
  // ...materialUIScope,
  // ...shadcnScope,
  motion,
  ...reactIconsFaScope,
  ...lucideScope,
  ...rechartsScope,
  ...reactScope,
};
