import tensorflow as tf
import tf2onnx
import os

MODEL_DIR = "./models/"

# List of models to convert
models_to_convert = [
    "efficient_net_B0_model.h5",
    "efficient_net_B7_model.h5",
    "inception_model.h5",
    "vgg_model50.h5"
]

# Custom FixedDropout layer due to shape mismatch
class FixedDropout(tf.keras.layers.Dropout):
    def _get_noise_shape(self, inputs):
        if self.noise_shape is None:
            return self.noise_shape
        return tuple([None if i is None else shape for i, shape in zip(self.noise_shape, tf.keras.backend.shape(inputs))])

# Function to convert and save models to ONNX format
def convert_models_to_onnx(model_names):
    for model_name in model_names:
        try:
            model_path = os.path.join(MODEL_DIR, model_name)
            print(f"Loading model from: {model_path}")

            # Load the model with custom objects
            with tf.keras.utils.custom_object_scope({'FixedDropout': FixedDropout}):  # Ensure FixedDropout is defined
                model = tf.keras.models.load_model(model_path)

            # Convert the model to ONNX format
            onnx_model, _ = tf2onnx.convert.from_keras(model)  # Unpack the tuple

            # Save the ONNX model to a file
            onnx_filename = model_name.replace('.h5', '.onnx')
            with open(onnx_filename, "wb") as f:
                f.write(onnx_model.SerializeToString())
            print(f"Successfully converted and saved: {onnx_filename}")

        except Exception as e:
            print(f"Error converting model {model_name}: {str(e)}")

# Run the conversion
convert_models_to_onnx(models_to_convert)