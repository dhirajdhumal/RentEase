import express from 'express';
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getBooking,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.get('/owner-bookings', protect, authorize('owner', 'admin'), getOwnerBookings);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBookingStatus);

export default router;
