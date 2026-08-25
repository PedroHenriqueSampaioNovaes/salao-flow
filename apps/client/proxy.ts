import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const GUEST_ONLY_ROUTES = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(
    request.nextUrl.pathname,
  );
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return isGuestOnlyRoute ? NextResponse.next() : redirectToLogin(request);
  }

  try {
    await jwtVerify(token, JWT_SECRET);

    return isGuestOnlyRoute
      ? redirectToDashboard(request)
      : NextResponse.next();
  } catch {
    return isGuestOnlyRoute ? NextResponse.next() : redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('token');

  return response;
}

function redirectToDashboard(request: NextRequest) {
  return NextResponse.redirect(new URL('/panel/dashboard', request.url));
}

export const config = {
  matcher: ['/panel/:path*', '/login', '/register'],
};
