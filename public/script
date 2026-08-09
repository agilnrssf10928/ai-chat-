const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const CHAT_STORAGE_KEY = 'aiChatHistory';

function loadChatHistory() {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
        const messages = JSON.parse(saved);
        chatBox.innerHTML = '';
        messages.forEach(msg => {
            displayMessage(msg.text, msg.sender);
        });
    }
}

function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const htmlContent = parseCodeBlocks(text);
    const codeBlockCount = (htmlContent.match(/class="code-block"/g) || []).length;
    
    const container = document.createElement('div');
    container.className = 'message-content';
    
    if (codeBlockCount > 1 && sender === 'ai') {
        const copyAllDiv = document.createElement('div');
        copyAllDiv.className = 'copy-all-container';
        copyAllDiv.innerHTML = `<button class="copy-all-btn" onclick="copyAllCode(this)">📋 Copy All Code</button>`;
        container.appendChild(copyAllDiv);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = htmlContent;
    container.appendChild(contentDiv);
    
    messageDiv.appendChild(container);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function copyAllCode(btnElement) {
    const messageDiv = btnElement.closest('.message-content');
    const codeBlocks = messageDiv.querySelectorAll('pre code');
    
    if (codeBlocks.length === 0) return;
    
    let allCode = '';
    codeBlocks.forEach((block, index) => {
        allCode += block.innerText;
        if (index < codeBlocks.length - 1) {
            allCode += '\n\n--- Code Block ' + (index + 2) + ' ---\n\n';
        }
    });
    
    navigator.clipboard.writeText(allCode).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = '✅ All Copied!';
        setTimeout(() => {
            btnElement.textContent = originalText;
        }, 2000);
    });
}

function parseCodeBlocks(text) {
    let result = text;
    const codeBlocks = [];
    
    result = result.replace(
        /`{3}(\w+)?\n([\s\S]*?)`{3}/g,
        (match, lang, code) => {
            const language = lang || 'plaintext';
            const trimmedCode = code.trim();
            const blockId = 'code-block-' + codeBlocks.length;
            
            codeBlocks.push({
                id: blockId,
                code: trimmedCode,
                lang: language
            });
            
            return `[CODE_BLOCK_${codeBlocks.length - 1}]`;
        }
    );
    
    result = result
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    codeBlocks.forEach((block, index) => {
        const html = `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-lang">${block.lang}</span>
                    <button class="copy-btn" onclick="copyCode(this, '${block.id}')">📋 Copy</button>
                </div>
                <pre id="${block.id}"><code>${escapeHtml(block.code)}</code></pre>
            </div>
        `;
        result = result.replace(`[CODE_BLOCK_${index}]`, html);
    });
    
    result = result.replace(/`([^`]+)`/g, '<code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">$1</code>');
    
    return result;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function copyCode(btnElement, elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;
    
    const text = codeElement.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = '✅ Copied!';
        setTimeout(() => {
            btnElement.textContent = originalText;
        }, 2000);
    });
}

function saveMessage(text, sender) {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY) || '[]';
    const messages = JSON.parse(saved);
    messages.push({ text, sender, timestamp: new Date().getTime() });
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

function clearChatHistory() {
    if (confirm('Yakin mau hapus semua chat?')) {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        chatBox.innerHTML = '<div class="message ai"><p>Halo! Aku AI, tanya apapun yang mau dibantu 😊</p></div>';
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;

    displayMessage(message, 'user');
    saveMessage(message, 'user');
    userInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai';
    loadingDiv.innerHTML = '<p><span class="loading"></span> AI sedang mikir...</p>';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const data = await response.json();
        
        loadingDiv.remove();
        displayMessage(data.reply, 'ai');
        saveMessage(data.reply, 'ai');

    } catch (error) {
        loadingDiv.remove();
        const errorMsg = 'Maaf, terjadi error. Coba lagi nanti.';
        displayMessage(errorMsg, 'ai');
        saveMessage(errorMsg, 'ai');
        console.error('Error:', error);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

window.addEventListener('DOMContentLoaded', loadChatHistory);
