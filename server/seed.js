const mongoose = require('mongoose');
const Plan = require('./models/Plan');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription_management');
    console.log('MongoDB Connected');

    // Clear existing data
    await Plan.deleteMany({});
    await User.deleteMany({});

    // Create subscription plans
    const plans = [
      {
        name: 'Basic',
        price: 9.99,
        duration: 30,
        features: [
          'Access to basic features',
          'Email support',
          '1 user account',
          'Basic analytics'
        ],
        maxUsers: 1,
        isActive: true
      },
      {
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
      },
      {
        name: 'Pro',
        price: 49.99,
        duration: 30,
        features: [
          'Access to all features plus extras',
          '24/7 phone support',
          'Unlimited user accounts',
          'Custom analytics dashboard',
          'Full API access',
          'Custom integrations',
          'Dedicated account manager'
        ],
        maxUsers: 999,
        isActive: true
      }
    ];

    const createdPlans = await Plan.insertMany(plans);
    console.log('Subscription plans created:', createdPlans.length);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created:', admin.email);

    // Create regular test user
    const userPassword = await bcrypt.hash('user123', 12);
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    console.log('Test user created:', testUser.email);

    console.log('\n=== Database Seeded Successfully ===');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
