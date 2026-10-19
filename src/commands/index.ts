import * as vscode from 'vscode';
import { ConfigurationManager } from '../configuration/manager';
import { Logger } from '../logging/logger';

export function registerCommands(context: vscode.ExtensionContext): void {
  const configManager = ConfigurationManager.getInstance();
  const logger = Logger.getInstance();

  const enableCommand = vscode.commands.registerCommand('auto.enable', async () => {
    const config = vscode.workspace.getConfiguration('auto');
    await config.update('enabled', true, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Auto has been enabled');
    logger.info('Auto enabled via command');
  });

  const disableCommand = vscode.commands.registerCommand('auto.disable', async () => {
    const config = vscode.workspace.getConfiguration('auto');
    await config.update('enabled', false, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Auto has been disabled');
    logger.info('Auto disabled via command');
  });

  const toggleCommand = vscode.commands.registerCommand('auto.toggle', async () => {
    const config = vscode.workspace.getConfiguration('auto');
    const current = config.get<boolean>('enabled', true);
    await config.update('enabled', !current, vscode.ConfigurationTarget.Global);
    const status = !current ? 'enabled' : 'disabled';
    vscode.window.showInformationMessage(`Auto has been ${status}`);
    logger.info(`Auto ${status} via command`);
  });

  const showStatusCommand = vscode.commands.registerCommand('auto.showStatus', () => {
    const config = configManager.getConfiguration();
    const enabled = config.enabled ? 'enabled' : 'disabled';
    const languages = config.enabledLanguages.length > 0
      ? config.enabledLanguages.join(', ')
      : 'all supported languages';

    const message = `
Auto Status:
- Global: ${enabled}
- Languages: ${languages}
- Debug Logging: ${config.debugLogging ? 'on' : 'off'}
    `.trim();

    vscode.window.showInformationMessage(message);
    logger.info('Status shown via command');
  });

  const openSettingsCommand = vscode.commands.registerCommand('auto.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'auto');
  });

  const showOutputLogCommand = vscode.commands.registerCommand('auto.showOutputLog', () => {
    logger.show();
  });

  context.subscriptions.push(
    enableCommand,
    disableCommand,
    toggleCommand,
    showStatusCommand,
    openSettingsCommand,
    showOutputLogCommand
  );
}
