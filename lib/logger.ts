/**
 * Centralized logging utility
 * Prepared for Sentry or other error tracking integration
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Log informational messages
     */
    info(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, context || '');
        }
        // TODO: Send to Sentry or logging service in production
        // if (Sentry) {
        //     Sentry.captureMessage(message, { level: 'info', contexts: { custom: context } });
        // }
    }

    /**
     * Log warnings
     */
    warn(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, context || '');
        }
        // TODO: Send to Sentry or logging service in production
        // if (Sentry) {
        //     Sentry.captureMessage(message, { level: 'warning', contexts: { custom: context } });
        // }
    }

    /**
     * Log errors with full context
     */
    error(message: string, error?: Error | unknown, context?: LogContext) {
        const errorDetails = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
        } : error;

        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, errorDetails, context || '');
        }

        // TODO: Send to Sentry or logging service in production
        // if (Sentry && error instanceof Error) {
        //     Sentry.captureException(error, {
        //         contexts: {
        //             custom: { ...context, message },
        //         },
        //     });
        // }
    }

    /**
     * Log debug information (development only)
     */
    debug(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, context || '');
        }
    }
}

// Export singleton instance
export const logger = new Logger();
