export interface LanguageCapability {
  languageId: string;
  enabledByDefault: boolean;
  statementTerminator: string;
  requiresSemicolon: boolean;
  supportLevel: 'full' | 'partial' | 'disabled';
  knownExclusions: string[];
  confidenceThreshold: number;
}

export interface DetectionContext {
  document: string;
  languageId: string;
  cursorPosition: number;
  line: number;
  column: number;
  lineText: string;
  previousLine?: string;
  nextLine?: string;
}

export interface StatementAnalysis {
  isComplete: boolean;
  requiresSemicolon: boolean;
  hasExistingSemicolon: boolean;
  confidence: number;
  insertionPoint: number;
  reason: string;
}

export interface InsertionDecision {
  shouldInsert: boolean;
  position: number;
  text: string;
  confidence: number;
  reason: string;
}

export interface Configuration {
  enabled: boolean;
  enabledLanguages: string[];
  disabledLanguages: string[];
  debugLogging: boolean;
  insertOnNewline: boolean;
  insertOnClosingDelimiter: boolean;
}
