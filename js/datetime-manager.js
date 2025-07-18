/**
 * Date and Timezone Utility
 * Handles date formatting and timezone issues consistently
 */

class DateTimeManager {
    constructor() {
        this.userTimezone = this.getUserTimezone();
        this.appTimezone = 'Asia/Kolkata'; // India Standard Time for Sandip University
    }

    /**
     * Get user's timezone
     */
    getUserTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (error) {
            console.warn('Could not detect timezone, using UTC');
            return 'UTC';
        }
    }

    /**
     * Create a date in the app's timezone
     */
    createAppDate(dateString) {
        try {
            if (!dateString) return null;
            
            // If it's already a Date object, use it
            if (dateString instanceof Date) {
                return dateString;
            }

            // Handle different date string formats
            let date;
            
            if (dateString.includes('T')) {
                // ISO format with time
                date = new Date(dateString);
            } else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                // Date only format (YYYY-MM-DD)
                // Parse as local date to avoid timezone shifts
                const [year, month, day] = dateString.split('-').map(Number);
                date = new Date(year, month - 1, day);
            } else {
                // Try parsing as is
                date = new Date(dateString);
            }

            // Validate the date
            if (isNaN(date.getTime())) {
                console.warn(`Invalid date string: ${dateString}`);
                return null;
            }

            return date;
        } catch (error) {
            console.error('Error creating date:', error);
            return null;
        }
    }

    /**
     * Format date consistently for display
     */
    formatDate(date, options = {}) {
        try {
            if (!date) return 'TBA';
            
            const dateObj = this.createAppDate(date);
            if (!dateObj) return 'Invalid Date';

            const defaultOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: this.appTimezone
            };

            return new Intl.DateTimeFormat('en-IN', {
                ...defaultOptions,
                ...options
            }).format(dateObj);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Error formatting date';
        }
    }

    /**
     * Format date for input fields (YYYY-MM-DD)
     */
    formatDateForInput(date) {
        try {
            const dateObj = this.createAppDate(date);
            if (!dateObj) return '';

            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error formatting date for input:', error);
            return '';
        }
    }

    /**
     * Format time consistently
     */
    formatTime(date, options = {}) {
        try {
            if (!date) return 'TBA';
            
            const dateObj = this.createAppDate(date);
            if (!dateObj) return 'Invalid Time';

            const defaultOptions = {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: this.appTimezone,
                hour12: true
            };

            return new Intl.DateTimeFormat('en-IN', {
                ...defaultOptions,
                ...options
            }).format(dateObj);
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Error formatting time';
        }
    }

    /**
     * Format full date and time
     */
    formatDateTime(date, options = {}) {
        try {
            if (!date) return 'TBA';
            
            const dateObj = this.createAppDate(date);
            if (!dateObj) return 'Invalid Date/Time';

            const defaultOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: this.appTimezone,
                hour12: true
            };

            return new Intl.DateTimeFormat('en-IN', {
                ...defaultOptions,
                ...options
            }).format(dateObj);
        } catch (error) {
            console.error('Error formatting datetime:', error);
            return 'Error formatting datetime';
        }
    }

    /**
     * Get relative time (e.g., "2 days ago", "in 3 hours")
     */
    getRelativeTime(date) {
        try {
            const dateObj = this.createAppDate(date);
            if (!dateObj) return 'Unknown';

            const now = new Date();
            const diffMs = dateObj.getTime() - now.getTime();
            const diffMinutes = Math.round(diffMs / (1000 * 60));
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            if (Math.abs(diffMinutes) < 60) {
                if (diffMinutes > 0) {
                    return `in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
                } else {
                    return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) === 1 ? '' : 's'} ago`;
                }
            } else if (Math.abs(diffHours) < 24) {
                if (diffHours > 0) {
                    return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
                } else {
                    return `${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? '' : 's'} ago`;
                }
            } else {
                if (diffDays > 0) {
                    return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
                } else {
                    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
                }
            }
        } catch (error) {
            console.error('Error calculating relative time:', error);
            return 'Unknown';
        }
    }

    /**
     * Check if date is today
     */
    isToday(date) {
        try {
            const dateObj = this.createAppDate(date);
            if (!dateObj) return false;

            const today = new Date();
            return dateObj.toDateString() === today.toDateString();
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if date is in the past
     */
    isPast(date) {
        try {
            const dateObj = this.createAppDate(date);
            if (!dateObj) return false;

            return dateObj < new Date();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get events for a specific day (timezone-aware)
     */
    getEventsForDay(events, targetDate) {
        try {
            const targetDateObj = this.createAppDate(targetDate);
            if (!targetDateObj) return [];

            const targetDateString = this.formatDateForInput(targetDateObj);

            return events.filter(event => {
                const eventDateString = this.formatDateForInput(event.event_date);
                return eventDateString === targetDateString;
            });
        } catch (error) {
            console.error('Error filtering events for day:', error);
            return [];
        }
    }

    /**
     * Create a safe date comparison string
     */
    getDateComparisonString(date) {
        try {
            const dateObj = this.createAppDate(date);
            if (!dateObj) return null;

            // Return YYYY-MM-DD format for consistent comparison
            return this.formatDateForInput(dateObj);
        } catch (error) {
            console.error('Error creating date comparison string:', error);
            return null;
        }
    }
}

// Create singleton instance
const dateTimeManager = new DateTimeManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DateTimeManager, dateTimeManager };
}
