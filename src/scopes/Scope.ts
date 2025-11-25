import { rechartsScope } from "./rechartScope";
import { lucideScope } from "./lucidreactScope";
import { reactIconsFaScope } from "./reactIconsScope";
import { editComponentScope } from "./editComponentScope";
import motion from "./motionScope";

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
export const scope: any = {
  ...reactIconsFaScope,
  ...lucideScope,
  ...rechartsScope,
  ...reactScope,
  ...editComponentScope,
  motion, // has to be named motion - <motion.div>
};
