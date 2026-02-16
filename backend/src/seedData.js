import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Listing from './models/Listing.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'password123',
    role: 'owner',
    phone: '+91 98765 43210'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    role: 'owner',
    phone: '+91 98765 43211'
  },
  {
    name: 'Amit Patel',
    email: 'amit@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 98765 43212'
  }
];

const sampleListings = [
  // Houses
  {
    title: 'Luxury 3BHK Apartment in Bandra',
    description: 'Spacious 3BHK apartment with modern amenities, sea view, and 24/7 security. Perfect for families.',
    type: 'house',
    category: 'apartment',
    price: 5000,
    location: {
      address: 'Hill Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    features: ['WiFi', 'AC', 'Parking', 'Swimming Pool', 'Gym', 'Security'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ]
  },
  {
    title: 'Cozy Studio Apartment in Koramangala',
    description: 'Modern studio apartment ideal for professionals. Fully furnished with all amenities.',
    type: 'house',
    category: 'studio',
    price: 2500,
    location: {
      address: '80 Feet Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560034'
    },
    features: ['WiFi', 'AC', 'Furnished', 'Power Backup', 'Water Supply'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ]
  },
  {
    title: 'Beautiful Villa with Garden in Gurgaon',
    description: '4BHK independent villa with private garden, parking for 3 cars, and modern interiors.',
    type: 'house',
    category: 'villa',
    price: 8000,
    location: {
      address: 'DLF Phase 2',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122002'
    },
    features: ['WiFi', 'AC', 'Garden', 'Parking', 'Security', 'Modular Kitchen'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ]
  },
  {
    title: 'Penthouse with Terrace in Pune',
    description: 'Luxurious penthouse with private terrace, panoramic city views, and premium fittings.',
    type: 'house',
    category: 'penthouse',
    price: 10000,
    location: {
      address: 'Kalyani Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411006'
    },
    features: ['WiFi', 'AC', 'Terrace', 'Parking', 'Gym', 'Club House', 'Swimming Pool'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ]
  },
  
  // Vehicles
  {
    title: 'Honda City 2022 - Automatic',
    description: 'Well-maintained Honda City with automatic transmission. Perfect for city drives and long trips.',
    type: 'vehicle',
    category: 'sedan',
    price: 2000,
    location: {
      address: 'Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400069'
    },
    features: ['AC', 'GPS', 'Bluetooth', 'Music System', 'Power Windows', 'Airbags'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'
    ]
  },
  {
    title: 'Maruti Swift - Hatchback',
    description: 'Fuel-efficient Maruti Swift, ideal for city commuting. Clean and well-serviced.',
    type: 'vehicle',
    category: 'hatchback',
    price: 1200,
    location: {
      address: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560038'
    },
    features: ['AC', 'Music System', 'Power Steering', 'Central Locking'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
    ]
  },
  {
    title: 'Toyota Fortuner - Luxury SUV',
    description: 'Premium SUV perfect for family trips and outstation travel. Spacious and comfortable.',
    type: 'vehicle',
    category: 'suv',
    price: 4000,
    location: {
      address: 'Cyber City',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122002'
    },
    features: ['AC', 'GPS', 'Leather Seats', 'Sunroof', 'Cruise Control', '4WD'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
    ]
  },
  {
    title: 'Royal Enfield Classic 350',
    description: 'Iconic Royal Enfield bike for adventure enthusiasts. Well-maintained and ready to ride.',
    type: 'vehicle',
    category: 'bike',
    price: 800,
    location: {
      address: 'Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411014'
    },
    features: ['Helmet Included', 'Disc Brakes', 'Electric Start'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800'
    ]
  },
  {
    title: 'Honda Activa 6G - Scooter',
    description: 'Reliable and fuel-efficient scooter for daily commute. Easy to ride and park.',
    type: 'vehicle',
    category: 'scooter',
    price: 400,
    location: {
      address: 'Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201301'
    },
    features: ['Helmet Included', 'Storage Space', 'LED Lights'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'
    ]
  },
  {
    title: 'Mercedes-Benz E-Class - Luxury Sedan',
    description: 'Premium luxury sedan for special occasions and business meetings. Chauffeur available.',
    type: 'vehicle',
    category: 'luxury',
    price: 6000,
    location: {
      address: 'Juhu',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400049'
    },
    features: ['AC', 'GPS', 'Leather Seats', 'Sunroof', 'Premium Sound System', 'Chauffeur Available'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800'
    ]
  },
  {
    title: 'Tata Nexon EV - Electric Car',
    description: 'Eco-friendly electric vehicle with great range. Perfect for environmentally conscious travelers.',
    type: 'vehicle',
    category: 'electric',
    price: 2500,
    location: {
      address: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560066'
    },
    features: ['AC', 'GPS', 'Fast Charging', 'Touchscreen', 'Connected Car Features'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'
    ]
  },
  {
    title: 'Toyota Innova Crysta - MUV',
    description: '7-seater comfortable MUV ideal for family trips and group travel.',
    type: 'vehicle',
    category: 'muv',
    price: 3000,
    location: {
      address: 'Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411057'
    },
    features: ['AC', 'GPS', '7 Seater', 'Music System', 'Spacious Boot'],
    availability: true,
    isApproved: true,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Assign owners to listings
    const owners = createdUsers.filter(u => u.role === 'owner');
    const listingsWithOwners = sampleListings.map((listing, index) => ({
      ...listing,
      owner: owners[index % owners.length]._id
    }));

    // Create listings
    const createdListings = await Listing.create(listingsWithOwners);
    console.log(`Created ${createdListings.length} listings`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Owner 1: rajesh@example.com / password123');
    console.log('Owner 2: priya@example.com / password123');
    console.log('Customer: amit@example.com / password123');
    console.log('\nNote: Create an admin user manually or use register page');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
