/**
 * Global Error Boundary and Handling System
 * Provides comprehensive error handling across the application
 */

class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.maxErrors = 10;
        this.setupGlobalErrorHandlers();
        this.setupPromiseRejectionHandler();
    }

    /**
     * Setup global error handlers
     */
    setupGlobalErrorHandlers() {
        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString()
            });
        });

        // Handle resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleError({
                    type: 'Resource Error',
                    message: `Failed to load resource: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    timestamp: new Date().toISOString()
                });
            }
        }, true);
    }

    /**
     * Setup unhandled promise rejection handler
     */
    setupPromiseRejectionHandler() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || 'Unknown promise rejection',
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });

            // Prevent the error from appearing in console
            event.preventDefault();
        });
    }

    /**
     * Handle and log errors
     */
    handleError(errorInfo) {
        // Add to error queue
        this.errors.push(errorInfo);
        
        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log error based on environment
        if (this.isProduction()) {
            this.logProductionError(errorInfo);
        } else {
            this.logDevelopmentError(errorInfo);
        }

        // Show user-friendly error message
        this.showUserError(errorInfo);

        // Send to error reporting service (implement as needed)
        this.reportError(errorInfo);
    }

    /**
     * Check if in production environment
     */
    isProduction() {
        return typeof configManager !== 'undefined' && 
               configManager.getAppConfig().environment === 'production';
    }

    /**
     * Log error in production (minimal logging)
     */
    logProductionError(errorInfo) {
        console.error(`[${errorInfo.type}] ${errorInfo.message}`);
    }

    /**
     * Log error in development (detailed logging)
     */
    logDevelopmentError(errorInfo) {
        console.group(`🚨 ${errorInfo.type}`);
        console.error('Message:', errorInfo.message);
        if (errorInfo.filename) {
            console.error('File:', `${errorInfo.filename}:${errorInfo.line}:${errorInfo.column}`);
        }
        if (errorInfo.stack) {
            console.error('Stack:', errorInfo.stack);
        }
        console.error('Timestamp:', errorInfo.timestamp);
        console.groupEnd();
    }

    /**
     * Show user-friendly error message
     */
    showUserError(errorInfo) {
        // Don't show errors for resource loading failures
        if (errorInfo.type === 'Resource Error') {
            return;
        }

        const errorMessage = this.getUserFriendlyMessage(errorInfo);
        this.showToast(errorMessage, 'error');
    }

    /**
     * Convert technical error to user-friendly message
     */
    getUserFriendlyMessage(errorInfo) {
        const message = errorInfo.message.toLowerCase();

        if (message.includes('network')) {
            return 'Network connection issue. Please check your internet and try again.';
        }
        
        if (message.includes('failed to fetch') || message.includes('fetch')) {
            return 'Unable to connect to server. Please try again later.';
        }

        if (message.includes('supabase') || message.includes('database')) {
            return 'Database connection issue. Please try again.';
        }

        if (message.includes('permission') || message.includes('unauthorized')) {
            return 'You don\'t have permission for this action. Please log in again.';
        }

        if (message.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }

        // Generic error message
        return 'Something went wrong. Please try again.';
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `error-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(235, 72, 134, 0.95)' : 'rgba(90, 66, 239, 0.95)'};
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            backdrop-filter: blur(10px);
        `;

        // Add to DOM
        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    /**
     * Report error to external service (implement as needed)
     */
    reportError(errorInfo) {
        // TODO: Implement error reporting service integration
        // Examples: Sentry, LogRocket, Bugsnag, etc.
        
        if (!this.isProduction()) {
            return; // Don't report in development
        }

        // Example implementation:
        // fetch('/api/errors', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorInfo)
        // }).catch(() => {}); // Fail silently
    }

    /**
     * Async operation wrapper with error handling
     */
    static async safeAsync(asyncOperation, context = 'Operation') {
        try {
            return await asyncOperation();
        } catch (error) {
            errorBoundary.handleError({
                type: 'Async Operation Error',
                message: `${context}: ${error.message}`,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            throw error; // Re-throw for caller to handle
        }
    }

    /**
     * Get error statistics
     */
    getErrorStats() {
        const errorTypes = {};
        this.errors.forEach(error => {
            errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
        });

        return {
            totalErrors: this.errors.length,
            errorTypes,
            recentErrors: this.errors.slice(-5)
        };
    }
}

// Initialize global error boundary
const errorBoundary = new ErrorBoundary();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorBoundary, errorBoundary };
}
