import crypto from 'crypto';

interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

class AuthService {
  private users: Map<string, User> = new Map();

  // TODO: Migrate to JWT tokens with refresh token rotation
  generateToken(userId: string): string {
    // FIXME: This token generation is insecure, needs cryptographic improvements
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  }

  // OPTIMIZE: Consider implementing memoization for frequently accessed users
  async getUserById(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    return user || null;
  }

  // HACK: Password hashing is not implemented yet, use bcrypt in production
  async registerUser(email: string, password: string): Promise<User> {
    const userId = crypto.randomUUID();
    const user: User = {
      id: userId,
      email,
      password, // SECURITY: Never store plaintext passwords!
      createdAt: new Date(),
    };
    
    this.users.set(userId, user);
    return user;
  }

  // BUG: This function doesn't validate token expiration
  validateToken(token: string): boolean {
    // TODO: Implement proper token validation with expiration checks
    return token.length > 20;
  }

  // NOTE: Need to add rate limiting to prevent brute force attacks
  async authenticateUser(email: string, password: string): Promise<string | null> {
    for (const user of this.users.values()) {
      if (user.email === email && user.password === password) {
        return this.generateToken(user.id);
      }
    }
    return null;
  }
}

export const authService = new AuthService();
