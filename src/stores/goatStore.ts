import { create } from 'zustand';
import { fetchGoats, addGoat, updateGoat, deleteGoat, getTotalStats, Goat } from '../lib/supabase';

interface GoatState {
  goats: Goat[];
  isLoading: boolean;
  error: string | null;
  stats: {
    totalSales: number;
    totalPaid: number;
    totalRemaining: number;
    totalGoats: number;
  };
  fetchGoats: () => Promise<void>;
  addGoat: (goat: Omit<Goat, 'id' | 'created_at'>) => Promise<void>;
  updateGoat: (id: string, updates: Partial<Goat>) => Promise<void>;
  deleteGoat: (id: string) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const useGoatStore = create<GoatState>((set, get) => ({
  goats: [],
  isLoading: false,
  error: null,
  stats: {
    totalSales: 0,
    totalPaid: 0,
    totalRemaining: 0,
    totalGoats: 0
  },
  
  fetchGoats: async () => {
    set({ isLoading: true, error: null });
    try {
      const goats = await fetchGoats();
      set({ goats, isLoading: false });
      get().refreshStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  
  addGoat: async (goatData) => {
    set({ isLoading: true, error: null });
    try {
      const newGoat = await addGoat(goatData);
      set((state) => ({ 
        goats: [newGoat, ...state.goats], 
        isLoading: false 
      }));
      get().refreshStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateGoat: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedGoat = await updateGoat(id, updates);
      set((state) => ({
        goats: state.goats.map(goat => goat.id === id ? updatedGoat : goat),
        isLoading: false
      }));
      get().refreshStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteGoat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteGoat(id);
      set((state) => ({
        goats: state.goats.filter(goat => goat.id !== id),
        isLoading: false
      }));
      get().refreshStats();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  refreshStats: async () => {
    try {
      const stats = await getTotalStats();
      set({ stats });
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }
}));