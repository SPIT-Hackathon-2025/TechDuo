from PIL import Image
import cv2
import numpy as np
import base64
import os
from datetime import datetime
from typing import Optional

class ImageHandler:
    def __init__(self, upload_folder: str):
        self.upload_folder = upload_folder
        self._ensure_upload_folder()

    def _ensure_upload_folder(self):
        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)

    def convert_to_jpg(self, input_file) -> Optional[str]:
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = os.path.join(self.upload_folder, f'uploaded_{timestamp}.jpg')
            
            image = Image.open(input_file)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image.save(output_path, 'JPEG')
            return output_path
        except Exception as e:
            print(f"Error converting image: {e}")
            return None

    def save_camera_capture(self, base64_image: str) -> Optional[str]:
        try:
            base64_str = base64_image.split(',')[1]
            img_bytes = base64.b64decode(base64_str)
            img_array = np.frombuffer(img_bytes, dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

            if img is None:
                raise ValueError("Invalid image data")

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = os.path.join(self.upload_folder, f'capture_{timestamp}.jpg')
            cv2.imwrite(output_path, img)
            return output_path
        except Exception as e:
            print(f"Error saving camera capture: {e}")
            return None

    def cleanup_files(self, *files):
        for file_path in files:
            try:
                if file_path and os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Error cleaning up file {file_path}: {e}")
