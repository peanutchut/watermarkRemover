import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import sharp from 'sharp';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const maskFile = formData.get('mask') as File | null;
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert the image to buffer
    const buffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 512;
    const height = metadata.height || 512;

    let maskBuffer: Buffer;
    if (maskFile) {
      // Use user-provided mask
      const maskArrayBuffer = await maskFile.arrayBuffer();
      maskBuffer = Buffer.from(maskArrayBuffer);
    } else {
      // Generate a simple center mask (white in center, black elsewhere, RGB)
      maskBuffer = await sharp({
        create: {
          width,
          height,
          channels: 3,
          background: { r: 0, g: 0, b: 0 },
        },
      })
        .composite([
          {
            input: await sharp({
              create: {
                width: Math.floor(width * 0.6),
                height: Math.floor(height * 0.6),
                channels: 3,
                background: { r: 255, g: 255, b: 255 },
              },
            })
              .png()
              .toBuffer(),
            left: Math.floor(width * 0.2),
            top: Math.floor(height * 0.2),
          },
        ])
        .png()
        .toBuffer();
    }

    // Convert images to base64 data URLs
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    const maskBase64 = `data:image/png;base64,${maskBuffer.toString('base64')}`;

    // Call Replicate's inpainting model
    const output = await replicate.run(
      'stability-ai/stable-diffusion-inpainting:db21e45e8b',
      {
        input: {
          image: imageBase64,
          mask: maskBase64,
          prompt: 'remove watermark, realistic background',
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    // The output is an array of image URLs
    const resultUrl = Array.isArray(output) ? output[0] : output;
    return NextResponse.json({ image: resultUrl });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 