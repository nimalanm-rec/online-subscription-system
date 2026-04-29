// In-memory user storage for demo without MongoDB
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', // admin123
    role: 'admin',
    subscription: null,
    createdAt: new Date()
  },
  {
    _id: '2', 
    name: 'Test User',
    email: 'user@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', // user123
    role: 'user',
    subscription: null,
    createdAt: new Date()
  }
];

let subscriptions = [];
let plans = [
  {
    _id: '1',
    name: 'Basic',
    price: 9.99,
    duration: 30,
    features: ['Access to basic features', 'Email support', '1 user account', 'Basic analytics'],
    maxUsers: 1,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'Premium', 
    price: 19.99,
    duration: 30,
    features: ['Access to all features', 'Priority email support', '5 user accounts', 'Advanced analytics', 'API access'],
    maxUsers: 5,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    name: 'Pro',
    price: 49.99,
    duration: 30,
    features: ['Access to all features plus extras', '24/7 phone support', 'Unlimited user accounts', 'Custom analytics dashboard', 'Full API access', 'Custom integrations', 'Dedicated account manager'],
    maxUsers: 999,
    isActive: true,
    createdAt: new Date()
  }
];

class MemoryUser {
  static async findOne(query) {
    if (query.email) {
      return users.find(u => u.email === query.email) || null;
    }
    return users.find(u => u._id === query._id) || null;
  }

  static async findById(id) {
    return users.find(u => u._id === id) || null;
  }

  static async create(userData) {
    const newUser = {
      _id: String(users.length + 1),
      ...userData,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static async find() {
    return users.filter(u => u.role === 'user');
  }

  static async countDocuments(query) {
    if (query.role === 'user') {
      return users.filter(u => u.role === 'user').length;
    }
    return users.length;
  }

  // Compare password method for authentication
  static comparePassword(userPassword, candidatePassword) {
    return userPassword === candidatePassword;
  }

  // Update user method
  static async findByIdAndUpdate(id, update) {
    const index = users.findIndex(u => u._id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...update };
      console.log(`User ${id} updated with subscription:`, update);
      return users[index];
    }
    return null;
  }
}

class MemorySubscription {
  static async findOne(query) {
    if (query.user && query.status) {
      console.log('Finding subscription for user:', query.user, 'status:', query.status);
      console.log('All subscriptions:', JSON.stringify(subscriptions, null, 2));
      
      // Enhanced user matching - try both string and number comparison
      const userId = query.user.toString();
      const found = subscriptions.find(s => {
        const subUserId = s.user.toString();
        console.log(`Comparing sub user: ${subUserId} with query user: ${userId}`);
        return subUserId === userId && s.status === query.status;
      });
      
      console.log('Found subscription:', found ? JSON.stringify(found, null, 2) : 'null');
      return found || null;
    }
    return subscriptions.find(s => s._id === query._id) || null;
  }

  static async create(subData) {
    const newSub = {
      _id: String(subscriptions.length + 1),
      user: subData.user.toString(), // Ensure user ID is string
      plan: subData.plan.toString(), // Ensure plan ID is string
      startDate: subData.startDate,
      endDate: subData.endDate,
      status: subData.status || 'active', // Ensure status is set
      paymentId: subData.paymentId,
      amount: subData.amount,
      paymentStatus: subData.paymentStatus,
      createdAt: new Date()
    };
    subscriptions.push(newSub);
    console.log('New subscription created with plan ID:', newSub.plan);
    console.log('All subscriptions after creation:', JSON.stringify(subscriptions, null, 2));
    return newSub;
  }

  static async find() {
    return subscriptions.map(s => ({
      ...s,
      user: users.find(u => u._id === s.user.toString()) || { name: 'Unknown', email: 'unknown@example.com' },
      plan: plans.find(p => p._id === s.plan.toString()) || { name: 'Unknown', price: 0 }
    }));
  }

  static async countDocuments() {
    return subscriptions.length;
  }

  static async findById(id) {
    return subscriptions.find(s => s._id === id) || null;
  }

  static async findByIdAndUpdate(id, update) {
    const index = subscriptions.findIndex(s => s._id === id);
    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...update };
      return subscriptions[index];
    }
    return null;
  }
}

class MemoryPlan {
  static async find(query = {}) {
    if (query.isActive) {
      return plans.filter(p => p.isActive);
    }
    return plans;
  }

  static async findById(id) {
    return plans.find(p => p._id === id) || null;
  }

  static async create(planData) {
    const newPlan = {
      _id: String(plans.length + 1),
      ...planData,
      createdAt: new Date()
    };
    plans.push(newPlan);
    return newPlan;
  }

  static async findByIdAndUpdate(id, update) {
    const index = plans.findIndex(p => p._id === id);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...update };
      return plans[index];
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    const index = plans.findIndex(p => p._id === id);
    if (index !== -1) {
      const deleted = plans[index];
      plans.splice(index, 1);
      return deleted;
    }
    return null;
  }
}

module.exports = {
  User: MemoryUser,
  Subscription: MemorySubscription,
  Plan: MemoryPlan
};
