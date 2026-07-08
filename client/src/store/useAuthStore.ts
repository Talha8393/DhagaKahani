import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  wishlist: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  setWishlist: (ids: string[]) => void;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  wishlist: [],

  login: async (email, password) => {
    const { token, user } = await authService.login(email, password);
    authService.saveToken(token);
    set({ user, token, isAuthenticated: true, wishlist: user.wishlist });
  },

  register: async (data) => {
    const { token, user } = await authService.register(data);
    authService.saveToken(token);
    set({ user, token, isAuthenticated: true, wishlist: user.wishlist });
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false, wishlist: [] });
  },

  hydrate: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const user = await authService.getMe();
      set({ user, token, isAuthenticated: true, wishlist: user.wishlist });
    } catch {
      authService.logout();
      set({ user: null, token: null, isAuthenticated: false, wishlist: [] });
    }
  },

  updateUser: (user) => set({ user, wishlist: user.wishlist }),

  refreshUser: async () => {
    const user = await authService.getMe();
    set({ user, wishlist: user.wishlist });
  },

  setWishlist: (ids) => set({ wishlist: ids }),

  toggleWishlist: async (productId) => {
    const result = await userService.toggleWishlist(productId);
    set({ wishlist: result.wishlist });
    if (get().user) {
      set({ user: { ...get().user!, wishlist: result.wishlist } });
    }
    return result.added;
  },

  isInWishlist: (productId) => get().wishlist.includes(productId),
}));
