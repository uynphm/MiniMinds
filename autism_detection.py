import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from PIL import Image
from skimage import transform
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Activation, DepthwiseConv2D, Dropout
from tensorflow.keras import backend as K
import io

# Constants
PHOTO_SIZE = 224
MODEL_DIR = "./models/"

class ModelPredictor:
    def __init__(self):
        self.custom_objects = self._get_custom_objects()
        self.models = self._load_models()

    def _get_custom_objects(self):
        return {
            'swish': Activation(self._swish),
            'relu6': tf.keras.layers.ReLU(max_value=6),
            'DepthwiseConv2D': self.CustomDepthwiseConv2D,
            'FixedDropout': self.FixedDropout
        }

    def _load_models(self):
        try:
            with tf.keras.utils.custom_object_scope(self.custom_objects):
                return {
                    'efficientnet_b0': load_model(
                        os.path.join(MODEL_DIR, 'efficient_net_B0_model.h5'),
                        compile=False
                    ),
                    'efficientnet_b7': load_model(
                        os.path.join(MODEL_DIR, 'efficient_net_B7_model.h5'),
                        compile=False
                    ),
                    'vgg': load_model(os.path.join(MODEL_DIR, 'vgg_model50.h5')),
                    'inception': load_model(os.path.join(MODEL_DIR, 'inception_model.h5'))
                }
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            raise

    @staticmethod
    def _swish(x):
        return K.sigmoid(x) * x

    class FixedDropout(Dropout):
        def _get_noise_shape(self, inputs):
            if self.noise_shape is None:
                return self.noise_shape
            return tuple([None if i is None else shape for i, shape in zip(self.noise_shape, K.shape(inputs))])

    class CustomDepthwiseConv2D(DepthwiseConv2D):
        def __init__(self, *args, **kwargs):
            if 'groups' in kwargs:
                del kwargs['groups']
            super().__init__(*args, **kwargs)

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
