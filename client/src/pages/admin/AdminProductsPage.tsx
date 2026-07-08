import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ProductTable } from '../../components/admin/ProductTable';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToastStore } from '../../store/useToastStore';
import type { Product } from '../../types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.addToast);

  const loadProducts = () => {
    setLoading(true);
    adminService.getProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
      addToast('Product deleted');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new">
          <Button><Plus className="h-4 w-4" /> Add Product</Button>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : products.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
    </div>
  );
}
