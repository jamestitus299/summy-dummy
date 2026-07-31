// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import importCss from "rollup-plugin-import-css";

// List of Storybook-specific files/patterns to exclude
const storybookExclude = [
  "**/*.stories.tsx",
  "**/*.stories.jsx",
  "**/*.stories.js",
  "**/*.stories.ts",
  ".storybook/**",
  "src/stories/**",
  "stories/",
];

// Add all external dependencies, including Radix UI packages
const external = [
  "react",
  "react-dom",
  "sucrase",
  "lucide-react",
  "prism-react-renderer",
  "react-simple-code-editor",
  "recharts",
  "@babel/standalone",
  "@babel/parser",
  "@babel/traverse",
  "@babel/types",
  "@babel/generator",
  "motion/react",
  "@emotion/react",
  "@emotion/is-prop-valid",
  "react-helmet-async",
];

const config = {
  input: "src/index.ts",
  // `dir` rather than `file`: the editor is dynamically imported (see
  // LazyLiveEditor), and a local dynamic import can only become its own chunk
  // if rollup is allowed to emit more than one file. With `file` rollup either
  // errors or, with inlineDynamicImports, folds the editor -- and therefore
  // prism-react-renderer -- straight back into the entry.
  //
  // entryFileNames keeps the published paths that `main` and `module` point at.
  output: [
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "index.js",
      chunkFileNames: "chunks/cjs/[name]-[hash].js",
      sourcemap: false,
    },
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "index.esm.js",
      chunkFileNames: "chunks/esm/[name]-[hash].js",
      sourcemap: false,
    },
  ],
  // Match subpaths too, not just bare package names. The lazy scope imports
  // ~1650 individual icon files as `lucide-react/dist/esm/icons/*.js`; without
  // this they are treated as local modules, pulled into the graph, and rollup
  // runs out of memory trying to inline them into a single-file bundle. Left
  // external, each stays a literal dynamic import for the consumer's bundler
  // to split -- which is the entire point of loading icons one at a time.
  external: (id) =>
    external.some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
  plugins: [
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true,
      exclude: storybookExclude,
      useTsconfigDeclarationDir: true,
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      dedupe: ["react", "react-dom"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: ["node_modules/**", ...storybookExclude],
      presets: ["@babel/preset-react"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    terser(),
    visualizer({
      filename: "bundle-analysis.html", // Output file
      open: true, // Open it in the browser after build
    }),
    importCss(),
  ],
};

export default config;
