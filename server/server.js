const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Set JWT_SECRET directly if not loaded
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'demo_secret_key_123456789';
  console.log('JWT_SECRET set directly');
}

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection - Using in-memory storage
console.log('Using in-memory database (no MongoDB required)');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Subscription Management API is running' });
});

// Import routes
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
