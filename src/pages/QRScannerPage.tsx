import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';

// In a real application, we would use a QR code scanner library
// For this demo, we'll simulate scanning by allowing manual input

const QRScannerPage: React.FC = () => {
  const [qrValue, setQrValue] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuthStore();
  const { getBookById } = useBookStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleScan = () => {
    try {
      // Parse the QR code data
      const data = JSON.parse(qrValue);
      
      // Validate the data
      if (!data.transactionId || !data.bookId) {
        setError('Invalid QR code data');
        setScanResult(null);
        return;
      }
      
      // Get book details
      const book = getBookById(data.bookId);
      if (!book) {
        setError('Book not found');
        setScanResult(null);
        return;
      }
      
      // Set the scan result
      setScanResult({
        ...data,
        book
      });
      setError('');
    } catch (err) {
      setError('Invalid QR code format');
      setScanResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code Scanner</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <p className="text-gray-600 mb-6">
            In a real application, this page would use your device's camera to scan QR codes. 
            For this demo, please paste the QR code data below:
          </p>
          
          <div className="mb-6">
            <label htmlFor="qrValue" className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Data
            </label>
            <textarea
              id="qrValue"
              rows={5}
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              placeholder='{"transactionId":"borrow-123456789","transactionType":"borrow","date":"2025-05-01","returnDate":"2025-05-15","bookId":"1","bookTitle":"Introduction to Computer Science","userId":"user-123","userName":"John Doe"}'
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleScan}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Scan QR Code
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {scanResult && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Scan Result</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Book Information</h3>
                  <p><span className="font-medium">Title:</span> {scanResult.book.title}</p>
                  <p><span className="font-medium">Author:</span> {scanResult.book.author}</p>
                  <p><span className="font-medium">Department:</span> {scanResult.book.department}</p>
                  <p><span className="font-medium">Price:</span> ₹{scanResult.book.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Transaction Details</h3>
                  <p><span className="font-medium">Transaction ID:</span> {scanResult.transactionId}</p>
                  <p><span className="font-medium">Type:</span> {scanResult.transactionType}</p>
                  <p><span className="font-medium">Date:</span> {scanResult.date}</p>
                  {scanResult.returnDate && (
                    <p><span className="font-medium">Return by:</span> {scanResult.returnDate}</p>
                  )}
                  <p><span className="font-medium">User:</span> {scanResult.userName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;