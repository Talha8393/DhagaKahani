export const CURRENCY = {
  code: 'PKR',
  label: 'PKR',
} as const;

export function formatPrice(amount: number): string {
  return `${CURRENCY.label} ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getEffectivePrice(price: number, discountPrice?: number): number {
  return discountPrice ?? price;
}

export function getDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}
