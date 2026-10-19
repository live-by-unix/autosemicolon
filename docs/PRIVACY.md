# Privacy Policy

This document describes the privacy practices of the Auto VS Code extension.

## Data Collection

Auto does **not** collect, transmit, or store any personal data.

### What Auto Does NOT Do

- No telemetry or analytics
- No usage tracking
- No crash reporting
- No user identification
- No IP address logging
- No account registration required
- No cloud services
- No external API calls during normal operation
- No data sent to any server

### What Auto Does Process

Auto processes your source code locally to:

- Detect programming language
- Analyze syntax for statement completion
- Determine where to insert semicolons
- Apply text edits to your documents

This processing happens entirely on your computer. Your source code never leaves your machine.

## Local Processing

All processing is performed locally within the VS Code extension host:

- Syntax analysis runs in your VS Code instance
- Decision logic runs in your VS Code instance
- Text edits are applied directly to your documents
- No external network requests are made
- No background processes communicate with external services

## Logging

Auto includes optional debug logging that can be enabled via the `auto.debugLogging` setting.

When enabled, logs may contain:

- Timestamps
- Language identifiers
- Confidence scores
- Insertion decisions
- Code snippets (the current line being analyzed)

**Important**:
- Debug logging is **disabled by default**
- Logs are stored locally in your VS Code output channel
- Logs are never transmitted
- Logs are cleared when you close VS Code
- You control whether logging is enabled

To enable debug logging:
```json
{
  "auto.debugLogging": true
}
```

## Dependencies

Auto has runtime dependencies specified in `package.json`:

- **@types/vscode**: Type definitions for VS Code API (dev dependency)
- **Other dev dependencies**: TypeScript, ESLint, testing frameworks

**Runtime dependencies**: None

Auto has no runtime dependencies that make network requests or collect data.

## File System Access

Auto accesses the file system only through VS Code's normal document editing APIs:

- Reads document content via VS Code API
- Applies edits via VS Code API
- No direct file system access
- No access to files outside your workspace
- No access to system files or configuration

## Network Access

Auto does **not** make network requests during normal operation.

The only time network access might occur is:

- When you install the extension (from Marketplace or GitHub)
- When checking for extension updates (handled by VS Code, not Auto)

Auto itself does not initiate any network connections.

## Third-Party Services

Auto does not use any third-party services:

- No AI services
- No cloud analysis
- No external parsers
- No CDN usage
- No analytics providers

## Extension Updates

Extension updates are handled by VS Code, not Auto:

- VS Code checks for updates periodically
- VS Code downloads updates from the Marketplace
- Auto has no role in the update process
- Auto does not check for updates itself

## Open Source

Auto is open source software:

- Source code is publicly available on GitHub
- You can review the code at https://github.com/live-by-unix/autosemicolon
- You can build the extension yourself from source
- You can verify exactly what the code does

## Data Retention

Auto does not retain any data:

- No persistent storage
- No database
- No cache of your code
- No history of edits
- Logs are cleared on VS Code exit

## Children's Privacy

Auto is not directed at children under 13 and does not knowingly collect personal information from children.

## Changes to Privacy Policy

If this privacy policy changes, the new policy will be:

- Published in this document
- Noted in the CHANGELOG.md
- Included in the next release

## Contact

For privacy-related questions or concerns:

- Open an issue on GitHub: https://github.com/live-by-unix/autosemicolon/issues
- Review the source code: https://github.com/live-by-unix/autosemicolon

## Compliance

Auto is designed to comply with:

- VS Code Marketplace policies
- Open source best practices
- Minimal data processing principles

## Summary

- No data collection
- No telemetry
- No network requests
- No external services
- All processing local
- Optional debug logging (local only)
- Open source for transparency
- No persistent storage

Your code stays on your computer. Auto just helps you type it faster.
