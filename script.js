let intents;

fetch('intents.json')
  .then(response => response.json())
  .then(data => {
    intents = data.intents;
  })
  .catch(() => {
    addMessage("Failed to load chatbot data.", "bot-msg");
  });

const chatlog = document.getElementById('chatlog');
const userInput = document.getElementById('userInput');

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, 'user-msg');
  userInput.value = '';
  respondToMessage(message);
}

function addMessage(message, className) {
  const msgDiv = document.createElement('div');
  msgDiv.className = className;
  msgDiv.textContent = message;
  chatlog.appendChild(msgDiv);
  chatlog.scrollTop = chatlog.scrollHeight;
}

function respondToMessage(message) {
  if (!intents) {
    addMessage("Sorry, I can't respond right now.", "bot-msg");
    return;
  }
  const msgLower = message.toLowerCase();

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (msgLower.includes(pattern.toLowerCase())) {
        const responses = intent.responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        addMessage(response, "bot-msg");
        return;
      }
    }
  }

  addMessage("Sorry, I didn't understand that.", "bot-msg");
}

// Optional: allow Enter key to send message
userInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
