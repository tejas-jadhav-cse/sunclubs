/**
 * Secure Supabase Configuration for Club Recruitment
 * 
 * SECURITY NOTE: This now uses the secure configuration manager
 * Environment variables should be set up properly for production
 */

// Import configuration manager
// Note: Make sure config-manager.js is loaded before this file

// Get secure configuration
const SUPABASE_CONFIG = (() => {
    try {
        if (typeof configManager === 'undefined') {
            console.warn('⚠️ Configuration manager not loaded. Please include config-manager.js first.');
            // Return fallback configuration for testing
            return {
                url: 'https://ycuxzzwlucnrhgpsucqc.supabase.co',
                anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdXh6endsdWNucmhncHN1Y3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjAxNDYsImV4cCI6MjA2NzgzNjE0Nn0.A8Tv2AqZ9OJxUDr6wtrL016YyZb0N_k11L4h-jCXZZo'
            };
        }
        return configManager.getSupabaseConfig();
    } catch (error) {
        console.error('❌ Configuration Error:', error.message);
        console.warn('⚠️ Using fallback configuration for testing');
        // Return fallback configuration
        return {
            url: 'https://ycuxzzwlucnrhgpsucqc.supabase.co',
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdXh6endsdWNucmhncHN1Y3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjAxNDYsImV4cCI6MjA2NzgzNjE0Nn0.A8Tv2AqZ9OJxUDr6wtrL016YyZb0N_k11L4h-jCXZZo'
        };
    }
})();

// Store the original Supabase library reference before we overwrite window.supabase
const SupabaseLibrary = window.supabase;

// Singleton Supabase client instance
let supabaseClientInstance = null;

// Initialize Supabase client with secure configuration (singleton pattern)
function createSupabaseClient() {
    // Return existing instance if already created
    if (supabaseClientInstance) {
        console.log('🔄 Returning existing Supabase client instance');
        return supabaseClientInstance;
    }

    try {
        if (SupabaseLibrary && SupabaseLibrary.createClient) {
            supabaseClientInstance = SupabaseLibrary.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Single Supabase client created');
            return supabaseClientInstance;
        } else {
            console.warn('⚠️ Supabase library not available during client creation');
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
        return null;
    }
}

// Create the initial client instance
const supabase = createSupabaseClient();

// Make supabase client available globally (but preserve library access)
if (supabase) {
    window.supabaseClient = supabase;
}
// Keep the original library accessible
window.SupabaseLibrary = SupabaseLibrary;
// Expose the singleton creation function
window.createSupabaseClient = createSupabaseClient;

// Available clubs (modify as needed)
const AVAILABLE_CLUBS = [
    { id: 'tech', name: 'Tech Club' },
    { id: 'entrepreneurship', name: 'Entrepreneurship Club' },
    { id: 'cultural', name: 'Cultural Club' },
    { id: 'sports', name: 'Sports Club' },
    { id: 'debate', name: 'Debate Club' },
    { id: 'music', name: 'Music Club' },
    { id: 'dance', name: 'Dance Club' },
    { id: 'photography', name: 'Photography Club' },
    { id: 'community-service', name: 'Community Service' },
    { id: 'gaming', name: 'Gaming Club' }
];

// Form validation rules
const VALIDATION_RULES = {
    fullName: {
        required: true,
        minLength: 2,
        maxLength: 100
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
        required: false,
        pattern: /^[\+]?[1-9][\d]{0,15}$/
    },
    college: {
        required: true,
        minLength: 1,
        maxLength: 50
    },
    branch: {
        required: false,
        minLength: 1,
        maxLength: 100
    },
    year: {
        required: false,
        minLength: 1,
        maxLength: 20
    },
    institution: {
        required: true
    },
    reason: {
        required: true,
        minLength: 50,
        maxLength: 1000
    },
    portfolio: {
        required: false,
        pattern: /^https?:\/\/.+/
    },
    clubs: {
        required: true,
        minSelection: 1,
        maxSelection: 5
    },
    consent: {
        required: true
    }
};

// Messages
const MESSAGES = {
    success: 'Application submitted successfully! We\'ll get back to you soon.',
    error: 'Something went wrong. Please try again later.',
    submitting: 'Submitting your application...',
    
    validation: {
        fullName: {
            required: 'Full name is required',
            minLength: 'Name must be at least 2 characters',
            maxLength: 'Name must be less than 100 characters'
        },
        email: {
            required: 'Email is required',
            invalid: 'Please enter a valid email address'
        },
        phone: {
            invalid: 'Please enter a valid phone number'
        },
        college: {
            required: 'Please select a college',
            minLength: 'Please select a college'
        },
        branch: {
            invalid: 'Please select a valid branch'
        },
        year: {
            invalid: 'Please select a valid year'
        },
        institution: {
            required: 'Please select an institution'
        },
        reason: {
            required: 'Please tell us why you want to join',
            minLength: 'Please provide a more detailed explanation (at least 50 characters)',
            maxLength: 'Please keep your response under 1000 characters'
        },
        portfolio: {
            invalid: 'Please enter a valid URL (starting with http:// or https://)'
        },
        clubs: {
            required: 'Please select at least one club',
            maxSelection: 'You can select up to 5 clubs maximum'
        },
        consent: {
            required: 'Please provide consent to process your application'
        }
    }
};

/**
 * Initialize Supabase client
 * @returns {Object|null} Supabase client or null if not configured
 */
function initializeSupabase() {
    // Check if configuration is using placeholder values
    if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL' || 
        SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY' ||
        !SUPABASE_CONFIG.url || 
        !SUPABASE_CONFIG.anonKey) {
        console.warn('Supabase not configured. Please update SUPABASE_CONFIG in supabase-config.js');
        return null;
    }

    console.log('🔥 Getting Supabase client instance...');
    
    // Return existing singleton instance instead of creating a new one
    if (supabaseClientInstance) {
        console.log('✅ Returning existing Supabase client instance');
        return supabaseClientInstance;
    }

    // If no instance exists, create one using the singleton function
    return createSupabaseClient();
}

