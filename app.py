# app.py
from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# Replace 'YOUR_HUGGING_FACE_API_KEY' with your actual API key
HUGGING_FACE_API_KEY = "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"
MODEL = "gpt2"  # You can choose other models like 'gpt-neo', 'gpt-3', etc.
API_URL = f"https://api-inference.huggingface.co/models/{MODEL}"
HEADERS = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}

# Function to send a request to Hugging Face's API
def query_hugging_face(payload):
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "details": response.text}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    payload = {
        "inputs": user_input,
    }

    # Send the user's input to the Hugging Face model
    response = query_hugging_face(payload)

    if "error" in response:
        return jsonify({"error": response["details"]}), response["error"]

    # Extract response text from the API output
    generated_text = response[0]["generated_text"]

    return jsonify({"response": generated_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
