# Architecture

This document describes the architecture of the Auto extension.

## Overview

Auto is a VS Code extension that automatically inserts semicolons when statements are confidently completed. The architecture is modular, with clear separation of concerns for language handling, syntax analysis, insertion decisions, and configuration.

## Components

### Core Modules

```
src/
├── extension.ts              # Extension entry point and lifecycle
├── types/                    # Shared TypeScript types
│   └── index.ts
├── configuration/            # Configuration management
│   └── manager.ts
├── logging/                  # Logging and diagnostics
│   └── logger.ts
├── languages/                # Language capability registry
│   └── registry.ts
├── detection/                # Syntax analysis and document handling
│   ├── syntaxAnalyzer.ts
│   └── documentHandler.ts
├── insertion/                # Insertion decision engine
│   └── decisionEngine.ts
└── commands/                 # VS Code commands
    └── index.ts
```

## Extension Lifecycle

### Activation

1. User opens a file with a supported language
2. VS Code activates the extension based on `activationEvents` in `package.json`
3. `activate()` function in `extension.ts` is called
4. Initializes:
   - Logger singleton
   - Configuration manager singleton
   - Document handler with change listener
   - Commands registration
5. Returns disposable for cleanup

### Deactivation

1. Extension is deactivated (VS Code closes, extension disabled)
2. `deactivate()` function is called
3. Disposes:
   - Document handler (removes change listener)
   - Configuration manager (removes config listener)
   - Logger (disposes output channel)

## Event Flow

### Document Change Processing

```
User types in editor
    ↓
vscode.workspace.onDidChangeTextDocument fires
    ↓
DocumentHandler.handleDocumentChange()
    ↓
Check: Supported language?
    ↓ No
Ignore
    ↓ Yes
Check: Language enabled in config?
    ↓ No
Ignore
    ↓ Yes
Check: Auto globally enabled?
    ↓ No
Ignore
    ↓ Yes
Build DetectionContext (document, position, context)
    ↓
Debounce (50ms) to avoid rapid successive analysis
    ↓
SyntaxAnalyzer.analyze(context)
    ↓
Apply language-specific rules
    ↓
Check exclusions (comments, strings, control structures)
    ↓
Determine statement completeness
    ↓
Calculate confidence score
    ↓
Return StatementAnalysis
    ↓
DecisionEngine.decide(analysis, context, config)
    ↓
Check for edit loop prevention
    ↓
Check confidence threshold
    ↓
If confident → Insert semicolon
    ↓
Apply WorkspaceEdit
    ↓
Update document
```

## Detection Pipeline

### Syntax Analyzer

The `SyntaxAnalyzer` class performs syntactic analysis:

1. **Language Capability Lookup**
   - Retrieve language-specific rules from registry
   - Check if language is supported and enabled
   - Get confidence threshold and exclusions

2. **Quick Exclusions**
   - Empty lines
   - Existing semicolons
   - Comments (single-line and block)
   - String literals (including template strings)
   - Preprocessor directives

3. **Control Structure Detection**
   - Check for keywords: `if`, `else`, `for`, `while`, etc.
   - Check for declarations: `function`, `class`, `struct`, etc.
   - Check for block boundaries: `{`, `}`

4. **Statement Completeness**
   - Check for trailing operators (`+`, `-`, `=`, etc.)
   - Check for unmatched parentheses
   - Check for unmatched brackets
   - Check for multiline continuations (comma, open paren)
   - Check for following control flow (`else`, `catch`, `finally`)

5. **Confidence Calculation**
   - Base confidence: 0.7
   - Bonus for assignment (`=`): +0.1
   - Bonus for function call (`(...)`): +0.1
   - Bonus for control flow (`return`, `break`, etc.): +0.15
   - Bonus for typed declaration: +0.1
   - Capped at 1.0

### Decision Engine

The `DecisionEngine` class makes the final insertion decision:

