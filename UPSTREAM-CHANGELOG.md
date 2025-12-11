# XX Network Upstream Modifications Changelog

This document tracks all modifications made to the upstream [polkadot-js/apps](https://github.com/polkadot-js/apps) codebase for the XX Network Wallet.

**Purpose**: Identify customizations during upstream merges and understand conflict-prone areas.

---

## Merge History

### 2025-12-10: Upstream Sync (polkadot-js/apps v0.169.2)

**Version Jump**: v0.122.3 → v0.169.2 (47 minor releases, ~3 years of development)

**Files Changed**: ~4,100+ files

**Conflicts Resolved**: 1,492 files

**Strategy**: Take upstream for most files, preserve XX Network customizations for critical files.

#### Major Upstream Features Added

**Polkadot 2.0 / Coretime**:
- Full Coretime UI for broker/sales interface
- Relay chain coretime overview and sales pages
- Core renewal tracking and region info display

**Governance Improvements**:
- OpenGov v2 with abstain voting support
- Referenda track filters and fellowship support
- Improved voting modals with all type values
- External links for Subsquare and Polkassembly

**Identity & People Chain**:
- Identity lookup from People system parachains
- `isPeopleForIdentity` flag support for parachains

**Staking Enhancements**:
- Better staking overview UI
- Async feedback for staking operations
- Post-AHM (Asset Hub Migration) validator display
- Improved session keys UX
- Remove expired votes feature

**Asset & Treasury**:
- Fee payment with sufficient (non-native) assets
- Enhanced non-native asset balance display
- Treasury `spendLocal` support
- Improved teleport/XCM features

**Developer Experience**:
- Scheduler split into separate app
- Chopsticks local fork integration for testing
- Light client (Substrate Connect) support
- Command center UI component
- Playground code runs in iframe sandbox

**Multisig Improvements**:
- Export multisig as JSON
- Better proxy account support
- Improved call data field handling

#### Breaking Changes

| Change | Before | After |
|--------|--------|-------|
| Node.js | >=14.0.0 | >=18.14 |
| Yarn | 3.2.4 | 4.6.0 |
| Module System | CommonJS | ES Modules (`"type": "module"`) |
| ESLint Config | `.eslintrc.cjs` | `eslint.config.js` (flat config) |
| Jest Config | `jest.config.cjs` | Removed (uses `@polkadot/dev`) |
| Babel | `babel.config.cjs` | Removed (native ESM) |
| @polkadot/api | v9.14.2 | v16.5.3 |
| Electron | v21 | v28 |
| Import Style | `./file` | `./file.js` |

#### Dependency Updates

| Package | Old | New |
|---------|-----|-----|
| @polkadot/api | 9.14.2 | 16.5.3 |
| @polkadot/common | - | 13.5.9 |
| @polkadot/wasm-crypto | - | 7.5.4 |
| @polkadot/extension | - | 0.62.6 |
| @polkadot/dev | 0.67.173 | 0.83.3 |
| electron | 21.3.3 | 28.0.0 |
| electron-builder | 23.6.0 | 24.10.0 |
| TypeScript target | ES2019 | ES2022 |

#### New Chains Added (Notable)

- Analog Timechain
- Autonomys (mainnet + EVM)
- Bittensor
- zkVerify + VFlow
- Torus
- Commune AI
- Many Paseo testnet parachains

#### Files Removed by Upstream

- `.eslintrc.cjs` → `eslint.config.js`
- `babel.config.cjs` (no longer needed)
- `jest.config.cjs`, `jest-ci.config.cjs`, `jest-slow.config.cjs`
- `jest/globalSetup.cjs`, `jest/globalTeardown.cjs`, `jest/setupEnv.cjs`
- `packages/apps-config/LICENSE` (consolidated)
- Various deprecated chain configs (Rococo relay removed)

#### XX Network Customizations Preserved

| Area | Files | Action |
|------|-------|--------|
| Chain Endpoints | `production.ts`, `testing.ts` | Merged: took upstream + added XX endpoints |
| Logos | `xxnetworkSVG.ts` | Created new generated file |
| React API | `Api.tsx`, `package.json` | Merged: took upstream + added XX imports/deps |
| React Hooks | `types.ts`, `useAccountInfo.ts` | Merged: took upstream + added cmixId support |
| React Components | `AddressInfo.tsx`, `Sidebar.tsx` | Merged: took upstream + added cmixId display |
| Page Staking | 9 files (SetCmixId, TransferCmixId, etc.) | Kept ours (extensive XX modifications) |
| Page Accounts | `package.json`, `IdentityMain.tsx` | Merged: took upstream + added XX deps/blurb |
| Translations | `app-accounts.json`, `app-staking.json`, `translation.json` | Kept ours (XX-specific strings) |

**Import Extension Updates**: Updated relative imports from `./file` to `./file.js` in kept files to match upstream convention.

**Files Deleted by Upstream** (now using new config format):
- `.eslintrc.cjs`
- `babel.config.cjs`
- Various jest config files

---

### 2025-12-11: Post-Merge Fixes (v0.169.2-xx-2)

**Issues Fixed**:

#### Staking Page - Stake Values Not Displaying

**Problem**: Own stake, other stake, and total stake columns on the Targets page showed values only in tooltips (via HorizontalBarChart), not directly in table cells.

**Root Cause**: The `HorizontalBarChart` component rendered a progress bar with tooltip-only values.

**Fix**: Modified `packages/page-staking/src/Targets/Validator.tsx` to render `FormatBalance` components directly in table cells instead of using the bar chart.

| File | Change |
|------|--------|
| `Targets/Validator.tsx` | Replaced `<HorizontalBarChart>` with direct `<FormatBalance>` cells for bondOwn and bondOther |

#### Commission Column Sorting Not Working

**Problem**: Clicking the commission column header on the Validators Overview page did not sort by commission.

**Root Cause**: Bug in `sort` callback - used closure variable `sortBy` instead of parameter `key`.

**Fix**:
```typescript
// Before (broken)
setSortState((state) => ({
  sortBy,  // Bug: captures stale closure value
  sortFromMax: state.sortBy === key ? !state.sortFromMax : state.sortFromMax
}));

// After (fixed)
setSortState((state) => ({
  sortBy: key,  // Correctly uses the clicked sort type
  sortFromMax: state.sortBy === key ? !state.sortFromMax : state.sortFromMax
}));
```

| File | Change |
|------|--------|
| `Validators/CurrentList.tsx` | Fixed `sort` callback to use `key` parameter instead of `sortBy` closure variable |

#### ESM Module Resolution

**Problem**: Custom derives weren't loading due to missing `.js` extensions on relative imports.

**Fix**: Added `.js` extensions to all relative imports in custom-derives package.

| File | Change |
|------|--------|
| `custom-derives/src/index.ts` | `./staking/index` → `./staking/index.js` |
| `custom-derives/src/staking/index.ts` | `./query` → `./query.js`, `./stakerRewards` → `./stakerRewards.js` |
| `custom-derives/src/xxCustody/index.ts` | `./nominatingCustodyAccounts` → `./nominatingCustodyAccounts.js` |
| `custom-derives/src/xxCustody/nominatingCustodyAccounts.ts` | `../types/index` → `../types/index.js` |
| `custom-derives/src/types/augment.ts` | `./index` → `./index.js` |

#### styled-components Transient Props Warnings

**Problem**: React warnings about invalid DOM props (`visible`, `color`, `isCommissionReducing`).

**Fix**: Changed to transient props (prefixed with `$`) per styled-components v5+ convention.

| File | Change |
|------|--------|
| `Targets/CommissionHover.tsx` | `visible` → `$visible`, `color` → `$color`, `isCommissionReducing` → `$isCommissionReducing` |
| `Targets/HorizontalBarChart.tsx` | `visible` → `$visible`, `color` → `$color` |

#### Upstream API Compatibility

**Problem**: Upstream changed from `withExposure` to `withExposureErasStakersLegacy` flag.

**Fix**: Support both flags for backward compatibility.

| File | Change |
|------|--------|
| `custom-derives/src/staking/query.ts` | Added `withExposureErasStakersLegacy` flag support, returns both `exposure` and `exposureEraStakers` fields |
| `page-staking/src/useSortedTargets.ts` | Uses both `withExposure` and `withExposureErasStakersLegacy` flags |

#### Type Import Updates

**Problem**: Deprecated type imports from `@polkadot/types/lookup`.

**Fix**: Updated to use `@polkadot/types/interfaces`.

| File | Change |
|------|--------|
| `custom-derives/src/staking/query.ts` | `Exposure`, `Nominations`, `StakingLedger`, `ValidatorPrefs` from interfaces |
| `custom-derives/src/staking/stakerRewards.ts` | `StakingLedger` from interfaces |

#### Page Title Branding

**Problem**: Page title showed "Polkadot/Substrate Portal" instead of "xx network portal".

**Fix**: Updated webpack configs to use correct branding.

| File | Change |
|------|--------|
| `apps/webpack.config.cjs` | `PAGE_TITLE: 'xx network portal'` |
| `apps/webpack.serve.cjs` | `PAGE_TITLE: 'xx network portal'` |
| `apps-electron/webpack.renderer.cjs` | `PAGE_TITLE: 'xx network portal'` |

#### On-Chain Identity Disabled

**Problem**: "Set on-chain identity" menu option not showing for XX Network accounts.

**Root Cause**: Upstream added a `isPeopleForIdentity` system where relay chains don't have identity enabled by default (it's expected to be on a People parachain). XX Network uses the identity pallet directly on the relay chain.

