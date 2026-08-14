import fs from 'fs';
import path from 'path';
import type { Config } from '@docusaurus/types';
import type {
  Options as ClassicPresetOptions,
  ThemeConfig as ClassicThemeConfig,
} from '@docusaurus/preset-classic';

// Read the installed canvas version straight off disk rather than importing
// `react-code-canvas/package.json`. The package's `exports` map only exposes
// ".", so a subpath import of package.json fails with ERR_PACKAGE_PATH_NOT_EXPORTED
// on versions that ship that field. fs bypasses exports resolution entirely.
//
// The exports map now carries "./package.json", but this stays until the docs
// depend on a published version that has it -- the pin above is 5.0.0, which
// does not, and switching early would silently degrade to 'unknown'.
function readCanvasVersion(): string {
  try {
    const pkgPath = path.join(
      __dirname,
      'node_modules/react-code-canvas/package.json'
    );
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

const config: Config = {
  title: 'react-code-canvas',
  tagline: 'Render React components and edit text content live in the browser.',
  favicon: 'img/rrc.png',

  url: 'https://jamestitus299.github.io',
  baseUrl: '/react-code-canvas/',
  organizationName: 'jamestitus299',
  projectName: 'react-code-canvas',
  trailingSlash: false,

  customFields: {
    canvasVersion: readCanvasVersion(),
  },

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies ClassicPresetOptions,
    ],
  ],

  themeConfig: {
    image: 'img/rrc.png',
    navbar: {
      title: 'react-code-canvas',
      logo: {
        alt: 'react-code-canvas logo',
        src: 'img/rrc.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/playground',
          label: 'Playground',
          position: 'left',
        },
        {
          href: 'https://github.com/jamestitus299/react-code-canvas/issues/new?template=bug_report.yml',
          label: 'Report a Bug',
          position: 'right',
        },
        {
          href: 'https://github.com/jamestitus299/react-code-canvas',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Security Model',
              to: '/docs/security',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Report a Bug',
              href: 'https://github.com/jamestitus299/react-code-canvas/issues/new?template=bug_report.yml',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/jamestitus299/react-code-canvas/blob/master/CONTRIBUTING.md',
            },
            {
              label: 'Code of Conduct',
              href: 'https://github.com/jamestitus299/react-code-canvas/blob/master/CODE_OF_CONDUCT.md',
            },
          ],
        },
        {
          title: 'Package',
          items: [
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/react-code-canvas',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/jamestitus299/react-code-canvas',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} James Titus. MIT licensed.`,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
    },
  } satisfies ClassicThemeConfig,
};

export default config;
