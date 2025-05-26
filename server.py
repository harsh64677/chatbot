⁠ python
from flask import Flask, request, jsonify
from chatbot import chatbot_response  # Your AI code should be in chatbot.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json["message"]
    response = chatbot_response(user_msg)
    return jsonify({"reply": response})

if __name__ == "__main__":
    app.run(debug=True)
