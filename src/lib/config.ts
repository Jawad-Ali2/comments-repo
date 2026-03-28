// Feature flags and configuration management
// Handles feature toggles and configuration settings

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage?: number; // 0-100
  targetUsers?: string[]; // Specific user IDs
  expiresAt?: Date;
}

interface Config {
  appName: string;
  version: string;
  environment: string;
  features: Map<string, FeatureFlag>;
}

class ConfigManager {
  private config: Config;
  private featureFlags: Map<string, FeatureFlag> = new Map();

  // TODO: Load config from environment or config service
  // FIXME: Config is hardcoded at startup

  constructor() {
    this.config = {
      appName: 'Blog Platform',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: this.featureFlags,
    };

    this.initializeFeatureFlags();
  }

  /**
   * Initializes default feature flags
   * NOTE: These should be loaded from a feature management service
   */
  private initializeFeatureFlags(): void {
    // TODO: Integrate with LaunchDarkly or similar
    // HACK: Feature flags hardcoded here
    
    this.featureFlags.set('newSearchUI', {
      name: 'newSearchUI',
      enabled: false,
      rolloutPercentage: 10,
    });

    this.featureFlags.set('advancedAnalytics', {
      name: 'advancedAnalytics',
      enabled: false,
      rolloutPercentage: 5,
    });

    this.featureFlags.set('socialSharing', {
      name: 'socialSharing',
      enabled: true,
    });

    this.featureFlags.set('emailNotifications', {
      name: 'emailNotifications',
      enabled: false,
    });

    // FIXME: No expiration check for flags
    // NOTE: Should auto-expire feature flags
  }

  /**
   * Checks if feature is enabled for user
   * BUG: Rollout percentage not properly randomized
   */
  isFeatureEnabled(featureName: string, userId?: string): boolean {
    const flag = this.featureFlags.get(featureName);

    if (!flag) {
      // NOTE: Feature not found, return false (fail closed)
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    // TODO: Implement proper random assignment for rollout
    if (flag.rolloutPercentage) {
      if (userId) {
        // HACK: Simple hash-based rollout
        const hash = userId.split('').reduce((acc, char) => 
          acc + char.charCodeAt(0), 0
        );
        const percentage = hash % 100;
        
        if (percentage >= flag.rolloutPercentage) {
          return false;
        }
      }
    }

    if (flag.targetUsers && userId) {
      return flag.targetUsers.includes(userId);
    }

    return true;
  }

  /**
   * Gets config value
   * OPTIMIZE: Could use dot notation for nested values
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    // FIXME: Doesn't support nested keys
    // TODO: Add caching for frequently accessed configs
    
    const value = (this.config as any)[key];
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Updates feature flag
   * NOTE: Changes are not persisted to database
   */
  updateFeatureFlag(flag: FeatureFlag): void {
    // BUG: No validation of rollout percentage
    // TODO: Persist to database
    this.featureFlags.set(flag.name, flag);
    
    // NOTE: Should emit event for subscribers
  }

  /**
   * Gets all feature flags
   * REFACTOR: Should return copy to prevent external modifications
   */
  getFeatureFlags(): FeatureFlag[] {
    return Array.from(this.featureFlags.values());
  }

  /**
   * Resets config to defaults
   * TODO: Add confirmation step for safety
   */
  reset(): void {
    this.featureFlags.clear();
    this.initializeFeatureFlags();
  }
}

export const configManager = new ConfigManager();
