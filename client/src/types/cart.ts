export interface CartLineItem {
  productId: string;
  variantId?: string;
  quantity: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  variantLabel?: string;
  slug: string;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface ShippingFormData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export type PaymentMethod = 'card' | 'cod' | 'wallet';

export interface CheckoutData {
  shipping: ShippingFormData;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}
