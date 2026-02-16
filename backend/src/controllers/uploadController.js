import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'rentease',
        resource_type: 'image'
      });
      
      // Delete local file after upload
      fs.unlinkSync(file.path);
      
      return result.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};
