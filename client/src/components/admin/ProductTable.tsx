import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium">Price</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Flags</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0" />
                    <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{product.category}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(product.discountPrice ?? product.price)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock <= 5 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex gap-1">
                    {product.featured && <Badge variant="brand">Featured</Badge>}
                    {product.isNew && <Badge variant="success">New</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(product.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
