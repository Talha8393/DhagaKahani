import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page Not Found" description="The page you requested could not be found." noIndex />
      <div className="max-w-7xl mx-auto px-4 py-24 text-center" role="main">
        <SearchX className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
        <p className="text-6xl font-bold text-brand-600 mb-4" aria-hidden="true">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Try searching for a product instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"><Button>Go Home</Button></Link>
          <Link to="/products"><Button variant="outline">Browse Products</Button></Link>
        </div>
      </div>
    </>
  );
}
