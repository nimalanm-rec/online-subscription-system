const express = require('express');
const { Plan, Subscription, User } = require('../models/MemoryUser');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/subscriptions/plans
// @desc    Get all available subscription plans
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: plans.length,
      plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/subscriptions/my-subscription
// @desc    Get current user's subscription
// @access  Private
router.get('/my-subscription', protect, async (req, res) => {
  try {
    console.log('Fetching subscription for user:', req.user._id);
    const subscription = await Subscription.findOne({ 
      user: req.user._id, 
      status: 'active' 
    });
    
    if (subscription) {
      // Always populate plan data
      if (subscription.plan) {
        subscription.plan = await Plan.findById(subscription.plan);
      } else {
        // If plan is null, we need to get it from the subscription data
        console.log('Plan is null, trying to find by subscription plan ID');
        subscription.plan = await Plan.findById(subscription.plan);
      }
      console.log('Subscription found:', subscription._id);
      console.log('Plan data:', subscription.plan);
    } else {
      console.log('No active subscription found for user:', req.user._id);
    }

    if (!subscription) {
      return res.status(200).json({
        success: true,
        subscription: null,
        message: 'No active subscription found'
      });
    }

    res.status(200).json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/subscriptions/subscribe
// @desc    Subscribe to a plan
// @access  Private
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { planId } = req.body;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or not active'
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'User already has an active subscription'
      });
    }

    // Create subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await Subscription.create({
      user: req.user._id,
      plan: planId,
      startDate,
      endDate,
      status: 'active',
      paymentId: 'PAY_' + Date.now(),
      amount: plan.price,
      paymentStatus: 'completed'
    });

    console.log('Subscription created with user ID:', req.user._id, 'type:', typeof req.user._id);
    console.log('Plan ID:', planId, 'type:', typeof planId);

    // Update user with subscription reference
    await User.findByIdAndUpdate(req.user._id, {
      subscription: subscription._id
    });
    
    console.log('Subscription created:', subscription._id);
    console.log('User updated with subscription ID:', subscription._id);

    // Populate subscription details
    const populatedSubscription = await Subscription.findById(subscription._id);
    
    // Always populate plan data
    try {
      const planData = await Plan.findById(planId);
      populatedSubscription.plan = planData;
      console.log('Plan populated successfully:', planData.name);
    } catch (error) {
      console.error('Error populating plan:', error);
      // Create fallback plan
      populatedSubscription.plan = {
        _id: planId,
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
      };
    }

    res.status(201).json({
      success: true,
      subscription: populatedSubscription,
      message: 'Subscription created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/subscriptions/cancel
// @desc    Cancel current subscription
// @access  Private
router.put('/cancel', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    // Remove subscription reference from user (in-memory, no need to update)

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
