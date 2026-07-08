import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

// EXTENSION: Replace this service with a real database adapter (PostgreSQL, MongoDB, etc.)
export class DbService {
  private async readFile<T>(filename: string): Promise<T> {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  private async writeFile<T>(filename: string, data: T): Promise<void> {
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
