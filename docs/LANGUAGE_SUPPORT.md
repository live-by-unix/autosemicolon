# Language Support

This document details Auto's support for each programming language.

## Support Matrix

| Language | Support Level | Enabled by Default | Requires Semicolon | Notes |
|----------|--------------|-------------------|-------------------|-------|
| C | Full | ✓ | ✓ | Comprehensive support |
| C++ | Full | ✓ | ✓ | Comprehensive support |
| C# | Full | ✓ | ✓ | Comprehensive support |
| JavaScript | Partial | ✓ | ✓ | Conservative due to ASI |
| JavaScript React | Partial | ✓ | ✓ | Conservative due to ASI |
| TypeScript | Partial | ✓ | ✓ | Conservative due to ASI |
| TypeScript React | Partial | ✓ | ✓ | Conservative due to ASI |
| Java | Full | ✓ | ✓ | Comprehensive support |
| PHP | Full | ✓ | ✓ | Comprehensive support |
| Rust | Partial | ✗ | ✓ | Disabled by default |
| Go | Disabled | ✗ | ✗ | Disabled (lexical insertion) |
| Swift | Disabled | ✗ | ✗ | Disabled (rarely used) |
| Objective-C | Full | ✓ | ✓ | Comprehensive support |
| Objective-C++ | Full | ✓ | ✓ | Comprehensive support |

## Support Levels Explained

### Full Support

Languages with full support have:
- Comprehensive statement detection
- High confidence accuracy
- Extensive exclusion lists
- Thoroughly tested
- Enabled by default

**Full Support Languages**: C, C++, C#, Java, PHP, Objective-C, Objective-C++

### Partial Support

Languages with partial support have:
- Basic statement detection
- Conservative confidence thresholds
- May miss some valid insertion points
- May have false negatives
- Language-specific limitations

**Partial Support Languages**:
- JavaScript/TypeScript: Automatic Semicolon Insertion (ASI) rules make semicolons optional in many cases. Auto is conservative to avoid conflicts.
- Rust: Expressions can be valid without semicolons. Conservative confidence and disabled by default.

### Disabled Support

Languages disabled by default have fundamental conflicts with automatic semicolon insertion.

**Disabled Languages**:
- Go: Uses lexical semicolon insertion that conflicts with explicit insertion
- Swift: Semicolons are rarely required and often discouraged

## Per-Language Details

### C

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- Variable declarations: `int x = 5;`
- Return statements: `return result;`
- Function calls: `printf("Hello");`
- Assignments: `x = 10;`
- Expressions: `x + y;`

**Excluded**:
- Control structures: `if`, `else`, `for`, `while`, `switch`, `case`, `default`, `do`
- Jump statements (headers): `break`, `continue`, `goto`
- Declarations: `typedef`, `struct`, `union`, `enum`
- Preprocessor: `#include`, `#define`, etc.
- Comments: `//`, `/* */`
- Strings: `"`, `'`

**Known Limitations**:
- Complex preprocessor macros may be misclassified
- Nested macros may cause issues

### C++

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- All C statements
- Class member access: `obj.method();`
- Stream operations: `std::cout << "Hello";`
- Template instantiations (basic)

**Excluded**:
- All C exclusions
- Template declarations: `template <typename T>`
- Namespace declarations: `namespace foo`
- Exception handling headers: `try`, `catch`, `throw`

**Known Limitations**:
- Complex template code may have reduced accuracy
- Nested templates may be misclassified

### C#

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- Variable declarations: `int x = 5;`
- Method calls: `Console.WriteLine("Hello");`
- Property access: `obj.Property;`
- LINQ queries (basic)

**Excluded**:
- Control structures: `if`, `else`, `for`, `foreach`, `while`, `switch`
- Declarations: `class`, `struct`, `interface`, `enum`, `namespace`
- Using directives: `using System;`
- Exception handling: `try`, `catch`, `finally`, `throw`
- Attributes: `[Attribute]`
- Verbatim strings: `@"..."`

**Known Limitations**:
- LINQ query syntax may be incomplete
- Complex attribute usage may need refinement

### JavaScript

**Support**: Partial
**Enabled by Default**: Yes
**Confidence Threshold**: 0.9

**Handled**:
- Variable declarations: `const x = 5;`
- Function calls: `console.log("Hello");`
- Return statements: `return result;`
- Simple expressions

**Excluded**:
- Control structures: `if`, `else`, `for`, `while`, `switch`
- Declarations: `function`, `class`, `const`, `let`, `var`
- Arrow functions: `=>`
- Exception handling: `try`, `catch`, `finally`, `throw`
- Module syntax: `import`, `export`
- Async/await: `async`, `await`
- Template literals: `` ` ``

**Known Limitations**:
- ASI rules mean semicolons are often optional
- Auto is conservative to avoid conflicts
- May not insert where ASI would apply
- React JSX may complicate detection (React variants handle this)

### TypeScript

**Support**: Partial
**Enabled by Default**: Yes
**Confidence Threshold**: 0.9

**Handled**:
- All JavaScript statements
- Type annotations: `const x: number = 5;`

**Excluded**:
- All JavaScript exclusions
- Type declarations: `interface`, `type`, `enum`
- Namespace declarations: `namespace`

**Known Limitations**:
- Same as JavaScript limitations
- Type annotations may affect confidence

### Java

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- Variable declarations: `int x = 5;`
- Method calls: `System.out.println("Hello");`
- Return statements: `return result;`
- Object creation: `new MyClass();`

**Excluded**:
- Control structures: `if`, `else`, `for`, `while`, `switch`
- Declarations: `class`, `interface`, `enum`
- Package and import: `package`, `import`
- Exception handling: `try`, `catch`, `finally`, `throw`, `throws`
- Annotations: `@Annotation`
- Modifiers: `synchronized`, `assert`

**Known Limitations**:
- Complex annotation chains may need refinement
- Nested generics may affect detection

### PHP

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- Variable assignments: `$x = 5;`
- Function calls: `echo "Hello";`
- Method calls: `$obj->method();`
- Static calls: `Class::method();`

**Excluded**:
- Control structures: `if`, `else`, `elseif`, `for`, `foreach`, `while`, `switch`
- Declarations: `function`, `class`, `interface`, `trait`
- Namespace: `namespace`, `use`
- Exception handling: `try`, `catch`, `finally`, `throw`
- Comments: `//`, `/* */`, `#`
- PHP tags: `<?php`, `?>`

