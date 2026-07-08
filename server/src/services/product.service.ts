import { db } from './db.service.js';
import { paginate, slugify } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';
import type { Product } from '../types/index.js';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  search?: string;
  featured?: boolean;
  isNew?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export class ProductService {
  async getAll(filters: ProductFilters = {}) {
    let products = await db.getProducts<Product[]>();

    if (filters.category) {
      products = products.filter((p) => p.categorySlug === filters.category);
    }
    if (filters.minPrice !== undefined) {
      products = products.filter((p) => (p.discountPrice ?? p.price) >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => (p.discountPrice ?? p.price) <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      products = products.filter((p) => p.rating >= filters.minRating!);
    }
    if (filters.inStock) {
      products = products.filter((p) => p.stock > 0);
    }
    if (filters.featured) {
      products = products.filter((p) => p.featured);
    }
    if (filters.isNew) {
      products = products.filter((p) => p.isNew);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    products = this.sortProducts(products, filters.sort);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    return paginate(products, page, limit);
  }

  async getById(id: string) {
    const products = await db.getProducts<Product[]>();
    const product = products.find((p) => p.id === id);
    if (!product) throw new AppError(404, 'Product not found');
    return product;
  }

  async getBySlug(slug: string) {
    const products = await db.getProducts<Product[]>();
    const product = products.find((p) => p.slug === slug);
    if (!product) throw new AppError(404, 'Product not found');
    return product;
  }

  async getRelated(id: string, limit = 4) {
    const product = await this.getById(id);
    const products = await db.getProducts<Product[]>();
    return products
      .filter((p) => p.id !== id && p.categorySlug === product.categorySlug)
      .slice(0, limit);
  }

  async getCategories() {
    const products = await db.getProducts<Product[]>();
    const map = new Map<string, { name: string; slug: string; count: number; image: string }>();
    for (const p of products) {
      const existing = map.get(p.categorySlug);
      if (existing) {
        existing.count++;
      } else {
        map.set(p.categorySlug, {
          name: p.category,
          slug: p.categorySlug,
          count: 1,
          image: p.images[0],
        });
      }
    }
    return Array.from(map.values());
  }

  async create(data: Omit<Product, 'id' | 'slug' | 'createdAt'>) {
    const products = await db.getProducts<Product[]>();
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      slug: slugify(data.name),
      createdAt: new Date().toISOString(),
    };
    products.push(product);
    await db.saveProducts(products);
    return product;
  }

  async update(id: string, data: Partial<Product>) {
    const products = await db.getProducts<Product[]>();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new AppError(404, 'Product not found');
    products[index] = { ...products[index], ...data, id };
    if (data.name) products[index].slug = slugify(data.name);
    await db.saveProducts(products);
    return products[index];
  }

  async delete(id: string) {
    const products = await db.getProducts<Product[]>();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) throw new AppError(404, 'Product not found');
    await db.saveProducts(filtered);
    return { message: 'Product deleted' };
  }

  private sortProducts(products: Product[], sort?: string) {
    const copy = [...products];
    switch (sort) {
      case 'price-asc':
        return copy.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      case 'price-desc':
        return copy.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      case 'newest':
        return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popularity':
        return copy.sort((a, b) => b.popularity - a.popularity);
      case 'rating':
        return copy.sort((a, b) => b.rating - a.rating);
      default:
        return copy;
    }
  }
}

export const productService = new ProductService();
