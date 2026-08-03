import type { Meta, StoryObj } from '@storybook/react-vite';
import { within } from 'storybook/test';

import { SReactCanvas } from './SReactCanvas';

const SReactCanvasMeta = {
  title: 'Canvas - Test',
  component: SReactCanvas,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SReactCanvas>;

type SReactCanvasStory = StoryObj<typeof SReactCanvasMeta>;

export const ReactCanvas: SReactCanvasStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};

export default SReactCanvasMeta;