1. **Edit Loop Prevention**
   - Track last edit position and timestamp
   - Reject if same position edited within 100ms
   - Prevents infinite loops from extension's own edits

2. **Configuration Checks**
   - Global enable/disable
   - Language enable/disable
   - Confidence mode (conservative vs balanced)

3. **Analysis Validation**
   - Require semicolon for language?
   - Already has semicolon?
   - Statement complete?
   - Confidence above threshold?

4. **Insertion Point Calculation**
   - Convert line/column to absolute document position
   - Insert at end of statement (before whitespace)

## Language Capability Model

Each language in the registry defines:

- `languageId`: VS Code language identifier
- `enabledByDefault`: Whether to enable by default
- `statementTerminator`: Character used to terminate statements
- `requiresSemicolon`: Whether the language requires semicolons
- `supportLevel`: `'full' | 'partial' | 'disabled'`
- `knownExclusions`: Keywords and patterns to exclude
- `confidenceThreshold`: Minimum confidence for insertion

### Support Levels

**Full**: Comprehensive support, high accuracy, enabled by default
- C, C++, C#, Java, PHP, Objective-C, Objective-C++

**Partial**: Basic support with conservative thresholds
- JavaScript, TypeScript, React variants (due to ASI rules)
- Rust (due to expression semantics)

**Disabled**: Not recommended for automatic insertion
- Go (lexical semicolon insertion conflicts)
- Swift (semicolons rarely required)

## Configuration Management

The `ConfigurationManager` class:

- Loads configuration from VS Code settings
- Listens for configuration changes
- Provides typed access to settings
- Validates language enable/disable logic

Settings hierarchy:
1. Global enable/disable (`auto.enabled`)
2. Explicitly enabled languages (`auto.enabledLanguages`)
3. Explicitly disabled languages (`auto.disabledLanguages`)
4. Per-language capability defaults

If `enabledLanguages` is empty, all supported languages are enabled except those in `disabledLanguages`.

## Logging

The `Logger` class:

- Singleton pattern
- VS Code Output channel
- Log levels: debug, info, warn, error
- Debug logging only enabled when configured
- Timestamps on all messages
- No sensitive data in logs

## Error Handling

Error handling strategy:

1. **Document Change Errors**: Caught and logged, don't crash extension
2. **Configuration Errors**: Use defaults, log warning
3. **Edit Application Failures**: Log and continue
4. **Unknown Languages**: Silently ignore
5. **Parse Errors**: Conservative (don't insert)

## Performance Design

Performance optimizations:

1. **Incremental Analysis**: Only analyze the changed line
2. **Debouncing**: 50ms delay to batch rapid changes
3. **Quick Exclusions**: Fast checks before deep analysis
4. **No Whole-File Scanning**: Process only relevant context
5. **Lazy Initialization**: Singletons created on first use
6. **No Network Requests**: All processing local
7. **No External Dependencies**: Runtime has only VS Code API

## Thread Safety

- VS Code extension host is single-threaded
- No async operations in critical path
- Debounce timer is the only concurrent operation
- Document versions prevent race conditions with edits

## Extension Limits

Known architectural limitations:

1. **No Language Server Integration**: Doesn't use LSP for semantic analysis
2. **Token-Level Only**: No full AST parsing
3. **Line-Local**: Only analyzes current line and immediate neighbors
4. **No Cross-File Analysis**: Each file analyzed independently
5. **No Type Information**: Doesn't use type checking

These are intentional tradeoffs for:
- Performance
- Simplicity
- No external dependencies
- Works without language servers

## Future Enhancements

Potential improvements:

1. **Language Server Integration**: Use LSP for semantic analysis where available
2. **AST Parsing**: Integrate proper parsers for each language
3. **Machine Learning**: Train models for better confidence
4. **Custom Rules**: User-defined insertion patterns
5. **Formatting Integration**: Coordinate with formatters

These would require:
- External dependencies
- Increased complexity
- Performance considerations
- Careful backward compatibility
