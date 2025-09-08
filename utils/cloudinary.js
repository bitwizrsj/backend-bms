require('dotenv').config(); 

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Corrected Multer Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'course_images',
    resource_type: 'image', // Make it explicit
    format: file.mimetype.split('/')[1], // Extract file format like 'jpeg'
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }),
});

const parser = multer({ storage });

module.exports = { cloudinary, parser };
