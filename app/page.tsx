'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function Home() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    }
  });

  const handleRemoveWatermark = async () => {
    if (!image || remainingUses <= 0) return;

    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call an AI API here
      const reader = new FileReader();
      reader.onload = (e) => {
        setProcessedImage(e.target?.result as string);
        setRemainingUses(prev => prev - 1);
      };
      reader.readAsDataURL(image);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        className="cursor-follower"
        animate={{
          x: cursorPosition.x,
          y: cursorPosition.y,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Watermark Remover
          </h1>
          <p className="text-xl text-gray-600">
            Remove watermarks from your images with AI
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Remaining free uses: {remainingUses}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {image ? (
              <div className="relative h-64">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Uploaded image"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg">Drag & drop an image here</p>
                <p className="text-sm text-gray-500">or click to select</p>
              </div>
            )}
          </div>

          <div className="border-2 border-gray-300 rounded-lg p-8">
            {processedImage ? (
              <div className="relative h-64">
                <Image
                  src={processedImage}
                  alt="Processed image"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Processed image will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleRemoveWatermark}
            disabled={!image || remainingUses <= 0 || isProcessing}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              !image || remainingUses <= 0 || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-secondary text-white'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Remove Watermark'}
          </button>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/pricing"
            className="text-primary hover:text-secondary font-semibold"
          >
            Need more uses? Check out our pricing plans →
          </a>
        </div>
      </div>
    </div>
  );
} 