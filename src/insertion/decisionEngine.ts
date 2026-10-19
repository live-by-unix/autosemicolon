import { StatementAnalysis, InsertionDecision, DetectionContext, Configuration } from '../types';
import { Logger } from '../logging/logger';

export class DecisionEngine {
  private logger: Logger;
  private lastEditTimestamp: number = 0;
  private lastEditPosition: number = -1;
  private lastEditDocument: string = '';

  constructor() {
    this.logger = Logger.getInstance();
  }

  public decide(
    analysis: StatementAnalysis,
    context: DetectionContext,
    config: Configuration,
    _documentVersion: number
  ): InsertionDecision {
    const now = Date.now();

    if (this.isRecentDuplicateEdit(context.document, context.cursorPosition, now)) {
      this.logger.debug('Skipping to prevent edit loop');
      return {
        shouldInsert: false,
        position: -1,
        text: '',
        confidence: 0,
        reason: 'Preventing edit loop'
      };
    }

    if (!config.enabled) {
      return {
        shouldInsert: false,
        position: -1,
        text: '',
        confidence: analysis.confidence,
        reason: 'Auto disabled globally'
      };
    }

    if (!analysis.requiresSemicolon) {
      return {
        shouldInsert: false,
        position: -1,
        text: '',
        confidence: analysis.confidence,
        reason: analysis.reason
      };
    }

    if (analysis.hasExistingSemicolon) {
      return {
        shouldInsert: false,
        position: -1,
        text: '',
        confidence: analysis.confidence,
        reason: 'Semicolon already exists'
      };
    }

    if (!analysis.isComplete) {
      return {
        shouldInsert: false,
        position: -1,
        text: '',
        confidence: analysis.confidence,
        reason: analysis.reason
      };
    }

    const absolutePosition = this.calculateAbsolutePosition(context, analysis.insertionPoint);
    
    this.recordEdit(context.document, absolutePosition, now);

    this.logger.debug(`Inserting semicolon at position ${absolutePosition}`);

    return {
      shouldInsert: true,
      position: absolutePosition,
      text: ';',
      confidence: analysis.confidence,
      reason: analysis.reason
    };
  }

  private isRecentDuplicateEdit(document: string, position: number, now: number): boolean {
    const timeSinceLastEdit = now - this.lastEditTimestamp;
    const positionDiff = Math.abs(position - this.lastEditPosition);
    
    if (this.lastEditDocument === document && 
        timeSinceLastEdit < 100 && 
        positionDiff < 10) {
      return true;
    }
    
    return false;
  }

  private recordEdit(document: string, position: number, timestamp: number): void {
    this.lastEditDocument = document;
    this.lastEditPosition = position;
    this.lastEditTimestamp = timestamp;
  }



  private calculateAbsolutePosition(context: DetectionContext, insertionPoint: number): number {
    const lines = context.document.split('\n');
    let position = 0;
    
    for (let i = 0; i < context.line; i++) {
      position += lines[i].length + 1;
    }
    
    position += insertionPoint;
    
    return position;
  }
}
