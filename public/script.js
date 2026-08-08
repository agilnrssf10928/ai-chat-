function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    const loadingMsg = addMessage('⏳ AI sedang berpikir...', 'ai', true);

    setTimeout(() => {
        loadingMsg.remove();
        addMessage('Maaf, aku masih dalam pengembangan! Tapi pertanyaan kamu keren! 🔥', 'ai');
    }, 1500);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(text, sender, isTemp = false) {
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="message-content">${text}</div>`;
    if (isTemp) div.id = 'loading-msg';
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

function clearChatHistory() {
    const chatBox = document.getElementById('chatBox');
    if (confirm('Yakin mau hapus semua chat? 🤔')) {
        chatBox.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'message ai';
        div.innerHTML = `<div class="message-content">Halo! Aku AI by GIL 🤖<br>Aku sedang dikembangkan, tanya apapun yang mau dibantu! 😊</div>`;
        chatBox.appendChild(div);
    }
}
