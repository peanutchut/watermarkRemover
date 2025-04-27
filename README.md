# Watermark Remover SaaS

A modern web application that uses AI-powered image processing to remove watermarks from images while preserving image quality.

## Features

- Advanced watermark removal using multiple processing stages
- High-quality image enhancement
- Cloud-based processing using Cloudinary
- Modern React-based UI with Framer Motion animations
- Drag-and-drop file upload support
- TypeScript for type safety
- Responsive design with Tailwind CSS

## Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- npm (v8 or higher)
- A Cloudinary account with API credentials

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Cloudinary
- Sharp
- Zustand
- React Dropzone
- Axios

## Project Structure

- `app/` - Next.js app directory containing pages and API routes
- `app/api/` - API routes for image processing
- `app/components/` - Reusable React components
- `public/` - Static assets

## License

MIT

## Support

For support, please open an issue in the repository. 