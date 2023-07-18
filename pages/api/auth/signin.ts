import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

import { prisma } from '../../../db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const errors: String[] = [];
    const { email, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is not valid',
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: 'Password is not valid',
      },
    ];

    validationSchema.forEach((item) => {
      if (!item.valid) {
        errors.push(item.errorMessage);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userWithEmail) {
      return res
        .status(401)
        .json({ errorMessage: 'Email or password is not valid' });
    }

    const isMatch = await bcrypt.compare(password, userWithEmail!.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: 'Email or password is not valid' });
    }

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: userWithEmail!.email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    return res.status(200).json({ token });
  }

  return res.status(404).json({ errorMessage: 'Unknown endpoint' });
}