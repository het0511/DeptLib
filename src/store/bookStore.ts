import { create } from 'zustand';
import { Book, Transaction } from '../types';
import { booksAPI, transactionsAPI } from '../api';

interface BookState {
  books: Book[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
  purchaseBook: (bookId: string) => Promise<Transaction | null>;
  borrowBook: (bookId: string) => Promise<Transaction | null>;
  returnBook: (transactionId: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  getUserTransactions: () => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  transactions: [],
  isLoading: false,
  error: null,
  
  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const books = await booksAPI.getAllBooks();
      set({ books, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch books', 
        isLoading: false 
      });
    }
  },
  
  fetchUserTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await transactionsAPI.getUserTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch transactions', 
        isLoading: false 
      });
    }
  },
  
  purchaseBook: async (bookId) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await transactionsAPI.purchaseBook(bookId);
      await get().fetchBooks(); // Refresh books to get updated stock
      set(state => ({ 
        transactions: [...state.transactions, transaction],
        isLoading: false 
      }));
      return transaction;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to purchase book', 
        isLoading: false 
      });
      return null;
    }
  },
  
  borrowBook: async (bookId) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await transactionsAPI.borrowBook(bookId);
      await get().fetchBooks(); // Refresh books to get updated stock
      set(state => ({ 
        transactions: [...state.transactions, transaction],
        isLoading: false 
      }));
      return transaction;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to borrow book', 
        isLoading: false 
      });
      return null;
    }
  },
  
  returnBook: async (transactionId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTransaction = await transactionsAPI.returnBook(transactionId);
      await get().fetchBooks(); // Refresh books to get updated stock
      set(state => ({
        transactions: state.transactions.map(t => 
          t.id === transactionId ? updatedTransaction : t
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to return book', 
        isLoading: false 
      });
    }
  },
  
  getBookById: (id) => {
    return get().books.find(book => book.id === id);
  },
  
  getUserTransactions: () => {
    return get().transactions;
  },
  
  getTransactionById: (id) => {
    return get().transactions.find(transaction => transaction.id === id);
  },

  addBook: async (book) => {
    set({ isLoading: true, error: null });
    try {
      await booksAPI.addBook(book);
      await get().fetchBooks(); // Refresh books list
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add book',
        isLoading: false
      });
    }
  },

  updateBook: async (id, book) => {
    set({ isLoading: true, error: null });
    try {
      await booksAPI.updateBook(id, book);
      await get().fetchBooks(); // Refresh books list
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update book',
        isLoading: false
      });
    }
  },

  deleteBook: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await booksAPI.deleteBook(id);
      await get().fetchBooks(); // Refresh books list
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete book',
        isLoading: false
      });
    }
  }
}));