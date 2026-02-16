import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    enum: ['house', 'vehicle'],
    required: true
  },
  category: String,
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  features: [String]
}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);
