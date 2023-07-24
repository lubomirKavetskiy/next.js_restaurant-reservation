import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/db';
import findAvailableTables from '@/service/restuarant/findAvailableTables';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
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

    const tablesCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };

    searchTimeWithTables.tables.forEach(({ seats, id }) => {
      if (seats === 2) {
        tablesCount[2].push(id);
      } else {
        tablesCount[4].push(id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        } else {
          if (tablesCount[2].length) {
            tablesToBook.push(tablesCount[2][0]);
            tablesCount[2].shift();
            seatsRemaining -= 2;
          }
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        } else {
          if (tablesCount[4].length) {
            tablesToBook.push(tablesCount[4][0]);
            tablesCount[4].shift();
            seatsRemaining -= 4;
          }
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant?.id,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((tableId) => ({
      booking_id: booking.id,
      table_id: tableId,
    }));

    await prisma.bookingsOnTable.createMany({
      data: bookingsOnTablesData,
    });
    console.log({ booking });
    return res.json(booking);
  }
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
