import { create } from 'zustand';
import { usersAPI } from '../api'; // You should create this API module like booksAPI
import { User } from '../types';   // Define your User type in types.ts

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersAPI.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        isLoading: false,
      });
    }
  },

  addUser: async (user) => {
    set({ isLoading: true, error: null });
    try {
      await usersAPI.addUser(user);
      await get().fetchUsers();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add user',
        isLoading: false,
      });
    }
  },

  updateUser: async (id, user) => {
    set({ isLoading: true, error: null });
    try {
      const existingUser = get().getUserById(id);

      // Enforce role change only from USER to ADMIN
      if (user.role && existingUser?.role === 'ADMIN' && user.role !== 'ADMIN') {
        throw new Error("Cannot demote an admin to a lower role.");
      }

      if (user.role && existingUser?.role !== 'ADMIN' && user.role === 'ADMIN') {
        // Only allow USER → ADMIN
        await usersAPI.updateUser(id, user);
        await get().fetchUsers();
      } else if (!user.role || user.role === existingUser?.role) {
        // For non-role updates or same-role edits
        await usersAPI.updateUser(id, user);
        await get().fetchUsers();
      } else {
        // All other role changes are not allowed
        throw new Error("Invalid role update.");
      }

      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update user',
        isLoading: false,
      });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await usersAPI.deleteUser(id);
      await get().fetchUsers();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete user',
        isLoading: false,
      });
    }
  },

  getUserById: (id) => {
    return get().users.find((user) => user.id === id);
  },
}));
