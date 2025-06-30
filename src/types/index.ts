export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  department: string;
  price: number;
  availableForPurchase: boolean;
  availableForBorrow: boolean;
  stock: number;
}

export interface Transaction {
  id: string;
  userId: string;
  bookId: string;
  type: 'purchase' | 'borrow';
  date: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'completed';
}