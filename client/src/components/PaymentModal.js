import React, { useState } from 'react';
import { X, CreditCard, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PaymentModal = ({ plan, onClose, onSuccess }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: card details, 2: processing, 3: success

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
    setProcessing(true);

    try {
      // Validate card first
      const validationResponse = await axios.post('/api/payment/validate-card', {
        cardNumber: cardDetails.cardNumber,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv
      });

      if (!validationResponse.data.success) {
        throw new Error(validationResponse.data.message);
      }

      // Process payment
      const paymentResponse = await axios.post('/api/payment/process', {
        amount: plan.price,
        cardDetails: {
          cardNumber: cardDetails.cardNumber,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
          name: cardDetails.name
        }
      });

      if (paymentResponse.data.success) {
        setStep(3);
        setTimeout(() => {
          onSuccess();
          onClose(); // Auto-close modal after success
        }, 2000);
      } else {
        throw new Error(paymentResponse.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setStep(1);
      setProcessing(false);
    }
  };

  const formatCardNumber = (number) => {
    return number.replace(/\d(?=\d{4})/g, '*');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 1 && (
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900">{plan.name} Plan</h3>
              <p className="text-2xl font-bold text-primary-600">${plan.price}</p>
              <p className="text-sm text-gray-600">Valid for {plan.duration} days</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Pay ${plan.price}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your subscription to {plan.name} plan has been activated.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-left">
              <p className="text-sm text-gray-600">Card ending in {formatCardNumber(cardDetails.cardNumber).slice(-4)}</p>
              <p className="text-sm font-medium">${plan.price} charged</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
