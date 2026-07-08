import { apiRequest } from './api';
import type { User, Address } from '../types';

export const userService = {
  updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) {
    return apiRequest<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getAddresses() {
    return apiRequest<Address[]>('/users/addresses');
  },

  addAddress(data: Omit<Address, 'id'>) {
    return apiRequest<Address>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAddress(id: string, data: Partial<Address>) {
    return apiRequest<Address>(`/users/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteAddress(id: string) {
    return apiRequest<{ message: string }>(`/users/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  getWishlist() {
    return apiRequest<string[]>('/users/wishlist');
  },

  toggleWishlist(productId: string) {
    return apiRequest<{ wishlist: string[]; added: boolean }>('/users/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
};
