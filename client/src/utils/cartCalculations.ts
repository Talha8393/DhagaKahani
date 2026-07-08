import { TAX_RATE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from './constants';
import type { CartLineItem, CartTotals } from '../types/cart';

export function calculateCartTotals(
  items: CartLineItem[],
  discount = 0,
): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * TAX_RATE * 100) / 100;
  const total = Math.round((taxable + tax + shipping) * 100) / 100;

  return { subtotal, tax, shipping, discount, total };
}

export function getCartItemKey(productId: string, variantId?: string): string {
  return `${productId}:${variantId || 'default'}`;
}

export function buildVariantLabel(size?: string, color?: string): string | undefined {
  const parts = [size, color].filter(Boolean);
  return parts.length > 0 ? parts.join(' / ') : undefined;
}
