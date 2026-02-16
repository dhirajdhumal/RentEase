import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  approveListing,
  getPendingListings,
  getDashboardStats,
  toggleListingStatus,
  getAllListings
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/listings/pending', getPendingListings);
router.get('/listings', getAllListings);
router.put('/listings/:id/approve', approveListing);
router.put('/listings/:id/toggle-status', toggleListingStatus);
router.get('/stats', getDashboardStats);

export default router;
