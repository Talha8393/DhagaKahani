import { ShoppingBag } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { CartItemRow } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { useCartStore, selectCartItemCount } from '../store/useCartStore';
import { calculateCartTotals } from '../utils/cartCalculations';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const itemCount = useCartStore(selectCartItemCount);
  const totals = calculateCartTotals(items, couponDiscount);

  if (items.length === 0) {
    return (
      <>
        <PageMeta title="Cart" description="Review items in your shopping cart." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Browse our catalog to find something you love."
            actionLabel="Start Shopping"
            actionTo="/products"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Cart" description="Review items in your shopping cart." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            {items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
          </div>
          <div>
            <CartSummary totals={totals} itemCount={itemCount} />
          </div>
        </div>
      </div>
    </>
  );
}
