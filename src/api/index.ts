import axios from 'axios';
import { Book, Transaction, User } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Books API
export const booksAPI = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  getBookById: async (id: string) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  getBooksByDepartment: async (department: string) => {
    const response = await api.get(`/books?department=${department}`);
    return response.data;
  },
  searchBooks: async (query: string) => {
    const response = await api.get(`/books/search?query=${query}`);
    return response.data;
  },
  addBook: async (book: Omit<Book, 'id'>) => {
    const response = await api.post('/books', book);
    return response.data;
  },
  updateBook: async (id: string, book: Partial<Book>) => {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },
  deleteBook: async (id: string) => {
    await api.delete(`/books/${id}`);
  },
};

// Transactions API
export const transactionsAPI = {
  purchaseBook: async (bookId: string) => {
    const response = await api.post('/transactions/purchase', { bookId });
    return response.data;
  },
  borrowBook: async (bookId: string) => {
    const response = await api.post('/transactions/borrow', { bookId });
    return response.data;
  },
  returnBook: async (transactionId: string) => {
    const response = await api.post(`/transactions/${transactionId}/return`);
    return response.data;
  },
  getUserTransactions: async () => {
    const response = await api.get('/transactions/user');
    return response.data;
  },
  getTransactionById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
};

export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  addUser: async (user: Omit<User, 'id'>): Promise<void> => {
    await api.post('/users', user);
  },

  updateUser: async (id: string, user: Partial<User>): Promise<void> => {
    await api.put(`/users/${id}`, user);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Analytics API
export const analyticsAPI = {
  getBookStats: async () => {
    const response = await api.get('/analytics/books');
    return response.data;
  },
  getUserStats: async () => {
    const response = await api.get('/analytics/users');
    return response.data;
  }
};

export default api;