/**
 * Submit application to Supabase
 * @param {Object} formData - The form data to submit
 * @returns {Promise<Object>} Result of the submission
 */
async function submitApplication(formData) {
    const supabase = initializeSupabase();
    
    if (!supabase) {
        // Fallback for testing without Supabase
        if (typeof logger !== 'undefined') {
            logger.debug('Test submission (Supabase not configured):', formData);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return { success: true, data: formData };
    }

    try {
        const { data, error } = await supabase
            .from('club_applications')
            .insert([formData]);

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Supabase submission error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Validate form field
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Array} selectedClubs - Currently selected clubs (for club validation)
 * @returns {Object} Validation result with isValid and message
 */
function validateField(fieldName, value, selectedClubs = []) {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return { isValid: true };

    // Special validation for clubs - handle array values
    if (fieldName === 'clubs') {
        const clubsArray = Array.isArray(value) ? value : selectedClubs;
        if (typeof logger !== 'undefined') {
            logger.debug('Validating clubs array:', clubsArray);
        }
        
        if (rules.minSelection && clubsArray.length < rules.minSelection) {
            return {
                isValid: false,
                message: MESSAGES.validation.clubs.required
            };
        }
        if (rules.maxSelection && clubsArray.length > rules.maxSelection) {
            return {
                isValid: false,
                message: MESSAGES.validation.clubs.maxSelection
            };
        }
        return { isValid: true };
    }

    // Required field validation
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.required || 'This field is required'
        };
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
        return { isValid: true };
    }

    // String length validation
    if (rules.minLength && value.length < rules.minLength) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.minLength || `Minimum ${rules.minLength} characters required`
        };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.maxLength || `Maximum ${rules.maxLength} characters allowed`
        };
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.invalid || 'Invalid format'
        };
    }

    return { isValid: true };
}

/**
 * Get form data from the form elements
 * @returns {Object} Form data object
 */
function getFormData() {
    return {
        full_name: document.getElementById('fullName')?.value?.trim() || '',
        email: document.getElementById('email')?.value?.trim() || '',
        phone: document.getElementById('phone')?.value?.trim() || null,
        institution: document.querySelector('.toggle-button.active')?.dataset?.institution || 'foundation',
        college: document.getElementById('college')?.value?.trim() || '',
        branch: document.getElementById('branch')?.value?.trim() || null,
        year: document.getElementById('year')?.value?.trim() || null,
        selected_clubs: window.selectedClubs || [],
        reason: document.getElementById('reason')?.value?.trim() || '',
        portfolio_url: document.getElementById('portfolio')?.value?.trim() || null,
        consent_given: window.consentGiven || false,
        created_at: new Date().toISOString()
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        AVAILABLE_CLUBS,
        VALIDATION_RULES,
        MESSAGES,
        initializeSupabase,
        submitApplication,
        validateField,
        getFormData
    };
}

// Browser environment - expose everything globally for direct access
if (typeof window !== 'undefined') {
    window.VALIDATION_RULES = VALIDATION_RULES;
    window.MESSAGES = MESSAGES;
    window.AVAILABLE_CLUBS = AVAILABLE_CLUBS;
    window.initializeSupabase = initializeSupabase;
    window.submitApplication = submitApplication;
    window.validateField = validateField;
    window.getFormData = getFormData;
}
