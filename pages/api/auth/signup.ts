import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

import { prisma } from '../../../db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const errors: String[] = [];
    const { firstName, lastName, email, phone, city, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: 'First name is not valid ',
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: 'Last name is not valid',
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is not valid',
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Phone is not valid',
      },
      {
        valid: validator.isLength(city, { min: 1, max: 20 }),
        errorMessage: 'City is not valid',
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough',
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

    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        email,
        phone,
        city,
      },
    });

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    setCookie('jwt', token, { req, res, maxAge: 24 * 6 * 60 });

    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  return res.status(404).json({ errorMessage: 'Unknown endpoint' });
}
