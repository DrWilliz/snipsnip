document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const codeEditor = document.getElementById('codeEditor');
    const languageSelect = document.getElementById('languageSelect');
    const saveBtn = document.getElementById('saveBtn');
    const newSnippetBtn = document.getElementById('newSnippetBtn');
    const snippetList = document.getElementById('snippetList');

    // Track current snippet
    let currentSnippetId = null;

    // Save snippet (new or update)
    function saveSnippet() {
        const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        const snippet = {
            code: codeEditor.value,
            language: languageSelect.value,
            lastModified: new Date().toISOString()
        };

        if (currentSnippetId) {
            // Update existing snippet
            const index = snippets.findIndex(s => s.id === currentSnippetId);
            if (index !== -1) {
                snippet.id = currentSnippetId;
                snippet.created = snippets[index].created;
                snippets[index] = snippet;
            }
        } else {
            // Create new snippet
            snippet.id = Date.now().toString();
            snippet.created = snippet.lastModified;
            snippets.push(snippet);
        }

        localStorage.setItem('snippets', JSON.stringify(snippets));
        displaySnippets();
        showMessage('Snippet saved!');
    }

    // Load snippet for editing
    function loadSnippet(id) {
        const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        const snippet = snippets.find(s => s.id === id);
        if (snippet) {
            currentSnippetId = snippet.id;
            codeEditor.value = snippet.code;
            languageSelect.value = snippet.language;
            saveBtn.textContent = 'Update Snippet';
            highlightSelectedSnippet(id);
        }
    }

    // Display snippets with improved UI
    function displaySnippets() {
        const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
        snippetList.innerHTML = snippets.map(snippet => `
            <div class="snippet-item ${snippet.id === currentSnippetId ? 'selected' : ''}" data-id="${snippet.id}">
                <div class="snippet-info">
                    <strong>${snippet.language}</strong>
                    <div class="snippet-dates">
                        <small>Created: ${new Date(snippet.created).toLocaleDateString()}</small>
                        <small>Modified: ${new Date(snippet.lastModified).toLocaleDateString()}</small>
                    </div>
                </div>
                <pre><code>${snippet.code.substring(0,50)}${snippet.code.length > 50 ? '...' : ''}</code></pre>
                <div class="snippet-actions">
                    <button class="delete-btn" data-id="${snippet.id}">Delete</button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        snippetList.querySelectorAll('.snippet-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.matches('.delete-btn')) {
                    loadSnippet(item.dataset.id);
                }
            });
        });

        // Add delete handlers
        snippetList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSnippet(btn.dataset.id);
            });
        });
    }

    // Delete snippet
    function deleteSnippet(id) {
        if (confirm('Are you sure you want to delete this snippet?')) {
            let snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
            snippets = snippets.filter(s => s.id !== id);
            localStorage.setItem('snippets', JSON.stringify(snippets));
            if (currentSnippetId === id) {
                currentSnippetId = null;
                codeEditor.value = '';
                saveBtn.textContent = 'Save Snippet';
            }
            displaySnippets();
            showMessage('Snippet deleted!');
        }
    }

    // Show status message
    function showMessage(text) {
        const message = document.createElement('div');
        message.className = 'status-message';
        message.textContent = text;
        document.body.appendChild(message);
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    // Highlight selected snippet
    function highlightSelectedSnippet(id) {
        document.querySelectorAll('.snippet-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.id === id);
        });
    }

    // Event listeners
    saveBtn.addEventListener('click', saveSnippet);
    newSnippetBtn.addEventListener('click', () => {
        currentSnippetId = null;
        codeEditor.value = '';
        languageSelect.value = 'javascript';
        saveBtn.textContent = 'Save Snippet';
        highlightSelectedSnippet(null);
    });

    // Initial load
    displaySnippets();
});

// Add to your existing JavaScript
function updatePreview() {
    const code = codeEditor.value;
    const language = languageSelect.value;
    const previewDiv = document.getElementById('codePreview');
    
    previewDiv.innerHTML = `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    
    // Apply highlighting
    hljs.highlightElement(previewDiv.querySelector('code'));
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add to your event listeners
codeEditor.addEventListener('input', updatePreview);
languageSelect.addEventListener('change', updatePreview);

// Call after loading a snippet
function loadSnippet(id) {
    // ... existing loadSnippet code ...
    updatePreview();
}

// Add to snippet structure
function saveSnippet() {
    const snippet = {
        // ... existing properties ...
        category: document.getElementById('categorySelect').value || 'General'
    };
    
    // ... rest of save function
}

// Add category filter
const categories = ['General', 'Utils', 'Components', 'Scripts'];
const categorySelect = document.createElement('select');
categorySelect.innerHTML = categories.map(cat =>
    `<option value="${cat}">${cat}</option>`
).join('');

