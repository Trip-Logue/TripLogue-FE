import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  register: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,

  login: (user: User) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    set({ isLoggedIn: true, user });
  },

  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    set({ isLoggedIn: false, user: null });
  },

  updateProfile: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 기존 사용자 목록에 추가
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // 자동 로그인
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    set({ isLoggedIn: true, user: newUser });
  },
}));

export default useAuthStore;
