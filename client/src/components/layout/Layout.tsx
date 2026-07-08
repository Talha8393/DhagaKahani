import { Header } from './Header';
import { Footer } from './Footer';
import { AnimatedOutlet } from './AnimatedOutlet';
import { ToastContainer } from '../ui/Toast';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only-focusable fixed top-2 left-2 z-[200] bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <ErrorBoundary>
          <AnimatedOutlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
