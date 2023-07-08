import { Metadata } from 'next';

import { Cuisine, PRICE, Restaurant, Location } from '@prisma/client';
import { prisma } from '@/db';

import Header from './components/Header';
import RestraunatCard from './components/RestraunatCard';
import SearchSideBar from './components/SearchSideBar';

export const metadata: Metadata = {
  title: 'Search',
};

export interface IRestaurant {
  id: number;
  name: string;
  main_image: string;
  price: PRICE;
  cuisine: Cuisine;
  location: Location;
  slug: string;
}

const fetchRestaurantsByCity = (city?: string): Promise<IRestaurant[]> => {
  const select = {
    id: true,
    name: true,
    description: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  return prisma.restaurant.findMany(
    city
      ? {
          where: {
            location: {
              name: {
                equals: city.toLocaleLowerCase(),
              },
            },
          },
          select,
        }
      : undefined
  );
};

export default async function Search({
  searchParams: { city },
}: {
  searchParams: { city: string };
}) {
  const restaurantsByLocation = await fetchRestaurantsByCity(
    city?.toLowerCase()
  );

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar />
        <div className="w-5/6">
          {restaurantsByLocation?.length ? (
            restaurantsByLocation.map((restaurant) => (
              <RestraunatCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <h2>Sorry, we found no restaurants in this location</h2>
          )}
        </div>
      </div>
    </>
  );
}
