import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { ProductForm, createEmptyProduct, type ProductFormData } from '../../components/admin/ProductForm';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToastStore } from '../../store/useToastStore';

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const [form, setForm] = useState<ProductFormData>(createEmptyProduct());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !id) return;
    productService.getById(id).then((product) => {
      const { id: _, slug: __, createdAt: ___, ...rest } = product;
      setForm(rest);
    }).catch(() => addToast('Product not found', 'error'))
      .finally(() => setLoading(false));
  }, [id, isNew, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      addToast('Product name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        variants: form.variants.map((v) => ({ ...v, price: form.discountPrice ?? form.price })),
      };
      if (isNew) {
        await adminService.createProduct(payload);
        addToast('Product created');
      } else if (id) {
        await adminService.updateProduct(id, payload);
        addToast('Product updated');
      }
      navigate('/admin/products');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Product' : 'Edit Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        <ProductForm data={form} onChange={setForm} />
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button type="submit" loading={saving}>{isNew ? 'Create Product' : 'Save Changes'}</Button>
          <Link to="/admin/products"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
