# Auto

Smart, automatic semicolon insertion for C-style programming languages.

Auto automatically inserts semicolons when you type code and the extension confidently determines that a statement is complete. No special keys, no commands, no menus—just type naturally and let Auto handle the punctuation.

## Features

- **Automatic insertion**: Detects completed statements and inserts semicolons without manual intervention
- **Language-aware**: Understands syntax differences between C, C++, C#, JavaScript, TypeScript, Java, PHP, and more
- **Confidence-based**: Only inserts when confident, avoiding ambiguous or incomplete code
- **Configurable**: Per-language settings, confidence modes, and insertion triggers
- **No external dependencies**: Works entirely offline with no AI or network calls
- **Privacy-focused**: No telemetry, no data collection, no external services

## Supported Languages

| Language | Support Level | Enabled by Default |
|----------|--------------|-------------------|
| C | Full | ✓ |
| C++ | Full | ✓ |
| C# | Full | ✓ |
| JavaScript | Partial | ✓ |
| TypeScript | Partial | ✓ |
| Java | Full | ✓ |
| PHP | Full | ✓ |
| Rust | Partial | ✗ |
| Go | Disabled | ✗ |
| Swift | Disabled | ✗ |
| Objective-C | Full | ✓ |
| Objective-C++ | Full | ✓ |

**Support Levels:**
- **Full**: Comprehensive statement detection with high confidence
- **Partial**: Basic support with conservative confidence thresholds
- **Disabled**: Not recommended for automatic insertion (language-specific reasons)

**Note on Go and Swift**: These languages have different approaches to statement termination. Go uses lexical semicolon insertion, and Swift typically doesn't require semicolons. Auto disables automatic insertion for these languages by default to avoid conflicts with language behavior.

## Installation

### From VSIX

Download the latest `.vsix` package from the [GitHub Releases](https://github.com/live-by-unix/autosemicolon/releases) page and install:

```bash
code --install-extension autosemicolon-1.0.0.vsix
```

### From VS Code Marketplace

Search for "Auto" by live-by-unix in the VS Code Extensions marketplace.

## How It Works

Auto analyzes your code as you type using document change events. When you complete a statement:

1. **Detect language**: Identify the current file's programming language
2. **Analyze syntax**: Parse the statement structure and context
3. **Check exclusions**: Skip control structures, declarations, comments, strings, and incomplete code
4. **Calculate confidence**: Evaluate how certain we are that a semicolon is needed
5. **Insert if confident**: Add a semicolon only when confidence exceeds the threshold

### Before and After

**C Code:**
```c
// Before (you type):
int health = 100

// After (Auto inserts):
int health = 100;
```

**C# Code:**
```csharp
// Before:
Console.WriteLine("Hello")

// After:
Console.WriteLine("Hello");
```

**JavaScript Code:**
```javascript
// Before:
const message = "Hello"

// After:
const message = "Hello";
```

**What Auto Won't Change:**
```c
// Control structures (no semicolon added):
if (health > 0)
while (running)
for (int i = 0; i < 10; i++)

// Declarations (no semicolon added):
void myFunction()
class MyClass

// Comments and strings (no semicolon added):
// This is a comment
printf("Hello, world")
```

## Settings

Configure Auto in your VS Code settings (`Ctrl+,` or `Cmd+,`).

### `auto.enabled`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Master enable/disable switch for Auto

### `auto.enabledLanguages`
- **Type**: Array of strings
- **Default**: `[]`
- **Description**: Language identifiers for which Auto is enabled. Empty array means all supported languages are enabled.

Example:
```json
{
  "auto.enabledLanguages": ["c", "cpp", "csharp"]
}
```

### `auto.disabledLanguages`
- **Type**: Array of strings
- **Default**: `[]`
- **Description**: Language identifiers explicitly excluded by the user.

Example:
```json
{
  "auto.disabledLanguages": ["javascript", "typescript"]
}
```

### `auto.confidenceMode`
- **Type**: String
- **Enum**: `"conservative"`, `"balanced"`
- **Default**: `"conservative"`
- **Description**: Insertion confidence mode. Conservative only inserts when semicolon is clearly required.

#### `conservative` (default)
High confidence threshold. Only inserts semicolons when they are clearly required for syntactically correct code. Minimizes false positives.

#### `balanced`
Moderate confidence threshold. Inserts semicolons in more cases, but may occasionally insert where not strictly required.

### `auto.debugLogging`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable detailed diagnostic logging in the Output channel.

### `auto.insertOnNewline`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Insert semicolon when a confidently completed statement is finalized by moving to a new line.

### `auto.insertOnClosingDelimiter`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable safe detection of completed statements after relevant closing delimiters (parentheses, brackets).

## Commands

Access commands via the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- **Auto: Enable** - Enable Auto globally
- **Auto: Disable** - Disable Auto globally
- **Auto: Toggle** - Toggle Auto on/off
- **Auto: Show Status** - Display current Auto status and configuration
- **Auto: Open Settings** - Open Auto settings in VS Code
- **Auto: Show Output Log** - Show the Auto output channel for diagnostics

## Troubleshooting

### Auto isn't inserting semicolons

1. Check that Auto is enabled: run `Auto: Show Status`
2. Verify the language is supported and not in `auto.disabledLanguages`
3. Ensure `auto.confidenceMode` isn't set too conservatively for your code
4. Enable `auto.debugLogging` to see why insertions are being skipped
5. Check the Output channel for diagnostic messages

### Auto is inserting semicolons incorrectly

1. Switch `auto.confidenceMode` to `"conservative"`
2. Disable the problematic language in `auto.disabledLanguages`
3. Report the issue with a code example on [GitHub Issues](https://github.com/live-by-unix/autosemicolon/issues)

### Performance issues

Auto is designed to be lightweight. If you experience lag:
- Disable languages you don't use in `auto.disabledLanguages`
- Disable `auto.insertOnClosingDelimiter` if enabled
- Check for large files (Auto works incrementally but very large files may have slower initial analysis)

## Known Limitations

- **JavaScript/TypeScript**: These languages have automatic semicolon insertion (ASI) rules. Auto is conservative and may not insert in all cases where ASI would apply.
- **Rust**: Rust expressions can be valid without semicolons. Auto uses conservative confidence and is disabled by default.
- **Go/Swift**: Disabled by default due to language-specific semicolon handling.
- **Complex macros**: Preprocessor macros in C/C++ may not be handled correctly.
- **Template-heavy code**: Complex C++ templates may be misclassified.
- **Code inside strings**: Auto attempts to detect string literals but complex nested strings may cause issues.

## Privacy

Auto processes your code entirely locally:

- No network requests during editing
- No telemetry or analytics
- No data sent to external servers
- No AI inference or API keys
- Source code never leaves your computer

For details, see [PRIVACY.md](PRIVACY.md).

## Development

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for:
- Setting up the development environment
- Building and testing
- Adding language support
- Contributing guidelines

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright © 2025 live-by-unix

## Support

- **Issues**: [GitHub Issues](https://github.com/live-by-unix/autosemicolon/issues)
- **Discussions**: [GitHub Discussions](https://github.com/live-by-unix/autosemicolon/discussions)
- **Security**: See [SECURITY.md](SECURITY.md)

---

Made with ❤️ by [live-by-unix](https://github.com/live-by-unix)
