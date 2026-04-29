# Online Subscription Management System

A full-stack subscription management system built with Node.js, Express, React, and MongoDB.

## Features

- **User Authentication**: JWT-based login/register system
- **Subscription Plans**: Basic, Premium, and Pro plans
- **User Dashboard**: View subscription status and manage account
- **Admin Panel**: Manage users, subscriptions, and plans
- **Mock Payment System**: Simulate payment processing
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

## Project Structure

```
Online subscription management system/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env.example
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/subscription_management
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory (in a new terminal):
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## Default Admin Account

The system includes a default admin account for testing:

- **Email**: admin@example.com
- **Password**: admin123

To create the admin account, you can either:
1. Register with the admin credentials and manually update the role in MongoDB
2. Use a script to create the admin user

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Subscriptions
- `GET /api/subscriptions/plans` - Get all available plans
- `GET /api/subscriptions/my-subscription` - Get user's subscription
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `PUT /api/subscriptions/cancel` - Cancel subscription

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/subscriptions` - Get all subscriptions
- `POST /api/admin/plans` - Create new plan
- `PUT /api/admin/plans/:id` - Update plan
- `DELETE /api/admin/plans/:id` - Delete plan

### Payment
- `POST /api/payment/process` - Process payment
- `GET /api/payment/methods` - Get payment methods
- `POST /api/payment/validate-card` - Validate card details

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Plans**: View available subscription plans
3. **Subscribe**: Choose a plan and complete the mock payment
4. **Manage Subscription**: View subscription status, cancel or upgrade plans
5. **Admin Panel**: (Admin users only) Manage users, subscriptions, and plans

## Mock Payment System

The application includes a mock payment system that simulates real payment processing:

- Card validation with basic checks
- Simulated payment processing delay
- 90% success rate for demo purposes
- Transaction ID generation

## Development

### Running in Development Mode

Both frontend and backend support hot reloading:

- Backend: `npm run dev` (uses nodemon)
- Frontend: `npm start` (uses React Scripts)

### Database Setup

For local development with MongoDB:

1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env` file

For cloud deployment with MongoDB Atlas:

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in `.env` file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
