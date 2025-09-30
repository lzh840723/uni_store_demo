import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_PREFIX = '/admin';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(ADMIN_PREFIX)) {
    const roleCookie = request.cookies.get('role')?.value?.toUpperCase();
    if (roleCookie !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