**Fix**: Added `isPeopleForIdentity: false` to XX Network endpoint configs to enable the local identity pallet.

| File | Change |
|------|--------|
| `apps-config/src/endpoints/production.ts` | Added `isPeopleForIdentity: false` to xxnetwork endpoint |
| `apps-config/src/endpoints/testing.ts` | Added `isPeopleForIdentity: false` to xxnetwork testnet endpoint |

#### Staking Tab Re-enabled

**Problem**: Staking tab was not appearing in navigation after upstream merge.

**Fix**: Restored staking routes in apps-routing.

| File | Change |
|------|--------|
| `apps-routing/src/staking.ts` | Re-enabled staking page routes and sub-routes |

#### Sleeve (Quantum-Secure) Account Generation

**Problem**: Sleeve account generation wizard was not showing up.

**Fix**: Fixed the Generate account flow to properly display sleeve generation steps.

| File | Change |
|------|--------|
| `page-accounts/src/Generate/Steps/Step1.tsx` | Fixed sleeve generation step |
| `page-accounts/src/Generate/Steps/Step2.tsx` | Fixed sleeve generation step |
| `page-accounts/src/Generate/Steps/Step3.tsx` | Fixed sleeve generation step |
| `page-accounts/src/Generate/index.tsx` | Fixed generate flow |
| `page-accounts/src/index.tsx` | Added sleeve account support |

