import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { SEditTextCanvas } from './SEditTextCanvas';


const SEditTextCanvasMeta = {
    title: 'Canvas - Test',
    component: SEditTextCanvas,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof SEditTextCanvas>;

type SEditTextCanvasStory = StoryObj<typeof SEditTextCanvasMeta>;

export const EditTextReactCanvas: SEditTextCanvasStory = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
    },
};

export default SEditTextCanvasMeta;
