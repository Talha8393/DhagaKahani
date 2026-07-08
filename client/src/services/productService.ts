import { apiRequest } from './api';
import type { Product, Category, PaginatedResponse } from '../types';

export interface ProductQuery {
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

function buildQuery(params: ProductQuery): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const productService = {
  getAll(params: ProductQuery = {}) {
    return apiRequest<PaginatedResponse<Product>>(`/products${buildQuery(params)}`);
  },

  getById(id: string) {
    return apiRequest<Product>(`/products/${id}`);
  },

  getBySlug(slug: string) {
    return apiRequest<Product>(`/products/slug/${slug}`);
  },

  getRelated(id: string) {
    return apiRequest<Product[]>(`/products/${id}/related`);
  },

  getCategories() {
    return apiRequest<Category[]>('/products/categories');
  },
};
