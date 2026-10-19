import * as vscode from 'vscode';
import { Configuration } from '../types';

export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: Configuration;
  private disposable: vscode.Disposable;

  private constructor() {
    this.config = this.loadConfiguration();
    this.disposable = vscode.workspace.onDidChangeConfiguration(() => {
      this.config = this.loadConfiguration();
    });
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  private loadConfiguration(): Configuration {
    const config = vscode.workspace.getConfiguration('auto');
    return {
      enabled: config.get<boolean>('enabled', true),
      enabledLanguages: config.get<string[]>('enabledLanguages', []),
      disabledLanguages: config.get<string[]>('disabledLanguages', []),
      debugLogging: config.get<boolean>('debugLogging', false),
      insertOnNewline: config.get<boolean>('insertOnNewline', true),
      insertOnClosingDelimiter: config.get<boolean>('insertOnClosingDelimiter', false)
    };
  }

  public getConfiguration(): Configuration {
    return { ...this.config };
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public isLanguageEnabled(languageId: string): boolean {
    if (this.config.disabledLanguages.includes(languageId)) {
      return false;
    }
    if (this.config.enabledLanguages.length === 0) {
      return true;
    }
    return this.config.enabledLanguages.includes(languageId);
  }

  public isDebugLoggingEnabled(): boolean {
    return this.config.debugLogging;
  }

  public shouldInsertOnNewline(): boolean {
    return this.config.insertOnNewline;
  }

  public shouldInsertOnClosingDelimiter(): boolean {
    return this.config.insertOnClosingDelimiter;
  }

  public dispose(): void {
    this.disposable.dispose();
  }
}
