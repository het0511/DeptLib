import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Loader } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import BookCard from '../components/BookCard';
import { Book } from '../types';
import { booksAPI } from '../api';

const BooksListPage: React.FC = () => {
  const { books, fetchBooks, isLoading } = useBookStore();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const location = useLocation();

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Extract unique departments
  useEffect(() => {
    if (books.length > 0) {
      const uniqueDepartments = Array.from(new Set(books.map(book => book.department)));
      setDepartments(uniqueDepartments);
    }
  }, [books]);

  // Handle URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deptParam = params.get('department');
    
    if (deptParam) {
      setSelectedDepartment(deptParam);
    }
  }, [location]);

  // Filter books based on search term and department
  useEffect(() => {
    let result = books;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term) ||
        book.description.toLowerCase().includes(term)
      );
    }
    
    if (selectedDepartment) {
      result = result.filter(book => book.department === selectedDepartment);
    }
    
    setFilteredBooks(result);
  }, [books, searchTerm, selectedDepartment]);

  // Handle search with API
  const handleSearch = async () => {
    if (!searchTerm) {
      fetchBooks();
      return;
    }
    
    try {
      const results = await booksAPI.searchBooks(searchTerm);
      setFilteredBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 drop-shadow-lg">
          📚 Browse Books
        </h1>
        
        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>
            
            <div className="w-full md:w-64 relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleSearch}
              className="md:w-auto w-full px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-transform transform hover:scale-105 shadow-md font-semibold"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-indigo-400" />
            <span className="ml-2 text-gray-400">Loading books...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No books found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksListPage;
