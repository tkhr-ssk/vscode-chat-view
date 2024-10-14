function addUserMessage() {
    const input = document.getElementById('user-input');
    const messageContainer = document.getElementById('messages');
    
    // ユーザーのメッセージを表示
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = input.value;
    messageContainer.appendChild(userMessage);

    // スクロールを最下部に
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function addResponse(response) {
    const messageContainer = document.getElementById('messages');
    
    // ボットの応答を表示（ここでは簡単なエコー）
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.textContent = "AI回答: " + response;
    messageContainer.appendChild(botMessage);
    
    // スクロールを最下部に
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function autoResize(textarea) {
    textarea.style.height = 'auto'; // 高さを一度リセット
    textarea.style.height = (textarea.scrollHeight - 20) + 'px'; // 新しい高さを設定(padding分減算)
}


(function () {
    const vscode = acquireVsCodeApi();

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
            input.style.height = 'auto'; // 高さをリセット
        }
    };

})();
