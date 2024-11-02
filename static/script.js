$(document).ready(function() {
    let chatHistory = []; // Array to store chat sessions
    let currentChatIndex = -1; // Index of the current chat session

    // Function to display messages
    function displayMessages() {
        $('#messages').empty(); // Clear previous messages
        const messages = chatHistory[currentChatIndex].messages; // Get current chat messages
        messages.forEach(msg => {
            $('#messages').append(`<div class="${msg.type}-message">${msg.text}</div>`);
        });
    }

    // Function to update chat history sidebar
    function updateChatHistorySidebar() {
        $('#chatHistory').empty(); // Clear current history
        chatHistory.forEach((chat, index) => {
            const summary = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Empty Chat";
            $('#chatHistory').append(`<div class="session-item" data-index="${index}">Chat ${index + 1}: ${summary}</div>`);
        });

        // Click event for loading chat sessions
        $('.session-item').click(function() {
            currentChatIndex = $(this).data('index'); // Get index from data attribute
            displayMessages(); // Display messages for selected chat
        });
    }

    // New chat button
    $('#newChatButton').click(function() {
        if (currentChatIndex !== -1) {
            // Add a summary of the previous chat to history
            const summary = chatHistory[currentChatIndex].messages.length > 0 ? chatHistory[currentChatIndex].messages[chatHistory[currentChatIndex].messages.length - 1].text : "Empty Chat";
            const newChat = {
                messages: [],
                summary: summary
            };
            chatHistory.push(newChat);
            currentChatIndex = chatHistory.length - 1; // Set to the new chat index
            displayMessages(); // Display the new chat messages
            updateChatHistorySidebar(); // Update the sidebar
        } else {
            // First chat initialization
            const newChat = {
                messages: []
            };
            chatHistory.push(newChat);
            currentChatIndex = chatHistory.length - 1; // Set to the new chat index
            displayMessages(); // Display the new chat messages
            updateChatHistorySidebar(); // Update the sidebar
        }
    });

    // Send button functionality
    $('#sendButton').click(function() {
        const userInput = $('#userInput').val();
        if (userInput.trim()) {
            const userMessage = {
                type: 'user',
                text: userInput
            };
            chatHistory[currentChatIndex].messages.push(userMessage); // Add user message to chat
            $('#userInput').val(''); // Clear input field
            displayMessages(); // Display updated messages

            // Simulate AI response
            setTimeout(() => {
                const aiMessage = {
                    type: 'ai',
                    text: `AI Response: ${userInput}` // Mock AI response
                };
                chatHistory[currentChatIndex].messages.push(aiMessage); // Add AI message to chat
                displayMessages(); // Display updated messages
            }, 1000); // Simulate a delay for AI response
        }
    });

    // Toggle dark/light mode
    $('.theme-toggle').click(function() {
        $('body').toggleClass('dark-mode'); // Toggle the class for dark mode
        const buttonText = $(this).text() === 'Toggle Dark/Light Mode' ? 'Toggle Light/Dark Mode' : 'Toggle Dark/Light Mode';
        $(this).text(buttonText); // Change button text
    });

    // Pressing 'Enter' sends the message
    $('#userInput').keypress(function(e) {
        if (e.which == 13) { // 13 is the Enter key
            $('#sendButton').click(); // Trigger send button click
        }
    });
});
