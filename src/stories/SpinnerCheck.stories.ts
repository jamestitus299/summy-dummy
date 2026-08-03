import type { Meta, StoryObj } from '@storybook/react-vite';

import { SSpinnerCheck } from './SSpinnerCheck';

const SSpinnerCheckMeta = {
  title: 'Canvas - Spinner Check',
  component: SSpinnerCheck,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SSpinnerCheck>;

type SSpinnerCheckStory = StoryObj<typeof SSpinnerCheckMeta>;

export const SpinnerCheck: SSpinnerCheckStory = {};

export default SSpinnerCheckMeta;
