import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { Page } from './Page';

const meta = {
  title: 'Test Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on component testing: https://storybook.js.org/docs/writing-tests/component-testing
export const TestPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
