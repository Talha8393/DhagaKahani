import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { useAuthStore } from '../store/useAuthStore';
import type { Product } from '../types';

export function useWishlistProducts() {
  const wishlist = useAuthStore((s) => s.wishlist);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    productService
      .getAll({ limit: 100 })
      .then((res) => setProducts(res.data.filter((p) => wishlist.includes(p.id))))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return { products, loading, count: wishlist.length };
}
