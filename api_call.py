import os
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = Groq(
    # export GROQ_API_KEY=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
    api_key=os.environ.get("GROQ_API_KEY")
)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_input,
            }
        ],
        model="llama-3.2-90b-vision-preview"
    )

    return jsonify({"response": chat_completion.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True)