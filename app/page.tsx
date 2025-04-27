'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function MaskCanvas({ image, onMaskChange }: { image: File, onMaskChange: (mask: Blob) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [drawing, setDrawing] = useState(false);

  React.useEffect(() => {
    if (!image) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (imgRef.current && e.target?.result) {
        imgRef.current.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(image);
  }, [image]);

  const startDraw = (e: React.MouseEvent) => {
    setDrawing(true);
    draw(e);
  };
  const endDraw = () => {
    setDrawing(false);
    // Export mask as PNG
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) onMaskChange(blob);
      }, 'image/png');
    }
  };
  const draw = (e: React.MouseEvent) => {
    if (!drawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(
      (e.nativeEvent.offsetX),
      (e.nativeEvent.offsetY)
    );
    ctx.lineTo(
      (e.nativeEvent.offsetX + 0.1),
      (e.nativeEvent.offsetY + 0.1)
    );
    ctx.stroke();
  };

  return (
    <div className="relative inline-block">
      <img ref={imgRef} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm select-none pointer-events-none" />
      <canvas
        ref={canvasRef}
        width={imgRef.current?.width || 512}
        height={imgRef.current?.height || 512}
        className="absolute top-0 left-0 w-full h-full cursor-crosshair z-10"
        style={{ touchAction: 'none' }}
        onMouseDown={startDraw}
        onMouseUp={endDraw}
        onMouseOut={endDraw}
        onMouseMove={draw}
      />
      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">Draw over watermark</div>
    </div>
  );
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [mask, setMask] = useState<Blob | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setProcessedImage(null);
      setError(null);
      setMask(null);
    } else {
      setError('Please upload a valid image file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleProcessImage = async () => {
    if (!image || !mask) {
      setError('Please draw over the watermark area before processing.');
      return;
    }
    setLoading(true);
    setError(null);
    setProcessingStage('Uploading image and mask...');
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('mask', mask, 'mask.png');
      setProcessingStage('Processing with AI...');
      const response = await axios.post('/api/remove-watermark', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProcessingStage(`Processing image: ${progress}%`);
        }
      });
      setProcessingStage('Applying final enhancements...');
      setProcessedImage(response.data.image);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setProcessingStage('');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          AI Watermark Remover
        </motion.h1>
        <motion.p 
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Draw over the watermark for best results
        </motion.p>

        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
          >
            <input {...getInputProps()} />
            {image ? (
              <div className="space-y-4">
                <MaskCanvas image={image} onMaskChange={setMask} />
                <p className="text-sm text-gray-500">Selected: {image.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-400">
                  Supports JPG, PNG, and WebP formats
                </p>
              </div>
            )}
          </div>

          {error && (
            <motion.p 
              className="text-red-500 mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          {processingStage && (
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-primary">{processingStage}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: processingStage.includes('%') ? processingStage.split(':')[1].trim() : '100%' }}
                />
              </div>
            </motion.div>
          )}

          {image && !processedImage && (
            <motion.button
              className="btn-primary w-full mt-4"
              onClick={handleProcessImage}
              disabled={loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {loading ? 'Processing...' : 'Remove Watermark'}
            </motion.button>
          )}

          {processedImage && (
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Processed Image</h2>
              <div className="relative">
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="max-w-full rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  AI Enhanced
                </div>
              </div>
              <a 
                href={processedImage}
                download
                className="btn-primary block text-center mt-4"
              >
                Download Enhanced Image
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
} 