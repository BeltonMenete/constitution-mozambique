document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('openChatBtn')
    const chatContainer = document.getElementById('chatContainer')
    const closeChatBtn = document.getElementById('closeChatBtn')
    const searchInput = document.getElementById('searchInput')
    const searchButton = document.getElementById('searchButton')
    const constitutionContainer = document.querySelector('.constitution-container')
    const chatInput = document.getElementById('chatInput')
    const sendChatBtn = document.getElementById('sendChatBtn')
    const chatMessages = document.getElementById('chatMessages')

    // --- Chat Functionality ---
    chatToggleBtn.addEventListener('click', () => {
        chatContainer.classList.add('open')
    })

    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('open')
    })

    sendChatBtn.addEventListener('click', () => {
        sendMessage()
    })

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    })

    function sendMessage() {
        const userMessage = chatInput.value.trim()
        if (userMessage === '') return

        // Display user message
        const userMessageDiv = document.createElement('div')
        userMessageDiv.classList.add('user-message')
        userMessageDiv.textContent = userMessage
        chatMessages.appendChild(userMessageDiv)

        chatInput.value = ''
        chatMessages.scrollTop = chatMessages.scrollHeight // Scroll to bottom

        // Simulate AI response (replace with actual AI integration)
        setTimeout(() => {
            const botResponse = getAIResponse(userMessage)
            const botMessageDiv = document.createElement('div')
            botMessageDiv.classList.add('bot-message')
            botMessageDiv.textContent = botResponse
            chatMessages.appendChild(botMessageDiv)
            chatMessages.scrollTop = chatMessages.scrollHeight
        }, 500) // Simulate network delay
    }

    // Placeholder for AI integration (THIS IS WHERE YOUR AI LOGIC GOES)
    function getAIResponse(query) {
        // In a real application, you would send this 'query' to an AI API (e.g., Google's Gemini, OpenAI, etc.)
        // and get a response. For this static page, we'll use a simple mock.

        const lowerCaseQuery = query.toLowerCase()

        if (lowerCaseQuery.includes('constituição') || lowerCaseQuery.includes('mozambique')) {
            return 'A Constituição da República de Moçambique é a lei fundamental do país. Foi aprovada em 2004 e estabelece os princípios e a organização do Estado.'
        } else if (lowerCaseQuery.includes('artigo 1')) {
            return 'O Artigo 1 da Constituição define Moçambique como um Estado de Direito democrático, baseado na soberania popular e no respeito pelos direitos e liberdades fundamentais.'
        } else if (lowerCaseQuery.includes('direitos humanos')) {
            return 'Os direitos humanos são amplamente protegidos na Constituição, especialmente no Título II, que aborda os direitos, deveres e liberdades fundamentais.'
        } else if (lowerCaseQuery.includes('ajuda legal') || lowerCaseQuery.includes('jurisdição')) {
            return 'Para situações jurisdicionais específicas, a Constituição estabelece os princípios gerais. Para aconselhamento detalhado, seria necessário consultar um profissional do direito.'
        } else {
            return 'Desculpe, não consigo responder a essa pergunta com a informação que tenho. Por favor, tente perguntar algo mais específico sobre a Constituição de Moçambique.'
        }
    }

    // --- Search Functionality ---
    searchButton.addEventListener('click', performSearch)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch()
        }
    })

    function performSearch() {
        const searchTerm = searchInput.value.trim()
        if (searchTerm === '') {
            clearHighlights()
            return
        }

        clearHighlights() // Clear previous highlights

        const textNodes = getTextNodes(constitutionContainer)
        let found = false

        textNodes.forEach((node) => {
            const originalText = node.nodeValue
            // Use a regular expression for case-insensitive search and global replacement
            const regex = new RegExp(`(${searchTerm})`, 'gi')
            if (originalText.match(regex)) {
                found = true
                const newHtml = originalText.replace(regex, '<span class="highlight">$1</span>')
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = newHtml
                // Replace the text node with the new HTML content
                while (tempDiv.firstChild) {
                    node.parentNode.insertBefore(tempDiv.firstChild, node)
                }
                node.parentNode.removeChild(node) // Remove the original text node
            }
        })

        if (found) {
            // Scroll to the first highlighted element
            const firstHighlight = document.querySelector('.highlight')
            if (firstHighlight) {
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        } else {
            alert('Nenhum resultado encontrado para "' + searchTerm + '".')
        }
    }

    function clearHighlights() {
        const highlights = document.querySelectorAll('.highlight')
        highlights.forEach((span) => {
            // Replace the span with its text content
            const parent = span.parentNode
            parent.replaceChild(document.createTextNode(span.textContent), span)
        })
        // Re-join adjacent text nodes that might have been split
        constitutionContainer.normalize()
    }

    // Helper function to get all text nodes in an element
    function getTextNodes(node) {
        const textNodes = []
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i]
            if (child.nodeType === Node.TEXT_NODE) {
                textNodes.push(child)
            } else if (child.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE'].includes(child.tagName)) {
                textNodes.push(...getTextNodes(child))
            }
        }
        return textNodes
    }
})
