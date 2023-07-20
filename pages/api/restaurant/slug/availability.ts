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

  if (!day || !time || !partySize) {
    return res.status(400).json({ message: 'Invalid data provided' });
  }

  return res.status(200).json({ slug, day, time, partySize });
}

//http://localhost:3000/api/restaurant/coconut-lagoon-ottawa/availability?day=2021-08-01&time=03:00:000&partySize=2
