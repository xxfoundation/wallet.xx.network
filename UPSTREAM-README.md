# Upstream Fork Management

This repository is a long-lived fork of [polkadot-js/apps](https://github.com/polkadot-js/apps), customized for the XX Network blockchain.

We use a simplified two-branch model, which provides clear separation while minimizing maintenance overhead. All customizations are documented in:

- [UPSTREAM-CHANGELOG.md](./UPSTREAM-CHANGELOG.md)

## Branching Strategy

```
polkadot-js/apps (upstream repo)
        │
        ▼
   ┌──────────┐
   │ upstream │  ← Pristine mirror of polkadot-js/apps master
   └────┬─────┘
        │ merge (at upstream releases)
        ▼
   ┌────────────┐
   │ xx-network │  ← Main development branch with XX customizations
   └──────┬─────┘
          │
          ▼
     Release tags (v0.122.3-121-x, etc.)
          │
          ▼
     Deployments
```

| Branch | Purpose |
|--------|---------|
| `upstream` | Pristine copy of polkadot-js/apps - **never commit custom changes here** |
| `xx-network` | Main development branch with all XX Network customizations |

## Git Setup

### 1. Add Upstream Remote

```bash
git remote add upstream https://github.com/polkadot-js/apps.git
git fetch upstream
```

### 2. Create Upstream Tracking Branch (first time only)

```bash
# Create local 'upstream' branch from the upstream remote's master
git checkout -b upstream upstream/master

# Push this branch to YOUR origin (xxfoundation repo), not to polkadot-js
git push -u origin upstream
```

### 3. Configure Helpful Git Settings

```bash
# Remember conflict resolutions for repeated merges
git config rerere.enabled true

# Show base version in conflicts (easier to understand)
git config merge.conflictstyle diff3

# Use merge (not rebase) for pulls
git config pull.rebase false
```

### 4. Useful Aliases (optional)

```bash
git config alias.sync-upstream '!git fetch upstream && git checkout upstream && git reset --hard upstream/master && git checkout -'
git config alias.merge-upstream '!git checkout xx-network && git merge upstream --no-ff'
```

## Upstream Sync Workflow

### Step 1: Update the upstream branch

```bash
git checkout upstream
git fetch upstream
git reset --hard upstream/master
git push origin upstream --force-with-lease
```

### Step 2: Merge into xx-network

```bash
git checkout xx-network
git merge upstream --no-ff -m "Merge upstream polkadot-js/apps $(date +%Y-%m-%d)"
```

### Step 3: Resolve Conflicts

Conflicts are expected in files listed in [UPSTREAM-CHANGELOG.md](./UPSTREAM-CHANGELOG.md). When resolving:

- Prefer XX Network customizations for XX-specific features
- Take upstream changes for general improvements
- Test thoroughly after resolution

### Step 4: Test and Push

```bash
yarn install
yarn build
yarn test
git push origin xx-network
```

### Step 5: Create Release Tag (when ready to deploy)

```bash
git tag -a v0.122.3-122-x -m "Release with upstream sync YYYY-MM-DD"
git push origin v0.122.3-122-x
```

## Sync Timing Recommendations

- **Recommended**: Sync at upstream release tags (more stable integration points)
- **Alternative**: Sync monthly or when critical security fixes are released
- **Avoid**: Continuous syncing with upstream master (more churn, less stability)

```bash
# Sync to a specific upstream release
git fetch upstream --tags
git checkout upstream
git reset --hard v0.130.1  # Upstream release tag
git push origin upstream --force-with-lease
```

## Conflict Mitigation

### Use .gitattributes for High-Conflict Files

For files you heavily customize, prefer your version during merges:

```bash
# .gitattributes
packages/apps-config/src/endpoints/production.ts merge=ours
packages/apps-config/src/endpoints/testing.ts merge=ours
```

### Track All Modifications

See [UPSTREAM-CHANGELOG.md](./UPSTREAM-CHANGELOG.md) for a complete list of XX Network modifications. This helps identify which files will likely conflict during upstream merges.

## Support

For questions about this repository or the XX Network Wallet:

- **Forum**: https://forum.xx.network
- **Issues**: Open an issue in this repository for bugs or feature requests
