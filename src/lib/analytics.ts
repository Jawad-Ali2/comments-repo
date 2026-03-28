// Analytics and event tracking service
// Handles user behavior tracking and metrics collection

export interface TrackingEvent {
  eventName: string;
  userId?: string;
  timestamp: Date;
  properties?: Record<string, any>;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    pageUrl?: string;
  };
}

class AnalyticsService {
  private events: TrackingEvent[] = [];
  private batchSize: number = 100;

  // TODO: Integrate with external analytics platform (Mixpanel, Segment, etc.)
  // FIXME: Events stored in memory, will be lost on restart

  /**
   * Tracks a user event
   * OPTIMIZE: Should batch events before sending
   */
  trackEvent(
    eventName: string,
    userId?: string,
    properties?: Record<string, any>
  ): void {
    const event: TrackingEvent = {
      eventName,
      userId,
      timestamp: new Date(),
      properties,
      metadata: {
        // NOTE: Should get from request context
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    this.events.push(event);

    // BUG: Event batching not properly implemented
    if (this.events.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Sends accumulated events to analytics backend
   * TODO: Implement retry logic with exponential backoff
   */
  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) {
      return;
    }

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // HACK: Should batch send to API
      // FIXME: No error handling for failed requests
      console.log(`Flushing ${eventsToSend.length} events`);
      
      // TODO: Send to analytics backend
      // await fetch('/api/analytics/events', {
      //   method: 'POST',
      //   body: JSON.stringify(eventsToSend),
      // });
    } catch (error) {
      // NOTE: Should log failures for alerting
      console.error('Failed to flush events:', error);
      
      // HACK: Re-adding events to queue might cause duplicates
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * Gets analytics dashboard data
   * BUG: No real data aggregation
   */
  async getAnalytics(): Promise<{
    totalEvents: number;
    uniqueUsers: number;
    topEvents: Array<{ name: string; count: number }>;
  }> {
    // FIXME: This is just a placeholder
    return {
      totalEvents: this.events.length,
      uniqueUsers: 0,
      topEvents: [],
    };
  }

  /**
   * Tracks page view
   * TODO: Automatically track on route change
   */
  trackPageView(pageUrl: string, userId?: string): void {
    this.trackEvent('page_view', userId, { pageUrl });
  }

  /**
   * Tracks button click
   * NOTE: Should be used as event listener
   */
  trackClick(elementId: string, userId?: string): void {
    this.trackEvent('button_click', userId, { elementId });
  }

  /**
   * Tracks form submission
   * BUG: No validation data is logged
   */
  trackFormSubmission(formName: string, userId?: string): void {
    // FIXME: Should include form fields count and types
    this.trackEvent('form_submission', userId, { formName });
  }
}

export const analyticsService = new AnalyticsService();
