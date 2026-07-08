import { apiRequest, setAuthToken } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login(email: string, password: string) {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  forgotPassword(email: string) {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getMe() {
    return apiRequest<User>('/auth/me');
  },

  logout() {
    setAuthToken(null);
  },

  saveToken(token: string) {
    setAuthToken(token);
  },
};
