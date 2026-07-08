import { Tag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { orderService } from '../../services/orderService';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface CouponInputProps {
  subtotal: number;
}

export function CouponInput({ subtotal }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const couponCode = useCartStore((s) => s.couponCode);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const clearCoupon = useCartStore((s) => s.clearCoupon);
  const addToast = useToastStore((s) => s.addToast);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const result = await orderService.validateCoupon(code.trim(), subtotal);
      setCoupon(result.coupon.code, result.discount);
      addToast(`Coupon "${result.coupon.code}" applied!`);
      setCode('');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Invalid coupon', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (couponCode) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700">
          <Tag className="h-4 w-4" />
          <span className="text-sm font-medium">{couponCode} applied</span>
        </div>
        <button onClick={clearCoupon} className="text-sm text-green-700 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Promo code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="flex-1"
      />
      <Button variant="outline" onClick={handleApply} loading={loading} disabled={!code.trim()}>
        Apply
      </Button>
    </div>
  );
}

export function CouponHint() {
  return (
    <p className="text-xs text-gray-400 mt-2">
      Try: SAVE10, WELCOME15, or FLAT20
    </p>
  );
}
