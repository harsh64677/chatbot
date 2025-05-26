// ----- Normalization Utilities -----
const stopWords = new Set([
  "a", "an", "the", "is", "are", "was", "were", "in", "on", "at", "to", "for",
  "and", "or", "of", "can", "you", "how", "do", "i", "what", "please", "tell", "me"
]);

const synonyms = {
  "lose": ["shed", "drop", "reduce"],
  "weight": ["pounds", "kgs", "kilograms"],
  "how": ["way", "method"],
  "change": ["replace", "swap"],
  "fix": ["repair", "mend"],
  "buy": ["purchase"],
  "tell": ["say", "inform"],
  "joke": ["funny", "humor"],
  "hi": ["hello", "hey", "greetings"],
  "thanks": ["thank", "thank you", "thx"]
};

function preprocess(text) {
  let words = text
    .toLowerCase()
    .replace(/[.,!?;:']/g, "")
    .split(/\s+/)
    .filter(word => word && !stopWords.has(word));

  words = words.map(word => {
    for (const [key, syns] of Object.entries(synonyms)) {
      if (word === key || syns.includes(word)) return key;
    }
    return word;
  });

  return words;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => []);
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// ----- Response Logic -----

function getOverlapScore(inputWords, questionWords) {
  let score = 0;
  for (const iWord of inputWords) {
    for (const qWord of questionWords) {
      if (iWord === qWord) {
        score += 2;
        break;
      } else if (levenshtein(iWord, qWord) <= 1) {
        score += 1;
        break;
      }
    }
  }
  return score;
}

function findBestAnswer(userInput) {
  const inputWords = preprocess(userInput);

  // First: check for direct match (after preprocessing)
  for (const qa of qaPairs) {
    const questionWords = preprocess(qa.question);
    if (JSON.stringify(inputWords) === JSON.stringify(questionWords)) {
      return qa.answer;
    }
  }

  // Then: keyword or fuzzy match
  let bestMatch = null;
  let highestScore = 0;
  const threshold = 2;

  for (const qa of qaPairs) {
    const questionWords = preprocess(qa.question);
    const score = getOverlapScore(inputWords, questionWords);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = qa;
    }
  }

  return highestScore >= threshold
    ? bestMatch.answer
    : "Sorry, I don't understand. Can you please rephrase?";
}

// ----- Chat UI Functions -----

function addMessage(text, isUser) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", isUser ? "user-message" : "bot-message");
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById("chat-box");
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot-message", "typing");
  typingDiv.id = "typing-indicator";
  typingDiv.textContent = "Zippy is typing...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

function handleSend() {
  const inputField = document.getElementById("user-input");
  const userInput = inputField.value;

  if (userInput.trim() === "") return;

  addMessage(userInput, true);
  inputField.value = "";

  showTyping();

  setTimeout(() => {
    removeTyping();
    const botReply = findBestAnswer(userInput);
    addMessage(botReply, false);
  }, 700); // simulate typing delay
}

// ----- Event Listener Setup -----

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  });

  const toggleBtn = document.getElementById("dark-mode-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }
});
