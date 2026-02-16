import express from 'express';
import { uploadImages } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 5),
  uploadImages
);

export default router;
