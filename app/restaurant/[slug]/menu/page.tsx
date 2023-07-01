import { Metadata } from 'next';

import { Item } from '@prisma/client';
import { prisma } from '@/db';

import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from '../components/Menu';

export const metadata: Metadata = {
  title: 'Some dynamic temp title for menu',
};

const fetchMenuBySlug = async (slug: string): Promise<Item[]> => {
  const menu = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!menu?.items) throw new Error('Menu not found');

  return menu?.items;
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const menu = await fetchMenuBySlug(slug);

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar slug={slug} />
      <Menu menu={menu} />
    </div>
  );
}
