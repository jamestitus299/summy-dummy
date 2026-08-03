---
title: Installation
description: Install react-code-canvas in a React application.
---

# Installation

```bash
bun add react-code-canvas@latest
```

With npm:

```bash
npm install react-code-canvas@latest
```

With Yarn:

```bash
yarn add react-code-canvas@latest
```


## Peer Dependencies

Your app must provide React and React DOM:

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

## Development From Source

This repository uses Bun:

```bash
bun install --frozen-lockfile
bun run test
bun run build
```

Run Storybook locally:

```bash
bun run dev
```
