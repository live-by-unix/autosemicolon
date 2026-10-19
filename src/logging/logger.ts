import * as vscode from 'vscode';
import { ConfigurationManager } from '../configuration/manager';

export class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;
  private configManager: ConfigurationManager;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Auto');
    this.configManager = ConfigurationManager.getInstance();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public debug(message: string): void {
    if (this.configManager.isDebugLoggingEnabled()) {
      this.log('[DEBUG]', message);
    }
  }

  public info(message: string): void {
    this.log('[INFO]', message);
  }

  public warn(message: string): void {
    this.log('[WARN]', message);
  }

  public error(message: string): void {
    this.log('[ERROR]', message);
  }

  private log(prefix: string, message: string): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`${timestamp} ${prefix} ${message}`);
  }

  public show(): void {
    this.outputChannel.show();
  }

  public dispose(): void {
    this.outputChannel.dispose();
  }
}
