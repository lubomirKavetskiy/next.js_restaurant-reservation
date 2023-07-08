import Link from 'next/link';

import { Cuisine, Location, PRICE } from '@prisma/client';

import { ISearchParams } from '../page';

interface IProps {
  locations: Location[];
  cuisines: Cuisine[];
  searchParams: ISearchParams;
}

const PRICES = Object.freeze([
  {
    price: PRICE.CHEAP,
    label: '$',
    className: 'border text-center w-full text-reg font-light rounded-l p-2',
  },
  {
    price: PRICE.REGULAR,
    label: '$$',
    className: 'border text-center w-full text-reg font-light  p-2',
  },
  {
    price: PRICE.EXPENSIVE,
    label: '$$$',
    className: 'border text-center w-full text-reg font-light rounded-r p-2',
  },
]);

export default function SearchSideBar({
  locations,
  cuisines,
  searchParams,
}: IProps) {
  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations?.map(({ id, name }) => (
          <Link
            key={id}
            href={{
              pathname: '/search',
              query: { ...searchParams, city: name },
            }}
            className="font-light text-reg capitalize"
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines?.map(({ id, name }) => (
          <Link
            key={id}
            href={{
              pathname: '/search',
              query: { ...searchParams, cuisine: name },
            }}
            className="font-light text-reg capitalize"
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {PRICES.map(({ price, label, className }) => (
            <Link
              key={price}
              href={{
                pathname: '/search',
                query: { ...searchParams, price },
              }}
              className={className}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
