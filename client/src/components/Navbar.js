import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, CreditCard, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              SubManager
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/plans"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/plans')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Plans
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <Shield className="inline w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/profile')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  <Settings className="inline w-4 h-4 mr-1" />
                  Profile
                </Link>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  <User className="inline w-4 h-4 mr-1" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
