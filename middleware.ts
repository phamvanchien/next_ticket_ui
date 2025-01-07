import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_AUTH } from './enums/app.enum';

export async function middleware (request: NextRequest) {
  const token: string | undefined = request.cookies.get(APP_AUTH.COOKIE_AUTH_KEY)?.value;
  if (typeof token === 'undefined' || !token || token === '') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/go-to-workspace',
    '/workspace/:path*',
    '/invitation'
  ],
}