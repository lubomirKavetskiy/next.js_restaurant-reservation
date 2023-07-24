import { Metadata } from 'next';

import { prisma } from '@/db';

import Header from './components/Header';
import Form from './components/Form';

export const metadata: Metadata = {
  title: 'Some dynamic temp title for rreserve',
};

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  return restaurant;
};

export default async function Reservation({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) {
  const restaurant = await fetchRestaurantBySlug(slug);

  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant!.main_image}
          name={restaurant!.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form
          slug={slug}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
      </div>
    </div>
  );
}
