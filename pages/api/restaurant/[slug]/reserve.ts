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

  return res.json({ slug, day, time, partySize });
}

//http://localhost:3000/api/restaurant/vivaanId/reserve?day=2021-08-01&time=03:00:000&partySize=2
