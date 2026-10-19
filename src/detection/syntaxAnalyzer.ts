import { DetectionContext, StatementAnalysis } from '../types';
import { getLanguageCapability } from '../languages/registry';

export class SyntaxAnalyzer {
  public analyze(context: DetectionContext): StatementAnalysis {
    const capability = getLanguageCapability(context.languageId);
    
    if (!capability) {
      return {
        isComplete: false,
        requiresSemicolon: false,
        hasExistingSemicolon: false,
        confidence: 0,
        insertionPoint: -1,
        reason: 'Language not supported'
      };
    }

    if (capability.supportLevel === 'disabled') {
      return {
        isComplete: false,
        requiresSemicolon: false,
        hasExistingSemicolon: false,
        confidence: 0,
        insertionPoint: -1,
        reason: 'Language support disabled'
      };
    }

    if (!capability.requiresSemicolon) {
      return {
        isComplete: false,
        requiresSemicolon: false,
        hasExistingSemicolon: false,
        confidence: 0,
        insertionPoint: -1,
        reason: 'Language does not require semicolons'
      };
    }

    const lineText = context.lineText.trim();
    
    if (lineText.length === 0) {
      return {
        isComplete: false,
        requiresSemicolon: false,
        hasExistingSemicolon: false,
        confidence: 0,
        insertionPoint: -1,
        reason: 'Empty line'
      };
    }

    if (this.hasExistingSemicolon(lineText)) {
      return {
        isComplete: true,
        requiresSemicolon: false,
        hasExistingSemicolon: true,
        confidence: 1.0,
        insertionPoint: -1,
        reason: 'Semicolon already present'
      };
    }

    if (this.isInComment(lineText, context.document, context.cursorPosition)) {
      return {
        isComplete: false,
        requiresSemicolon: false,
        hasExistingSemicolon: false,
        confidence: 0,
        insertionPoint: -1,
        reason: 'Inside comment'
      };
    }

    if (this.isInString(lineText, context.document, context.cursorPosition)) {
      return {
        isComplete: false,
        requiresSemicolon: false,
        hasExistingSemicolon: false,
        confidence: 0,
        insertionPoint: -1,
        reason: 'Inside string literal'
      };
    }

    if (this.shouldHaveSemicolon(lineText, context.previousLine)) {
      const insertionPoint = this.calculateInsertionPoint(lineText, context.lineText);
      return {
        isComplete: true,
        requiresSemicolon: true,
        hasExistingSemicolon: false,
        confidence: 1.0,
        insertionPoint,
        reason: 'Line requires semicolon'
      };
    }

    return {
      isComplete: false,
      requiresSemicolon: false,
      hasExistingSemicolon: false,
      confidence: 0,
      insertionPoint: -1,
      reason: 'Line does not require semicolon'
    };
  }

  private hasExistingSemicolon(line: string): boolean {
    return line.trim().endsWith(';');
  }

  private isInComment(_line: string, document: string, cursorPosition: number): boolean {
    const docUpToCursor = document.substring(0, cursorPosition);
    
    const singleLineCommentPos = docUpToCursor.lastIndexOf('//');
    if (singleLineCommentPos !== -1) {
      const lastNewlineBeforeComment = docUpToCursor.lastIndexOf('\n', singleLineCommentPos);
      if (lastNewlineBeforeComment === -1 || lastNewlineBeforeComment < singleLineCommentPos) {
        return true;
      }
    }

    let blockCommentStart = docUpToCursor.lastIndexOf('/*');
    let blockCommentEnd = docUpToCursor.lastIndexOf('*/');
    
    while (blockCommentStart !== -1) {
      if (blockCommentEnd === -1 || blockCommentStart > blockCommentEnd) {
        return true;
      }
      blockCommentStart = docUpToCursor.lastIndexOf('/*', blockCommentStart - 1);
      blockCommentEnd = docUpToCursor.lastIndexOf('*/', blockCommentEnd - 1);
    }

    return false;
  }

