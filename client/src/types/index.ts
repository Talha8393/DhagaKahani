export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  variants: ProductVariant[];
  specs: Record<string, string>;
  featured: boolean;
  isNew: boolean;
  popularity: number;
  createdAt: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  image: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'card' | 'cod' | 'wallet';
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product?: Product;
}

export interface CouponValidation {
  coupon: { code: string; type: string; value: number };
  discount: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  ordersByStatus: Record<string, number>;
  recentOrders: Order[];
}
