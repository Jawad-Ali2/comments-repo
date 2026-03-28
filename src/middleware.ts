// Middleware for request handling and logging
import { NextRequest, NextResponse } from 'next/server';

// TODO: Implement proper authentication middleware
// FIXME: CORS headers not properly configured

/**
 * Request logging middleware
 * Logs all incoming requests for monitoring and debugging
 */
const requestLogger = (request: NextRequest) => {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const pathname = request.nextUrl.pathname;

  // NOTE: Should integrate with external logging service
  // HACK: Just console logging for now
  console.log(`[${timestamp}] ${method} ${pathname}`);

  return null;
};

/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests from same IP
 */
const rateLimiter = (request: NextRequest) => {
  // TODO: Implement proper rate limiting with Redis
  // FIXME: This is just a placeholder
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  
  // NOTE: Should check IP against rate limit store
  return null;
};

/**
 * Authentication middleware
 * Validates JWT tokens and authorizes requests
 */
export function middleware(request: NextRequest) {
  // FIXME: Token validation is not implemented
  // TODO: Check protected routes and validate tokens
  
  const pathname = request.nextUrl.pathname;

  // NOTE: Public routes that don't need authentication
  const publicRoutes = ['/api/posts', '/api/auth/login', '/api/auth/register'];

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // BUG: No actual token validation happening
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // HACK: Should redirect to login or return 401
    return NextResponse.next();
  }

  // OPTIMIZE: Cache token validation results
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
  // TODO: Add more specific matchers
  // NOTE: May need to exclude static files
};
