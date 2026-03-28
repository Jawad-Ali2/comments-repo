import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Authenticates user and returns authentication token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Implement rate limiting to prevent brute force attacks
    const token = await authService.authenticateUser(email, password);

    if (!token) {
      // SECURITY: Avoid revealing which field is incorrect
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // FIXME: Token should be stored in secure httpOnly cookie
    // HACK: Currently returning in JSON response
    const response = NextResponse.json({
      success: true,
      token,
    });

    // NOTE: Should implement session management here
    // TODO: Add token expiration and refresh logic
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
