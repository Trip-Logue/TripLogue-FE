import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  login: (email: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({ email }));
    set({ isLoggedIn: true, user: { email } });
  },
  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;
