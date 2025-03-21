import os
import numpy as np
import onnxruntime as ort
from PIL import Image
from skimage import transform
import io
import logging
from memory_profiler import memory_usage
import gc
import time

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[
    logging.FileHandler("memory_usage.log"),
    logging.StreamHandler()
])

PHOTO_SIZE = 224
MODEL_DIR = "./onnx/"  
MEMORY_THRESHOLD = 512  # Set memory threshold in MiB

class ModelPredictor:
    def __init__(self):
        self.models_names = [
            "efficient_net_B0_model.onnx",
            "vgg_model50.onnx"
        ]

    def _load_model(self, model_name):
        model_path = os.path.join(MODEL_DIR, model_name)
        logging.info(f"Loading model from: {model_path}")
        session = ort.InferenceSession(model_path)
        self.log_memory_usage(f"After loading {model_name}")
        return session

    def preprocess_image(self, image):
        """Preprocess image for model prediction"""
        if isinstance(image, str):  # Check if image is a string
            image = Image.open(image)
        if isinstance(image, bytes):  # Check if image is bytes
            image = Image.open(io.BytesIO(image))
        if image.mode != 'RGB':  # Check if image is in RGB mode
            image = image.convert('RGB')
        np_image = np.array(image).astype('float32') / 255.0
        np_image = transform.resize(np_image, (PHOTO_SIZE, PHOTO_SIZE, 3))
        self.log_memory_usage("After preprocessing image")
        return np.expand_dims(np_image, axis=0)

    def check_memory(self):
        """Check current memory usage and enforce garbage collection if needed."""
        mem_usage = memory_usage(-1, interval=0.1, timeout=1)
        current_memory = max(mem_usage)
        logging.info(f"Current memory usage: {current_memory} MiB")
        
        if current_memory > MEMORY_THRESHOLD:
            logging.warning(f"Memory usage exceeds threshold of {MEMORY_THRESHOLD} MiB. Triggering garbage collection.")
            gc.collect()  # Force garbage collection
            time.sleep(1)  # Wait a moment for memory to be freed
            mem_usage = memory_usage(-1, interval=0.1, timeout=1)
            current_memory = max(mem_usage)
            logging.info(f"Memory after garbage collection: {current_memory} MiB")

        return current_memory

    def predict(self, image):
        """Make predictions using all models one at a time"""
        predictions = {}

        for model_name in self.models_names:
            self.check_memory()  # Check memory before loading the model
            session = self._load_model(model_name)  # Load model
            try:
                img = self.preprocess_image(image)
                input_name = session.get_inputs()[0].name
                output = session.run(None, {input_name: img})
                probabilities = output[0]  # Assuming the first output is the probabilities

                # Process the output based on the model
                if model_name == "vgg_model50.onnx" or model_name == "inception_model.onnx":
                    predicted_class = "Autistic" if probabilities.argmax() == 1 else "Non-Autistic"
                    confidence = float(probabilities.max() * 100)
                else:  # For EfficientNet models
                    predicted_class = "Autistic" if probabilities[0][0] > 0.5 else "Non-Autistic"
                    confidence = float(probabilities[0][0] * 100 if probabilities[0][0] > 0.5 else (1 - probabilities[0][0]) * 100)

                predictions[model_name] = {
                    "class": predicted_class,
                    "confidence": confidence
                }

            finally:
                del session  # Unload the model session
                gc.collect()  # Explicitly call garbage collection
                self.log_memory_usage(f"After unloading {model_name}")

        return predictions

    def log_memory_usage(self, message):
        mem_usage = memory_usage(-1, interval=0.1, timeout=1)
        logging.info(f"{message}: Memory usage: {mem_usage} MiB")