#### Validator Charts Fixed

**Problem**: Validator query charts (Points, Preferences, Rewards, Stake) were broken after upstream merge.

**Fix**: Added custom `ownExposures` derive and fixed chart components.

| File | Change |
|------|--------|
| `custom-derives/src/staking/ownExposures.ts` | New custom derive for validator exposure history |
| `custom-derives/src/staking/index.ts` | Export ownExposures |
| `page-staking/src/Query/ChartPoints.tsx` | Fixed chart component |
| `page-staking/src/Query/ChartPrefs.tsx` | Fixed chart component |
| `page-staking/src/Query/ChartRewards.tsx` | Fixed chart component |
| `page-staking/src/Query/ChartStake.tsx` | Fixed chart component |

#### Dwellir RPC Endpoint Updated

**Fix**: Updated Dwellir RPC endpoint URL.

| File | Change |
|------|--------|
| `apps-config/src/endpoints/production.ts` | `wss://xxnetwork-rpc.n.dwellir.com` |

#### Simplified RPC Endpoint Sidebar

**Problem**: Too many RPC endpoint options in the sidebar dropdown.

**Fix**: Thinned down the endpoint list to show only XX Network endpoints.

| File | Change |
|------|--------|
| `apps-config/src/endpoints/index.ts` | Simplified to only show XX Network endpoints |
| `apps/src/Endpoints/index.tsx` | Simplified endpoint UI |

