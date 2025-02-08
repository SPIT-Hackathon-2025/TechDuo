from deepface import DeepFace
import cv2
import numpy as np
from typing import Tuple, Optional

class FaceVerifier:
    @staticmethod
    def verify_faces(img1_path: str, img2_path: str) -> Tuple[bool, Optional[float]]:
        try:
            # First check if faces are detected in both images
            img1 = cv2.imread(img1_path)
            img2 = cv2.imread(img2_path)
            
            if img1 is None or img2 is None:
                raise ValueError("Cannot read one or both images")

            # Perform face detection first
            detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces1 = detector.detectMultiScale(cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY))
            faces2 = detector.detectMultiScale(cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY))

            if len(faces1) == 0 or len(faces2) == 0:
                return False, None

            # Perform face verification
            result = DeepFace.verify(
                img1_path=img1_path,
                img2_path=img2_path,
                enforce_detection=False  # We already checked for faces
            )
            return result['verified'], result['distance']

        except Exception as e:
            print(f"Error in face verification: {e}")
            return False, None
