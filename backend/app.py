from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from image_handler import ImageHandler
from face_verifier import FaceVerifier
import os
from functools import wraps

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'temp'
image_handler = ImageHandler(UPLOAD_FOLDER)

# Store the reference image path in session
reference_image = {'path': None}

def require_reference_image(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if reference_image['path'] is None:
            return jsonify({'error': 'Please upload reference image first'}), 400
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Clean up previous reference image if it exists
        if reference_image['path']:
            image_handler.cleanup_files(reference_image['path'])
        
        output_path = image_handler.convert_to_jpg(file)
        if not output_path:
            return jsonify({'error': 'Error processing file'}), 500
        
        reference_image['path'] = output_path
        return jsonify({'message': 'File uploaded successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/capture', methods=['POST'])
@require_reference_image
def capture():
    try:
        if not request.json or 'image' not in request.json:
            return jsonify({'error': 'No image data'}), 400
        
        capture_path = image_handler.save_camera_capture(request.json['image'])
        if not capture_path:
            return jsonify({'error': 'Error processing capture'}), 500

        verified, distance = FaceVerifier.verify_faces(reference_image['path'], capture_path)
        
        # Clean up the captured image
        image_handler.cleanup_files(capture_path)
        
        return jsonify({
            'verified': verified,
            'distance': distance,
            'threshold': 0.6,  # You can adjust this threshold
            'message': 'Verification successful' if verified else 'Verification failed'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # Clean up all files
        if reference_image['path']:
            image_handler.cleanup_files(reference_image['path'])
            reference_image['path'] = None
        
        return jsonify({'message': 'Session completed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)