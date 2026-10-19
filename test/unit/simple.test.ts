import * as assert from 'assert';
import { SyntaxAnalyzer } from '../../../src/detection/syntaxAnalyzer';
import { DetectionContext } from '../../../src/types';

suite('SyntaxAnalyzer Tests', () => {
  let analyzer: SyntaxAnalyzer;

  setup(() => {
    analyzer = new SyntaxAnalyzer();
  });

  test('should detect existing semicolon', () => {
    const context: DetectionContext = {
      document: 'int x = 5;',
      languageId: 'c',
      cursorPosition: 10,
      line: 0,
      column: 10,
      lineText: 'int x = 5;'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.hasExistingSemicolon, true);
  });

  test('should detect simple variable declaration', () => {
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
    assert.strictEqual(result.requiresSemicolon, true);
    assert.strictEqual(result.hasExistingSemicolon, false);
    assert.strictEqual(result.confidence > 0.7, true);
  });

  test('should reject if statement', () => {
    const context: DetectionContext = {
      document: 'if (x > 0)',
      languageId: 'c',
      cursorPosition: 9,
      line: 0,
      column: 9,
      lineText: 'if (x > 0)'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
    assert.strictEqual(result.requiresSemicolon, false);
  });

  test('should reject for loop', () => {
    const context: DetectionContext = {
      document: 'for (int i = 0; i < 10; i++)',
      languageId: 'c',
      cursorPosition: 28,
      line: 0,
      column: 28,
      lineText: 'for (int i = 0; i < 10; i++)'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject while loop', () => {
    const context: DetectionContext = {
      document: 'while (running)',
      languageId: 'c',
      cursorPosition: 14,
      line: 0,
      column: 14,
      lineText: 'while (running)'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject function declaration', () => {
    const context: DetectionContext = {
      document: 'void myFunction()',
      languageId: 'c',
      cursorPosition: 16,
      line: 0,
      column: 16,
      lineText: 'void myFunction()'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should accept return statement', () => {
    const context: DetectionContext = {
      document: 'return result',
      languageId: 'c',
      cursorPosition: 13,
      line: 0,
      column: 13,
      lineText: 'return result'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, true);
    assert.strictEqual(result.requiresSemicolon, true);
    assert.strictEqual(result.confidence > 0.8, true);
  });

  test('should reject incomplete statement with operator', () => {
    const context: DetectionContext = {
      document: 'int x =',
      languageId: 'c',
      cursorPosition: 7,
      line: 0,
      column: 7,
      lineText: 'int x ='
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject empty line', () => {
    const context: DetectionContext = {
      document: '',
      languageId: 'c',
      cursorPosition: 0,
      line: 0,
      column: 0,
      lineText: ''
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject block opening', () => {
    const context: DetectionContext = {
      document: '{',
      languageId: 'c',
      cursorPosition: 1,
      line: 0,
      column: 1,
      lineText: '{'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject block closing', () => {
    const context: DetectionContext = {
      document: '}',
      languageId: 'c',
      cursorPosition: 1,
      line: 0,
      column: 1,
      lineText: '}'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject preprocessor directive', () => {
    const context: DetectionContext = {
      document: '#include <stdio.h>',
      languageId: 'c',
      cursorPosition: 18,
      line: 0,
      column: 18,
      lineText: '#include <stdio.h>'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should detect method call', () => {
    const context: DetectionContext = {
      document: 'Console.WriteLine("Hello")',
      languageId: 'csharp',
      cursorPosition: 26,
      line: 0,
      column: 26,
      lineText: 'Console.WriteLine("Hello")'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, true);
    assert.strictEqual(result.requiresSemicolon, true);
  });

  test('should reject comment', () => {
    const context: DetectionContext = {
      document: '// This is a comment',
      languageId: 'c',
      cursorPosition: 20,
      line: 0,
      column: 20,
      lineText: '// This is a comment'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should reject unsupported language', () => {
    const context: DetectionContext = {
      document: 'some code',
      languageId: 'python',
      cursorPosition: 9,
      line: 0,
      column: 9,
      lineText: 'some code'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
    assert.strictEqual(result.confidence, 0);
  });

  test('should detect JavaScript with conservative confidence', () => {
    const context: DetectionContext = {
      document: 'const x = 5',
      languageId: 'javascript',
      cursorPosition: 10,
      line: 0,
      column: 10,
      lineText: 'const x = 5'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, true);
    assert.strictEqual(result.confidence > 0.85, true);
  });

  test('should handle incomplete parentheses', () => {
    const context: DetectionContext = {
      document: 'printf("Hello"',
      languageId: 'c',
      cursorPosition: 14,
      line: 0,
      column: 14,
      lineText: 'printf("Hello"'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });

  test('should handle multiline continuation with comma', () => {
    const context: DetectionContext = {
      document: 'int x = 1,',
      languageId: 'c',
      cursorPosition: 9,
      line: 0,
      column: 9,
      lineText: 'int x = 1,',
      previousLine: 'int x = 1,'
    };

    const result = analyzer.analyze(context);
    assert.strictEqual(result.isComplete, false);
  });
});
