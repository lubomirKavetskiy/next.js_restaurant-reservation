import { NextApiRequest, NextApiResponse } from 'next';

import { times } from '@/data';
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

  const searchTimes = times.find(({ time: t }) => t === time)?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({ message: 'Invalid time provided' });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day} ${searchTimes[0]}`),
        lte: new Date(`${day} ${searchTimes.at(-1)}`),
      },
    },
    select: {
      booking_time: true,
      number_of_people: true,
      tables: true,
    },
  });

  const bookingTablesObj: any = bookings.reduce(
    (acc, curr) =>
      [
        ...acc,
        {
          [curr.booking_time.toISOString()]: curr.tables.reduce(
            (obj, { table_id }) => ({ ...obj, [table_id]: true }),
            {}
          ),
        },
      ] as any,
    []
  );

  return res.status(200).json({ searchTimes, bookingTablesObj });
}

//http://localhost:3000/api/restaurant/vivaanId/availability?day=2021-08-01&time=03:00:000&partySize=2