  private isInString(_line: string, document: string, cursorPosition: number): boolean {
    const docUpToCursor = document.substring(0, cursorPosition);
    
    let inDoubleQuote = false;
    let inSingleQuote = false;
    let inTemplate = false;
    let i = 0;
    
    while (i < docUpToCursor.length) {
      const char = docUpToCursor[i];
      
      if (char === '`' && !inDoubleQuote && !inSingleQuote) {
        inTemplate = !inTemplate;
      } else if (char === '"' && !inSingleQuote && !inTemplate) {
        inDoubleQuote = !inDoubleQuote;
      } else if (char === "'" && !inDoubleQuote && !inTemplate) {
        inSingleQuote = !inSingleQuote;
      } else if (char === '\\' && i + 1 < docUpToCursor.length) {
        i++;
      }
      
      i++;
    }

    return inDoubleQuote || inSingleQuote || inTemplate;
  }

  private shouldHaveSemicolon(line: string, previousLine?: string): boolean {
    const trimmed = line.trim();

    // Skip if line ends with incomplete syntax
    if (trimmed.endsWith(',') || 
        trimmed.endsWith('+') || 
        trimmed.endsWith('-') || 
        trimmed.endsWith('*') || 
        trimmed.endsWith('/') || 
        trimmed.endsWith('=') || 
        trimmed.endsWith('&') || 
        trimmed.endsWith('|') || 
        trimmed.endsWith('^') || 
        trimmed.endsWith('<') || 
        trimmed.endsWith('>')) {
      return false;
    }

    // Skip if line ends with opening brace or paren
    if (trimmed.endsWith('{') || trimmed.endsWith('(')) {
      return false;
    }

    // Skip control structures
    const controlPatterns = [
      /^if\s*\(/,
      /^else\s*$/,
      /^else\s+if\s*\(/,
      /^for\s*\(/,
      /^while\s*\(/,
      /^do\s*$/,
      /^switch\s*\(/,
      /^case\s+/,
      /^default\s*:/,
      /^try\s*$/,
      /^catch\s*\(/,
      /^finally\s*$/,
      /^class\s+/,
      /^interface\s+/,
      /^struct\s+/,
      /^enum\s+/,
      /^namespace\s+/,
      /^function\s+/,
      /^fn\s+/,
      /^def\s+/,
      /^public\s+/,
      /^private\s+/,
      /^protected\s+/,
      /^@interface/,
      /^@implementation/,
      /^@end/,
      /^@protocol/,
      /^@property/,
      /^#include/,
      /^#define/,
      /^#pragma/,
      /^import\s+/,
      /^from\s+/,
      /^export\s+/,
      /^module\s+/
    ];

    for (const pattern of controlPatterns) {
      if (pattern.test(trimmed)) {
        return false;
      }
    }

    // Skip block boundaries
    if (trimmed === '{' || trimmed === '}' || trimmed === '};') {
      return false;
    }

    // Skip if unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      return false;
    }

    // Skip if unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      return false;
    }

    // Skip if previous line ended with comma or open paren (multiline)
    if (previousLine) {
      const prevTrimmed = previousLine.trim();
      if (prevTrimmed.endsWith(',') || prevTrimmed.endsWith('(')) {
        return false;
      }
    }

    // If line looks like a statement, it needs a semicolon
    // Statements typically contain:
    // - Assignments (=)
    // - Function calls with parens
    // - return/break/continue/throw
    // - Variable declarations
    
    // Has assignment
    if (trimmed.includes('=')) {
      return true;
    }

    // Has function call (parentheses) but not a declaration
    if (trimmed.includes('(') && trimmed.includes(')')) {
      // Check if it's a declaration (function name before paren with no =)
      const beforeParen = trimmed.substring(0, trimmed.indexOf('(')).trim();
      // If it looks like a type name followed by identifier, skip
      if (/^[a-zA-Z_][a-zA-Z0-9_]*\s+[a-zA-Z_][a-zA-Z0-9_]*$/.test(beforeParen)) {
        return false;
      }
      return true;
    }

    // Control flow keywords that need semicolon
    if (/^\s*(return|break|continue|throw|goto)\s/.test(trimmed)) {
      return true;
    }

    // Variable declaration without assignment (e.g., "int x;")
    if (/^[a-zA-Z_][a-zA-Z0-9_<>]*\s+[a-zA-Z_][a-zA-Z0-9_]*\s*$/.test(trimmed)) {
      return true;
    }

    return false;
  }

  private calculateInsertionPoint(_trimmedLine: string, originalLine: string): number {
    const lastNonSpace = originalLine.search(/\S$/);
    if (lastNonSpace === -1) {
      return originalLine.length;
    }
    return lastNonSpace + 1;
  }
}
