# Configuration

This document provides a complete reference for all Auto configuration settings.

## Settings Reference

All settings are under the `auto` namespace in VS Code settings.

### `auto.enabled`

**Type**: Boolean  
**Default**: `true`  
**Scope**: User, Workspace, Folder

Master enable/disable switch for Auto. When `false`, Auto will not insert any semicolons regardless of other settings.

**Examples**:
```json
{
  "auto.enabled": false
}
```

**Use Cases**:
- Temporarily disable Auto for a specific project
- Disable for debugging
- Personal preference to disable globally

---

### `auto.enabledLanguages`

**Type**: Array of strings  
**Default**: `[]` (empty array)  
**Scope**: User, Workspace, Folder

Language identifiers for which Auto is enabled. An empty array means all supported languages are enabled (except those in `disabledLanguages`).

**Language Identifiers**:
- `c` - C
- `cpp` - C++
- `csharp` - C#
- `javascript` - JavaScript
- `javascriptreact` - JavaScript React (JSX)
- `typescript` - TypeScript
- `typescriptreact` - TypeScript React (TSX)
- `java` - Java
- `php` - PHP
- `rust` - Rust
- `go` - Go
- `swift` - Swift
- `objective-c` - Objective-C
- `objective-cpp` - Objective-C++

**Examples**:
```json
{
  "auto.enabledLanguages": ["c", "cpp", "csharp"]
}
```

```json
{
  "auto.enabledLanguages": []
}
```

**Use Cases**:
- Enable only specific languages you use
- Enable partial-support languages explicitly (e.g., Rust)
- Language selection for multi-language projects

**Priority**: If `enabledLanguages` is non-empty, only those languages are enabled. If empty, all supported languages are enabled except those in `disabledLanguages`.

---

### `auto.disabledLanguages`

**Type**: Array of strings  
**Default**: `[]` (empty array)  
**Scope**: User, Workspace, Folder

Language identifiers explicitly excluded by the user. These languages will not have automatic semicolon insertion even if they are supported by default.

**Examples**:
```json
{
  "auto.disabledLanguages": ["javascript", "typescript"]
}
```

```json
{
  "auto.disabledLanguages": ["rust"]
}
```

**Use Cases**:
- Disable languages you don't want Auto to touch
- Disable partial-support languages that may be unreliable
- Disable for projects with specific coding standards

**Priority**: `disabledLanguages` takes precedence over `enabledLanguages`. If a language is in both lists, it is disabled.

---

### `auto.confidenceMode`

**Type**: String (enum)  
**Values**: `"conservative"`, `"balanced"`  
**Default**: `"conservative"`  
**Scope**: User, Workspace, Folder

Insertion confidence mode. Controls how confident Auto must be before inserting a semicolon.

#### `conservative`

Requires higher confidence before inserting semicolons. Recommended for most users.

- Confidence threshold: 0.85
- Fewer insertions
- Fewer false positives
- May miss some valid insertion points

**When to use**:
- Default recommendation
- Production code
- When accuracy is more important than coverage
- New to Auto

#### `balanced`

Lower confidence threshold, more insertions.

- Confidence threshold: 0.70
- More insertions
- Slightly higher risk of false positives
- Better coverage

**When to use**:
- Experienced users who understand Auto's behavior
- When you want more aggressive insertion
- Prototyping or rapid development
- After verifying Auto's behavior on your codebase

**Examples**:
```json
{
  "auto.confidenceMode": "conservative"
}
```

```json
{
  "auto.confidenceMode": "balanced"
}
```

---

### `auto.debugLogging`

**Type**: Boolean  
**Default**: `false`  
**Scope**: User, Workspace, Folder

Enable detailed diagnostic logging in the Output channel. When enabled, Auto logs detailed information about its decisions, including why insertions were accepted or rejected.

**What is logged**:
- Statement analysis results
- Confidence scores
- Exclusion reasons
- Insertion decisions
- Edit loop prevention triggers

**How to view logs**:
1. Set `auto.debugLogging` to `true`
2. Run command: `Auto: Show Output Log`
3. View the "Auto" output channel

**Examples**:
```json
{
  "auto.debugLogging": true
}
```

**Use Cases**:
- Debugging why Auto isn't inserting semicolons
- Reporting bugs with detailed information
- Understanding Auto's decision process
- Tuning confidence mode

**Performance Impact**: Minimal, but logs can grow large over time.

---

### `auto.insertOnNewline`

**Type**: Boolean  
**Default**: `true`  
**Scope**: User, Workspace, Folder

Insert semicolon when a confidently completed statement is finalized by moving to a new line.

