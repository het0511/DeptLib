import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader, AlertCircle, User } from 'lucide-react';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { Book } from '../types';

const AdminPanel: React.FC = () => {
  const { user } = useAuthStore();
  const { books, isLoading, error, deleteBook, addBook, updateBook, fetchBooks } = useBookStore();
  const { users, isLoading: usersLoading, error: usersError, fetchUsers, deleteUser, updateUser } = useUserStore();
  const { bookStats, userStats, loading, error: analyticsError, fetchAnalytics } = useAnalyticsStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    department: '',
    price: 0,
    stock: 0,
    availableForPurchase: true,
    availableForBorrow: true
  });

  // New state to toggle between Book and User management
  const [showUserManagement, setShowUserManagement] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (showUserManagement) {
      fetchUsers();
    }
  }, [showUserManagement, fetchUsers]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(newBook);
      await fetchAnalytics();
      setNewBook({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        department: '',
        price: 0,
        stock: 0,
        availableForPurchase: true,
        availableForBorrow: true
      });
    } catch (err) {
      console.error('Failed to add book:', err);
    }
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook?.id) {
      try {
        await updateBook(editingBook.id, editingBook);
        await fetchAnalytics();
        setIsEditing(false);
        setEditingBook(null);
      } catch (err) {
        console.error('Failed to update book:', err);
      }
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        await fetchAnalytics();
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

  const handleDeleteUser = async (userId: string, role: string) => {
    if (role === 'ADMIN') {
      alert("You can't delete an admin user.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        await fetchAnalytics();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (user.role === 'ADMIN' && newRole !== 'ADMIN') {
      alert("Cannot demote an ADMIN to USER.");
      return;
    }

    if (user.role === 'USER' && newRole === 'ADMIN') {
      try {
        await updateUser(userId, { role: 'ADMIN' });
        await fetchAnalytics();
      } catch (error) {
        alert((error as Error).message || 'Failed to update role.');
      }
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-200">Admin Panel</h1>
          <button
            onClick={() => setShowUserManagement(!showUserManagement)}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {showUserManagement ? 'Manage Books' : 'Manage Users'}
          </button>
        </div>

        {showUserManagement ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>User Management</span>
            </h2>

            {usersError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-red-700">{usersError}</p>
                </div>
              </div>
            )}

            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={u.role === 'ADMIN'} // Prevent demotion
                            className="border rounded px-2 py-1 text-sm bg-white"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.role)}
                            disabled={u.role === 'ADMIN'}
                            className={`text-red-600 hover:text-red-900 ${u.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={u.role === 'ADMIN' ? "Can't delete admin user" : "Delete user"}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-red-700">{error}</p>
                </div>
              </div>
            )}

        {/* Add/Edit Book Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <form onSubmit={isEditing ? handleEditBook : handleAddBook} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={isEditing ? editingBook?.title : newBook.title}
                  onChange={(e) => isEditing 
                    ? setEditingBook({ ...editingBook!, title: e.target.value })
                    : setNewBook({ ...newBook, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  value={isEditing ? editingBook?.author : newBook.author}
                  onChange={(e) => isEditing
                    ? setEditingBook({ ...editingBook!, author: e.target.value })
                    : setNewBook({ ...newBook, author: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={isEditing ? editingBook?.description : newBook.description}
                  onChange={(e) => isEditing
                    ? setEditingBook({ ...editingBook!, description: e.target.value })
                    : setNewBook({ ...newBook, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                <input
                  type="url"
                  value={isEditing ? editingBook?.coverImage : newBook.coverImage}
                  onChange={(e) => isEditing
                    ? setEditingBook({ ...editingBook!, coverImage: e.target.value })
                    : setNewBook({ ...newBook, coverImage: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={isEditing ? editingBook?.department : newBook.department}
                  onChange={(e) => isEditing
                    ? setEditingBook({ ...editingBook!, department: e.target.value })
                    : setNewBook({ ...newBook, department: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Economics">Economics</option>
                  <option value="History">History</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={isEditing ? editingBook?.price : newBook.price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isEditing) {
                      setEditingBook({ ...editingBook!, price: value });
                    } else {
                      setNewBook({ ...newBook, price: value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={isEditing ? editingBook?.stock : newBook.stock}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (isEditing) {
                      setEditingBook({ ...editingBook!, stock: value });
                    } else {
                      setNewBook({ ...newBook, stock: value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  required
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEditing ? editingBook?.availableForPurchase : newBook.availableForPurchase}
                    onChange={(e) => isEditing
                      ? setEditingBook({ ...editingBook!, availableForPurchase: e.target.checked })
                      : setNewBook({ ...newBook, availableForPurchase: e.target.checked })
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available for Purchase</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEditing ? editingBook?.availableForBorrow : newBook.availableForBorrow}
                    onChange={(e) => isEditing
                      ? setEditingBook({ ...editingBook!, availableForBorrow: e.target.checked })
                      : setNewBook({ ...newBook, availableForBorrow: e.target.checked })
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-yellow-50 text-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available for Borrow</span>
                </label>
              </div>
            </div>

                <div className="flex justify-end space-x-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingBook(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {isLoading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : isEditing ? (
                      <>
                        <Edit className="h-5 w-5 mr-2" />
                        Update Book
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Book
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Books List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="h-10 w-8 object-cover rounded"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{book.title}</div>
                              <div className="text-sm text-gray-500">{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{book.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              book.availableForPurchase
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {book.availableForPurchase ? 'For Sale' : 'Not for Sale'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              book.availableForBorrow
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {book.availableForBorrow ? 'Can Borrow' : 'No Borrowing'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setEditingBook(book);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {/* Analytics Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 text-black">
          <h2 className="text-xl font-semibold mb-4">Library Analytics</h2>

          {analyticsError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-red-700">{analyticsError}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-indigo-100 rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold text-indigo-800">Total Books</h3>
                <p className="text-2xl font-bold text-indigo-900">{bookStats?.totalBooks || 0}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold text-green-800">Total Users</h3>
                <p className="text-2xl font-bold text-green-900">{userStats?.totalUsers || 0}</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold text-yellow-800">Admins</h3>
                <p className="text-2xl font-bold text-yellow-900">{userStats?.totalAdmins || 0}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
