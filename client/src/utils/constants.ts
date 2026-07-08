export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 75;
export const STANDARD_SHIPPING = 5.99;

export const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
] as const;

export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;
