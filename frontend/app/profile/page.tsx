"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Star, Clock, Shield, Upload, Camera, Building2 } from "lucide-react";

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Open Camera and Capture Image
  const startCamera = async () => {
    setShowCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Capture Image from Camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 200);
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setShowCamera(false);
    }
  };

  // Upload reference document
  const uploadDocument = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  // Function to handle Verification using ML Model
  const verifyIdentity = async () => {
    if (!selectedFile || !capturedImage) {
      setError("Please upload a document and capture your image first!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First upload the reference document
      const uploadSuccess = await uploadDocument();
      if (!uploadSuccess) return;

      // Then send the captured image for verification
      const response = await fetch('http://localhost:5000/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setIsVerified(data.verified);
      
      // Show verification result
      alert(data.verified ? 
        `Verification Successful! Match confidence: ${((1 - data.distance) * 100).toFixed(2)}%` : 
        'Verification Failed! Identity Mismatch.');

      // Cleanup after verification
      await fetch('http://localhost:5000/submit', {
        method: 'POST'
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error in verification process');
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Add error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground">0x1234...5678</p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="secondary">Tenant</Badge>
              {isVerified === null ? (
                <Badge variant="secondary" className="bg-gray-200 text-gray-800">
                  Not Verified
                </Badge>
              ) : isVerified ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Unverified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Reputation Score</span>
              </div>
              <span className="font-semibold">4.8/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Member Since</span>
              </div>
              <span className="font-semibold">Jan 2024</span>
            </div>
            <Button className="w-full mt-4" onClick={startCamera}>
              <Shield className="h-4 w-4 mr-2" />
              Verify Identity
            </Button>
          </CardContent>
        </Card>

        {/* Document Upload Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="text-xl font-semibold">Identity Verification</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Upload your ID Document</p>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                <Button variant="outline" className="mt-4">Choose File</Button>
              </label>
              {selectedFile && <div className="mt-4 text-sm text-muted-foreground">Selected: <span className="font-semibold">{selectedFile.name}</span></div>}
            </div>

            {showCamera && (
              <div className="mt-6 text-center">
                <video ref={videoRef} autoPlay className="rounded-lg border" width="300" height="200"></video>
                <canvas ref={canvasRef} className="hidden" width="300" height="200"></canvas>
                <Button className="mt-4" onClick={captureImage}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Image
                </Button>
              </div>
            )}

            {capturedImage && <img src={capturedImage} alt="Captured" className="mt-4 mx-auto rounded-lg border" width="200" />}

            <Button 
              className="mt-4 w-full" 
              onClick={verifyIdentity} 
              disabled={!selectedFile || !capturedImage || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
