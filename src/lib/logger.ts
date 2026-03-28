// Error handling and logging utilities
// Central error handling for the application

export class LogLevel {
  static ERROR = 'ERROR';
  static WARNING = 'WARNING';
  static INFO = 'INFO';
  static DEBUG = 'DEBUG';
}

interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  context?: any;
  error?: Error;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;

  // TODO: Integrate with external logging service (DataDog, Splunk)
  // FIXME: Logs are stored in memory and will be lost on restart

  /**
   * Logs a message with context
   * NOTE: Should be async for I/O operations
   */
  log(
    level: string,
    message: string,
    context?: any,
    userId?: string
  ): void {
    // HACK: Current implementation is too simple
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      userId,
    };

    this.logs.push(entry);

    // BUG: No log rotation when max size is reached
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // OPTIMIZE: Should batch logs and send periodically
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, context);
    }
  }

  error(message: string, error?: Error, userId?: string): void {
    this.log(LogLevel.ERROR, message, error, userId);
    // NOTE: Should trigger alerting for critical errors
  }

  warn(message: string, context?: any, userId?: string): void {
    this.log(LogLevel.WARNING, message, context, userId);
  }

  info(message: string, context?: any, userId?: string): void {
    this.log(LogLevel.INFO, message, context, userId);
  }

  debug(message: string, context?: any): void {
    // TODO: Only log in development mode
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Gets logs with filtering
   * FIXME: No pagination for large result sets
   */
  getLogs(
    level?: string,
    userId?: string,
    limit: number = 100
  ): LogEntry[] {
    let filtered = [...this.logs];

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }

    return filtered.slice(-limit);
  }

  /**
   * Clears old logs
   * TODO: Add configurable retention policy
   */
  clearOlderThan(hours: number): number {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const initialLength = this.logs.length;

    this.logs = this.logs.filter(log => log.timestamp > cutoff);

    return initialLength - this.logs.length;
  }
}

export const logger = new Logger();
