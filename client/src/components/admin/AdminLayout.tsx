import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft, Store } from 'lucide-react';
import { PageMeta } from '../layout/PageMeta';
import { AnimatedOutlet } from '../layout/AnimatedOutlet';
import { ErrorBoundary } from '../ui/ErrorBoundary';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PageMeta title="Admin" description="Dhaga Kahani admin panel" noIndex />
      <a
        href="#admin-main"
        className="sr-only-focusable fixed top-2 left-2 z-[200] bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Skip to admin content
      </a>
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-brand-400" aria-hidden="true" />
            <span className="font-bold">D Admin</span>
          </div>
          <Link to="/" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Store
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-1" aria-label="Admin navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="grid lg:grid-cols-5 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" aria-label="Admin navigation">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-700 border-l-4 border-l-brand-600' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <main id="admin-main" className="lg:col-span-4" tabIndex={-1}>
            <ErrorBoundary>
              <AnimatedOutlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}
