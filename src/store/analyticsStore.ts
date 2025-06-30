import { create } from 'zustand';
import { analyticsAPI } from '../api';

interface BookStats {
  totalBooks: number;
  booksAvailableForBorrow: number;
  booksAvailableForPurchase: number;
  departmentWiseBooks: Record<string, number>;
}

interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
}

interface AnalyticsState {
  bookStats: BookStats | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  bookStats: null,
  userStats: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const [bookStats, userStats] = await Promise.all([
        analyticsAPI.getBookStats(),
        analyticsAPI.getUserStats(),
      ]);
      set({ bookStats, userStats, loading: false });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      set({ error: 'Failed to fetch analytics data.', loading: false });
    }
  },
}));
