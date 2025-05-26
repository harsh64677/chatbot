let intents;

fetch('intents.json')
  .then(response => response.json())
  .then(data => {
    intents = data.intents;
  });

const chatlog = document.getElementById('chatlog');
const userInput = document.getElementById('userInput');

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, 'user-msg');
  userInput.value = '';
  botResponse(message);
}

function addMessage(message, className) {
  const msgDiv = document.createElement('div');
  msgDiv.className = className;
  msgDiv.textContent = message;
  chatlog.appendChild(msgDiv);
  chatlog.scrollTop = chatlog.scrollHeight;
}

function botResponse(message) {
  if (!intents) {
    addMessage("Sorry, I can't respond right now.", 'bot-msg');
    return;
  }

  const msgLower = message.toLowerCase();
  for (let intent of intents) {
    for (let pattern of intent.patterns) {
      if (msgLower.includes(pattern.toLowerCase())) {
        const responses = intent.responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        addMessage(response, 'bot-msg');
        return;
      }
    }
  }
  addMessage("Sorry, I didn't understand that.", 'bot-msg');
}
