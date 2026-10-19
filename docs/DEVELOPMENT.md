# Development

This document provides complete instructions for developing Auto.

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: 2.0.0 or higher
- **Visual Studio Code**: 1.96.0 or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/live-by-unix/autosemicolon.git
cd autosemicolon
```

2. Install dependencies:
```bash
npm install
```

This installs:
- TypeScript compiler
- VS Code Extension API types
- ESLint and TypeScript ESLint
- VS Code test runner
- VS Code packaging tool (vsce)

## Project Structure

```
autosemicolon/
├── src/                      # Source code
│   ├── extension.ts          # Extension entry point
│   ├── types/               # TypeScript type definitions
│   ├── configuration/       # Configuration management
│   ├── logging/             # Logging implementation
│   ├── languages/           # Language capability registry
│   ├── detection/           # Syntax analysis
│   ├── insertion/           # Insertion decision engine
│   └── commands/            # VS Code commands
├── test/                    # Tests
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── runTest.ts          # Test runner
├── docs/                    # Documentation
├── assets/                  # Extension assets (icon)
├── .github/                 # GitHub workflows and templates
├── .vscode/                 # VS Code configuration
├── package.json            # Package metadata
├── tsconfig.json           # TypeScript configuration
├── .eslintrc.json          # ESLint configuration
└── README.md               # User documentation
```

## Development Commands

### Building

```bash
npm run compile
```
Compiles TypeScript to JavaScript in the `out/` directory.

```bash
npm run typecheck
```
Type-checks without emitting output (faster for validation).

```bash
npm run watch
```
Watches for file changes and recompiles automatically. Use this during development.

### Linting

```bash
npm run lint
```
Runs ESLint on the source code.

### Testing

```bash
npm test
```
Runs all tests (unit and integration).

```bash
npm run pretest
```
Compiles and lints before testing (used by `npm test` automatically).

### Packaging

```bash
npm run package
```
Builds the extension and packages it as a `.vsix` file in `dist/`.

### Cleaning

```bash
npm run clean
```
Removes build artifacts (`out/` and `dist/` directories).

### Version

```bash
npm run version
```
Displays the current version from package.json.

## Debugging

### Running the Extension in Development

1. Open the project in VS Code
2. Press `F5` or select "Run > Start Debugging"
3. A new VS Code window (Extension Development Host) will open
4. Test the extension in this window

### Debugging with Breakpoints

1. Set breakpoints in your TypeScript source files
2. Press `F5` to launch the Extension Development Host
3. Trigger the code you want to debug
4. Execution will pause at your breakpoints

### Debugging Tests

1. Open `.vscode/launch.json`
2. Select the "Extension Tests" configuration
3. Press `F5` to run tests in debug mode
4. Set breakpoints in test files

### Viewing Logs

1. Enable debug logging: Set `auto.debugLogging` to `true`
2. Run command: `Auto: Show Output Log`
3. View the "Auto" output channel

## Code Style

### TypeScript Guidelines

- Use strict type checking (already configured in tsconfig.json)
- Avoid `any` unless explicitly justified
- Use descriptive variable and function names
- Keep functions focused and single-purpose
- Add JSDoc comments only for public APIs and non-obvious logic
- Follow existing code patterns

### Example

```typescript
// Good
function calculateConfidence(line: string, isComplete: boolean): number {
  if (!isComplete) {
    return 0;
  }
  // Implementation
}

// Avoid
function calc(l: string, c: boolean): any {
  // Implementation
}
```

### Error Handling

- Always handle errors gracefully
- Log errors using the Logger
- Don't let errors crash the extension host
- Use try-catch for operations that may fail

```typescript
try {
  await vscode.workspace.applyEdit(edit);
} catch (error) {
  this.logger.error(`Failed to apply edit: ${error}`);
}
```

## Testing

### Writing Unit Tests

Unit tests test individual functions and classes in isolation.

**Location**: `test/unit/`

**Example**:
```typescript
import * as assert from 'assert';
import { SyntaxAnalyzer } from '../../src/detection/syntaxAnalyzer';

suite('SyntaxAnalyzer Tests', () => {
  let analyzer: SyntaxAnalyzer;

  setup(() => {
    analyzer = new SyntaxAnalyzer();
  });

  test('should detect simple statement', () => {
    const context: DetectionContext = {
      document: 'int x = 5',
      languageId: 'c',
      cursorPosition: 9,
      line: 0,
      column: 9,
      lineText: 'int x = 5'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, true);
  });
});
```

### Writing Integration Tests

Integration tests test the extension with the actual VS Code API.

**Location**: `test/integration/`

**Example**:
```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Integration Tests', () => {
  test('should handle C file', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'c',
      content: 'int x = 5'
    });
    
    await vscode.window.showTextDocument(doc);
    // Test with actual editor
  });
});
```

### Running Tests

```bash
npm test
```

Tests run automatically as part of CI/CD.

## Adding Features

### Adding a New Command

1. Register the command in `package.json`:
```json
"contributes": {
  "commands": [
    {
      "command": "auto.myCommand",
      "title": "Auto: My Command"
    }
  ]
}
```

2. Implement the command in `src/commands/index.ts`:
```typescript
const myCommand = vscode.commands.registerCommand('auto.myCommand', () => {
  // Implementation
});

context.subscriptions.push(myCommand);
```

3. Add tests for the command

4. Update documentation

### Adding a New Setting

1. Add to `package.json`:
```json
"configuration": {
  "properties": {
    "auto.mySetting": {
      "type": "boolean",
      "default": true,
      "description": "My setting description"
    }
  }
}
```

2. Add to Configuration type in `src/types/index.ts`:
```typescript
export interface Configuration {
  // Existing settings
  mySetting: boolean;
}
```

3. Implement in ConfigurationManager
4. Add tests
5. Update docs/CONFIGURATION.md

### Adding Language Support

See [docs/LANGUAGE_SUPPORT.md](LANGUAGE_SUPPORT.md) for detailed instructions.

## Performance Considerations

### Guidelines

- Avoid expensive operations on every keystroke
- Use debouncing for document change handlers
- Analyze only the relevant context, not entire files
- Keep dependencies minimal
- Avoid network calls during editing

### Example Debouncing

```typescript
private debounceTimer: NodeJS.Timeout | null = null;

private handleDocumentChange(event: vscode.TextDocumentChangeEvent): void {
  if (this.debounceTimer) {
    clearTimeout(this.debounceTimer);
  }

  this.debounceTimer = setTimeout(() => {
    this.processChange(event);
  }, 50);
}
```

## Versioning

Auto follows semantic versioning (MAJOR.MINOR.PATCH).

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Update version in `package.json` before releasing.

## Release Process

See [docs/RELEASING.md](RELEASING.md) for the complete release process.

## Troubleshooting Development Issues

### TypeScript Compilation Errors

```bash
npm run typecheck
```
Check for type errors and fix them.

### Linting Errors

```bash
npm run lint
```
Fix ESLint errors. Use `--fix` for auto-fixable issues:
```bash
eslint src --ext ts --fix
```

### Tests Failing

1. Run tests in debug mode
2. Check test output for specific failures
3. Verify test expectations match implementation
4. Fix implementation or update tests (if test was wrong)

### Extension Not Activating

1. Check `activationEvents` in package.json
2. Verify language IDs are correct
3. Check VS Code version compatibility
4. Look for errors in Developer Tools console

### Build Failures

1. Clean build artifacts: `npm run clean`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Node.js version compatibility
4. Verify TypeScript version

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## Questions?

- Open an issue on GitHub
- Start a discussion
- Check existing documentation
