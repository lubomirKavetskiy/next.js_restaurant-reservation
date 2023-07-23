import { prisma } from '@/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({ message: 'Restaurant not found' });
  }

  if (
    new Date(`${day}T${time}`) < new Date(restaurant.open_time) ||
    new Date(`${day}T${time}`) > new Date(restaurant.close_time)
  ) {
    return res
      .status(400)
      .json({ message: 'Restaurant is not open in this time' });
  }

  return res.json({ slug, day, time, partySize });
}

//http://localhost:3000/api/restaurant/vivaanId/reserve?day=2021-08-01&time=03:00:000&partySize=2
