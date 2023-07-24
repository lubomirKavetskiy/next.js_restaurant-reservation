import { NextApiResponse } from 'next';

import { times } from '@/data';
import { prisma } from '@/db';
import { Table } from '@prisma/client';

export default async function findAvailableTables({
  time,
  day,
  restaurant,
  res,
}: {
  time: string;
  day: string;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
  res: NextApiResponse;
}) {
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

  let bookingTablesObj: { [key: string]: { [key: number]: boolean } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.table_id]: true,
        }),
        {}
      );
  });

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day} ${searchTime}`),
      time: searchTime,
      tables: restaurant.tables,
    };
  });

  searchTimesWithTables.forEach((item) => {
    item.tables = item.tables.filter(
      ({ id }) => !bookingTablesObj[item.date.toISOString()]?.[id]
    );
  });

  return searchTimesWithTables;
}