**Known Limitations**:
- Mixed HTML/PHP files may have issues
- Heredoc/nowdoc syntax not handled

### Rust

**Support**: Partial
**Enabled by Default**: No
**Confidence Threshold**: 0.75

**Handled**:
- Let bindings: `let x = 5;`
- Function calls: `println!("Hello");`
- Return statements: `return result;`
- Expressions with semicolons

**Excluded**:
- Control structures: `if`, `else`, `for`, `while`, `loop`, `match`
- Declarations: `fn`, `struct`, `enum`, `impl`, `trait`, `mod`
- Item declarations: `use`, `let`, `const`, `static`
- Attributes: `#[attribute]`
- Macros: `macro!`, `vec!`, etc.
- Raw identifiers: `r#ident`
- Visibility: `pub`

**Known Limitations**:
- Rust expressions are valid without semicolons
- Block expressions end with the last expression, not a semicolon
- Conservative confidence to avoid breaking valid code
- Disabled by default for safety

### Go

**Support**: Disabled
**Enabled by Default**: No
**Confidence Threshold**: 0.0

**Reason**: Go uses lexical semicolon insertion similar to JavaScript. The Go compiler automatically inserts semicolons at the end of statements based on token boundaries. Explicit insertion by Auto would conflict with this behavior.

**Recommendation**: Do not enable automatic insertion for Go.

### Swift

**Support**: Disabled
**Enabled by Default**: No
**Confidence Threshold**: 0.0

**Reason**: Swift rarely requires semicolons. They are optional and generally discouraged in idiomatic Swift code. Automatic insertion would add unwanted punctuation.

**Recommendation**: Do not enable automatic insertion for Swift.

### Objective-C

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- All C statements
- Message sends: `[object method];`
- Property access: `object.property;`

**Excluded**:
- All C exclusions
- Objective-C declarations: `@interface`, `@implementation`, `@end`, `@protocol`, `@property`, `@class`

**Known Limitations**:
- Complex message chains may need refinement

### Objective-C++

**Support**: Full
**Enabled by Default**: Yes
**Confidence Threshold**: 0.85

**Handled**:
- All Objective-C statements
- All C++ statements

**Excluded**:
- All Objective-C exclusions
- All C++ exclusions

**Known Limitations**:
- Combined language features may have edge cases

## Adding a New Language

To add support for a new language:

1. **Research the Language**
   - Does it require semicolons?
   - What are the statement termination rules?
   - What are the control structure keywords?
   - Are there language-specific exceptions?

2. **Add to Registry**
   Edit `src/languages/registry.ts`:
   ```typescript
   [
     'yourlang',
     {
       languageId: 'yourlang',
       enabledByDefault: true, // or false
       statementTerminator: ';',
       requiresSemicolon: true, // or false
       supportLevel: 'full', // or 'partial' or 'disabled'
       knownExclusions: [
         // list of keywords and patterns
       ],
       confidenceThreshold: 0.85
     }
   ]
   ```

3. **Add Activation Event**
   Edit `package.json`:
   ```json
   "activationEvents": [
     "onLanguage:yourlang"
   ]
   ```

4. **Write Tests**
   - Add unit tests in `test/unit/syntaxAnalyzer.test.ts`
   - Add integration tests in `test/integration/extension.test.ts`

5. **Update Documentation**
   - Update this file
   - Update README.md support matrix
   - Update CHANGELOG.md

6. **Test Thoroughly**
   - Test various code patterns
   - Test edge cases
   - Test exclusions
   - Test confidence scoring

## Testing Language Support

### Unit Tests

Test the syntax analyzer for the language:
```typescript
test('should detect [language] statement', () => {
  const context: DetectionContext = {
    document: 'example statement',
    languageId: 'yourlang',
    cursorPosition: 15,
    line: 0,
    column: 15,
    lineText: 'example statement'
  };
  
  const result = analyzer.analyze(context);
  assert.strictEqual(result.isComplete, true);
});
```

### Integration Tests

Test with actual VS Code document:
```typescript
test('should handle [language] file', async () => {
  const doc = await vscode.workspace.openTextDocument({
    language: 'yourlang',
    content: 'example code'
  });
  
  // test with actual editor
});
```

### Manual Testing

1. Create a test file in the language
2. Type various statements
3. Verify Auto inserts semicolons correctly
4. Verify exclusions work
5. Enable debug logging to see decisions

## Language-Specific Issues

If you encounter a language-specific issue:

1. Check this document for known limitations
2. Enable debug logging
3. Report the issue with:
   - Language
   - Code example
   - Expected behavior
   - Actual behavior
   - Debug log output
