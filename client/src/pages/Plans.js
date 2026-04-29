import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, CreditCard, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';

const Plans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansResponse, subscriptionResponse] = await Promise.all([
        axios.get('/api/subscriptions/plans'),
        axios.get('/api/subscriptions/my-subscription')
      ]);
      
      setPlans(plansResponse.data.plans);
      setSubscription(subscriptionResponse.data.subscription);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setMessage('Failed to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan) => {
    if (subscription && subscription.status === 'active' && subscription.plan && subscription.plan._id === plan._id) {
      setMessage('You already have an active subscription. Cancel it first to subscribe to a new plan.');
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      console.log('Processing payment success for plan:', selectedPlan.name);
      
      const response = await axios.post('/api/subscriptions/subscribe', {
        planId: selectedPlan._id
      });
      
      if (response.data.success) {
        console.log('Payment successful, subscription created:', response.data.subscription);
        
        // Store subscription data in localStorage for persistence
        localStorage.setItem('userSubscription', JSON.stringify(response.data.subscription));
        
        setMessage('Subscription created successfully!');
        setShowPaymentModal(false);
        setSelectedPlan(null);
        
        // Redirect to dashboard after successful payment
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment success handler error:', error);
      setMessage(error.response?.data?.message || 'Failed to create subscription');
      setShowPaymentModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Plans</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.includes('success') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {message}
          </div>
        </div>
      )}

      {subscription && subscription.status === 'active' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700">
              You currently have an active {subscription.plan.name} subscription. 
              Cancel it to subscribe to a new plan.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-200 ${
              plan.name === 'Premium' 
                ? 'border-primary-500 transform scale-105' 
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            {plan.name === 'Premium' && (
              <div className="bg-primary-500 text-white text-center py-1 px-3 rounded-full text-sm font-medium mb-4">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-gray-600">/{plan.duration} days</span>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={subscription && subscription.status === 'active' && subscription.plan && subscription.plan._id === plan._id}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                subscription && subscription.status === 'active' && subscription.plan && subscription.plan._id === plan._id
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : plan.name === 'Premium'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {subscription && subscription.status === 'active' && subscription.plan && subscription.plan._id === plan._id ? 'Already Subscribed' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>

      {showPaymentModal && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Plans;
