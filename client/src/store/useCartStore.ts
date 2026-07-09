import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLineItem } from '../types/cart';
import { getCartItemKey } from '../utils/cartCalculations';

interface CartState {
  items: CartLineItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartLineItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  getItemCount: () => number;
}

export const selectCartItemCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item, quantity = 1) => {
        const key = getCartItemKey(item.productId, item.variantId);
        set((state) => {
          const existing = state.items.find(
            (i) => getCartItemKey(i.productId, i.variantId) === key,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                getCartItemKey(i.productId, i.variantId) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (productId, variantId) => {
        const key = getCartItemKey(productId, variantId);
        set((state) => ({
          items: state.items.filter((i) => getCartItemKey(i.productId, i.variantId) !== key),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        const key = getCartItemKey(productId, variantId);
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            getCartItemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'dhaga-kahani-cart' },
  ),
);
