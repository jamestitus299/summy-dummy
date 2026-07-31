import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    'installation',
    'quick-start',
    {
      type: 'category',
      label: 'Components',
      items: ['react-canvas', 'edit-text-react-canvas'],
    },
    'scope',
    'security',
    'contributing',
  ],
};

export default sidebars;
