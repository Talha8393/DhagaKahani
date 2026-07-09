import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';

const slides = [
  {
    title: 'Summer Collection 2026',
    subtitle: 'Discover the latest trends in fashion & lifestyle',
    cta: 'Shop Now',
    link: '/products?isNew=true',
    image: 'https://picsum.photos/seed/hero-summer/1600/600',
    bg: 'from-brand-900/80 to-brand-600/60',
  },
  {
    title: 'Tech Deals Up to 40% Off',
    subtitle: 'Premium electronics at unbeatable prices',
    cta: 'Browse Electronics',
    link: '/products?category=electronics',
    image: 'https://picsum.photos/seed/hero-tech/1600/600',
    bg: 'from-gray-900/80 to-gray-600/60',
  },
  {
    title: `Free Shipping Over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
    subtitle: 'On all orders — no code needed',
    cta: 'Start Shopping',
    link: '/products',
    image: 'https://picsum.photos/seed/hero-shipping/1600/600',
    bg: 'from-emerald-900/80 to-emerald-600/60',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4">
      <div className="relative aspect-[21/9] min-h-[280px] md:min-h-[360px]">
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{slide.title}</h1>
          <p className="text-lg text-white/90 mb-6">{slide.subtitle}</p>
          <Link to={slide.link}>
            <Button size="lg" className="w-fit">{slide.cta}</Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </section>
  );
}
