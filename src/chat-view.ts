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
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this.context.extensionUri
            ]
        };
        webviewView.webview.html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .chat-container {
            width: 100%;
            margin: auto;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 10px;
            overflow: hidden;
        }
        .messages {
            height: 400px;
            overflow-y: scroll;
            padding: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .message {
            margin: 10px 0;
        }
        .user {
            text-align: right;
        }
        .bot {
            text-align: left;
        }
        .input-area {
            display: flex;
            padding: 10px;
        }
        .input-area textarea {
            flex: 1;
            min-width: 0;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            resize: none; /* サイズ変更を無効化 */
            overflow: hidden; /* スクロールバーを非表示 */
        }
        .input-area button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid var(--vscode-button-border);
            padding: 10px;
            margin-left: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        .input-area button:hover {
        }
    </style>
</head>
<body>

<div class="chat-container">
    <div class="messages" id="messages"></div>
    <div class="input-area">
        <textarea id="user-input" placeholder="input..." rows="1" oninput="autoResize(this)"></textarea>
        <button onclick="sendMessage()">send</button>
    </div>
</div>

<script>
    function sendMessage() {
        const input = document.getElementById('user-input');
        const messageContainer = document.getElementById('messages');
        
        // ユーザーのメッセージを表示
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = input.value;
        messageContainer.appendChild(userMessage);
        
        // ボットの応答を表示（ここでは簡単なエコー）
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.textContent = "ボットの応答: " + input.value;
        messageContainer.appendChild(botMessage);
        
        // 入力フィールドをクリア
        input.value = '';
        input.style.height = 'auto'; // 高さをリセット
        
        // スクロールを最下部に
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    function autoResize(textarea) {
        textarea.style.height = 'auto'; // 高さを一度リセット
        textarea.style.height = (textarea.scrollHeight - 20) + 'px'; // 新しい高さを設定(padding分減算)
    }
</script>

</body>
</html>`;
    }
}