---

## [Custom Packages Added]

### @xxnetwork/custom-derives
Custom blockchain derives for XX Network-specific functionality.

| File | Description |
|------|-------------|
| `packages/custom-derives/package.json` | Package definition |
| `packages/custom-derives/src/index.ts` | Main export combining all derives |
| `packages/custom-derives/src/staking/index.ts` | Staking derives export |
| `packages/custom-derives/src/staking/query.ts` | Custom staking query with cmixId transformation |
| `packages/custom-derives/src/staking/stakerRewards.ts` | Modified rewards calculation with custody support |
| `packages/custom-derives/src/xxCustody/index.ts` | Custody derives export |
| `packages/custom-derives/src/xxCustody/nominatingCustodyAccounts.ts` | Custody account nomination derive |
| `packages/custom-derives/src/types/index.ts` | CustodyAccount type definitions |
| `packages/custom-derives/src/types/augment.ts` | API type augmentation for derives |

---

## [Dependencies Added]

| Package | Location | Purpose |
|---------|----------|---------|
| `@xxnetwork/types` | `packages/react-api/package.json` | XX Network type definitions |
| `@xxnetwork/wasm-crypto` | `packages/page-accounts/package.json` | XX Network cryptographic functions |
| `@xxnetwork/custom-derives` | `packages/react-api/package.json` | Custom derives (internal) |

---

## [Chain Configuration]

### Endpoints
| File | Modification |
|------|--------------|
| `packages/apps-config/src/endpoints/production.ts` | XX Network mainnet endpoints (`wss://rpc.xx.network`, `wss://xxnetwork-rpc.dwellir.com`) |
| `packages/apps-config/src/endpoints/testing.ts` | XX Network test endpoint (`wss://test.xxlabs.net`) |

### Branding & Logos
| File | Modification |
|------|--------------|
| `packages/apps-config/src/ui/logos/chains/generated/xxnetworkSVG.ts` | XX Network chain logo (base64 embedded) |
| `packages/apps-config/src/ui/logos/chains/index.ts` | Logo exports |

---

## [cMix Node ID Features]

### New Components
| File | Description |
|------|-------------|
| `packages/react-components/src/CmixAddress.tsx` | Display cMix node IDs with dashboard links |
| `packages/react-components/src/InputCmixAddress.tsx` | Input field for 256-bit hex cMix IDs |
| `packages/react-components/src/index.tsx` | Component exports (lines 31, 59) |

### Staking Modals
| File | Description |
|------|-------------|
| `packages/page-staking/src/Actions/Account/SetCmixId.tsx` | Modal for validators to set cMix ID on-chain |
| `packages/page-staking/src/Actions/Account/TransferCmixId.tsx` | Modal to transfer cMix ID between stash accounts |
| `packages/page-staking/src/Actions/Account/index.tsx` | Integration of cMix modals (lines 94-112) |

### Validator Display
| File | Description |
|------|-------------|
| `packages/page-staking/src/Validators/Address/index.tsx` | Display cMix ID for validators |
| `packages/page-staking/src/Targets/Validator.tsx` | cMix ID in validator targets |

---

## [Custody Account System]

### Custom Derives
| File | Description |
|------|-------------|
| `packages/custom-derives/src/xxCustody/nominatingCustodyAccounts.ts` | Query custody accounts and nominations |
| `packages/custom-derives/src/types/index.ts` | `CustodyAccount`, `DeriveCustodyAccounts` types |

