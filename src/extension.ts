import * as vscode from 'vscode';
import { ConfigurationManager } from './configuration/manager';
import { Logger } from './logging/logger';
import { DocumentHandler } from './detection/documentHandler';
import { registerCommands } from './commands';

let documentHandler: DocumentHandler | undefined;
let configManager: ConfigurationManager | undefined;
let logger: Logger | undefined;

export function activate(context: vscode.ExtensionContext): void {
  logger = Logger.getInstance();
  configManager = ConfigurationManager.getInstance();
  
  logger.info('Auto extension activated');
  
  registerCommands(context);
  
  documentHandler = new DocumentHandler();
  
  context.subscriptions.push({
    dispose: () => {
      if (documentHandler) {
        documentHandler.dispose();
      }
      if (configManager) {
        configManager.dispose();
      }
      if (logger) {
        logger.dispose();
      }
    }
  });
}

export function deactivate(): void {
  if (documentHandler) {
    documentHandler.dispose();
  }
  if (configManager) {
    configManager.dispose();
  }
  if (logger) {
    logger.dispose();
  }
}
