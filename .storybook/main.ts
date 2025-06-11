import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/Page.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/Package.stories.@(js|jsx|mjs|ts|tsx)",
    // "../src/**/*.mdx",
    // "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  }
};
export default config;