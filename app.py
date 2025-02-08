from flask import Flask, render_template, request, jsonify
import cv2
from PIL import Image
import os
import base64
import numpy as np
from datetime import datetime
from deepface import DeepFace

app = Flask(__name__)

# Create a temporary folder for storing images if it doesn't exist
UPLOAD_FOLDER = 'temp'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Global variable to store the reference image path
reference_image_path = None

def convert_to_jpg(input_file):
    try:
        # Generate unique filename based on timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(UPLOAD_FOLDER, f'uploaded_{timestamp}.jpg')
        
        # Open and convert the image
        image = Image.open(input_file)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image.save(output_path, 'JPEG')
        
        global reference_image_path
        reference_image_path = output_path
        return output_path
    except Exception as e:
        print(f"Error converting image: {e}")
        return None

def save_camera_capture(base64_image):
    try:
        # Remove the data URL prefix to get just the base64 string
        base64_str = base64_image.split(',')[1]
        
        # Decode base64 string to bytes
        img_bytes = base64.b64decode(base64_str)
        
        # Convert to numpy array
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        
        # Decode the image
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        # Generate unique filename based on timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(UPLOAD_FOLDER, f'capture_{timestamp}.jpg')
        
        # Save the image
        cv2.imwrite(output_path, img)
        return output_path
    except Exception as e:
        print(f"Error saving camera capture: {e}")
        return None

def verify_face(img1_path, img2_path):
    try:
        result = DeepFace.verify(
            img1_path=img1_path,
            img2_path=img2_path
        )
        # The result contains 'verified' boolean and 'distance' float
        # Lower distance means more similarity
        return result['verified'], result['distance']
    except Exception as e:
        print(f"Error in face verification: {e}")
        return False, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        output_path = convert_to_jpg(file)
        if output_path:
            return jsonify({'message': 'File uploaded successfully', 'path': output_path})
        return jsonify({'error': 'Error processing file'}), 500

@app.route('/capture', methods=['POST'])
def capture():
    if 'image' not in request.json:
        return jsonify({'error': 'No image data'}), 400
    
    if reference_image_path is None:
        return jsonify({'error': 'Please upload reference image first'}), 400
    
    output_path = save_camera_capture(request.json['image'])
    if output_path:
        # Perform face verification
        verified, distance = verify_face(reference_image_path, output_path)
        
        return jsonify({
            'message': 'Image captured successfully',
            'path': output_path,
            'verified': verified,
            'distance': distance
        })
    return jsonify({'error': 'Error processing capture'}), 500

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # Optionally perform any cleanup or final processing here
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()
        return jsonify({'message': 'Session terminated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 