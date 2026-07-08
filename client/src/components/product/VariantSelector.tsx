import type { ProductVariant } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  if (variants.length <= 1 && !variants[0]?.size && !variants[0]?.color) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find((v) => v.size === size && v.id === selectedId) ||
                variants.find((v) => v.size === size);
              const isSelected = variants.find((v) => v.id === selectedId)?.size === size;
              const outOfStock = variant ? variant.stock <= 0 : true;
              return (
                <button
                  key={size}
                  disabled={outOfStock}
                  onClick={() => {
                    const match = variants.find((v) => v.size === size && (colors.length === 0 || v.color === variants.find((x) => x.id === selectedId)?.color))
                      || variants.find((v) => v.size === size);
                    if (match) onSelect(match);
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : outOfStock
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                        : 'border-gray-300 text-gray-700 hover:border-brand-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = variants.find((v) => v.id === selectedId)?.color === color;
              const variant = variants.find((v) => v.color === color);
              return (
                <button
                  key={color}
                  disabled={!variant || variant.stock <= 0}
                  onClick={() => variant && onSelect(variant)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-gray-300 text-gray-700 hover:border-brand-400'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {selectedId && (
        <p className="text-sm text-gray-500">
          Price: {formatPrice(variants.find((v) => v.id === selectedId)?.price ?? 0)}
          {' · '}
          {variants.find((v) => v.id === selectedId)?.stock ?? 0} in stock
        </p>
      )}
    </div>
  );
}
