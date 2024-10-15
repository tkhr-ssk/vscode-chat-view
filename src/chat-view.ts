import * as vscode from 'vscode';
import AiService from './gpt';

export default class ChatViewProvider implements vscode.WebviewViewProvider {
    private webView?: vscode.WebviewView;
    private aiService?: AiService;

    constructor(private context: vscode.ExtensionContext) {
        const configuration = vscode.workspace.getConfiguration("chat-view");
        let apiKey = configuration.get("apiKey") as string;
        if (!apiKey) {
            vscode.window.showErrorMessage('Failed to load API key from configuration.');
            return;
        }
        this.aiService = new AiService(apiKey);
    }

    private loadApiKey() {
        const configuration = vscode.workspace.getConfiguration("chat-view");
        let apiKey = configuration.get("apiKey") as string;
        if (!apiKey) {
            vscode.window.showErrorMessage('Failed to load API key from configuration.');
            return;
        }
        this.aiService = new AiService(apiKey);
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.webView = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this.context.extensionUri
            ]
        };
        const scriptUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const stylesMainUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.css'));
        webviewView.webview.html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation</title>
    <link href="${stylesMainUri}" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>

<div class="chat-container">
    <div class="messages" id="messages"></div>
    <div class="input-area">
        <textarea id="user-input" placeholder="input..." rows="1" oninput="autoResize(this)"></textarea>
        <button id="send-button">send</button>
    </div>
</div>
<script src="${scriptUri}"></script>
</body>
</html>`;

        webviewView.webview.onDidReceiveMessage(async data => {
            console.log(data);
            switch (data.type) {
                case 'sendMessage':
                    this.sendApiRequest(data.value, { command: "freeText" });
                    break;
                default:
                    break;
            }
        });
    }

    public async sendApiRequest(prompt: string, options: { command: string, code?: string, previousAnswer?: string, language?: string; }) {
        let response;
        let messageHistory = [];
        messageHistory.push (
            { role: "user", content: prompt }
        );
        if(!this.aiService){
            this.loadApiKey();
        }
        const info = await this.aiService?.gpt(messageHistory);
        console.log(info);
        response = info?.text;
        this.sendMessage({ type: 'response', value: response });
    }

    public sendMessage(message: any) {
        if (this.webView) {
            this.webView?.webview.postMessage(message);
        }
    }

}
