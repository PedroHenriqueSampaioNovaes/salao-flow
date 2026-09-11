import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { checkSubscriptionActive } from '@/src/common/utils/checkSubscriptionActive';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const GUEST_ONLY_ROUTES = ['/login', '/register'];
const SUBSCRIPTION_VIEW_ROUTE = '/panel/subscription-view';

export async function proxy(request: NextRequest) {
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(request.nextUrl.pathname);
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return isGuestOnlyRoute ? NextResponse.next() : redirectToLogin(request);
  }

  try {
    await jwtVerify(token, JWT_SECRET);

    if (isGuestOnlyRoute) {
      return redirectToDashboard(request);
    }

    if (
      request.nextUrl.pathname.startsWith('/panel') &&
      request.nextUrl.pathname !== SUBSCRIPTION_VIEW_ROUTE
    ) {
      const isSubscriptionActive = await checkSubscriptionActive(token);

      if (!isSubscriptionActive) {
        return NextResponse.redirect(
          new URL(SUBSCRIPTION_VIEW_ROUTE, request.url),
        );
      }
    }

    return NextResponse.next();
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
