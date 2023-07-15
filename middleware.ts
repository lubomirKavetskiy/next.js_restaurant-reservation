import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const returnError = (message: string = 'Unauthorized request') =>
  new NextResponse(JSON.stringify({ message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get('authorization');

  if (!bearerToken) {
    return returnError();
  }

  const token = bearerToken?.split(' ')[1];

  if (!token) {
    return returnError();
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return returnError();
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
