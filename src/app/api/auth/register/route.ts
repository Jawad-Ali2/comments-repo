import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

// TODO: Move authentication middleware to a separate file
// FIXME: Add proper error logging and monitoring

/**
 * POST /api/auth/register
 * Registers a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // BUG: No validation of email format or password strength
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // HACK: Should implement email verification flow
    const user = await authService.registerUser(email, password);

    // NOTE: Should send welcome email here
    // TODO: Implement email queue system

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    // FIXME: Not logging errors properly for debugging
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
