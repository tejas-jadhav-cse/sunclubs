/**
 * Production-Safe Logger
 * Provides logging that's safe for production environments
 */

class Logger {
    constructor() {
        this.isProduction = this.checkProductionEnvironment();
        this.logLevel = this.isProduction ? 'error' : 'debug';
        this.logs = [];
        this.maxLogs = 50;
    }

    /**
     * Check if we're in production
     */
    checkProductionEnvironment() {
        try {
            if (typeof configManager !== 'undefined') {
                return configManager.getAppConfig().environment === 'production';
            }
            
            // Fallback checks
            return window.location.hostname !== 'localhost' && 
                   window.location.hostname !== '127.0.0.1' &&
                   !window.location.hostname.includes('local');
        } catch (error) {
            return true; // Err on the side of caution
        }
    }

    /**
     * Log levels
     */
    static LEVELS = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    /**
     * Check if we should log at this level
     */
    shouldLog(level) {
        const currentLevel = Logger.LEVELS[this.logLevel] || 0;
        const messageLevel = Logger.LEVELS[level] || 0;
        return messageLevel >= currentLevel;
    }

    /**
     * Add log to internal storage
     */
    addToHistory(level, message, data) {
        this.logs.push({
            level,
            message,
            data,
            timestamp: new Date().toISOString()
        });

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    /**
     * Debug logging (development only)
     */
    debug(message, data = null) {
        if (!this.shouldLog('debug')) return;
        
        this.addToHistory('debug', message, data);
        
        if (data) {
            console.log(`🔍 [DEBUG] ${message}`, data);
        } else {
            console.log(`🔍 [DEBUG] ${message}`);
        }
    }

    /**
     * Info logging
     */
    info(message, data = null) {
        if (!this.shouldLog('info')) return;
        
        this.addToHistory('info', message, data);
        
        if (data) {
            console.log(`ℹ️ [INFO] ${message}`, data);
        } else {
            console.log(`ℹ️ [INFO] ${message}`);
        }
    }

    /**
     * Warning logging
     */
    warn(message, data = null) {
        if (!this.shouldLog('warn')) return;
        
        this.addToHistory('warn', message, data);
        
        if (data) {
            console.warn(`⚠️ [WARN] ${message}`, data);
        } else {
            console.warn(`⚠️ [WARN] ${message}`);
        }
    }

    /**
     * Error logging (always logged)
     */
    error(message, data = null) {
        this.addToHistory('error', message, data);
        
        if (data) {
            console.error(`❌ [ERROR] ${message}`, data);
        } else {
            console.error(`❌ [ERROR] ${message}`);
        }
    }

    /**
     * Success logging
     */
    success(message, data = null) {
        if (!this.shouldLog('info')) return;
        
        this.addToHistory('info', message, data);
        
        if (data) {
            console.log(`✅ [SUCCESS] ${message}`, data);
        } else {
            console.log(`✅ [SUCCESS] ${message}`);
        }
    }

    /**
     * Performance timing
     */
    time(label) {
        if (!this.shouldLog('debug')) return;
        console.time(`⏱️ ${label}`);
    }

    timeEnd(label) {
        if (!this.shouldLog('debug')) return;
        console.timeEnd(`⏱️ ${label}`);
    }

    /**
     * Group logging
     */
    group(label) {
        if (!this.shouldLog('debug')) return;
        console.group(`📁 ${label}`);
    }

    groupEnd() {
        if (!this.shouldLog('debug')) return;
        console.groupEnd();
    }

    /**
     * Get log history
     */
    getHistory(level = null) {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return this.logs;
    }

    /**
     * Clear log history
     */
    clearHistory() {
        this.logs = [];
    }

    /**
     * Export logs for debugging
     */
    exportLogs() {
        if (this.isProduction) {
            this.warn('Log export not available in production');
            return null;
        }

        return {
            environment: this.isProduction ? 'production' : 'development',
            logLevel: this.logLevel,
            totalLogs: this.logs.length,
            logs: this.logs
        };
    }

    /**
     * Safe object logging (prevents circular references)
     */
    logObject(label, obj) {
        if (!this.shouldLog('debug')) return;
        
        try {
            const safeObj = JSON.parse(JSON.stringify(obj));
            this.debug(label, safeObj);
        } catch (error) {
            this.debug(`${label} (circular reference detected)`, '[Object with circular references]');
        }
    }
}

// Create singleton instance
const logger = new Logger();

// Disable console.log in production
if (logger.isProduction) {
    // Override console methods to prevent debug output
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalDebug = console.debug;
    
    console.log = function(...args) {
        // Only allow error and warn in production
        return;
    };
    
    console.info = function(...args) {
        return;
    };
    
    console.debug = function(...args) {
        return;
    };
    
    // Keep error and warn
    // console.error and console.warn remain unchanged
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Logger, logger };
}
