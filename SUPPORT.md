# Support

This document provides guidance on getting help with Auto.

## Where to Ask Questions

### GitHub Discussions
For general questions, ideas, and discussions:
- [GitHub Discussions](https://github.com/live-by-unix/autosemicolon/discussions)

### GitHub Issues
For bug reports and feature requests:
- [GitHub Issues](https://github.com/live-by-unix/autosemicolon/issues)

## Reporting Bugs

Before reporting a bug, please:

1. Check existing issues to avoid duplicates
2. Verify you're using the latest version
3. Try to reproduce the issue in a minimal example
4. Enable debug logging if relevant (set `auto.debugLogging` to `true`)

### Bug Report Template

When opening an issue, include:

**Title**: Brief description of the bug

**Description**:
- What you were trying to do
- What happened instead
- Expected behavior

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Environment**:
- OS: [e.g., macOS, Windows, Linux]
- VS Code version: [from Help > About]
- Auto version: [from Extensions panel]
- Language: [the programming language you were using]

**Code Example**:
```c
// Minimal code that reproduces the issue
```

**Logs**:
- Output from the Auto Output channel (if debug logging enabled)

**Additional Context**:
- Any other relevant information

## Feature Requests

We welcome feature requests! Please:

1. Check existing issues and discussions
2. Describe the use case clearly
3. Explain why the feature would be valuable
4. Consider implementation complexity
5. Be open to feedback and discussion

### Feature Request Template

**Title**: Brief description of the feature

**Description**:
- What problem does this solve?
- Who would benefit?
- How should it work?

**Proposed Implementation** (if known):
- Technical approach
- Potential challenges

**Alternatives Considered**:
- Other ways to achieve the same goal
- Why this approach is preferred

## Troubleshooting

### Common Issues

#### Auto isn't inserting semicolons

1. Check that Auto is enabled: run `Auto: Show Status`
2. Verify the language is supported
3. Check `auto.disabledLanguages` setting
4. Try enabling debug logging
5. See the Output channel for diagnostic information

#### Auto inserts semicolons incorrectly

1. Switch to conservative mode: `"auto.confidenceMode": "conservative"`
2. Disable the problematic language
3. Report the issue with a code example

#### Performance issues

1. Disable unused languages
2. Disable `auto.insertOnClosingDelimiter`
3. Check for very large files
4. Report the issue with file size and language

#### Extension doesn't activate

1. Check VS Code version (requires 1.96.0 or higher)
2. Check the file's language is supported
3. Look for errors in the Developer Tools console
5. Try reinstalling the extension

## Getting Help

### Documentation

- [README.md](README.md) - General overview and quick start
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture details
- [docs/LANGUAGE_SUPPORT.md](docs/LANGUAGE_SUPPORT.md) - Language-specific information
- [docs/CONFIGURATION.md](docs/CONFIGURATION.md) - Configuration reference
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guide

### Commands

Run these commands from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- `Auto: Show Status` - Check if Auto is enabled and configured
- `Auto: Show Output Log` - View diagnostic logs
- `Auto: Open Settings` - Open Auto settings

### Debug Logging

Enable debug logging to see why Auto is or isn't inserting semicolons:

1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for `auto.debugLogging`
3. Set to `true`
4. Open the Output channel: `Auto: Show Output Log`
5. Reproduce the issue
6. Include the log output in bug reports

## Community Guidelines

- Be respectful and constructive
- Search before asking
- Provide minimal reproducible examples
- Share solutions when you find them
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Contributing

If you'd like to contribute code, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Professional Support

For enterprise support or custom development, please contact the maintainers through GitHub Discussions.
