# app.py
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import requests, os

app = Flask(__name__)

# Load environment variables
load_dotenv()
api_key = os.getenv('API_KEY')

if not api_key:
    raise EnvironmentError("API_KEY not found in environment variables")

HUGGING_FACE_API_KEY = api_key
MODEL = "gpt-3.5-turbo"  # Ensure this model supports your use case
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
    if isinstance(response, list) and "generated_text" in response[0]:
        generated_text = response[0]["generated_text"]
    else:
        generated_text = "Unexpected response format from the model."

    return jsonify({"response": generated_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
