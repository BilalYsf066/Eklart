import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  totalStars?: number
  size?: number
  className?: string
  onRate?: (rating: number) => void
  isInteractive?: boolean
}

export const StarRating = ({
  rating,
  totalStars = 5,
  size = 16,
  className,
  onRate,
  isInteractive = false,
}: StarRatingProps) => {
  const stars = Array.from({ length: totalStars }, (_, i) => i + 1)

  return (
    <div className={cn("flex items-center", className)}>
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            "stroke-1",
            rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
            isInteractive && "cursor-pointer transition-transform hover:scale-110"
          )}
          onClick={() => onRate && onRate(star)}
        />
      ))}
    </div>
  )
}