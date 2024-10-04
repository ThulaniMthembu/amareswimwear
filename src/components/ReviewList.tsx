import React from 'react'
import { Review, User } from '@/types'
import { Star } from 'lucide-react'

interface ReviewListProps {
  reviews: Review[]
  currentUser: User | null
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentUser }) => {
  if (reviews.length === 0) {
    return <p className="text-black">No reviews yet. Be the first to review this product!</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="font-semibold text-black">{review.userName}</p>
              {currentUser && currentUser.id === review.userId && (
                <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded text-black">You</span>
              )}
            </div>
            <p className="text-sm text-black">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-black">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

export default ReviewList