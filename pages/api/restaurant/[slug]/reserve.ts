import { prisma } from '@/db';
import findAvailableTables from '@/service/restuarant/findAvailableTables';
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
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return res
      .status(400)
      .json({ message: 'Restaurant is not open in this time' });
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

  const searchTimeWithTables = searchTimesWithTables.find(
    ({ date }) =>
      date.toISOString() === new Date(`${day}T${time}`).toISOString()
  );

  if (!searchTimeWithTables) {
    return res.status(400).json({ message: 'No availability, cannot book' });
  }

  return res.json({ searchTimeWithTables });
}

//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2025-01-31&time=15:00:00.000Z&partySize=2

// //only 2 best score result;
// const items = [
//   [2, 89],
//   [1, 97],
//   [3, 56],
//   [2, 58],
//   [3, 12],
//   [3, 95],
//   [1, 55],
//   [2, 44],
// ];

// // const obj = {[id]: [items]};
// const obj = {};

// for (const [key, value] of items) {
//   if (!obj[key]) {
//     obj[key] = [value];
//   } else {
//     obj[key] = [...obj[key], value];
//   }
// }

// const result = [];

// for (const key in obj) {
//   obj[key] =
//     obj[key]
//       .sort()
//       .slice(0, 3)
//       .reduce((acc, curr) => acc + curr, 0) / 2;
//   result.push(key, obj[key]);
// }

// console.log(result);
