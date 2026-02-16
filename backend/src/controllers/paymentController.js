import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create dummy payment record
    const payment = await Payment.create({
      booking: bookingId,
      amount: booking.totalAmount,
      transactionId: `DUMMY_${Date.now()}`,
      status: 'pending',
      paymentMethod: 'dummy'
    });

    res.json({
      paymentId: payment._id,
      amount: booking.totalAmount,
      bookingId: bookingId
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethod } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Simulate payment success
    payment.status = 'completed';
    payment.paymentMethod = paymentMethod || 'dummy';
    payment.transactionId = `TXN_${Date.now()}`;
    await payment.save();

    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({ 
      success: true, 
      message: 'Payment completed successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate({
        path: 'booking',
        populate: { path: 'listing' }
      });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
