import os
import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from autism_detection import ModelPredictor
from dotenv import load_dotenv
from groq import Groq

# Initialize FastAPI app
app = FastAPI(
    title="MiniMinds Combined API",
    description="API for chat and autism detection services",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

# Initialize Groq client
client = Groq(api_key=api_key)

# Initialize model predictor
predictor = ModelPredictor()

# Request model for chat endpoint
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": request.message}],
            model="llama-3.2-90b-vision-preview"
        )
        return JSONResponse({"response": chat_completion.choices[0].message.content})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files are supported")

        raw_predictions = predictor.predict(contents)

        if not raw_predictions:
            raise HTTPException(status_code=500, detail="Model returned no predictions")

        # Format the predictions into a readable message
        predictions_text = "\n".join([
            f"Model: {model_name}, Class: {pred_data.get('class', 'Unknown')}, Confidence: {pred_data.get('confidence', 0.0):.2f}"
            for model_name, pred_data in raw_predictions.items()
        ])

        # Send the formatted predictions to the chatbot
        chat_request = ChatRequest(message=f"Please analyze this result, and give the final prediction whether
                                   it is autistic or not, make sure if 2/4 models predict non autistic, then it is not autistic. Just
                                   give me the final prediction of Autistic or Non-Autistic.\n{predictions_text}")
        chat_response = await chat(chat_request)

        return chat_response  # Directly return the chatbot response

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging
        return JSONResponse(content={"error": str(e)}, status_code=500)

# use uvicorn api_call:app --reload