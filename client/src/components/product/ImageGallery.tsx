import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        <img
          src={images[selected]}
          alt={alt}
          className={`h-full w-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
        />
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2">
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setZoomed(false); }}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              i === selected ? 'border-brand-600' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img src={img} alt={`${alt} view ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
