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

  return res.status(200).json({
    searchTimes,
    bookingTablesObj,
    bookings,
    restaurantTables: restaurant.tables,
    searchTimesWithTables,
    availabilities,
  });
}

//http://localhost:3000/api/restaurant/vivaanId/availability?day=2021-08-01&time=03:00:000&partySize=2
