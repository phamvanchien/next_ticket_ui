import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_AUTH } from './enums/app.enum';
import { defaultLocale, locales } from './next-intl-config';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(APP_AUTH.COOKIE_AUTH_KEY)?.value;

  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (locales.includes(preferredLocale)) {
      locale = preferredLocale;
    }
  }

  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  }

  const response = NextResponse.next();
  response.cookies.set('locale', locale, { path: '/' });
  response.headers.set('locale', locale);

  response.headers.set('x-pathname', request.nextUrl.pathname);

  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  if (request.nextUrl.pathname !== '/login' && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return response;
}

export const config = {
  matcher: [
    '/login',
    '/go-to-workspace', 
    '/workspace/:path*', 
    '/document/:path*', 
    '/invitation', 
    '/profile/:path*', 
    '/calendar'
  ],
};