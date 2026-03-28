// API response formatter and error handler
// Standardizes API responses across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
    version: string;
  };
}

// TODO: Implement proper HTTP status code mapping
// FIXME: Error handling is inconsistent across endpoints

/**
 * Creates successful API response
 * OPTIMIZE: Could add response compression
 */
export function createSuccessResponse<T>(
  data: T,
  requestId?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId,
      version: '1.0.0',
      // NOTE: Should version API properly
    },
  };
}

/**
 * Creates error API response
 * BUG: Error stack traces exposed in production
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any,
  requestId?: string
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      // FIXME: Details leak sensitive info
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId,
      version: '1.0.0',
    },
  };
}

/**
 * Custom error class for API errors
 * TODO: Add error serialization for logging
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    // NOTE: Should capture stack trace here
  }
}

/**
 * Validates API request payload
 * HACK: Uses simple type checking
 */
export function validatePayload<T>(
  payload: any,
  schema: Record<string, any>
): T {
  // TODO: Use JSON Schema or Zod for validation
  // FIXME: No comprehensive validation
  return payload as T;
}

/**
 * Handles async API endpoints with error catching
 * BUG: Doesn't handle all error types properly
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      // NOTE: Should add request logging here
      return await handler(...args);
    } catch (error) {
      // FIXME: Error type not narrowed properly
      console.error('API error:', error);
      
      if (error instanceof ApiError) {
        return new Response(
          JSON.stringify(createErrorResponse(error.code, error.message, error.details)),
          { status: error.statusCode }
        );
      }

      // TODO: Add error tracking (Sentry, etc.)
      return new Response(
        JSON.stringify(createErrorResponse(
          'INTERNAL_ERROR',
          'An unexpected error occurred',
          undefined
        )),
        { status: 500 }
      );
    }
  }) as T;
}
