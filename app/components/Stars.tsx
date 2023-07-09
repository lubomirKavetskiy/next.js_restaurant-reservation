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
        stars.push(<img key={i} src={fullStar} alt="full star" />);
      } else if (ratingAverage >= i - 0.5) {
        stars.push(<img key={i} src={halfStar} alt="half star" />);
      } else {
        stars.push(<img key={i} src={emptyStar} alt="empty star" />);
      }
    }
    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
