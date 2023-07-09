import { Metadata } from 'next';

import { Cuisine, PRICE, Location, Review } from '@prisma/client';
import { prisma } from '@/db';

import Header from './components/Header';
import SearchRestraunatCard from './components/RestraunatCard';
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
  reviews: Review[];
}

export interface ISearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const fetchRestaurantsByCity = ({
  city,
  cuisine,
  price,
}: ISearchParams): Promise<IRestaurant[]> => {
  const where: any = {};

  if (city) {
    where.location = {
      name: {
        equals: city.toLocaleLowerCase(),
      },
    };
  }
  if (cuisine) {
    where.cuisine = {
      name: {
        equals: cuisine.toLocaleLowerCase(),
      },
    };
  }
  if (price) {
    where.price = {
      equals: price,
    };
  }

  const select = {
    id: true,
    name: true,
    description: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => prisma.location.findMany();
const fetchCusines = async () => await prisma.cuisine.findMany();

export default async function Search({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) {
  const restaurantsByLocation = await fetchRestaurantsByCity({
    city: searchParams.city?.toLowerCase(),
    cuisine: searchParams.cuisine?.toLowerCase(),
    price: searchParams.price,
  });
  const locations = await fetchLocations();
  const cuisines = await fetchCusines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurantsByLocation?.length ? (
            restaurantsByLocation.map((restaurant) => (
              <SearchRestraunatCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))
          ) : (
            <h2>Sorry, we found no restaurants in this location</h2>
          )}
        </div>
      </div>
    </>
  );
}
