import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <img 
        src={`${book.coverImage}?w=400&h=250&fit=crop&crop=entropy&auto=format&q=80`} 
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white drop-shadow-md">{book.title}</h3>
        <p className="text-sm text-gray-300">by <span className="text-indigo-400">{book.author}</span></p>
        <p className="text-xs text-indigo-300 mt-1">Department: {book.department}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-indigo-400">₹{book.price.toFixed(2)}</span>
          <Link 
            to={`/books/${book.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all duration-300 shadow-md"
          >
            View Details
          </Link>
        </div>

        <div className="mt-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all 
            ${book.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
