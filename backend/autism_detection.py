import os
import numpy as np
import tensorflow as tf
import gdown
from PIL import Image
from skimage import transform
from tensorflow.keras.models import load_model
from tensorflow.keras import backend as K
import io

PHOTO_SIZE = 224
MODEL_DIR = "./models/"

# Define FixedDropout outside of ModelPredictor
class FixedDropout(tf.keras.layers.Dropout):
    def _get_noise_shape(self, inputs):
        if self.noise_shape is None:
            return self.noise_shape
        return tuple([None if i is None else shape for i, shape in zip(self.noise_shape, tf.keras.backend.shape(inputs))])

# Custom DepthwiseConv2D
class CustomDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, *args, **kwargs):
        if 'groups' in kwargs:
            del kwargs['groups']
        super().__init__(*args, **kwargs)

class ModelPredictor:
    def __init__(self):
        self.custom_objects = self._get_custom_objects()
        self.models = self._load_models()

    def _get_custom_objects(self):
        # Removed 'swish' to avoid JSON serialization issues.
        return {
            'relu6': tf.keras.layers.ReLU(max_value=6),
            'DepthwiseConv2D': CustomDepthwiseConv2D,
            'FixedDropout': FixedDropout
        }

    def _load_models(self):
        try:
            # Download models from Google Drive
            self._download_model_from_drive('1Kh8o2jEVseJZj4kNnIKbt0e1ipDksJBT', 'efficient_net_B0_model.h5')
            self._download_model_from_drive('1bDyn9A9LrM7fZfYN7cabcHBfKKvTSATd', 'efficient_net_B7_model.h5')
            self._download_model_from_drive('1LLCX4Vy2AjySOnAuyFo15-Q8YdXLj5B1', 'inception_model.h5')
            self._download_model_from_drive('1XlQoYfPVE5YqtRaW2WZwQLF1Yp_Zqfsu', 'vgg_model50.h5')

            # Use custom_object_scope with our custom_objects.
            with tf.keras.utils.custom_object_scope(self.custom_objects):
                return {
                    'efficientnet_b0': load_model(os.path.join(MODEL_DIR, 'efficient_net_B0_model.h5'),
                                                   custom_objects=self.custom_objects, compile=False),
                    'efficientnet_b7': load_model(os.path.join(MODEL_DIR, 'efficient_net_B7_model.h5'),
                                                   custom_objects=self.custom_objects, compile=False),
                    'vgg': load_model(os.path.join(MODEL_DIR, 'vgg_model50.h5'),
                                      custom_objects=self.custom_objects),
                    'inception': load_model(os.path.join(MODEL_DIR, 'inception_model.h5'),
                                            custom_objects=self.custom_objects)
                }
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            raise

    def _download_model_from_drive(self, file_id, model_filename):
        """Download model from Google Drive using gdown"""
        file_url = f"https://drive.google.com/uc?id={file_id}"
        output_path = os.path.join(MODEL_DIR, model_filename)
        
        if not os.path.exists(MODEL_DIR):
            os.makedirs(MODEL_DIR)
        
        if not os.path.exists(output_path):  # Only download if not already present
            gdown.download(file_url, output_path, quiet=False)
            print(f"Downloaded {model_filename}")
        else:
            print(f"{model_filename} already exists, skipping download.")

    def preprocess_image(self, image):
        """Preprocess image for model prediction"""
        if isinstance(image, str):
            image = Image.open(image)
        if isinstance(image, bytes):
            image = Image.open(io.BytesIO(image))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        np_image = np.array(image).astype('float32') / 255.0
        np_image = transform.resize(np_image, (PHOTO_SIZE, PHOTO_SIZE, 3))
        return np.expand_dims(np_image, axis=0)

    def predict(self, image):
        """Make predictions using all models"""
        try:
            img = self.preprocess_image(image)
            # Get predictions from all models
            pred_vgg = self.models['vgg'].predict(img, verbose=0)
            pred_inception = self.models['inception'].predict(img, verbose=0)
            pred_effb0 = self.models['efficientnet_b0'].predict(img, verbose=0)
            pred_effb7 = self.models['efficientnet_b7'].predict(img, verbose=0)

            return {
                "VGG-16": {
                    "class": "Autistic" if pred_vgg.argmax() == 1 else "Non-Autistic",
                    "confidence": float(pred_vgg.max() * 100)
                },
                "Inception-V3": {
                    "class": "Autistic" if pred_inception.argmax() == 1 else "Non-Autistic",
                    "confidence": float(pred_inception.max() * 100)
                },
                "EfficientNet-B0": {
                    "class": "Autistic" if pred_effb0[0][0] > 0.5 else "Non-Autistic",
                    "confidence": float(pred_effb0[0][0] * 100 if pred_effb0[0][0] > 0.5 else (1 - pred_effb0[0][0]) * 100)
                },
                "EfficientNet-B7": {
                    "class": "Autistic" if pred_effb7[0][0] > 0.5 else "Non-Autistic",
                    "confidence": float(pred_effb7[0][0] * 100 if pred_effb7[0][0] > 0.5 else (1 - pred_effb7[0][0]) * 100)
                }
            }
        except Exception as e:
            raise RuntimeError(f"Prediction error: {str(e)}")
