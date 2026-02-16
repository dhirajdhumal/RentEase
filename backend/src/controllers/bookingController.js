import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

export const createBooking = async (req, res) => {
  try {
    const { listing, startDate, endDate } = req.body;

    const listingData = await Listing.findById(listing);
    if (!listingData || !listingData.availability) {
      return res.status(400).json({ message: 'Listing not available' });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = days * listingData.price;

    const booking = await Booking.create({
      user: req.user._id,
      listing,
      startDate,
      endDate,
      totalAmount
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('listing')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    // Find all listings owned by the user
    const listings = await Listing.find({ owner: req.user._id });
    const listingIds = listings.map(l => l._id);
    
    // Find all bookings for those listings
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate('listing')
      .populate('user', 'name email phone')
      .sort('-createdAt');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the owner of the listing or admin
    if (booking.listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('listing')
      .populate('user', 'name email phone');

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
