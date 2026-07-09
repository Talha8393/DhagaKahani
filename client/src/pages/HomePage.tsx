import { PageMeta } from '../components/layout/PageMeta';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { ProductSection } from '../components/home/ProductSection';
import { useCategories, useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const { categories, loading: catLoading } = useCategories();
  const { products: featured, loading: featLoading } = useProducts({ featured: true, sort: 'newest', limit: 4 });
  const { products: newArrivals, loading: newLoading } = useProducts({ isNew: true, sort: 'newest', limit: 4 });

  return (
    <>
      <PageMeta title="Home" description="Shop quality products at great prices. Free shipping on orders over $75." />
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <CategoryShowcase categories={categories} loading={catLoading} />
        </section>

        <ProductSection
          title="Featured Products"
          subtitle="Hand-picked favorites just for you"
          products={featured}
          loading={featLoading}
          viewAllLink="/products?featured=true"
        />

        <ProductSection
          title="New Arrivals"
          subtitle="The latest additions to our collection"
          products={newArrivals}
          loading={newLoading}
          viewAllLink="/products?isNew=true"
        />
      </div>
    </>
  );
}
