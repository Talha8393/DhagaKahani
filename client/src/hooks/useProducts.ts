import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import type { Product, Category } from '../types';

export function useProducts(params: Parameters<typeof productService.getAll>[0]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    productService
      .getAll(params)
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data);
          setPagination(res.pagination);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);

  return { products, pagination, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService
      .getBySlug(slug)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

export function useRelatedProducts(productId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    productService.getRelated(productId).then(setProducts).finally(() => setLoading(false));
  }, [productId]);

  return { products, loading };
}
