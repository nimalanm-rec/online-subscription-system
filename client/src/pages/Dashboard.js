import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import SubscriptionDetails from '../components/SubscriptionDetails';

const Dashboard = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log('Dashboard - Subscription data:', response.data.subscription);
      
      // Handle subscription data with proper error checking
      if (response.data.subscription) {
        let subscriptionData = response.data.subscription;
        
        // If plan is null or undefined, create fallback plan
        if (!subscriptionData.plan) {
          console.log('Plan is null, creating fallback plan');
          subscriptionData = {
            ...subscriptionData,
            plan: {
              _id: subscriptionData.planId || '2',
              name: 'Premium',
              price: subscriptionData.amount || 19.99,
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
        }
        
        // Validate subscription data before setting state
        if (subscriptionData.plan && subscriptionData.status) {
          setSubscription(subscriptionData);
          console.log('Subscription set successfully:', subscriptionData.plan.name);
        } else {
          console.error('Invalid subscription data structure');
          setSubscription(null);
        }
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'expired':
        return <XCircle className="w-5 h-5" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Details */}
          <div className="lg:col-span-2">
            <SubscriptionDetails subscription={subscription} loading={loading} />
          </div>

          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/profile"
                  className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
