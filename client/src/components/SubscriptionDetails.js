import React from 'react';
import { CheckCircle, Calendar, CreditCard, AlertCircle } from 'lucide-react';

const SubscriptionDetails = ({ subscription, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">You don't have an active subscription yet.</p>
          <a 
            href="/plans" 
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
    );
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1)}
        </span>
      </div>

      {/* Plan Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900">{subscription.plan?.name || 'Premium'}</h4>
              <p className="text-gray-600">${subscription.plan?.price || subscription.amount || '19.99'}/{subscription.plan?.duration || 30} days</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-mono text-xs">{subscription.paymentId}</p>
            </div>
          </div>
          
          {/* Plan Features */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Features</h5>
            <div className="space-y-2">
              {(subscription.plan?.features || [
                'Access to all features',
                'Priority email support',
                '5 user accounts',
                'Advanced analytics',
                'API access'
              ]).map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">Start Date</span>
            </div>
            <p className="text-gray-700">{formatDate(subscription.startDate)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">Expiry Date</span>
            </div>
            <p className="text-gray-700">{formatDate(subscription.endDate)}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium text-gray-900">Payment Status</span>
            </div>
            <span className="text-green-600 font-medium">
              {subscription.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Amount Paid: <span className="font-medium">${subscription.amount || '19.99'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
          Upgrade Plan
        </button>
        <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
          Cancel Subscription
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
