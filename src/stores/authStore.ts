import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  login: (username, password) => {
    if (username === 'sabrikurban' && password === '0042') {
      set({ isAuthenticated: true });
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false });
    localStorage.removeItem('isAuthenticated');
  }
}));

// Check if user was previously authenticated
export const initializeAuth = () => {
  if (localStorage.getItem('isAuthenticated') === 'true') {
    useAuthStore.setState({ isAuthenticated: true });
  }
};