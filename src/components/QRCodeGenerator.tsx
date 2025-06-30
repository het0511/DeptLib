import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Book, Transaction, User } from '../types';

interface QRCodeGeneratorProps {
  transaction: Transaction;
  book: Book;
  user: User;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ transaction, book, user }) => {
  // Create a data object to encode in the QR code
  const qrData = {
    transactionId: transaction.id,
    transactionType: transaction.type,
    date: transaction.date,
    returnDate: transaction.returnDate,
    bookId: book.id,
    bookTitle: book.title,
    userId: user.id,
    userName: user.name,
  };

  // Convert to JSON string
  const qrValue = JSON.stringify(qrData);

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {transaction.type === 'purchase' ? 'Purchase' : 'Borrow'} QR Code
      </h3>
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG value={qrValue} size={200} />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Scan this QR code to verify your {transaction.type === 'purchase' ? 'purchase' : 'borrowing'} details
      </p>
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>Transaction ID: {transaction.id}</p>
        <p>Book: {book.title}</p>
        <p>Date: {transaction.date}</p>
        {transaction.returnDate && <p>Return by: {transaction.returnDate}</p>}
      </div>
    </div>
  );
};

export default QRCodeGenerator;