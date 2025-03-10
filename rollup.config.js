// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

// List of Storybook-specific files/patterns to exclude
const storybookExclude = [
  '**/*.stories.tsx',
  '**/*.stories.jsx',
  '**/*.stories.js',
  '**/*.stories.ts',
  '.storybook/**',
  'src/stories/**',
  'stories/',
];

// Add all external dependencies, including Radix UI packages
const external = [
  'react', 
  'react-dom', 
  'react-live-runner', 
  'recharts',
  // Add all Radix UI packages
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-aspect-ratio',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-context-menu',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-hover-card',
  '@radix-ui/react-icons',
  '@radix-ui/react-label',
  '@radix-ui/react-popover',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip',
  'class-variance-authority',
  'clsx',
  'lucide-react'
];

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: external,
  plugins: [
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      exclude: storybookExclude,
      useTsconfigDeclarationDir: true, // Add this to better handle declarations
    }),
    resolve({
      dedupe: ["sucrase"], // Ensures Rollup deduplicates imports
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: ['node_modules/**', ...storybookExclude],
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
  ],
};

export default config;