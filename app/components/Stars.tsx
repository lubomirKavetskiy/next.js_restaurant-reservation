import Image from 'next/image';

import fullStar from '@/public/icons/full-star-icon.svg';
import halfStar from '@/public/icons/half-star-icon.svg';
import emptyStar from '@/public/icons/empty-star-icon.svg';
import { Review } from '@prisma/client';
import { calculateReviewRatingAverage } from '@/utils/calculateReviewRatingAveage';

interface IProps {
  reviews: Review[];
  rating?: number;
}

export default function Stars({ reviews, rating }: IProps) {
  const ratingAverage = rating || calculateReviewRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (ratingAverage >= i) {
        stars.push(
          <Image
            key={i}
            src={fullStar}
            alt="full star"
            width={16}
            height={16}
          />
        );
      } else if (ratingAverage >= i - 0.5) {
        stars.push(
          <Image
            key={i}
            src={halfStar}
            alt="half star"
            width={16}
            height={16}
          />
        );
      } else {
        stars.push(
          <Image
            key={i}
            src={emptyStar}
            alt="empty star"
            width={16}
            height={16}
          />
        );
      }
    }
    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
