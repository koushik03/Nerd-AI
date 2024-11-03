$(document).ready(function() {
    let chatHistory = [];
    let currentChatIndex = -1;

    // Function to display messages
    function displayMessages() {
        $('#messages').empty();
        const messages = chatHistory[currentChatIndex].messages;
        messages.forEach(msg => {
            $('#messages').append(`<div class="${msg.type}-message">${msg.text}</div>`);
        });
    }

    // Function to update chat history sidebar
    function updateChatHistorySidebar() {
        $('#chatHistory').empty();
        chatHistory.forEach((chat, index) => {
            const summary = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Empty Chat";
            $('#chatHistory').append(`<div class="session-item" data-index="${index}">Chat ${index + 1}: ${summary}</div>`);
        });

        $('.session-item').click(function() {
            currentChatIndex = $(this).data('index');
            displayMessages();
        });
    }

    // New chat button
    $('#newChatButton').click(function() {
        if (currentChatIndex !== -1) {
            const summary = chatHistory[currentChatIndex].messages.length > 0 ? chatHistory[currentChatIndex].messages[chatHistory[currentChatIndex].messages.length - 1].text : "Empty Chat";
            const newChat = { messages: [], summary: summary };
            chatHistory.push(newChat);
            currentChatIndex = chatHistory.length - 1;
            displayMessages();
            updateChatHistorySidebar();
        } else {
            const newChat = { messages: [] };
            chatHistory.push(newChat);
            currentChatIndex = chatHistory.length - 1;
            displayMessages();
            updateChatHistorySidebar();
        }
    });

    // Send button functionality
    $('#sendButton').click(function() {
        const userInput = $('#userInput').val();
        if (userInput.trim()) {
            const userMessage = { type: 'user', text: userInput };
            chatHistory[currentChatIndex].messages.push(userMessage);
            $('#userInput').val('');
            displayMessages();

            // Make AJAX call to the Flask API
            $.ajax({
                url: '/chat',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ message: userInput }),
                success: function(response) {
                    const aiMessage = { type: 'ai', text: response.response };
                    chatHistory[currentChatIndex].messages.push(aiMessage);
                    displayMessages();
                },
                error: function(xhr) {
                    const errorMessage = { type: 'ai', text: `Error: ${xhr.responseJSON.error}` };
                    chatHistory[currentChatIndex].messages.push(errorMessage);
                    displayMessages();
                }
            });
        }
    });

    // Toggle dark/light mode
    $('.theme-toggle').click(function() {
        $('body').toggleClass('dark-mode');
        const buttonText = $(this).text() === 'Light Mode' ? 'Dark Mode' : 'Light Mode';
        $(this).text(buttonText);
    });

    // Pressing 'Enter' sends the message
    $('#userInput').keypress(function(e) {
        if (e.which == 13) {
            $('#sendButton').click();
        }
    });
});
