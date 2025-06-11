// rollup.config.js
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import typescript from "rollup-plugin-typescript2"
import json from "@rollup/plugin-json"
import terser from "@rollup/plugin-terser"
import { visualizer } from "rollup-plugin-visualizer"

// List of Storybook-specific files/patterns to exclude
const storybookExclude = [
  "**/*.stories.tsx",
  "**/*.stories.jsx",
  "**/*.stories.js",
  "**/*.stories.ts",
  ".storybook/**",
  "src/stories/**",
  "stories/",
]

// Add all external dependencies, including Radix UI packages
const external = [
  "react",
  "react-dom",
  "react-live-runner",
  "recharts",
  /^@radix-ui\//, // Exclude all Radix UI components
  "lucide-react",
  "sucrase",
  "motion",
  "react-icons",
  "recharts",
]

const config = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: external,
  plugins: [
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true,
      exclude: storybookExclude,
      useTsconfigDeclarationDir: true, // Add this to better handle declarations
    }),
    resolve({
      dedupe: ["sucrase"], // Ensures Rollup deduplicates imports
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: ["node_modules/**", ...storybookExclude, ...external],
      presets: ["@babel/preset-react"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    terser(),
    visualizer({
      filename: "bundle-analysis.html", // Output file
      open: true, // Open it in the browser after build
    }),
  ],
}

export default config
