import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [activeBookingTab, setActiveBookingTab] = useState('my-listings');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    category: '',
    price: '',
    location: { city: '', state: '', address: '', zipCode: '' },
    features: [],
    images: []
  });
  const [featureInput, setFeatureInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user.role === 'customer') fetchBookings();
    if (user.role === 'owner') {
      fetchMyListings();
      fetchOwnerBookings();
    }
  }, []);

  const fetchBookings = async () => {
    const { data } = await api.get('/bookings');
    setBookings(data);
  };

  const fetchMyListings = async () => {
    const { data } = await api.get('/listings/my-listings');
    setListings(data);
  };

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await api.get('/bookings/owner-bookings');
      setOwnerBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status });
      alert(`Booking ${status} successfully!`);
      fetchOwnerBookings();
    } catch (error) {
      alert('Failed to update booking');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, idx) => idx !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const startEdit = (listing) => {
    setEditingId(listing._id);
    setFormData({
      title: listing.title,
      description: listing.description,
      type: listing.type,
      category: listing.category || '',
      price: listing.price,
      location: listing.location || { city: '', state: '', address: '', zipCode: '' },
      features: listing.features || [],
      images: listing.images || []
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      type: 'house',
      category: '',
      price: '',
      location: { city: '', state: '', address: '', zipCode: '' },
      features: [],
      images: []
    });
    setSelectedFiles([]);
    setShowForm(false);
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/listings/${id}`);
      alert('Listing deleted successfully!');
      fetchMyListings();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrls = [...formData.images];
      
      // Upload new images if selected
      if (selectedFiles.length > 0) {
        console.log('Uploading images...');
        const formDataUpload = new FormData();
        selectedFiles.forEach(file => {
          formDataUpload.append('images', file);
        });
        
        const { data } = await api.post('/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = [...imageUrls, ...data.images];
        console.log('Images uploaded:', imageUrls);
      }
      
      const listingData = { ...formData, images: imageUrls };
      
      // Update or create listing
      if (editingId) {
        console.log('Updating listing:', editingId);
        await api.put(`/listings/${editingId}`, listingData);
        alert('Listing updated successfully!');
      } else {
        console.log('Creating listing with data:', listingData);
        await api.post('/listings', listingData);
        alert('Listing created! Awaiting admin approval.');
      }
      
      cancelEdit();
      fetchMyListings();
    } catch (error) {
      console.error('Error saving listing:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to save listing: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>

        {user.role === 'owner' && (
          <>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-primary" style={{marginBottom: '20px'}}>
                Add Listing
              </button>
            )}

            {showForm && (
              <form className="listing-form" onSubmit={handleCreateListing}>
                <h3>{editingId ? 'Edit Listing' : 'Create New Listing'}</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                >
                  <option value="house">House</option>
                  <option value="vehicle">Vehicle</option>
                </select>
                
                {formData.type === 'house' && (
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select House Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="farmhouse">Farmhouse</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="cottage">Cottage</option>
                  </select>
                )}

                {formData.type === 'vehicle' && (
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="muv">MUV/MPV</option>
                    <option value="luxury">Luxury Car</option>
                    <option value="sports">Sports Car</option>
                    <option value="bike">Bike/Motorcycle</option>
                    <option value="scooter">Scooter</option>
                    <option value="electric">Electric Vehicle</option>
                    <option value="van">Van/Tempo</option>
                    <option value="bus">Bus/Mini Bus</option>
                  </select>
                )}

                <input
                  type="number"
                  placeholder="Price per day (₹)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                  required
                />
                <input
                  type="text"
                  placeholder="Full Address"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                  required
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.location.zipCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, zipCode: e.target.value }
                  })}
                  required
                />
                
                <div className="features-input">
                  <label>Features/Amenities</label>
                  <div className="feature-add">
                    <input
                      type="text"
                      placeholder={formData.type === 'house' ? 'e.g., WiFi, AC, Parking, Swimming Pool' : 'e.g., GPS, AC, Bluetooth, Music System'}
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" onClick={addFeature} className="btn-secondary">Add</button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="feature-tags">
                      {formData.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          {feature}
                          <button type="button" onClick={() => removeFeature(idx)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="file-upload">
                  <label htmlFor="images">Upload Images (Max 5)</label>
                  {formData.images.length > 0 && (
                    <div className="existing-images">
                      <p>Current Images:</p>
                      <div className="image-preview-grid">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="image-preview">
                            <img src={img} alt={`Preview ${idx + 1}`} />
                            <button 
                              type="button" 
                              onClick={() => {
                                const newImages = formData.images.filter((_, i) => i !== idx);
                                setFormData({ ...formData, images: newImages });
                              }}
                              className="remove-image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  {selectedFiles.length > 0 && (
                    <p className="file-count">{selectedFiles.length} new file(s) selected</p>
                  )}
                </div>
                <div className="button-group">
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : editingId ? 'Update Listing' : 'Create Listing'}
                  </button>
                  <button type="button" onClick={cancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="tabs">
              <button 
                className={activeBookingTab === 'my-listings' ? 'tab-active' : 'tab'}
                onClick={() => setActiveBookingTab('my-listings')}
              >
                My Listings ({listings.length})
              </button>
              <button 
                className={activeBookingTab === 'bookings' ? 'tab-active' : 'tab'}
                onClick={() => setActiveBookingTab('bookings')}
              >
                Booking Requests ({ownerBookings.filter(b => b.status === 'pending' && b.paymentStatus === 'paid').length})
              </button>
            </div>

            <div className="tab-content">
              {activeBookingTab === 'my-listings' && (
                <>
                  <div className="items-list">
                  {listings.length === 0 ? (
                    <p>No listings yet. Create your first listing!</p>
                  ) : (
                    listings.map((listing) => (
                      <div key={listing._id} className="item-card">
                        {listing.images && listing.images.length > 0 && (
                          <img src={listing.images[0]} alt={listing.title} className="listing-thumb" />
                        )}
                        <h3>{listing.title}</h3>
                        <p className="category-badge">{listing.category}</p>
                        <p>₹{listing.price}/day</p>
                        <span className={listing.isApproved ? 'approved' : 'pending'}>
                          {listing.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        <div className="button-group">
                          <button onClick={() => startEdit(listing)} className="btn-primary">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteListing(listing._id)} className="btn-danger">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeBookingTab === 'bookings' && (
              <>
                <div className="items-list">
                  {ownerBookings.length === 0 ? (
                    <p>No booking requests yet.</p>
                  ) : (
                    ownerBookings.map((booking) => (
                      <div key={booking._id} className="item-card booking-card">
                        <h3>{booking.listing?.title}</h3>
                        <p><strong>Customer:</strong> {booking.user?.name}</p>
                        <p><strong>Email:</strong> {booking.user?.email}</p>
                        {booking.user?.phone && <p><strong>Phone:</strong> {booking.user?.phone}</p>}
                        <p><strong>Amount:</strong> ₹{booking.totalAmount}</p>
                        <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString('en-IN')} - {new Date(booking.endDate).toLocaleDateString('en-IN')}</p>
                        
                        <div className="status-badges">
                          <span className={`status-${booking.status}`}>
                            Status: {booking.status}
                          </span>
                          <span className={`status-${booking.paymentStatus}`}>
                            Payment: {booking.paymentStatus}
                          </span>
                        </div>

                        {booking.paymentStatus === 'paid' && (
                          <p style={{color: '#28a745', fontWeight: 'bold', marginTop: '10px'}}>
                            ✓ Payment Received
                          </p>
                        )}

                        {booking.paymentStatus === 'pending' && (
                          <p style={{color: '#ffc107', fontWeight: 'bold', marginTop: '10px'}}>
                            ⏳ Payment Pending
                          </p>
                        )}
                        
                        {booking.status === 'pending' && booking.paymentStatus === 'paid' && (
                          <div className="button-group">
                            <button 
                              onClick={() => handleBookingAction(booking._id, 'confirmed')} 
                              className="btn-primary"
                            >
                              Accept Booking
                            </button>
                            <button 
                              onClick={() => handleBookingAction(booking._id, 'cancelled')} 
                              className="btn-danger"
                            >
                              Reject Booking
                            </button>
                          </div>
                        )}

                        {booking.status === 'pending' && booking.paymentStatus === 'pending' && (
                          <p style={{color: '#666', fontStyle: 'italic', marginTop: '10px'}}>
                            Waiting for customer payment...
                          </p>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => handleBookingAction(booking._id, 'completed')} 
                            className="btn-primary"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            </div>

          </>
        )}

        {user.role === 'customer' && (
          <>
            <h2>My Bookings</h2>
            <div className="items-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="item-card">
                  <h3>{booking.listing?.title}</h3>
                  <p>Amount: ₹{booking.totalAmount}</p>
                  <p>Status: <span className={`status-${booking.status}`}>{booking.status}</span></p>
                  <p>Dates: {new Date(booking.startDate).toLocaleDateString('en-IN')} - {new Date(booking.endDate).toLocaleDateString('en-IN')}</p>
                  {booking.paymentStatus && (
                    <p><strong>Payment:</strong> <span className={`status-${booking.paymentStatus}`}>{booking.paymentStatus}</span></p>
                  )}
                  {booking.status === 'pending' && booking.paymentStatus === 'paid' && (
                    <p style={{color: '#28a745', fontWeight: 'bold'}}>✓ Payment completed - Awaiting owner confirmation</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
