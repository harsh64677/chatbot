const chatLog = document.getElementById("chatlog");
const inputField = document.getElementById("userInput");

let chatbotData = [];

// Load chatbot intents from JSON file
async function loadIntents() {
  try {
    const response = await fetch("intents.json");
    const data = await response.json();
    chatbotData = data.intents;
  } catch (err) {
    appendMessage("Sorry, failed to load chatbot data.", "bot-msg");
  }
}

// Append a message to chat log
function appendMessage(message, className) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.textContent = message;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Respond to user's message
function handleResponse(userText) {
  if (!chatbotData || chatbotData.length === 0) {
    appendMessage("I'm currently unavailable to respond.", "bot-msg");
    return;
  }

  const lowerCaseText = userText.toLowerCase();

  let matchedIntent = chatbotData.find(intent =>
    intent.patterns.some(pattern => lowerCaseText.includes(pattern.toLowerCase()))
  );

  if (matchedIntent) {
    const reply = matchedIntent.responses[Math.floor(Math.random() * matchedIntent.responses.length)];
    appendMessage(reply, "bot-msg");
  } else {
    appendMessage("I'm not sure how to respond to that.", "bot-msg");
  }
}

// Send message from input
function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  appendMessage(userText, "user-msg");
  inputField.value = "";
  handleResponse(userText);
}

// Event listener for Enter key
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Load chatbot data when script starts
loadIntents();
