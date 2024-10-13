import * as vscode from 'vscode';

export default class ChatViewProvider implements vscode.WebviewViewProvider {
    private webView?: vscode.WebviewView;

    constructor(private context: vscode.ExtensionContext) {
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.webView = webviewView;
        webviewView.webview.html = `<!DOCTYPE html>
        <html lang="en">
            <head>
            </head>
            <body>
            <h1>Title</h1>
            </body>
        </html>
        `;
    }
}
