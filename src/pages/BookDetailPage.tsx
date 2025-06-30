import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, BookOpen, ArrowLeft, Loader } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import QRCodeGenerator from '../components/QRCodeGenerator';
import PaymentModal from '../components/PaymentModal';
import { booksAPI } from '../api';
import type { PaymentFormData } from '../components/PaymentModal';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, purchaseBook, borrowBook, isLoading } = useBookStore();
  const { user, isAuthenticated } = useAuthStore();
  const [transaction, setTransaction] = useState<any>(null);
  const [actionType, setActionType] = useState<'purchase' | 'borrow' | null>(null);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const bookData = await booksAPI.getBookById(id);
        setBook(bookData);
        setError(null);
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handlePayment = async (paymentData: PaymentFormData) => {
    if (!book || !book.id) return;
    
    try {
      setProcessingPayment(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await purchaseBook(book.id);
      if (result) {
        setTransaction(result);
        setActionType('purchase');
        setShowPaymentModal(false);
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handleBorrow = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    if (!book || !book.id) return;
    
    const result = await borrowBook(book.id);
    if (result) {
      setTransaction(result);
      setActionType('borrow');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-2 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
          <p className="text-gray-600 mt-2">{error || "The requested book could not be found"}</p>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/books')}
          className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Books
        </button>
        
        {transaction ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {actionType === 'purchase' ? 'Purchase Successful!' : 'Book Borrowed Successfully!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {actionType === 'purchase' 
                  ? 'You have successfully purchased this book. Use the QR code below for verification.' 
                  : `You have successfully borrowed this book. Please return it by ${transaction.returnDate}. Use the QR code below for verification.`}
              </p>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-start">
                      <img 
                        src={`${book.coverImage}?w=300&h=400&fit=crop&crop=entropy&auto=format&q=80`} 
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded mr-4"
                      />
                      <div>
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <p className="text-sm text-indigo-600 mt-1">Department: {book.department}</p>
                        <p className="text-lg font-bold mt-2 text-gray-800">₹{book.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900">Transaction Details</h4>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-gray-800"><span className="font-medium">Transaction ID:</span> {transaction.id}</p>
                      <p className="text-gray-800"><span className="font-medium">Date:</span> {transaction.date}</p>
                      {transaction.returnDate && (
                        <p className="text-gray-800"><span className="font-medium">Return by:</span> {transaction.returnDate}</p>
                      )}
                      <p className="text-gray-800"><span className="font-medium">Status:</span> {transaction.status}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex justify-center">
                  {user && <QRCodeGenerator transaction={transaction} book={book} user={user} />}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate('/my-books')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View My Books
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={`${book.coverImage}?w=600&h=800&fit=crop&crop=entropy&auto=format&q=80`} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                    <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{book.price.toFixed(2)}</p>
                </div>
                
                <div className="mb-6">
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {book.department}
                  </span>
                  <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                  </span> </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-600">{book.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {book.availableForPurchase && book.stock > 0 && (
                    <button
                      onClick={handlePurchase}
                      disabled={isLoading}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                      {isLoading ? (
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-5 w-5 mr-2" />
                      )}
                      Purchase Book
                    </button>
                  )}
                  
                  {book.availableForBorrow && book.stock > 0 && (
                    <button
                      onClick={handleBorrow}
                      disabled={isLoading}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:text-indigo-400"
                    >
                      {isLoading ? (
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <BookOpen className="h-5 w-5 mr-2" />
                      )}
                      Borrow Book
                    </button>
                  )}
                </div>
                
                {!isAuthenticated && (
                  <p className="mt-4 text-sm text-gray-500">
                    You need to <button onClick={() => navigate('/login')} className="text-indigo-600 hover:text-indigo-800">login</button> to purchase or borrow books.
                  </p>
                )}
                
                {book.stock === 0 && (
                  <p className="mt-4 text-sm text-red-500">
                    This book is currently out of stock.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePayment}
        amount={book?.price || 0}
        isLoading={processingPayment}
      />
    </div>
  );
};

export default BookDetailPage;