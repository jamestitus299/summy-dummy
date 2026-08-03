import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { editComponentScope } from "./editComponentScope";
import helmetScope from "./helmetScope";
import { ICON_LOADERS, ICON_ALIASES } from "./generated/lucideIconMap";
import { RECHARTS_NAMES, MOTION_NAMES, FA_NAMES } from "./generated/scopeNames";

type Scope = Record<string, any>;

/**
 * Everything cheap enough to ship in the first chunk. React is a peer
 * dependency (already on the page), the edit helpers are our own code, and
 * react-helmet-async is ~6 KB -- not worth a round trip.
 */
export const baseScope: Scope = {
  React,
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  ...editComponentScope,
  ...helmetScope,
};

const RECHARTS_SET = new Set(RECHARTS_NAMES);
const MOTION_SET = new Set(MOTION_NAMES);
const FA_SET = new Set(FA_NAMES);

/**
 * `PascalCase` -> `kebab-case`. Must stay in step with the same function in
 * scripts/generate-scope-maps.mjs, which is what decided the ICON_LOADERS keys.
 */
export function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Every identifier-shaped token in the source.
 *
 * Deliberately a regex and not a parse: this runs before evaluation on every
 * code change, and the only consequence of over-matching is loading a module
 * that turns out to be unused. A word inside a string or comment can trigger a
 * needless fetch; nothing breaks.
 *
 * Under-matching would break things, and cannot happen -- every name the code
 * can reference appears literally in the source. Names assembled at runtime
 * (`scope['Ac' + 'tivity']`) were never resolvable here anyway, because the
 * scope is passed as `new Function` parameters.
 */
export function collectIdentifiers(code: string): Set<string> {
  const found = new Set<string>();
  const re = /[A-Za-z_$][\w$]*/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(code))) found.add(match[0]);
  return found;
}

/** The dynamic import for an icon name, or undefined if it is not a lucide icon. */
export function iconLoaderFor(name: string): (() => Promise<any>) | undefined {
  // Every lucide export is PascalCase. Without this, keywords collide with icon
  // file names -- `import` matches icons/import.js, gets added to the scope, and
  // then blows up as a `new Function` parameter because it is a reserved word.
  if (!/^[A-Z]/.test(name)) return undefined;

  const explicit = ICON_ALIASES[name];
  if (explicit) return ICON_LOADERS[explicit];

  // `ActivityIcon` and `LucideActivity` both reduce to `activity`. Guard the
  // degenerate cases so `Icon` and `Lucide` do not reduce to an empty string.
  const stripped = name.replace(/Icon$/, "").replace(/^Lucide/, "");
  if (!stripped) return undefined;

  return ICON_LOADERS[toKebab(stripped)];
}

/**
 * Copy a module namespace into the scope, skipping `default`.
 *
 * A namespace object always carries `default`, which is a reserved word and so
 * cannot become a `new Function` parameter. The generated name lists exclude it
 * for the same reason -- otherwise the `default` in every `export default`
 * would look like a reference to recharts.
 */
export function assignNamespace(scope: Scope, mod: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(mod)) {
    if (key === "default") continue;
    scope[key] = value;
  }
}

/** True if the name is a lucide icon, without loading anything. */
export const isIconName = (name: string): boolean => !!iconLoaderFor(name);

/** True if the name comes from recharts. */
export const isRechartsName = (name: string): boolean => RECHARTS_SET.has(name);

/** True if the name comes from motion/react. */
export const isMotionName = (name: string): boolean => MOTION_SET.has(name);

/** True if the name is a Font Awesome icon from react-icons/fa. */
export const isFaName = (name: string): boolean => FA_SET.has(name);

/**
 * The names `resolveScope` would put in scope for this code, without loading
 * anything. Mirrors resolveScope exactly, because it is what decides the
 * `new Function` parameter list -- and therefore which top-level declarations
 * in the code count as duplicates.
 */
export function scopeNamesFor(code: string, extra: string[] = []): string[] {
  const names = new Set<string>(Object.keys(baseScope));
  let needsRecharts = false;
  let needsMotion = false;

  for (const name of collectIdentifiers(code)) {
    if (RECHARTS_SET.has(name)) needsRecharts = true;
    if (MOTION_SET.has(name)) needsMotion = true;
    // Only the Fa names actually referenced, not all 1611. The pack is fetched
    // whole but the scope stays small -- these become `new Function` parameters.
    if (FA_SET.has(name)) names.add(name);
    if (iconLoaderFor(name)) names.add(name);
  }

  if (needsRecharts) for (const n of RECHARTS_NAMES) names.add(n);
  if (needsMotion) for (const n of MOTION_NAMES) names.add(n);
  for (const n of extra) names.add(n);

  return [...names];
}

/**
 * Build the scope the given code actually needs.
 *
 * The old behaviour was to spread every export of lucide-react (5670 names),
 * recharts and motion into one object at module load. That forced ~300 KB
 * (brotli) into the first chunk regardless of what the code used, and handed
 * ~5800 parameters to `new Function` on every single evaluation.
 *
 * Here each group is fetched only when the code references it: icons one file
 * at a time (~0.7 KB each), recharts and motion whole (they are not usefully
 * splittable). Repeat calls are free -- the browser caches resolved modules, so
 * an already-loaded icon resolves in a microtask.
 *
 * `extra` is merged last so a caller-supplied scope always wins.
 */
export async function resolveScope(
  code: string,
  extra: Scope = {},
): Promise<Scope> {
  const scope: Scope = { ...baseScope };
  if (!code?.trim()) return { ...scope, ...extra };

  const identifiers = collectIdentifiers(code);
  const pending: Promise<unknown>[] = [];
  const faNames = new Set<string>();
  let needsRecharts = false;
  let needsMotion = false;

  for (const name of identifiers) {
    if (RECHARTS_SET.has(name)) needsRecharts = true;
    if (MOTION_SET.has(name)) needsMotion = true;
    if (FA_SET.has(name)) faNames.add(name);

    const loader = iconLoaderFor(name);
    if (!loader) continue;
    pending.push(
      loader().then((mod) => {
        // Key by the name the code used, not the file name -- aliases such as
        // `SortDesc` must land in the scope under `SortDesc`.
        scope[name] = mod.default;
      }),
    );
  }

  if (needsRecharts) {
    pending.push(
      import("recharts").then((mod) => {
        assignNamespace(scope, mod);
      }),
    );
  }

  if (needsMotion) {
    pending.push(
      // `motion` has to keep its name -- <motion.div> resolves against it.
      import("motion/react").then((mod) => {
        assignNamespace(scope, mod);
      }),
    );
  }

  if (faNames.size) {
    // ponytail: whole-pack fetch (~424 KB gzipped). react-icons/fa is a single
    // module with no per-icon files, so it cannot be split the way lucide is --
    // there is nothing finer to import. Only pages that name an Fa icon pay it,
    // and only once. Upgrade path if that cost ever matters: generate per-icon
    // modules from the pack ourselves, or move the code to lucide equivalents.
    pending.push(
      import("react-icons/fa").then((mod: Record<string, unknown>) => {
        // Assign only what the code referenced, not all 1611 exports: these
        // become `new Function` parameters on every evaluation.
        for (const name of faNames) scope[name] = mod[name];
      }),
    );
  }

  await Promise.all(pending);
  return { ...scope, ...extra };
}
