/**
 * Secure Configuration Manager
 * Handles environment variables and configuration securely
 */

class ConfigManager {
    constructor() {
        console.log('🔧 ConfigManager: Initializing...');
        this.config = {};
        this.isProduction = this.getEnvironment() === 'production';
        console.log('🔧 ConfigManager: Environment detected:', this.getEnvironment());
        console.log('🔧 ConfigManager: Is Production:', this.isProduction);
        this.loadConfiguration();
        console.log('🔧 ConfigManager: Configuration loaded successfully');
    }

    /**
     * Load configuration from environment variables or fallback
     */
    loadConfiguration() {
        // Try to load from environment variables first
        this.config = {
            supabase: {
                url: this.getEnvVar('VITE_SUPABASE_URL') || this.getFallbackConfig().url,
                anonKey: this.getEnvVar('VITE_SUPABASE_ANON_KEY') || this.getFallbackConfig().anonKey
            },
            app: {
                name: this.getEnvVar('VITE_APP_NAME') || 'Sandip University Clubs',
                version: this.getEnvVar('VITE_APP_VERSION') || '1.0.0',
                environment: this.getEnvVar('VITE_ENVIRONMENT') || 'development'
            },
            admin: {
                secretKey: this.getEnvVar('VITE_ADMIN_SECRET_KEY') || ''
            }
        };

        // Validate configuration
        this.validateConfiguration();
    }

    /**
     * Get environment variable safely
     */
    getEnvVar(key) {
        // Node.js environment
        if (typeof process !== 'undefined' && process.env) {
            return process.env[key];
        }
        
        // For client-side, check if variables are injected by build tools
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__[key];
        }
        
        // Manual environment injection for browser (fallback)
        if (typeof window !== 'undefined' && window.__MANUAL_ENV__) {
            return window.__MANUAL_ENV__[key];
        }
        
        return null;
    }

    /**
     * Get current environment
     */
    getEnvironment() {
        // First check for explicit environment variables
        const envVar = this.getEnvVar('VITE_ENVIRONMENT') || this.getEnvVar('NODE_ENV');
        if (envVar) return envVar;
        
        // For browser applications, use hostname to determine environment
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            
            // Development environments
            if (hostname === 'localhost' || 
                hostname === '127.0.0.1' || 
                hostname.includes('localhost') ||
                hostname.includes('127.0.0.1') ||
                hostname.includes('.local')) {
                return 'development';
            }
            
            // Production environments (hosted domains)
            return 'production';
        }
        
        // Default fallback
        return 'development';
    }

    /**
     * Fallback configuration for development/demo
     * WARNING: These should NEVER be used in production
     */
    getFallbackConfig() {
        if (this.isProduction) {
            throw new Error('❌ CRITICAL: No environment configuration found in production! Please set up environment variables.');
        }

        console.warn('⚠️  WARNING: Using fallback configuration. Set up environment variables for production!');
        
        return {
            url: 'https://ycuxzzwlucnrhgpsucqc.supabase.co',
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdXh6endsdWNucmhncHN1Y3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjAxNDYsImV4cCI6MjA2NzgzNjE0Nn0.A8Tv2AqZ9OJxUDr6wtrL016YyZb0N_k11L4h-jCXZZo'
        };
    }

    /**
     * Validate configuration
     */
    validateConfiguration() {
        const { supabase } = this.config;

        if (!supabase.url || !supabase.anonKey) {
            throw new Error('❌ CRITICAL: Supabase configuration is missing. Please check your environment variables.');
        }

        if (!supabase.url.startsWith('https://')) {
            throw new Error('❌ CRITICAL: Supabase URL must use HTTPS.');
        }

        if (supabase.anonKey.length < 100) {
            console.warn('⚠️  WARNING: Supabase anon key seems too short. Please verify.');
        }

        // Check for test/development values in production
        if (this.isProduction) {
            const testPatterns = ['test', 'demo', 'localhost', 'example'];
            const configString = JSON.stringify(supabase).toLowerCase();
            
            if (testPatterns.some(pattern => configString.includes(pattern))) {
                throw new Error('❌ CRITICAL: Test/development configuration detected in production!');
            }
        }
    }

    /**
     * Get Supabase configuration
     */
    getSupabaseConfig() {
        return {
            url: this.config.supabase.url,
            anonKey: this.config.supabase.anonKey
        };
    }

    /**
     * Get app configuration
     */
    getAppConfig() {
        return this.config.app;
    }

    /**
     * Check if admin features are enabled
     */
    isAdminEnabled() {
        return !!this.config.admin.secretKey;
    }

    /**
     * Get admin headers for authenticated requests
     */
    getAdminHeaders() {
        if (!this.isAdminEnabled()) {
            return {};
        }

        return {
            'x-admin-key': this.config.admin.secretKey
        };
    }

    /**
     * Safe logging that doesn't expose sensitive data
     */
    logConfig() {
        if (!this.isProduction) {
            console.log('📋 Configuration loaded:', {
                environment: this.config.app.environment,
                supabaseUrl: this.config.supabase.url ? '✅ Set' : '❌ Missing',
                supabaseKey: this.config.supabase.anonKey ? '✅ Set' : '❌ Missing',
                adminEnabled: this.isAdminEnabled()
            });
        }
    }
}

// Create singleton instance
const configManager = new ConfigManager();

// Log configuration (safe)
configManager.logConfig();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfigManager, configManager };
}
