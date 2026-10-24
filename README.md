# Github Memory

A memory game built with the GitHub contributors of a repository.

## Live demo

https://christianjtr.github.io/react-memory

## Tech stack

- React 19 + TypeScript 5.9
- Vite 8
- Tailwind CSS 4
- Vitest 5 + React Testing Library
- ESLint 10 (flat config) + Prettier 3

## Requirements

- Node.js 24.15 or newer (see `.nvmrc`)
- npm 11

## Getting started

```shell
nvm use
npm ci
npm run dev
```

The app loads `facebook/react` contributors by default. To use another repository,
copy `.env.example` to `.env` and set:

```shell
VITE_REPO_OWNER=owner
VITE_REPO_NAME=repository
```

The GitHub API is public and rate-limited. No token or secret is required or stored
in the client.

## Scripts

| Script                  | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start the development server       |
| `npm run build`         | Typecheck and build for production |
| `npm run preview`       | Preview the production build       |
| `npm run typecheck`     | Run TypeScript project references  |
| `npm run lint`          | Run ESLint                         |
| `npm run lint:fix`      | Fix ESLint issues                  |
| `npm run format`        | Format with Prettier               |
| `npm run format:check`  | Check formatting                   |
| `npm run test`          | Run tests                          |
| `npm run test:watch`    | Run tests in watch mode            |
| `npm run test:coverage` | Run tests with coverage thresholds |
| `npm run audit`         | Audit dependencies                 |
| `npm run check`         | Lint, typecheck, tests and build   |

## Architecture

```text
src/
  app/                       application bootstrap
  features/
    contributors/            GitHub API, adapter, hook and types
    game/                    components, context, reducer, hooks and deck logic
  lib/                       shared utilities
  styles/                    Tailwind entry point
  test/                      test setup and fixtures
```

The project is organized by feature. Game rules live in a pure reducer; API access,
validation and mapping are isolated from UI components.

## Quality and security

- `npm audit` is expected to report zero vulnerabilities.
- Dependencies are grouped in weekly Dependabot pull requests.
- Repository segments are validated before building the GitHub API URL.
- API responses are validated and avatars are restricted to
  `https://avatars.githubusercontent.com`.
- CI runs audit, lint, typecheck, tests with coverage and a production build on every
  push and pull request to `develop`.
- The production build is deployed to GitHub Pages from `develop`.

## Demo

![](demo.gif)
