import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert the image to buffer
    const buffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // First pass: Use sharp for initial processing
    const processedBuffer = await sharp(imageBuffer)
      .modulate({ brightness: 1.2 }) // Increase brightness
      .sharpen({ sigma: 1.5 }) // Sharpen the image
      .toBuffer();

    // Upload to Cloudinary with advanced transformations
    const uploadResult = await cloudinary.uploader.upload(
      `data:${image.type};base64,${processedBuffer.toString('base64')}`,
      {
        resource_type: 'auto',
        folder: 'watermark-remover',
        transformation: [
          // Color adjustments
          { effect: 'improve:outdoor:100' },
          { effect: 'auto_contrast:100' },
          { effect: 'auto_brightness:100' },
          { effect: 'saturation:50' },
          
          // Detail enhancement
          { effect: 'sharpen:100' },
          { effect: 'unsharp_mask:100' },
          
          // Noise reduction
          { effect: 'noise_reduction:100' },
          
          // Quality settings
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
      }
    );

    // Apply final transformations
    const processedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        // Final color adjustments
        { effect: 'improve:outdoor:100' },
        { effect: 'auto_contrast:100' },
        
        // Final detail enhancement
        { effect: 'sharpen:100' },
        
        // Final quality settings
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    return NextResponse.json({ image: processedUrl });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 