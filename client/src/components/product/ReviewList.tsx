import { Star } from 'lucide-react';
import type { Review } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ReviewListProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewList({ reviews, rating, reviewCount }: ReviewListProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{rating}</p>
          <div className="flex justify-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{reviewCount} reviews</p>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-400">{formatDate(review.createdAt)}</span>
              </div>
              <h4 className="font-medium text-gray-800">{review.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
