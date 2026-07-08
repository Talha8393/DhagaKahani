import { NavLink } from 'react-router-dom';
import { User, Package, MapPin, Heart } from 'lucide-react';
import { PageMeta } from '../layout/PageMeta';
import { AnimatedOutlet } from '../layout/AnimatedOutlet';
import { useAuthStore } from '../../store/useAuthStore';
import { ErrorBoundary } from '../ui/ErrorBoundary';

const links = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
];

export function AccountLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <PageMeta title="My Account" description="Manage your ShopHub profile, orders, addresses, and wishlist." noIndex />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Account</h1>
        <p className="text-gray-500 mb-6 sm:mb-8">Welcome back, {user?.firstName}!</p>

        <nav className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-1" aria-label="Account navigation">
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

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="bg-white border border-gray-200 rounded-xl overflow-hidden" aria-label="Account navigation">
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
          <div className="lg:col-span-3">
            <ErrorBoundary>
              <AnimatedOutlet />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
