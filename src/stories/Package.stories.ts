import type { Meta, StoryObj } from "@storybook/react-vite"

import { PageDist } from "./Page"

const meta = {
  title: "Canvas/Library",
  component: PageDist,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PageDist>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
