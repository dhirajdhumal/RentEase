import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleListingStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    listing.availability = !listing.availability;
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'name email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingListings = async (req, res) => {
  try {
    const listings = await Listing.find({ isApproved: false }).populate('owner', 'name email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingListings = await Listing.countDocuments({ isApproved: false });

    res.json({
      totalUsers,
      totalListings,
      totalBookings,
      pendingListings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
