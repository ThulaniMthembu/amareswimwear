import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarIcon } from 'lucide-react';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

type ReviewFormProps = {
  onSubmit: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
};

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    }
  };

  if (!user) {
    return <p className="text-gray-600">Please log in to write a review.</p>;
  }

  return (
    <div className="mt-8 text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="rating" className="text-sm font-medium text-black">Rating</Label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="comment" className="text-sm font-medium text-black">Review</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            required
            className="mt-1 bg-white text-black border-black min-h-[80px] w-full rounded-md px-3 py-2 text-sm"
          />
        </div>
        <Button 
          type="submit" 
          disabled={rating === 0 || comment.trim() === ''}
          className="bg-black text-white hover:bg-gray-800 h-10 px-4 py-2 rounded-md text-sm font-medium"
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;