import os
import base64
from uuid import uuid4
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from autism_detection import ModelPredictor
from dotenv import load_dotenv
from groq import Groq
import cv2
import tempfile

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
        chat_request = ChatRequest(message=f"""Please analyze this result, and give the analysis process of each model, whether
                                   it is autistic or not. Then give me the final prediction of Autistic or Non-Autistic.\n{predictions_text}""")
        chat_response = await chat(chat_request)

        return chat_response  # Directly return the chatbot response

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging
        return JSONResponse(content={"error": str(e)}, status_code=500)

def extract_frames(video_path, frame_rate=1):
    vidcap = cv2.VideoCapture(video_path)
    frames = []
    fps = int(vidcap.get(cv2.CAP_PROP_FPS))
    frame_interval = max(1, fps // frame_rate)
    
    success, image = vidcap.read()
    count = 0
    
    while success:
        if count % frame_interval == 0:
            _, buffer = cv2.imencode('.jpg', image)
            base64_frame = base64.b64encode(buffer).decode('utf-8')
            frames.append(base64_frame)

        success, image = vidcap.read()
        count += 1
        
    vidcap.release()

    return frames

@app.post("/analyze_video")
async def analyze_video(file: UploadFile = File(...)):
    try:
        # Save video to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            temp_video.write(await file.read())
            temp_video_path = temp_video.name

        # Extract frames from video
        frames = extract_frames(temp_video_path, frame_rate=1)

        if not frames:
            raise HTTPException(status_code=400, detail="No frames extracted from the video.")

        results = []
        for i, frame in enumerate(frames[:5]):  # Limit to 5 frames for efficiency
            # Determine image's MIME type
            mime_type = file.content_type
            
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Analyze frame {i+1} and describe the observed activity, focus on the child's behavior:"},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{mime_type};base64,{frame}"},
                        },
                    ],
                }
            ]

            # Send frame to Groq API
            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama-3.2-90b-vision-preview"
            )
            results.append(chat_completion.choices[0].message.content)

        os.remove(temp_video_path)  # Cleanup
        
        return JSONResponse({"responses": results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run FastAPI using: uvicorn api_call:app --reload