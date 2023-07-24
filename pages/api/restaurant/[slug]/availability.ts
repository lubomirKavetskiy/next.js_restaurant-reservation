import { NextApiRequest, NextApiResponse } from 'next';

import findAvailableTables from '@/service/restuarant/findAvailableTables';
import { prisma } from '@/db';

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

  if (!day || !time || !partySize) {
    return res.status(400).json({ message: 'Invalid data provided' });
  }

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
    return res.status(400).json({ message: 'Invalid restaurant provided' });
  }

  const searchTimesWithTables = await findAvailableTables({
    time,
    day,
    restaurant,
    res,
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({ message: 'Invalid data provided' });
  }

  const availabilities = searchTimesWithTables
    .map((item) => {
      const sum = item.tables.reduce((acc, { seats }) => acc + seats, 0);

      return { time: item.time, available: sum >= parseInt(partySize) };
    })
    .filter(({ time }) => {
      const timeAfterOpeningHour =
        new Date(`${day} ${time}`) >=
        new Date(`${day} ${restaurant.open_time}`);
      const timeBeforeClosingHour =
        new Date(`${day} ${time}`) <=
        new Date(`${day} ${restaurant.close_time}`);

      return timeAfterOpeningHour && timeBeforeClosingHour;
    });

  return res.status(200).json(availabilities);
}

//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2025-01-31&time=15:00:00.000Z&partySize=2
