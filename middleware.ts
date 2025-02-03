import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_AUTH } from './enums/app.enum';
import { locales, defaultLocale } from './next-intl-config';

export async function middleware(request: NextRequest) {
  const token: string | undefined = request.cookies.get(APP_AUTH.COOKIE_AUTH_KEY)?.value;

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

  if (request.nextUrl.pathname !== '/login' && (typeof token === 'undefined' || !token || token === '')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/', 
    '/login',
    '/go-to-workspace', 
    '/workspace/:path*', 
    '/document/:path*', 
    '/invitation', 
    '/profile/:path*', 
    '/calendar'
  ],
};
