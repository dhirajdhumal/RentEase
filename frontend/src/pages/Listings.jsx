import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import './Listings.css';

function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '', city: '', minPrice: '', maxPrice: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Check for category parameter in URL
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({ ...prev, type: categoryParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  useEffect(() => {
    updateCategories();
  }, [filters.type]);

  const updateCategories = () => {
    if (filters.type === 'house') {
      setCategories([
        { value: 'apartment', label: 'Apartment' },
        { value: 'villa', label: 'Villa' },
        { value: 'studio', label: 'Studio' },
        { value: 'penthouse', label: 'Penthouse' },
        { value: 'farmhouse', label: 'Farmhouse' },
        { value: 'bungalow', label: 'Bungalow' },
        { value: 'cottage', label: 'Cottage' }
      ]);
    } else if (filters.type === 'vehicle') {
      setCategories([
        { value: 'hatchback', label: 'Hatchback' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'muv', label: 'MUV/MPV' },
        { value: 'luxury', label: 'Luxury Car' },
        { value: 'sports', label: 'Sports Car' },
        { value: 'bike', label: 'Bike/Motorcycle' },
        { value: 'scooter', label: 'Scooter' },
        { value: 'electric', label: 'Electric Vehicle' },
        { value: 'van', label: 'Van/Tempo' },
        { value: 'bus', label: 'Bus/Mini Bus' }
      ]);
    } else {
      setCategories([]);
    }
  };

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      console.log('Fetching listings with filters:', Object.fromEntries(params));
      const { data } = await api.get(`/listings?${params}`);
      console.log('Listings received:', data);
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    }
  };

  return (
    <div className="listings-page">
      <div className="container">
        <div className="filters">
          <select 
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, category: '' })}
          >
            <option value="">All Types</option>
            <option value="house">Houses</option>
            <option value="vehicle">Vehicles</option>
          </select>
          
          {categories.length > 0 && (
            <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          )}
          
          <input
            type="text"
            placeholder="City"
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Price (₹)"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price (₹)"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        <div className="listings-grid">
          {listings.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>No listings found matching your criteria.</p>
              <p style={{ color: '#999' }}>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            listings.map((listing) => (
              <Link to={`/listings/${listing._id}`} key={listing._id} className="listing-card">
                <div className="listing-image">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} />
                  ) : (
                    <div className="no-image">{listing.type === 'house' ? '🏠' : '🚗'}</div>
                  )}
                </div>
                <h3>{listing.title}</h3>
                <p className="price">₹{listing.price}/day</p>
                <p className="location">{listing.location?.city}</p>
                {listing.category && <p className="category">{listing.category}</p>}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Listings;