### Hooks
| File | Description |
|------|-------------|
| `packages/react-hooks/src/useTeamMultipliers.ts` | Calculate team multiplier bonuses from custody |

### Staking Integration
| File | Description |
|------|-------------|
| `packages/custom-derives/src/staking/stakerRewards.ts` | Custody-backed stake in reward calculations |
| `packages/page-staking/src/useSortedTargets.ts` | Team multiplier integration |
| `packages/page-staking/src/Targets/Summary.tsx` | Custody summary information |
| `packages/page-staking/src/Nominators/index.tsx` | Custody account references |

---

## [Staking Modifications]

### Type Extensions
| File | Modification |
|------|--------------|
| `packages/page-staking/src/types.ts` | `cmixId` in ValidatorInfo, `ExposureWithCustody`, `rankTeamMultiplier`, `bondTotalWithTM` |
| `packages/custom-derives/src/types/augment.ts` | `cmixId` in DeriveStakingQuery |

### Custom Derives
| File | Modification |
|------|--------------|
| `packages/custom-derives/src/staking/query.ts` | `transformCmixAddress()` - H256 to base64, cmixId in query results |
| `packages/custom-derives/src/staking/stakerRewards.ts` | `exposure.custody` field in reward calculations |

---

## [UI/Component Changes]

### Account Display
| File | Modification |
|------|--------------|
| `packages/react-components/src/AddressInfo.tsx` | cmixId display via `renderLedgerInfo()` |
| `packages/react-components/src/AccountSidebar/Sidebar.tsx` | cmixId prop from useAccountInfo |
| `packages/react-components/src/AccountSidebar/SidebarEditableSection.tsx` | cmixId display handling |
| `packages/page-accounts/src/modals/IdentityMain.tsx` | Blurb field for cMix dashboard |

---

## [API Integration]

| File | Modification |
|------|--------------|
| `packages/react-api/src/Api.tsx` | Import `@xxnetwork/types` (line 4), `@xxnetwork/custom-derives/types/augment` (line 5), custom derives (line 14), default wallet link (line 92) |

---

## [React Hooks Modifications]

| File | Modification |
|------|--------------|
| `packages/react-hooks/src/useAccountInfo.ts` | cmixId field in account info |
| `packages/react-hooks/src/types.ts` | cmixId type support |
| `packages/react-hooks/src/useTeamMultipliers.ts` | Team multiplier calculations |
| `packages/react-hooks/src/useWeight.ts` | XX Network weight calculations |
| `packages/react-hooks/src/useTotalStakeableIssuance.ts` | XX Network staking calculations |
| `packages/react-hooks/src/useIdealInterest.ts` | Interest rate calculations |
| `packages/react-hooks/src/useInflationParams.ts` | Inflation parameters |

---

## [Claims Page]

| File | Description |
|------|-------------|
| `packages/page-claims/src/index.tsx` | Main claims functionality |
| `packages/page-claims/src/util.ts` | XX Network claims utilities |
| `packages/page-claims/src/Statement.tsx` | Claims statement display |
| `packages/page-claims/src/wagmi_config.ts` | Web3 wallet configuration |
| `packages/page-claims/src/usePolkadotPreclaims.ts` | Preclaim verification |

---

## [Documentation]

| File | Modification |
|------|--------------|
| `packages/page-accounts/src/md/basic.md` | XX Network existential deposit explanation (1 XX) |

---

## [High Conflict Risk Files]

These files are most likely to conflict during upstream merges:

```
packages/apps-config/src/endpoints/production.ts
packages/apps-config/src/endpoints/testing.ts
packages/apps-config/src/ui/logos/index.ts
packages/react-api/src/Api.tsx
packages/react-components/src/index.tsx
packages/react-hooks/src/types.ts
packages/page-staking/src/types.ts
packages/page-staking/src/Actions/Account/index.tsx
packages/page-staking/src/useSortedTargets.ts
```

---

## Support

For questions or issues: https://forum.xx.network
