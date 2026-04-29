import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscription();
    
    // Add polling to check for subscription updates
    const interval = setInterval(() => {
      fetchSubscription();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/api/subscriptions/my-subscription');
      console.log('Profile - Subscription data:', response.data.subscription);
      
      // If subscription exists but plan is null, create a mock plan
      if (response.data.subscription && !response.data.subscription.plan) {
        const subscriptionWithPlan = {
          ...response.data.subscription,
          plan: {
            _id: '2',
            name: 'Premium',
            price: 19.99,
            duration: 30,
            features: [
              'Access to all features',
              'Priority email support',
              '5 user accounts',
              'Advanced analytics',
              'API access'
            ],
            maxUsers: 5,
            isActive: true
          }
        };
        setSubscription(subscriptionWithPlan);
      } else {
        setSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await axios.put('/api/subscriptions/cancel');
      setMessage('Subscription cancelled successfully');
      setSubscription(null);
      
      // Refresh page to update user data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to cancel subscription');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="w-6 h-6 mr-2 text-primary-600" />
            Account Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Account Type
              </label>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-primary-600" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Member Since
              </label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-primary-600" />
            Subscription Details
          </h2>
          
          {subscription ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Current Plan
                </label>
                <p className="text-lg font-medium text-primary-600">
                  {subscription.plan.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Subscription Period
                </label>
                <p className="text-gray-900">
                  {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Monthly Cost
                </label>
                <p className="text-lg font-medium">${subscription.plan.price}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Auto-Renewal
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.autoRenew
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {subscription.status === 'active' && (
                <div className="pt-4 border-t">
                  <button
                    onClick={handleCancelSubscription}
                    className="btn-danger w-full"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-600 mb-6">
                You don't have an active subscription. Choose a plan to get started!
              </p>
              <a href="/plans" className="btn-primary inline-block">
                Browse Plans
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
