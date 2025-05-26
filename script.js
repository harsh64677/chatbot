javascript
async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;
  appendMessage("You", message);
  input.value = "";

  const res = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  appendMessage("Zippy", data.reply);
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
}