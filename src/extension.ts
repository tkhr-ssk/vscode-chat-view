import * as vscode from 'vscode';
import ChatViewProvider from './chat-view';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "chat-view" is now active!');
	const provider = new ChatViewProvider(context);
	const view = vscode.window.registerWebviewViewProvider(
		"chat-view.view",
		provider,
		{
			webviewOptions: {
				retainContextWhenHidden: true,
			},
		}
	);
	const disposable = vscode.commands.registerCommand('chat-view.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from chat-view!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
