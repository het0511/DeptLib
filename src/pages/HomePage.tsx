import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookMarked, Search } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import DueDateReminder from '../components/DueDateReminder';

const HomePage: React.FC = () => {
  const { books, fetchBooks, fetchUserTransactions, transactions } = useBookStore();
  const { isAuthenticated } = useAuthStore();
  const featuredBooks = books.slice(0, 3);

  useEffect(() => {
    fetchBooks();
    if (isAuthenticated) {
      fetchUserTransactions();
    }
  }, [fetchBooks, fetchUserTransactions, isAuthenticated]);

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('images/library.jpg')" }} 
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Main Content */}
      <div className="relative text-center py-24 px-4 animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to DeptLib</h1>
        <p className="text-xl mb-8 opacity-90">Discover, borrow, and purchase books with ease</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/books" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-200 transition-transform transform hover:scale-105">
            Browse Books
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-500 transition-transform transform hover:scale-105">
              Login to Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Due Date Reminders */}
      {isAuthenticated && transactions.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <DueDateReminder transactions={transactions} />
        </div>
      )}

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 drop-shadow-lg">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{ icon: BookOpen, title: "Borrow Books", text: "Borrow books for up to 14 days." },
            { icon: BookMarked, title: "Purchase Books", text: "Buy your favorite books easily." },
            { icon: Search, title: "QR Code Access", text: "Get QR codes for easy management." }].map((feature, index) => (
            <div key={index} className="bg-white text-gray-800 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform backdrop-blur-md bg-opacity-90">
              <div className="flex justify-center mb-4">
                <feature.icon className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Books */}
      <div className="relative bg-gray-100 py-16 text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Books</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredBooks.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
                <img src={`${book.coverImage}`} alt={book.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">₹{book.price.toFixed(2)}</span>
                    <Link to={`/books/${book.id}`} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/books" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105">
              View All Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
