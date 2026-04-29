const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock payment processing
const processPayment = (amount, cardDetails) => {
  return new Promise((resolve) => {
    // Simulate payment processing delay
    setTimeout(() => {
      // Mock successful payment (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        resolve({
          success: true,
          transactionId: 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          amount,
          currency: 'USD',
          status: 'completed',
          message: 'Payment processed successfully'
        });
      } else {
        resolve({
          success: false,
          message: 'Payment failed. Please try again.',
          error: 'Insufficient funds or invalid card details'
        });
      }
    }, 2000); // 2 second delay to simulate processing
  });
};

// @route   POST /api/payment/process
// @desc    Process payment for subscription
// @access  Private
router.post('/process', protect, async (req, res) => {
  try {
    const { amount, cardDetails } = req.body;

    if (!amount || !cardDetails) {
      return res.status(400).json({
        success: false,
        message: 'Amount and card details are required'
      });
    }

    // Validate card details (basic validation)
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card details'
      });
    }

    // Process payment
    const paymentResult = await processPayment(amount, cardDetails);

    if (paymentResult.success) {
      res.status(200).json({
        success: true,
        payment: paymentResult,
        message: 'Payment processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.message,
        error: paymentResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
});

// @route   GET /api/payment/methods
// @desc    Get available payment methods (mock)
// @access  Private
router.get('/methods', protect, (req, res) => {
  res.status(200).json({
    success: true,
    methods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        type: 'card',
        supported: ['visa', 'mastercard', 'amex']
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        type: 'card',
        supported: ['visa', 'mastercard']
      },
      {
        id: 'paypal',
        name: 'PayPal',
        type: 'wallet',
        supported: ['paypal']
      }
    ]
  });
});

// @route   POST /api/payment/validate-card
// @desc    Validate card details (client-side validation helper)
// @access  Private
router.post('/validate-card', protect, (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv } = req.body;

    const errors = [];

    // Basic card number validation (more lenient for testing)
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13 || cardNumber.replace(/\s/g, '').length > 19) {
      errors.push('Invalid card number length');
    }

    // Basic expiry date validation (more lenient)
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      errors.push('Invalid expiry date format (MM/YY)');
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.push('Invalid month');
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push('Card has expired');
      }
    }

    // Basic CVV validation
    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
      errors.push('Invalid CVV');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Card validation failed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Card details are valid'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation failed',
      error: error.message
    });
  }
});

module.exports = router;
