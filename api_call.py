import os
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Process the file (e.g., save it, analyze it, etc.)
    # For demonstration, we'll just return a dummy response
    # You can integrate your actual analysis logic here

    # Dummy response
    response = "File analyzed successfully"

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True, port=3000)

"""
try {
    const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: input }),
    });
    
    const data = await res.json();
    setResponse(data.response);
} catch (error) {
    console.error('Error:', error);
    setResponse('Error occurred while fetching response');
} finally {
    setLoading(false);
}
"""