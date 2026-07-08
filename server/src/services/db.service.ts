import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function resolveSeedDir(): Promise<string> {
  const candidates = [
    path.join(__dirname, '../data'),
    path.join(__dirname, '../../src/data'),
    path.join(process.cwd(), 'server/dist/data'),
    path.join(process.cwd(), 'server/src/data'),
  ];

  for (const dir of candidates) {
    try {
      await fs.access(path.join(dir, 'products.json'));
      return dir;
    } catch {
      // try next
    }
  }

  throw new Error('Could not locate seed data directory (products.json)');
}

let seedDirPromise: Promise<string> | null = null;
let dataDirReady: Promise<void> | null = null;

function getSeedDir() {
  if (!seedDirPromise) seedDirPromise = resolveSeedDir();
  return seedDirPromise;
}

async function ensureDataReady() {
  if (!env.isVercel) return;
  if (!dataDirReady) {
    dataDirReady = (async () => {
      const SEED_DIR = await getSeedDir();
      const DATA_DIR = path.join('/tmp', 'shophub-data');
      await fs.mkdir(DATA_DIR, { recursive: true });
      for (const file of ['products.json', 'users.json', 'orders.json', 'coupons.json']) {
        const dest = path.join(DATA_DIR, file);
        try {
          await fs.access(dest);
        } catch {
          await fs.copyFile(path.join(SEED_DIR, file), dest);
        }
      }
    })();
  }
  return dataDirReady;
}

async function getDataDir(): Promise<string> {
  if (env.isVercel) {
    await ensureDataReady();
    return path.join('/tmp', 'shophub-data');
  }
  return getSeedDir();
}

// EXTENSION: Replace this service with a real database adapter (PostgreSQL, MongoDB, etc.)
export class DbService {
  private async readFile<T>(filename: string): Promise<T> {
    const dataDir = await getDataDir();
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  private async writeFile<T>(filename: string, data: T): Promise<void> {
    const dataDir = await getDataDir();
    const filePath = path.join(dataDir, filename);
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
