import Link from 'next/link';

import Price from '@/app/components/Price';
import { Review } from '@prisma/client';
import { calculateReviewRatingAverage } from '@/utils/calculateReviewRatingAveage';
import Stars from '@/app/components/Stars';

import { IRestaurant } from '../page';

const renderRatingText = (rating: Review[]) => {
  const avarageRating = calculateReviewRatingAverage(rating);

  if (avarageRating >= 4) {
    return 'Awesome';
  } else if (avarageRating >= 3) {
    return 'Good';
  } else if (avarageRating >= 2) {
    return 'Average';
  } else if (avarageRating >= 1) {
    return 'Poor';
  } else {
    return 'Terrible';
  }
};

export default function SearchRestraunatCard({
  restaurant,
}: {
  restaurant: IRestaurant;
}) {
  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={restaurant.main_image} alt="" className="w-44 h-36 rounded" />

      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">
            <Stars reviews={restaurant?.reviews} />
          </div>
          <p className="ml-2 text-sm">{renderRatingText(restaurant.reviews)}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={restaurant.price} />
            <p className="mr-4 capitalize">{restaurant.cuisine?.name}</p>
            <p className="mr-4 capitalize">{restaurant.location?.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
}
