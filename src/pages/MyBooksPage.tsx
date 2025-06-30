import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingBag, QrCode, Loader } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';
import QRCodeGenerator from '../components/QRCodeGenerator';
import DueDateReminder from '../components/DueDateReminder';

const MyBooksPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    fetchUserTransactions, 
    getUserTransactions, 
    getBookById, 
    returnBook, 
    isLoading 
  } = useBookStore();
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Fetch user transactions on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserTransactions();
    }
  }, [fetchUserTransactions, isAuthenticated, user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const transactions = getUserTransactions();
  const purchasedBooks = transactions.filter(t => t.type === 'PURCHASE');
  const borrowedBooks = transactions.filter(t => t.type === 'BORROW' && t.status === 'ACTIVE');
  const returnedBooks = transactions.filter(t => t.type === 'BORROW' && t.status === 'RETURNED');

  //console.log(transactions);
  //console.log("Purchased Books:", purchasedBooks);
  //console.log("Borrowed Books (Active):", borrowedBooks);
  //console.log("Returned Books:", returnedBooks);

  const handleReturn = async (transactionId: string) => {
    await returnBook(transactionId);
  };

  const handleShowQR = (transactionId: string) => {
    setSelectedTransaction(transactionId === selectedTransaction ? null : transactionId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-2 text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Due Date Reminders */}
        {transactions.length > 0 && (
          <div className="relative max-w-7xl mx-auto px-6 py-8">
            <DueDateReminder transactions={transactions} />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Books</h1>
        
        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You haven't purchased or borrowed any books yet.</p>
            <button
              onClick={() => navigate('/books')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Borrowed Books */}
            {borrowedBooks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                  Currently Borrowed
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {borrowedBooks.map(transaction => {
                      const book = getBookById(transaction.bookId);
                      if (!book) return null;
                      
                      return (
                        <li key={transaction.id} className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-start">
                              <img 
                                src={`${book.coverImage}?w=100&h=150&fit=crop&crop=entropy&auto=format&q=80`} 
                                alt={book.title}
                                className="w-16 h-20 object-cover rounded mr-4"
                              />
                              <div>
                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                <p className="text-sm text-gray-600">by {book.author}</p>
                                <p className="text-xs text-indigo-600 mt-1">Department: {book.department}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Borrowed on: {transaction.date} | Return by: {transaction.returnDate}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleReturn(transaction.id)}
                                disabled={isLoading}
                                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                              >
                                {isLoading ? (
                                  <Loader className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  "Return Book"
                                )}
                              </button>
                              <button
                                onClick={() => handleShowQR(transaction.id)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <QrCode className="h-4 w-4 mr-1" />
                                {selectedTransaction === transaction.id ? 'Hide QR' : 'Show QR'}
                              </button>
                            </div>
                          </div>
                          
                          {selectedTransaction === transaction.id && (
                            <div className="mt-4 flex justify-center">
                              <QRCodeGenerator transaction={transaction} book={book} user={user} />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Purchased Books */}
            {purchasedBooks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingBag className="h-6 w-6 mr-2 text-indigo-600" />
                  Purchased Books
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {purchasedBooks.map(transaction => {
                      const book = getBookById(transaction.bookId);
                      if (!book) return null;
                      
                      return (
                        <li key={transaction.id} className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-start">
                              <img 
                                src={`${book.coverImage}?w=100&h=150&fit=crop&crop=entropy&auto=format&q=80`} 
                                alt={book.title}
                                className="w-16 h-20 object-cover rounded mr-4"
                              />
                              <div>
                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                <p className="text-sm text-gray-600">by {book.author}</p>
                                <p className="text-xs text-indigo-600 mt-1">Department: {book.department}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Purchased on: {transaction.date}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <button
                                onClick={() => handleShowQR(transaction.id)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <QrCode className="h-4 w-4 mr-1" />
                                {selectedTransaction === transaction.id ? 'Hide QR' : 'Show QR'}
                              </button>
                            </div>
                          </div>
                          
                          {selectedTransaction === transaction.id && (
                            <div className="mt-4 flex justify-center">
                              <QRCodeGenerator transaction={transaction} book={book} user={user} />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Returned Books */}
            {returnedBooks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-gray-600" />
                  Previously Borrowed
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {returnedBooks.map(transaction => {
                      const book = getBookById(transaction.bookId);
                      if (!book) return null;
                      
                      return (
                        <li key={transaction.id} className="p-4">
                          <div className="flex items-start">
                            <img 
                              src={`${book.coverImage}?w=100&h=150&fit=crop&crop=entropy&auto=format&q=80`} 
                              alt={book.title}
                              className="w-16 h-20 object-cover rounded mr-4"
                            />
                            <div>
                              <h3 className="text-lg font-semibold">{book.title}</h3>
                              <p className="text-sm text-gray-600">by {book.author}</p>
                              <p className="text-xs text-indigo-600 mt-1">Department: {book.department}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Borrowed: {transaction.date} | Returned: {transaction.returnDate}
                              </p>
                              <span className="inline-block mt-2 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                Returned
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooksPage;