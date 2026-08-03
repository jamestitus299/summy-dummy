---
title: Security Model
description: Understand the risks of executing code strings in the browser.
---

# Security Model

`react-code-canvas` evaluates provided React code in the browser.

That is powerful, but it also means you should not execute untrusted code without additional isolation appropriate for your application.

## Important Rules

- Do not pass arbitrary user input directly into the renderer.
- Do not expose secrets, tokens, or privileged objects through `scope`.
- Treat generated code as executable code, not plain content.
- Use an iframe, worker, sandboxed execution environment, or server-side review process if your product accepts code from untrusted users.

## What Scope Controls

The `scope` prop controls which values are available by name to the rendered code. It does not make execution inherently safe.

Keep scope narrow and only expose the components and data required for rendering.
