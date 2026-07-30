// react-icons/fa

// import * as ReactIconsFa from "react-icons/fa";

// // Create an object to hold all icons
// const reactIconsScope = {};

// // Import all icons from react-icons/fa into the scope object
// Object.keys(ReactIconsFa).forEach(iconName => {
//   // console.log(iconName)
//   // reactIconsScope[iconName] = ReactIconsFa[iconName];
// });

// export { reactIconsScope };

// https://www.npmjs.com/package/react-icons
//
// ---------------------------------------------------------------------------
// PARKED / NOT IN USE as of 4.2.x — kept for reference in case Font Awesome
// icons are wanted again.
//
// Why it was removed from the default scope: `import * as FaIcons` pulls all
// 1611 exports, which measured ~424KB gzipped — roughly half the whole bundle —
// duplicating coverage that `lucide-react` already provides with 5673 icons.
// Removing it took a ReactCanvas-only consumer bundle from 896KB to 474KB gzip.
//
// The code below is commented out deliberately: the `react-icons` dependency
// was dropped, so a live import here would fail to resolve and break the
// TypeScript build.
//
// To re-enable:
//   1. bun add react-icons
//   2. add "react-icons/fa" back to `external` in rollup.config.mjs
//      (otherwise it gets inlined into dist instead of staying a peer import)
//   3. uncomment the block below
//   4. in scopes/Scope.ts, re-add the import and spread `...reactIconsFaScope`
//   5. invert src/scopes/__test__/scope.test.js, which now asserts NO Fa keys
//   6. re-add the Font Awesome line to the generator system prompts in
//      vvp-admin and vvp-client, or models will never emit these icons
//
// Prefer loading it on demand rather than statically — every export of
// react-icons/fa matches /^Fa[A-Z0-9]/ (verified: 0 of 1611 exceptions), so
// `/\bFa[A-Z]/.test(code)` is a reliable test for whether a given code string
// needs the set at all.
// ---------------------------------------------------------------------------

// import * as FaIcons from 'react-icons/fa';
//
// // Filter only actual components (functions or objects)
// const faComponentNames = Object.keys(FaIcons).filter(
//   key => typeof (FaIcons as any)[key] === 'function' || typeof (FaIcons as any)[key] === 'object'
// );
//
// // Create the scope
// export const reactIconsFaScope = faComponentNames.reduce((acc, name) => {
//   acc[name] = (FaIcons as any)[name];
//   return acc;
// }, {} as Record<string, any>);
