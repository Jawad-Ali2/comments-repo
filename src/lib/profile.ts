// User profile and preferences management

export interface UserProfile {
  userId: string;
  displayName: string;
  bio: string;
  avatar?: string;
  preferences: UserPreferences;
  socialLinks: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  publicProfile: boolean;
  twoFactorEnabled: boolean;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

class UserProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  // TODO: Implement image optimization and CDN integration for avatars
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.profiles.get(userId);
    
    if (!profile) {
      // FIXME: Should throw a proper custom error type
      throw new Error('User profile not found');
    }

    // BUG: No validation of displayName length or content
    const updated: UserProfile = {
      ...profile,
      ...updates,
      userId, // Ensure userId cannot be changed
      updatedAt: new Date(),
    };

    this.profiles.set(userId, updated);
    
    // NOTE: Should trigger event for profile update (e.g., for audit logs)
    console.log(`Profile updated for user ${userId}`);
    
    return updated;
  }

  // OPTIMIZE: Cache user preferences to reduce lookups
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const profile = this.profiles.get(userId);
    return profile?.preferences || null;
  }

  // TODO: Add validation for social media URLs
  async updateSocialLinks(userId: string, links: SocialLinks): Promise<SocialLinks> {
    const profile = this.profiles.get(userId);
    
    if (!profile) {
      throw new Error('User profile not found');
    }

    // HACK: Should validate URLs before storing
    profile.socialLinks = links;
    profile.updatedAt = new Date();

    return links;
  }

  // FIXME: Two-factor auth is not properly implemented
  async enableTwoFactorAuth(userId: string): Promise<{ secret: string; qrCode: string }> {
    // TODO: Integrate with TOTP library like speakeasy
    const secret = Math.random().toString(36).substring(7);
    
    return {
      secret,
      qrCode: `qr-code-placeholder-${secret}`, // Placeholder
    };
  }

  // BUG: No rate limiting on profile lookups for privacy attacks
  async getPublicProfile(userId: string): Promise<Partial<UserProfile> | null> {
    const profile = this.profiles.get(userId);
    
    if (!profile || !profile.preferences.publicProfile) {
      return null;
    }

    // NOTE: Should return only publicly visible fields
    return {
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      socialLinks: profile.socialLinks,
    };
  }

  // REFACTOR: Extract validation logic into a separate validator class
  async createProfile(
    userId: string,
    displayName: string,
    email: string
  ): Promise<UserProfile> {
    const profile: UserProfile = {
      userId,
      displayName,
      bio: '',
      preferences: {
        theme: 'auto',
        emailNotifications: true,
        publicProfile: false,
        twoFactorEnabled: false,
      },
      socialLinks: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.profiles.set(userId, profile);
    return profile;
  }
}

export const userProfileService = new UserProfileService();
