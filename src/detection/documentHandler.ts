import * as vscode from 'vscode';
import { DetectionContext } from '../types';
import { SyntaxAnalyzer } from './syntaxAnalyzer';
import { DecisionEngine } from '../insertion/decisionEngine';
import { ConfigurationManager } from '../configuration/manager';
import { Logger } from '../logging/logger';

export class DocumentHandler {
  private syntaxAnalyzer: SyntaxAnalyzer;
  private decisionEngine: DecisionEngine;
  private configManager: ConfigurationManager;
  private logger: Logger;
  private disposable: vscode.Disposable;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.syntaxAnalyzer = new SyntaxAnalyzer();
    this.decisionEngine = new DecisionEngine();
    this.configManager = ConfigurationManager.getInstance();
    this.logger = Logger.getInstance();

    this.disposable = vscode.workspace.onDidChangeTextDocument(async (event) => {
      await this.handleDocumentChange(event);
    });
  }

  private async handleDocumentChange(event: vscode.TextDocumentChangeEvent): Promise<void> {
    if (event.contentChanges.length === 0) {
      return;
    }

    const document = event.document;
    const change = event.contentChanges[0];

    if (!this.isSupportedLanguage(document.languageId)) {
      return;
    }

    if (!this.configManager.isLanguageEnabled(document.languageId)) {
      return;
    }

    if (!this.configManager.isEnabled()) {
      return;
    }

    if (document.isClosed || document.isUntitled) {
      return;
    }

    // Only trigger when user creates a new line (inserts \n)
    if (!change.text.includes('\n')) {
      return;
    }

    // Check the line BEFORE the new line (the completed line)
    const position = change.range.start;
    const lineIndex = position.line;
    
    if (lineIndex < 0 || lineIndex >= document.lineCount) {
      return;
    }

    const lineText = document.lineAt(lineIndex).text;
    const previousLine = lineIndex > 0 ? document.lineAt(lineIndex - 1).text : undefined;

    const context: DetectionContext = {
      document: document.getText(),
      languageId: document.languageId,
      cursorPosition: document.offsetAt(position),
      line: lineIndex,
      column: position.character,
      lineText,
      previousLine,
      nextLine: undefined
    };

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      await this.processInsertion(context, document);
    }, 50);
  }

  private isSupportedLanguage(languageId: string): boolean {
    const supportedLanguages = [
      'c', 'cpp', 'csharp',
      'javascript', 'javascriptreact',
      'typescript', 'typescriptreact',
      'java', 'php', 'rust', 'go', 'swift',
      'objective-c', 'objective-cpp'
    ];
    return supportedLanguages.includes(languageId);
  }

  private async processInsertion(context: DetectionContext, document: vscode.TextDocument): Promise<void> {
    try {
      const analysis = this.syntaxAnalyzer.analyze(context);
      const config = this.configManager.getConfiguration();
      
      const decision = this.decisionEngine.decide(analysis, context, config, document.version);

      if (decision.shouldInsert) {
        const edit = new vscode.WorkspaceEdit();
        const position = document.positionAt(decision.position);
        
        edit.insert(document.uri, position, decision.text);
        
        const success = await vscode.workspace.applyEdit(edit);
        
        if (success) {
          this.logger.debug(`Successfully inserted semicolon at line ${context.line + 1}`);
        } else {
          this.logger.warn(`Failed to insert semicolon at line ${context.line + 1}`);
        }
      } else {
        this.logger.debug(`Skipping insertion: ${decision.reason}`);
      }
    } catch (error) {
      this.logger.error(`Error processing insertion: ${error}`);
    }
  }

  public dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.disposable.dispose();
  }
}
