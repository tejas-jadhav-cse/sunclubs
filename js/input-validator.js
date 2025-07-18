/**
 * Input Validation Utility
 * Provides comprehensive input validation for forms
 */

class InputValidator {
    constructor() {
        this.validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            url: {
                pattern: /^https?:\/\/[^\s]+$/,
                message: 'Please enter a valid URL starting with http:// or https://'
            },
            name: {
                pattern: /^[a-zA-Z\s]{2,50}$/,
                message: 'Name should contain only letters and spaces (2-50 characters)'
            },
            password: {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
            }
        };

        this.setupRealTimeValidation();
    }

    /**
     * Validate a single field
     */
    validateField(element, type = null) {
        if (!element) return { isValid: false, message: 'Element not found' };

        const value = element.value.trim();
        const fieldType = type || element.dataset.validate || element.type;
        const isRequired = element.hasAttribute('required');

        // Check if field is required and empty
        if (isRequired && !value) {
            return {
                isValid: false,
                message: 'This field is required'
            };
        }

        // If field is empty and not required, it's valid
        if (!value && !isRequired) {
            return { isValid: true, message: '' };
        }

        // Validate based on type
        switch (fieldType) {
            case 'email':
                return this.validateEmail(value);
            case 'phone':
            case 'tel':
                return this.validatePhone(value);
            case 'url':
                return this.validateUrl(value);
            case 'name':
                return this.validateName(value);
            case 'password':
                return this.validatePassword(value, element);
            case 'text':
                return this.validateText(value, element);
            case 'number':
                return this.validateNumber(value, element);
            default:
                return { isValid: true, message: '' };
        }
    }

    /**
     * Email validation
     */
    validateEmail(email) {
        if (!this.validationRules.email.pattern.test(email)) {
            return {
                isValid: false,
                message: this.validationRules.email.message
            };
        }

        // Additional checks for common email mistakes
        if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
            return {
                isValid: false,
                message: 'Email address format is invalid'
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Phone validation
     */
    validatePhone(phone) {
        // Remove spaces and dashes for validation
        const cleanPhone = phone.replace(/[\s\-]/g, '');
        
        if (!this.validationRules.phone.pattern.test(cleanPhone)) {
            return {
                isValid: false,
                message: this.validationRules.phone.message
            };
        }

        // Check for minimum length (international format)
        if (cleanPhone.length < 8) {
            return {
                isValid: false,
                message: 'Phone number is too short'
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * URL validation
     */
    validateUrl(url) {
        if (!this.validationRules.url.pattern.test(url)) {
            return {
                isValid: false,
                message: this.validationRules.url.message
            };
        }

        try {
            new URL(url);
            return { isValid: true, message: '' };
        } catch (error) {
            return {
                isValid: false,
                message: 'Invalid URL format'
            };
        }
    }

    /**
     * Name validation
     */
    validateName(name) {
        if (name.length < 2) {
            return {
                isValid: false,
                message: 'Name must be at least 2 characters long'
            };
        }

        if (name.length > 50) {
            return {
                isValid: false,
                message: 'Name must be less than 50 characters'
            };
        }

        if (!/^[a-zA-Z\s\.]+$/.test(name)) {
            return {
                isValid: false,
                message: 'Name can only contain letters, spaces, and periods'
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Password validation
     */
    validatePassword(password, element = null) {
        // Check if password validation is disabled for login forms
        if (element && element.dataset.skipValidation === 'true') {
            // For login forms, only check if password is not empty
            if (password.length === 0) {
                return {
                    isValid: false,
                    message: 'Password is required'
                };
            }
            return { isValid: true, message: '' };
        }

        // Standard password validation for registration/signup forms
        if (password.length < 8) {
            return {
                isValid: false,
                message: 'Password must be at least 8 characters long'
            };
        }

        if (!/(?=.*[a-z])/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one lowercase letter'
            };
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one uppercase letter'
            };
        }

        if (!/(?=.*\d)/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one number'
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Text validation with custom rules
     */
    validateText(text, element) {
        const minLength = parseInt(element.getAttribute('minlength')) || 0;
        const maxLength = parseInt(element.getAttribute('maxlength')) || Infinity;

        if (text.length < minLength) {
            return {
                isValid: false,
                message: `Must be at least ${minLength} characters long`
            };
        }

        if (text.length > maxLength) {
            return {
                isValid: false,
                message: `Must be less than ${maxLength} characters`
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Number validation
     */
    validateNumber(value, element) {
        const num = parseFloat(value);
        
        if (isNaN(num)) {
            return {
                isValid: false,
                message: 'Please enter a valid number'
            };
        }

        const min = parseFloat(element.getAttribute('min'));
        const max = parseFloat(element.getAttribute('max'));

        if (!isNaN(min) && num < min) {
            return {
                isValid: false,
                message: `Value must be at least ${min}`
            };
        }

        if (!isNaN(max) && num > max) {
            return {
                isValid: false,
                message: `Value must be at most ${max}`
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        const results = {
            isValid: true,
            errors: {},
            firstErrorElement: null
        };

        const elements = form.querySelectorAll('input, textarea, select');
        
        elements.forEach(element => {
            if (element.type === 'submit' || element.type === 'button') return;

            const validation = this.validateField(element);
            
            if (!validation.isValid) {
                results.isValid = false;
                results.errors[element.name || element.id] = validation.message;
                
                if (!results.firstErrorElement) {
                    results.firstErrorElement = element;
                }

                this.showFieldError(element, validation.message);
            } else {
                this.clearFieldError(element);
            }
        });

        return results;
    }

    /**
     * Show error for a specific field
     */
    showFieldError(element, message) {
        // Remove existing error
        this.clearFieldError(element);

        // Add error class
        element.classList.add('validation-error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b9d;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        `;

        // Insert error message after the input
        element.parentNode.insertBefore(errorElement, element.nextSibling);

        // Add error styling to input
        element.style.borderColor = '#ff6b9d';
        element.style.boxShadow = '0 0 0 2px rgba(255, 107, 157, 0.2)';
    }

    /**
     * Clear error for a specific field
     */
    clearFieldError(element) {
        // Remove error class
        element.classList.remove('validation-error');

        // Remove error message
        const errorMessage = element.parentNode.querySelector('.validation-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }

        // Reset input styling
        element.style.borderColor = '';
        element.style.boxShadow = '';
    }

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        document.addEventListener('input', (event) => {
            const element = event.target;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Debounce validation to avoid excessive validation
                clearTimeout(element.validationTimeout);
                element.validationTimeout = setTimeout(() => {
                    const validation = this.validateField(element);
                    if (!validation.isValid && element.value.trim()) {
                        this.showFieldError(element, validation.message);
                    } else {
                        this.clearFieldError(element);
                    }
                }, 500);
            }
        });

        document.addEventListener('blur', (event) => {
            const element = event.target;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const validation = this.validateField(element);
                if (!validation.isValid) {
                    this.showFieldError(element, validation.message);
                } else {
                    this.clearFieldError(element);
                }
            }
        });
    }

    /**
     * Sanitize input to prevent XSS
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Validate and sanitize form data
     */
    processFormData(form) {
        const validation = this.validateForm(form);
        
        if (!validation.isValid) {
            // Focus on first error element
            if (validation.firstErrorElement) {
                validation.firstErrorElement.focus();
            }
            return { isValid: false, errors: validation.errors };
        }

        // Extract and sanitize form data
        const formData = new FormData(form);
        const sanitizedData = {};

        for (const [key, value] of formData.entries()) {
            sanitizedData[key] = this.sanitizeInput(value);
        }

        return { isValid: true, data: sanitizedData };
    }
}

// Create singleton instance
const inputValidator = new InputValidator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InputValidator, inputValidator };
}
