import React from 'react'
import { Review, User } from '@/types'
import { Star } from 'lucide-react'

interface ReviewListProps {
  reviews: Review[]
  currentUser: User | null
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentUser }) => {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2 text-black">{review.userName}</span>
                {currentUser && currentUser.id === review.userId && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">You</span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  )
}