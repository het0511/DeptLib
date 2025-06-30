import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, LogOut, User, ShoppingBag, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white hover:text-gray-300 transition-all">
              <BookOpen className="h-8 w-8 mr-2 text-indigo-400" />
              <span className="font-extrabold text-xl">DeptLib</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/books" className="text-gray-300 hover:text-indigo-400 transition-all font-medium">
              Browse Books
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-books" className="flex items-center text-gray-300 hover:text-indigo-400 transition-all font-medium">
                  <ShoppingBag className="h-5 w-5 mr-1" />
                  My Books
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="flex items-center text-gray-300 hover:text-indigo-400 transition-all font-medium">
                    <Settings className="h-5 w-5 mr-1" />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center text-gray-300">
                  <User className="h-5 w-5 mr-1 text-indigo-400" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-red-400 transition-all font-medium"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center text-gray-300 hover:text-green-400 transition-all font-medium"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;