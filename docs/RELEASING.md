# Releasing

This document describes the release process for Auto.

## Versioning

Auto follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backward compatible manner
- **PATCH**: Backward compatible bug fixes

Update the version in `package.json` before starting the release process.

## Pre-Release Checklist

- [ ] All tests pass (`npm test`)
- [ ] Type-checking passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version in package.json is updated
- [ ] No TODOs or placeholder code remain
- [ ] No debug code or console.log statements
- [ ] Dependencies are up to date and secure

## Building the Extension

### 1. Clean Previous Builds

```bash
npm run clean
```

### 2. Install Dependencies

```bash
npm install
```

This ensures a clean dependency tree with the lockfile.

### 3. Type-Check

```bash
npm run typecheck
```

Verify no TypeScript errors.

### 4. Lint

```bash
npm run lint
```

Verify no linting errors.

### 5. Compile

```bash
npm run compile
```

Generate JavaScript output in `out/`.

### 6. Run Tests

```bash
npm test
```

Verify all tests pass.

### 7. Package

```bash
npm run package
```

This will:
- Compile the extension
- Run vsce packaging
- Generate `dist/autosemicolon-X.Y.Z.vsix`

## Validating the VSIX

### 1. Check File Exists

```bash
ls -lh dist/
```

Verify the `.vsix` file exists and has a reasonable size.

### 2. Inspect Contents

```bash
cd dist
unzip -l autosemicolon-1.0.0.vsix
```

Verify the package contains:
- `extension/` directory with compiled JavaScript
- `package.json` with correct metadata
- Icon file
- No source TypeScript files
- No test files
- No development dependencies

### 3. Test Installation Locally

```bash
code --install-extension dist/autosemicolon-1.0.0.vsix
```

Install the extension in your VS Code.

### 4. Test in Extension Development Host

1. Uninstall any existing version
2. Install the new `.vsix`
3. Open a test file in a supported language
4. Test automatic insertion
5. Verify commands work
6. Check settings
7. Enable debug logging and verify output

### 5. Test Uninstallation

```bash
code --uninstall-extension live-by-unix.autosemicolon
```

Verify clean uninstallation.

## GitHub Release

### 1. Tag the Release

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 2. Create GitHub Release

1. Go to https://github.com/live-by-unix/autosemicolon/releases
2. Click "Draft a new release"
3. Select the tag you just pushed
4. Title: `Auto v1.0.0`
5. Description: Copy relevant sections from CHANGELOG.md
6. Attach the `.vsix` file as an asset
7. Click "Publish release"

### 3. Update CHANGELOG.md

Add a new `[Unreleased]` section at the top for the next version.

## VS Code Marketplace Publishing

### Prerequisites

- Publisher account: `live-by-unix`
- Publisher verified with VS Code Marketplace
- Personal Access Token (PAT) for vsce

### Publishing

```bash
vsce publish
```

Or with a specific version:
```bash
vsce publish minor
```

This will:
- Build the extension
- Package it
- Publish to the VS Code Marketplace
- Require your PAT for authentication

### Verify Marketplace Listing

1. Go to https://marketplace.visualstudio.com/items?itemName=live-by-unix.autosemicolon
2. Verify the listing is updated
3. Check version, description, and screenshots
4. Test installing from the marketplace

## Rollback Procedure

If a critical issue is discovered after release:

### 1. Unpublish from Marketplace

```bash
vsce unpublish live-by-unix.autosemicolon
```

**Warning**: This is irreversible and should only be done for critical issues.

### 2. Yank the GitHub Release

1. Go to the release on GitHub
2. Delete the release (not the tag)
3. Optionally delete the tag: `git tag -d v1.0.0 && git push origin :refs/tags/v1.0.0`

### 3. Fix the Issue

- Fix the bug
- Update version to patch release (e.g., 1.0.1)
- Rebuild and retest
- Release new version

### 4. Communicate

- Update the issue with rollback information
- Post in discussions if users are affected
- Update README with known issues if needed

## CI/CD Automation

The GitHub Actions workflow (`.github/workflows/release.yml`) automates:

- Running tests on all platforms
- Building the extension
- Creating the `.vsix`
- Uploading as a GitHub Release asset (requires manual trigger)

### Manual Trigger

1. Go to GitHub Actions
2. Select "Release" workflow
3. Click "Run workflow"
4. Select the version/tag
5. Run

## Post-Release Tasks

- [ ] Update website or documentation links if version-specific
- [ ] Announce release in discussions
- [ ] Monitor issues for any release-specific problems
- [ ] Update any integration tests if behavior changed
- [ ] Plan next version based on feedback

## Troubleshooting Releases

### vsce Authentication Error

```
Error: Authentication failed
```

**Solution**:
- Create a new PAT in your Azure DevOps account
- Set as environment variable: `VSCE_PAT`
- Or pass with: `vsce publish --pat YOUR_TOKEN`

### Package Size Too Large

VS Code Marketplace has size limits. If your package is too large:

- Remove unnecessary files from `.vscodeignore`
- Exclude large assets
- Minimize dependencies

### Validation Fails

If vsce validation fails:

- Check `package.json` syntax
- Verify all required fields are present
- Check icon dimensions (must be 128x128)
- Verify license metadata

### Marketplace Rejection

If the marketplace rejects the extension:

- Review marketplace policies
- Check publisher verification status
- Verify extension category and content
- Ensure no prohibited content

## Release Notes Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature 1
- New feature 2

### Changed
- Changed behavior 1
- Updated dependency 1

### Fixed
- Fixed bug 1
- Fixed bug 2

### Removed
- Deprecated feature 1

### Security
- Security fix 1

### Known Issues
- Known issue 1
```

## Dependency Updates

Before releasing, check for dependency updates:

```bash
npm outdated
```

Update if necessary:

```bash
npm update
npm audit fix
```

For major version updates, test thoroughly:
1. Update the dependency
2. Run all tests
3. Manual testing
4. Check for breaking changes in dependency changelog

## Platform-Specific Testing

Test on all supported platforms if possible:

- **macOS**: Primary development platform
- **Windows**: Test in Windows VM or via GitHub Actions
- **Linux**: Test via GitHub Actions or Linux VM

Report platform-specific issues in the release notes if known limitations exist.
