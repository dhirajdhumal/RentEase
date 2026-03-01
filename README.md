# RentEase - House & Vehicle Rental Platform

Full-stack MERN application for renting houses and vehicles online.

## Features

- User authentication (JWT)
- Role-based access (Admin, Owner, Customer)
- Property/vehicle listings with search & filters
- Booking management with owner approval
- Image upload with Cloudinary
- Admin dashboard with analytics
- Owner dashboard for managing listings and bookings
- Customer dashboard for viewing bookings
- Indian Rupees (₹) currency

## Tech Stack

- Frontend: React 18, Vite, Zustand, React Router, Axios
- Backend: Node.js, Express, MongoDB, JWT
- Image Storage: Cloudinary
- Payment: Stripe integration ready

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Default Ports

- Backend: http://localhost:5001
- Frontend: http://localhost:3000

## Sample Data Includes

### Houses (4 listings):
- Luxury 3BHK Apartment in Mumbai
- Cozy Studio in Bangalore
- Beautiful Villa in Gurgaon
- Penthouse in Pune

### Vehicles (8 listings):
- Honda City Sedan
- Maruti Swift Hatchback
- Toyota Fortuner SUV
- Royal Enfield Bike
- Honda Activa Scooter
- Mercedes-Benz Luxury Car
- Tata Nexon Electric Vehicle
- Toyota Innova MUV

All listings come with:
- High-quality images
- Detailed descriptions
- Features/amenities
- Realistic pricing in ₹
- Indian locations

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Listings
- GET /api/listings
- POST /api/listings
- GET /api/listings/:id
- PUT /api/listings/:id
- DELETE /api/listings/:id
- GET /api/listings/my-listings

### Bookings
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/owner-bookings
- GET /api/bookings/:id
- PUT /api/bookings/:id

### Admin
- GET /api/admin/users
- PUT /api/admin/users/:id/toggle-status
- GET /api/admin/listings
- GET /api/admin/listings/pending
- PUT /api/admin/listings/:id/approve
- PUT /api/admin/listings/:id/toggle-status
- GET /api/admin/stats

### Upload
- POST /api/upload (multipart/form-data)

