import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import { Skeleton } from '../ui/Skeleton';

interface CategoryShowcaseProps {
  categories: Category[];
  loading?: boolean;
}

export function CategoryShowcase({ categories, loading }: CategoryShowcaseProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          to={`/products?category=${cat.slug}`}
          className="group relative overflow-hidden rounded-xl aspect-[4/3]"
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white font-semibold">{cat.name}</h3>
            <p className="text-white/80 text-sm">{cat.count} products</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
