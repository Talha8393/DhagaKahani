import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_DIR = path.join(__dirname, '../data');
const DATA_DIR = env.isVercel ? path.join('/tmp', 'shophub-data') : SEED_DIR;

let initialized = false;

async function ensureDataReady() {
  if (!env.isVercel || initialized) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
  for (const file of ['products.json', 'users.json', 'orders.json', 'coupons.json']) {
    const dest = path.join(DATA_DIR, file);
    try {
      await fs.access(dest);
    } catch {
      await fs.copyFile(path.join(SEED_DIR, file), dest);
    }
  }
  initialized = true;
}

// EXTENSION: Replace this service with a real database adapter (PostgreSQL, MongoDB, etc.)
export class DbService {
  private async readFile<T>(filename: string): Promise<T> {
    await ensureDataReady();
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  private async writeFile<T>(filename: string, data: T): Promise<void> {
    await ensureDataReady();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getProducts<T>() {
    return this.readFile<T>('products.json');
  }

  async saveProducts<T>(data: T) {
    return this.writeFile('products.json', data);
  }

  async getUsers<T>() {
    return this.readFile<T>('users.json');
  }

  async saveUsers<T>(data: T) {
    return this.writeFile('users.json', data);
  }

  async getOrders<T>() {
    return this.readFile<T>('orders.json');
  }

  async saveOrders<T>(data: T) {
    return this.writeFile('orders.json', data);
  }

  async getCoupons<T>() {
    return this.readFile<T>('coupons.json');
  }
}

export const db = new DbService();
