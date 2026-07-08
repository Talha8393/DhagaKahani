import { v4 as uuidv4 } from 'uuid';
import { db } from './db.service.js';
import { authService } from './auth.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type { User, Address } from '../types/index.js';

export class UserService {
  async updateProfile(userId: string, data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) {
    const users = await db.getUsers<User[]>();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new AppError(404, 'User not found');
    users[index] = { ...users[index], ...data };
    await db.saveUsers(users);
    return authService.sanitizeUser(users[index]);
  }

  async getAddresses(userId: string) {
    const users = await db.getUsers<User[]>();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new AppError(404, 'User not found');
    return user.addresses;
  }

  async addAddress(userId: string, address: Omit<Address, 'id'>) {
    const users = await db.getUsers<User[]>();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new AppError(404, 'User not found');
    const newAddress: Address = { ...address, id: uuidv4() };
    if (newAddress.isDefault) {
      users[index].addresses = users[index].addresses.map((a) => ({ ...a, isDefault: false }));
    }
    users[index].addresses.push(newAddress);
    await db.saveUsers(users);
    return newAddress;
  }

  async updateAddress(userId: string, addressId: string, data: Partial<Address>) {
    const users = await db.getUsers<User[]>();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new AppError(404, 'User not found');
    const addrIndex = users[userIndex].addresses.findIndex((a) => a.id === addressId);
    if (addrIndex === -1) throw new AppError(404, 'Address not found');
    users[userIndex].addresses[addrIndex] = {
      ...users[userIndex].addresses[addrIndex],
      ...data,
      id: addressId,
    };
    await db.saveUsers(users);
    return users[userIndex].addresses[addrIndex];
  }

  async deleteAddress(userId: string, addressId: string) {
    const users = await db.getUsers<User[]>();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new AppError(404, 'User not found');
    users[index].addresses = users[index].addresses.filter((a) => a.id !== addressId);
    await db.saveUsers(users);
    return { message: 'Address deleted' };
  }

  async getWishlist(userId: string) {
    const users = await db.getUsers<User[]>();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new AppError(404, 'User not found');
    return user.wishlist;
  }

  async toggleWishlist(userId: string, productId: string) {
    const users = await db.getUsers<User[]>();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new AppError(404, 'User not found');
    const wishlist = users[index].wishlist;
    const exists = wishlist.includes(productId);
    users[index].wishlist = exists
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    await db.saveUsers(users);
    return { wishlist: users[index].wishlist, added: !exists };
  }
}

export const userService = new UserService();
