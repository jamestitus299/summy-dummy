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
  external: ['react', 'react-dom', 'react-live-runner', 'recharts'],
  plugins: [
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      exclude: storybookExclude,
    }),
    resolve(),
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