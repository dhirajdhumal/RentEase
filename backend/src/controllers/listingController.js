import Listing from '../models/Listing.js';

export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      owner: req.user._id
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const { type, category, city, minPrice, maxPrice, availability } = req.query;
    const filter = { isApproved: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (availability) filter.availability = availability === 'true';

    console.log('Listing filter:', filter);
    const listings = await Listing.find(filter).populate('owner', 'name email');
    console.log('Found listings:', listings.length);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email phone');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
