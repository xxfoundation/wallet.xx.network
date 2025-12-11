# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XX Network Wallet - A fork of Polkadot Apps customized for the XX Network blockchain. Provides browser-based and Electron desktop interfaces for account management, staking, governance, and blockchain interaction.

## Common Commands

```bash
# Development
yarn start              # Start dev server (localhost:3000)
yarn start:electron     # Start Electron app in dev mode

# Building
yarn build              # Full production build (i18n + code)
yarn build:code         # Build code only
yarn build:electron     # Build Electron app for all platforms

# Testing
yarn test               # Run fast tests (excludes slow tests)
yarn test:all           # Run all tests including slow tests
yarn test:one <path>    # Run specific test file

# Linting
yarn lint               # ESLint and TypeScript checks

# Cleaning
yarn clean              # Clean all build artifacts
```

## Architecture

**Monorepo Structure** (Yarn workspaces with ~45 packages under `/packages`):

- **`apps/`** - Main web app entry point, routing, layout shell
- **`apps-electron/`** - Electron desktop wrapper (main/renderer process)
- **`apps-config/`** - Chain configuration, endpoints, type definitions, settings
- **`apps-routing/`** - Route definitions for all pages

**Feature Pages** (`page-*` packages):
Each feature (accounts, staking, explorer, governance, etc.) is a separate package following the pattern:
```
page-feature/src/
├── index.tsx       # Main component
├── modals/         # Modal dialogs
├── types.ts        # TypeScript types
├── translate.ts    # i18n setup
└── util.tsx        # Utilities
```

**Shared Libraries** (`react-*` packages):
- `react-components/` - 120+ styled-components (Button, Input, Table, Modal, etc.)
- `react-hooks/` - Custom hooks for API/state (`useApi`, `useAccounts`, `useCall`, etc.)
- `react-query/` - RxJS Observable-based query components
- `react-api/` - API connection management and context
- `react-signer/` - Transaction signing UI
- `react-params/` - Extrinsic parameter input components

**XX Network Customizations** (`custom-derives/`):
- Custom blockchain derives for staking overrides and xxCustody
- Uses `@xxnetwork/wasm-crypto` for XX-specific cryptography

## Key Technologies

- **React 18** with TypeScript 4.9
- **RxJS** for reactive data flow (Observable-based, not Redux)
- **Styled Components** for CSS-in-JS
- **@polkadot/api** for blockchain interaction
- **i18next** for internationalization (30+ languages)
- **Electron 21** for desktop builds

## Important Patterns

**RxJS Subscriptions**: Data flows through Observables, managed via custom hooks rather than useEffect. The `useCall` hook is the primary pattern for API subscriptions.

**i18n**: Use `t<string>('key')` pattern - keys are auto-extracted by i18next-scanner during build. Translation files live in `packages/apps/public/locales/{lang}/`.

**Type Definitions**: Chain types are defined in `apps-config/src/api/typesBundle.ts` (large file).

**Module Aliases**:
- `@polkadot/apps-*` → core packages
- `@polkadot/app-*` → page packages
- `@polkadot/react-*` → shared libraries
- `@xxnetwork/*` → XX Network custom packages

## File Headers

All source files require:
```typescript
// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
```

## Testing Notes

- Tests use Jest with jsdom and Testing Library
- Slow tests (`*.slow.spec.tsx`) are excluded by default - use `yarn test:all` to include
- Custom crypto setup required for Node.js environment (configured in `jest/setupEnv.cjs`)
