function autoResize(textarea) {
    const maxHeight = 300;
    textarea.style.height = 'auto'; // 高さを一度リセット
    const newHeight = textarea.scrollHeight - 20; // 新しい高さを計算 (padding分減算)
    textarea.style.height = (newHeight > maxHeight ? maxHeight : newHeight) + 'px';
}

(function () {
    const vscode = acquireVsCodeApi();

    // ローディングメッセージを作成
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'AIが回答中...';
    loadingMessage.classList.add('loading');
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.appendChild(loadingMessage);

    window.addEventListener("message", (event) => {
        const message = event.data;
        switch (message.type) {
            case "response":
                console.log(message);
                addResponse(message.value);
                break;
            default:
                break;
        }
    });

    document.addEventListener("click", (e) => {
        const targetButton = e.target.closest('button');
        const input = document.getElementById('user-input');
        if (targetButton?.id === "send-button") {
            e.preventDefault();
            console.log('message sent');
            sendMessage();
            return;
        }
        if (targetButton?.id === "clear-button") {
            e.preventDefault();
            console.log('message clear');
            const messagesContainer = document.querySelector('.messages');
            messagesContainer.innerHTML = ''; // メッセージをクリア
            vscode.postMessage({
                type: "clearHistory"
            });
            return;
        }
    });

    const sendMessage = () => {
        const input = document.getElementById('user-input');
        if (input.value?.length > 0) {
            console.log("input", input.value);
            vscode.postMessage({
                type: "sendMessage",
                value: input.value
            });
            addUserMessage();
            input.value = "";
            autoResize(input); // 自動リサイズを呼び出す
            messagesContainer.appendChild(loadingMessage);
            loadingMessage.classList.add('active'); // ローディングメッセージを表示
            // スクロールを最下部に
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    };

    function addUserMessage() {
        const input = document.getElementById('user-input');
        const messageContainer = document.getElementById('messages');
        
        // ユーザーのメッセージを表示
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = input.value;
        messageContainer.appendChild(userMessage);
    }

    function addResponse(response) {
        loadingMessage.classList.remove('active'); // ローディングメッセージを非表示
    
        const messageContainer = document.getElementById('messages');
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.innerHTML = marked.parse(response);
        messageContainer.appendChild(botMessage);
        
        // スクロールを最下部に
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    // テキストエリアの自動リサイズイベントを追加
    const inputArea = document.getElementById('user-input');
    inputArea.addEventListener('input', () => autoResize(inputArea));
})();
