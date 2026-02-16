import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import PaymentModal from '../components/PaymentModal';
import './ListingDetail.css';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [booking, setBooking] = useState({ startDate: '', endDate: '' });
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data);
    } catch (error) {
      console.error('Failed to fetch listing', error);
    }
  };

  const calculateTotal = () => {
    if (booking.startDate && booking.endDate) {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * listing.price : 0;
    }
    return 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    const total = calculateTotal();
    if (total <= 0) {
      alert('Please select valid dates');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentMethod) => {
    setProcessing(true);

    try {
      // Create booking
      const { data } = await api.post('/bookings', { listing: id, ...booking });
      
      // Create payment order
      const paymentResponse = await api.post('/payment/create-order', {
        bookingId: data._id
      });

      // Verify payment
      await api.post('/payment/verify', {
        paymentId: paymentResponse.data.paymentId,
        paymentMethod: paymentMethod
      });

      setShowPaymentModal(false);
      alert('✅ Payment successful! Your booking is confirmed.');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="listing-detail">
      <div className="container">
        <div className="listing-content">
          {listing.images && listing.images.length > 0 && (
            <div className="image-gallery">
              {listing.images.map((img, index) => (
                <img key={index} src={img} alt={`${listing.title} ${index + 1}`} />
              ))}
            </div>
          )}
          <h1>{listing.title}</h1>
          <p className="price">₹{listing.price}/day</p>
          <p>{listing.description}</p>
          <p><strong>Location:</strong> {listing.location?.address}, {listing.location?.city}, {listing.location?.state} - {listing.location?.zipCode}</p>
          <p><strong>Type:</strong> {listing.type}</p>
          {listing.category && <p><strong>Category:</strong> <span style={{textTransform: 'capitalize'}}>{listing.category}</span></p>}
          {listing.features && listing.features.length > 0 && (
            <div className="features">
              <strong>Features:</strong>
              <ul>
                {listing.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {listing.category && <p><strong>Category:</strong> {listing.category}</p>}

        {user?.role === 'customer' && listing.availability && (
          <form className="booking-form" onSubmit={handleBooking}>
            <h3>Book Now</h3>
            <label>Start Date</label>
            <input
              type="date"
              value={booking.startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
              required
            />
            <label>End Date</label>
            <input
              type="date"
              value={booking.endDate}
              min={booking.startDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
              required
            />
            {booking.startDate && booking.endDate && calculateTotal() > 0 && (
              <div className="total-amount">
                <strong>Total Amount: ₹{calculateTotal()}</strong>
                <p>({Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days × ₹{listing.price})</p>
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={processing}>
              {processing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        )}
        
        {user?.role === 'customer' && !listing.availability && (
          <div className="booking-form">
            <p style={{color: '#dc3545', fontWeight: 'bold'}}>This listing is currently unavailable</p>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          amount={calculateTotal()}
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}

export default ListingDetail;
