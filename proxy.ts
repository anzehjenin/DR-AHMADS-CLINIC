import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('sehha_session');
  const { pathname } = request.nextUrl;

  // Protect all /patient routes
  if (pathname.startsWith('/patient')) {
    if (!sessionCookie || !sessionCookie.value) {
      // Redirect to login page if no valid session
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in patients away from the login page to the dashboard
  if (pathname === '/') {
    if (sessionCookie && sessionCookie.value) {
      const dashboardUrl = new URL('/patient', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}
