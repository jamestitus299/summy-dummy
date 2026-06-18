import type { Config } from '@docusaurus/types';
import type {
  Options as ClassicPresetOptions,
  ThemeConfig as ClassicThemeConfig,
} from '@docusaurus/preset-classic';

const config: Config = {
  title: 'react-code-canvas',
  tagline: 'Render React components and edit text content live in the browser.',
  favicon: 'img/rrc.png',

  url: 'https://jamestitus299.github.io',
  baseUrl: '/react-code-canvas/',
  organizationName: 'jamestitus299',
  projectName: 'react-code-canvas',
  trailingSlash: false,

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
