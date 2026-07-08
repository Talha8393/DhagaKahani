import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronRight } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Skeleton } from '../components/ui/Skeleton';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { formatPrice, getEffectivePrice, getDiscountPercent } from '../utils/formatters';
import { buildVariantLabel } from '../utils/cartCalculations';
import type { ProductVariant } from '../types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, loading, error } = useProduct(slug || '');
  const { products: related, loading: relatedLoading } = useRelatedProducts(product?.id);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInWishlist = useAuthStore((s) => s.isInWishlist);
  const toggleWishlist = useAuthStore((s) => s.toggleWishlist);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const variant = selectedVariant || product?.variants[0] || null;
  const price = variant?.price ?? (product ? getEffectivePrice(product.price, product.discountPrice) : 0);
  const stock = variant?.stock ?? product?.stock ?? 0;
  const hasDiscount = product?.discountPrice != null;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      variantId: variant?.id,
      productName: product.name,
      productImage: product.images[0],
      unitPrice: price,
      variantLabel: buildVariantLabel(variant?.size, variant?.color),
      slug: product.slug,
    }, quantity);
    addToast(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    const added = await toggleWishlist(product.id);
    addToast(added ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const inWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">{error || 'This product does not exist.'}</p>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  ];

  return (
    <>
      <PageMeta title={product.name} description={product.shortDescription} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-brand-600">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-brand-600">{product.category}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ImageGallery images={product.images} alt={product.name} />

          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.isNew && <Badge variant="brand">New</Badge>}
              {hasDiscount && (
                <Badge variant="danger">-{getDiscountPercent(product.price, product.discountPrice!)}%</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="text-gray-600 mt-4">{product.shortDescription}</p>

            {product.variants.length > 0 && (
              <div className="mt-6">
                <VariantSelector
                  variants={product.variants}
                  selectedId={variant?.id || ''}
                  onSelect={setSelectedVariant}
                />
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-50 rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="p-2 hover:bg-gray-50 rounded-r-lg disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{stock} available</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button size="lg" className="flex-1" disabled={stock <= 0} onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary" className="flex-1" disabled={stock <= 0} onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={handleWishlist}
                className={inWishlist ? 'text-red-500 border-red-200 hover:bg-red-50' : ''}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500' : ''}`} />
              </Button>
            </div>

            {stock <= 0 && (
              <p className="text-red-600 text-sm mt-3">This item is currently out of stock.</p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <dt className="font-medium text-gray-700">{key}</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {activeTab === 'reviews' && (
              <ReviewList reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
            )}
          </div>
        </div>

        <RelatedProducts products={related} loading={relatedLoading} />
      </div>
    </>
  );
}
