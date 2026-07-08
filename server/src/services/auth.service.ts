import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.service.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import type { User, AuthPayload } from '../types/index.js';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const users = await db.getUsers<User[]>();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new AppError(409, 'Email already registered');
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user: User = {
      id: uuidv4(),
      email: data.email.toLowerCase(),
      password: hashed,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await db.saveUsers(users);
    return this.toAuthResponse(user);
  }

  async login(email: string, password: string) {
    const users = await db.getUsers<User[]>();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, 'Invalid email or password');
    }
    return this.toAuthResponse(user);
  }

  async forgotPassword(email: string) {
    const users = await db.getUsers<User[]>();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    // EXTENSION: Send real password reset email via SendGrid/SES
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }
    return { message: 'If that email exists, a reset link has been sent.', mockToken: 'reset-mock-token' };
  }

  async getProfile(userId: string) {
    const users = await db.getUsers<User[]>();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new AppError(404, 'User not found');
    return this.sanitizeUser(user);
  }

  private toAuthResponse(user: User) {
    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    return { token: signToken(payload), user: this.sanitizeUser(user) };
  }

  sanitizeUser(user: User) {
    const { password: _, ...safe } = user;
    return safe;
  }
}

export const authService = new AuthService();
