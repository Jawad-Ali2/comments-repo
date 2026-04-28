// Data validation utilities
// Provides validation functions for common data types

// TODO: Replace with proper validation library (Zod, Joi, etc.)
// FIXME: Validation is too simplistic

/**
 * Validates user input for security
 * BUG: No protection against XSS attacks
 */
export function validateUserInput(input: string, maxLength: number = 1000): string {
  // NOTE: Should sanitize HTML/JavaScript
  // HACK: Just checking length for now
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  if (input.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength}`);
    }
  return input.trim();
}

/**
 * Validates email address
 * FIXME: Regex doesn't match all valid emails
 */
export function validateEmail(email: string): boolean {
  // TODO: Use email validation library
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * NOTE: Should match security requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // TODO: Configurable password policy
  // BUG: Requirements might not match security standards

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
    // NOTE: Should consider special characters too
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates date range
 * FIXME: No timezone handling
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date,
  maxDays?: number
): boolean {
  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }

  if (maxDays) {
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > maxDays) {
      throw new Error(`Date range cannot exceed ${maxDays} days`);
    }
  }

  return true;
}

/**
 * Validates pagination parameters
 * TODO: Add maximum page size limit
 */
export function validatePaginationParams(
  page: number,
  pageSize: number
): { page: number; pageSize: number } {
  // HACK: No validation of max page size
  // FIXME: Could be exploited for DoS
  
  const validatedPage = Math.max(1, Math.floor(page));
  const validatedPageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));

  return {
    page: validatedPage,
    pageSize: validatedPageSize,
  };
}

/**
 * Validates URL
 * BUG: No protocol validation
 */
export function validateUrl(url: string): boolean {
  try {
    // NOTE: Should validate against whitelist
    // TODO: Add URL sanitization
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates array of tags
 * FIXME: No tag format validation
 */
export function validateTags(tags: string[]): string[] {
  // TODO: Add tag character restrictions
  // BUG: Duplicate tags allowed
  if (!Array.isArray(tags)) {
    throw new Error('Tags must be an array');
  }

  return tags
    .map(tag => tag.trim().toLowerCase())
    .filter((tag, index, self) => tag.length > 0 && self.indexOf(tag) === index);
    // NOTE: Should limit number of tags
}
