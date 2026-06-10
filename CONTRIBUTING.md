# Contributing

Thanks for your interest in contributing to `react-code-canvas`.

This project is open source under the MIT license. Contributions should keep the package easy to install, easy to test, and safe for users to understand.

## Getting Started

1. Fork the repository.
2. Clone your fork.
3. Install dependencies with Bun:

```bash
bun install --frozen-lockfile
```

4. Run the test suite:

```bash
bun run test
```

5. Run a production build:

```bash
bun run build
```

## Development Workflow

- Use `bun.lock` as the source of truth for dependency resolution.
- Do not commit `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`.
- Keep changes focused. A pull request should solve one problem or add one coherent feature.
- Add or update tests for behavior changes.
- Update the README when public APIs, setup steps, or user-facing behavior changes.

## Local Commands

```bash
bun run dev
```

Starts Storybook for local development.

```bash
bun run test
```

Runs the Jest test suite.

```bash
bun run build
```

Builds the package with Rollup.

```bash
bun run size
```

Runs the configured bundle size check.

## Pull Requests

Before opening a pull request:

- Make sure `bun run test` passes.
- Make sure `bun run build` passes.
- Include a clear description of the change and why it is needed.
- Link related issues when applicable.
- Call out breaking changes, security implications, or migration notes.

## Issues

When opening an issue, include:

- The package version.
- Your React version.
- A minimal reproduction or code sample.
- Expected behavior.
- Actual behavior.
- Any relevant error output.

## Security

This package evaluates provided React code in the browser. Do not use it to execute untrusted code without additional isolation in your application.

If you believe you have found a security issue, avoid posting exploit details in a public issue. Contact the maintainer privately first when possible.

## Code of Conduct

By participating in this project, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
