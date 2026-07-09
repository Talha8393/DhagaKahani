import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Dhaga Kahani</h3>
            <p className="text-sm text-gray-400">Your one-stop shop for quality products at great prices.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white">All Products</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-white">Featured</Link></li>
              <li><Link to="/products?isNew=true" className="hover:text-white">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white">Create Account</Link></li>
              <li><Link to="/account" className="hover:text-white">My Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-white">Order History</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link to="/products?category=clothing" className="hover:text-white">Clothing</Link></li>
              <li><Link to="/products?category=home-kitchen" className="hover:text-white">Home & Kitchen</Link></li>
              <li><Link to="/products?category=sports-outdoors" className="hover:text-white">Sports</Link></li>
              <li><Link to="/products?category=beauty" className="hover:text-white">Beauty</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Dhaga Kahani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
