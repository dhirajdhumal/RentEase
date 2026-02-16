import express from 'express';
import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getOwnerListings
} from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, authorize('owner', 'admin'), createListing);

router.get('/my-listings', protect, authorize('owner', 'admin'), getOwnerListings);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('owner', 'admin'), updateListing)
  .delete(protect, authorize('owner', 'admin'), deleteListing);

export default router;