**Behavior**:
- When `true`: Auto checks for insertion when you press Enter
- When `false`: Auto only checks on other triggers (if implemented)

**Examples**:
```json
{
  "auto.insertOnNewline": true
}
```

**Use Cases**:
- Disable if you want insertion only on specific triggers
- Personal preference for when insertions happen

**Note**: This is the primary insertion trigger in the current implementation.

---

### `auto.insertOnClosingDelimiter`

**Type**: Boolean  
**Default**: `false`  
**Scope**: User, Workspace, Folder

Enable safe detection of completed statements after relevant closing delimiters (parentheses, brackets).

**Behavior**:
- When `true`: Auto checks for insertion after closing `)` or `]`
- When `false`: Only newline-based insertion

**Examples**:
```json
{
  "auto.insertOnClosingDelimiter": false
}
```

**Use Cases**:
- Enable for more aggressive insertion
- Useful for function call patterns like `func(arg)`
- May increase false positives

**Caution**: This setting is experimental and may cause unwanted insertions in some code patterns.

---

## Configuration Examples

### Minimal Configuration (Defaults)

```json
{
  "auto.enabled": true,
  "auto.enabledLanguages": [],
  "auto.disabledLanguages": [],
  "auto.confidenceMode": "conservative",
  "auto.debugLogging": false,
  "auto.insertOnNewline": true,
  "auto.insertOnClosingDelimiter": false
}
```

### C/C++ Only Project

```json
{
  "auto.enabledLanguages": ["c", "cpp"],
  "auto.confidenceMode": "conservative"
}
```

### Web Development (JavaScript/TypeScript)

```json
{
  "auto.enabledLanguages": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "auto.confidenceMode": "conservative",
  "auto.debugLogging": true
}
```

### Disable JavaScript/TypeScript

```json
{
  "auto.disabledLanguages": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### Aggressive Mode

```json
{
  "auto.confidenceMode": "balanced",
  "auto.insertOnClosingDelimiter": true
}
```

### Debugging Mode

```json
{
  "auto.debugLogging": true,
  "auto.confidenceMode": "conservative"
}
```

### Workspace-Specific Configuration

Settings can be overridden at workspace or folder level:

**User settings** (global):
```json
{
  "auto.enabled": true,
  "auto.confidenceMode": "conservative"
}
```

**Workspace settings** (`.vscode/settings.json`):
```json
{
  "auto.confidenceMode": "balanced",
  "auto.disabledLanguages": ["rust"]
}
```

**Folder settings** (deeper `.vscode/settings.json`):
```json
{
  "auto.enabled": false
}
```

---

## Configuration Priority

Settings are evaluated in this order:

1. Folder settings (highest priority)
2. Workspace settings
3. User settings (lowest priority)

For language enable/disable:

1. If `auto.enabled` is `false`, no insertions occur
2. If language is in `auto.disabledLanguages`, it is disabled
3. If `auto.enabledLanguages` is non-empty and language is not in it, it is disabled
4. Otherwise, language is enabled if supported

---

## Changing Configuration

### Via VS Code Settings UI

1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "auto"
3. Modify settings as desired

### Via settings.json

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Run "Preferences: Open User Settings (JSON)"
3. Add or modify `auto.*` settings

### Via Commands

- `Auto: Open Settings` - Opens Auto settings in UI

---

## Validating Configuration

To check your current configuration:

1. Run command: `Auto: Show Status`
2. View the information message showing:
   - Global enabled status
   - Confidence mode
   - Enabled languages
   - Debug logging status

Or enable debug logging and check the Output channel.

---

## Troubleshooting Configuration

### Settings Not Taking Effect

1. Verify settings syntax is correct JSON
2. Check settings file for syntax errors
3. Reload VS Code after changing settings
4. Check if workspace settings override user settings
5. Run `Auto: Show Status` to verify current state

### Language Not Working

1. Check language is supported (see [LANGUAGE_SUPPORT.md](LANGUAGE_SUPPORT.md))
2. Verify language is not in `disabledLanguages`
3. If `enabledLanguages` is non-empty, verify language is in it
4. Check `auto.enabled` is `true`
5. Enable debug logging to see why

### Too Many/Too Few Insertions

1. Adjust `auto.confidenceMode`
2. Enable debug logging to see confidence scores
3. Consider `auto.insertOnClosingDelimiter`
4. Disable problematic languages

---

## Resetting Configuration

To reset to defaults:

1. Open settings.json
2. Remove all `auto.*` entries
3. Reload VS Code

Or use VS Code's "Reset to Default" for individual settings in the Settings UI.
