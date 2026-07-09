import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { SearchBar } from '../search/SearchBar';
import { useCartStore, selectCartItemCount } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const itemCount = useCartStore(selectCartItemCount);
  const { isAuthenticated, user, logout, wishlist } = useAuthStore();

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex-shrink-0 text-xl font-bold text-brand-700">
            Dhaga Kahani
          </Link>

          <SearchBar className="hidden md:flex flex-1 max-w-lg mx-4" />

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 rounded-lg hover:bg-gray-50">
              Shop
            </Link>
            <Link to="/products?featured=true" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 rounded-lg hover:bg-gray-50">
              Featured
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-brand-600 rounded-lg hover:bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.firstName}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:block px-3 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="p-2 text-gray-600 hover:text-brand-600 rounded-lg hover:bg-gray-50" aria-label="Sign in">
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-brand-600 rounded-lg hover:bg-gray-50" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {isAuthenticated && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-600 rounded-lg hover:bg-gray-50" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <button onClick={handleLogout} className="hidden sm:block p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-50" aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            )}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-brand-600 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-100 pt-3">
            <SearchBar onSearch={closeMobile} />
            <Link to="/products" className="block px-3 py-2 text-sm font-medium text-gray-700" onClick={closeMobile}>
              Shop All
            </Link>
            <Link to="/products?featured=true" className="block px-3 py-2 text-sm font-medium text-gray-700" onClick={closeMobile}>
              Featured
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="block px-3 py-2 text-sm font-medium text-gray-700" onClick={closeMobile}>
                  My Account
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 text-sm font-medium text-brand-600" onClick={closeMobile}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { handleLogout(); closeMobile(); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-sm font-medium text-gray-700" onClick={closeMobile}>
                  Sign In
                </Link>
                <Link to="/signup" className="block px-3 py-2 text-sm font-medium text-gray-700" onClick={closeMobile}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
