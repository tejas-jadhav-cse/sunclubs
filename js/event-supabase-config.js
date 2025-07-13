/**
 * Secure Supabase Configuration for Event Calendar
 * Uses the secure configuration manager to protect credentials
 */

// Get secure configuration
const SUPABASE_CONFIG = (() => {
    try {
        if (typeof configManager === 'undefined') {
            throw new Error('Configuration manager not loaded. Please include config-manager.js first.');
        }
        return configManager.getSupabaseConfig();
    } catch (error) {
        console.error('❌ Configuration Error:', error.message);
        throw error;
    }
})();

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Secure authentication helper functions
class AuthHelper {
    // Server-side admin verification (to be implemented)
    static async isAdmin(email) {
        try {
            // TODO: Implement server-side admin verification
            // This should make an authenticated API call to verify admin status
            const response = await supabaseClient.rpc('verify_admin_status', { 
                user_email: email 
            });
            
            return response.data === true;
        } catch (error) {
            console.error('Admin verification failed:', error);
            return false;
        }
    }

    // Get admin headers if available
    static getAdminHeaders() {
        if (typeof configManager !== 'undefined' && configManager.isAdminEnabled()) {
            return configManager.getAdminHeaders();
        }
        return {};
    }
}

// Event Management Functions
class EventManager {
    constructor() {
        this.tableName = 'club_events';
    }

    // Fetch all events
    async getAllEvents() {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .select('*')
                .order('event_date', { ascending: true });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    // Fetch events by date range
    async getEventsByDateRange(startDate, endDate) {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .select('*')
                .gte('event_date', startDate)
                .lte('event_date', endDate)
                .order('event_date', { ascending: true });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching events by date range:', error);
            throw error;
        }
    }

    // Fetch events by club
    async getEventsByClub(clubName) {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .select('*')
                .eq('club_name', clubName)
                .order('event_date', { ascending: true });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching events by club:', error);
            throw error;
        }
    }

    // Fetch events by type
    async getEventsByType(eventType) {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .select('*')
                .eq('event_type', eventType)
                .order('event_date', { ascending: true });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching events by type:', error);
            throw error;
        }
    }

    // Add new event (for admin dashboard)
    async addEvent(eventData) {
        try {
            // Log the data being sent for debugging
            if (typeof logger !== 'undefined') {
                logger.debug('Adding event with data:', eventData);
            }
            
            // Clean and validate data before sending
            const cleanedData = this.cleanEventData(eventData);
            if (typeof logger !== 'undefined') {
                logger.debug('Cleaned event data:', cleanedData);
            }
            
            // Add admin headers if using secret key method
            const headers = AuthHelper.getAdminHeaders();
            
            let query = supabaseClient
                .from(this.tableName)
                .insert([cleanedData])
                .select();

            // Add headers if they exist
            if (Object.keys(headers).length > 0) {
                query = query.headers(headers);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Detailed error:', error);
                console.error('Event data being inserted:', eventData);
                
                // Provide more helpful error messages
                if (error.code === '42501') {
                    throw new Error('Permission denied. Please check if RLS policies allow public inserts or if you need to authenticate.');
                }
                if (error.code === '23514') {
                    throw new Error('Data validation failed. Please check: URLs must start with http/https, phone numbers must be +91xxxxxxxxxx format, and required fields are filled.');
                }
                if (error.message && error.message.includes('violates check constraint')) {
                    throw new Error('Data validation failed: ' + error.message);
                }
                throw new Error('Database error: ' + (error.message || 'Unknown error occurred'));
            }

            return data[0];
        } catch (error) {
            console.error('Error adding event:', error);
            throw error;
        }
    }

    // Update event (for admin dashboard)
    async updateEvent(eventId, updates) {
        try {
            // Add admin headers if using secret key method
            const headers = AuthHelper.getAdminHeaders();
            
            let query = supabaseClient
                .from(this.tableName)
                .update(updates)
                .eq('id', eventId)
                .select();

            // Add headers if they exist
            if (Object.keys(headers).length > 0) {
                query = query.headers(headers);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Detailed error:', error);
                if (error.code === '42501') {
                    throw new Error('Permission denied. Please check if RLS policies allow updates or if you need to authenticate.');
                }
                throw error;
            }

            return data[0];
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    // Clean and validate event data before database insertion
    cleanEventData(eventData) {
        const cleaned = { ...eventData };
        
        // Ensure required fields have values
        if (!cleaned.event_name || cleaned.event_name.trim() === '') {
            throw new Error('Event name is required');
        }
        if (!cleaned.club_name || cleaned.club_name.trim() === '') {
            throw new Error('Club name is required');
        }
        if (!cleaned.event_date) {
            throw new Error('Event date is required');
        }
        
        // Set default values for missing fields
        cleaned.status = cleaned.status || 'Active';
        cleaned.event_type = cleaned.event_type || 'In-Person';
        cleaned.tentative_time = cleaned.tentative_time || 'TBA';
        cleaned.venue = cleaned.venue || 'TBA';
        
        // Clean URL fields - ensure they start with http/https or set to null
        ['banner_url', 'register_url', 'whatsapp_url'].forEach(field => {
            if (cleaned[field]) {
                const url = cleaned[field].trim();
                if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                    cleaned[field] = 'https://' + url;
                } else if (!url) {
                    cleaned[field] = null;
                }
            } else {
                cleaned[field] = null;
            }
        });
        
        // Clean phone number fields - ensure they match +91xxxxxxxxxx format or set to null
        ['coordinator_1_phone', 'coordinator_2_phone'].forEach(field => {
            if (cleaned[field]) {
                const phone = cleaned[field].replace(/\D/g, ''); // Remove non-digits
                if (phone.length === 10) {
                    cleaned[field] = '+91' + phone;
                } else if (phone.length === 12 && phone.startsWith('91')) {
                    cleaned[field] = '+' + phone;
                } else if (cleaned[field].startsWith('+91') && phone.length === 12) {
                    // Already in correct format
                } else {
                    cleaned[field] = null; // Invalid format
                }
            } else {
                cleaned[field] = null;
            }
        });
        
        // Ensure description doesn't exceed 500 characters
        if (cleaned.description && cleaned.description.length > 500) {
            cleaned.description = cleaned.description.substring(0, 500);
        }
        
        // Remove any undefined or empty string values
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === undefined || cleaned[key] === '') {
                cleaned[key] = null;
            }
        });
        
        return cleaned;
    }

    // Delete event (for admin dashboard)
    async deleteEvent(eventId) {
        try {
            // Add admin headers if using secret key method
            const headers = AuthHelper.getAdminHeaders();
            
            let query = supabaseClient
                .from(this.tableName)
                .delete()
                .eq('id', eventId);

            // Add headers if they exist
            if (Object.keys(headers).length > 0) {
                query = query.headers(headers);
            }

            const { error } = await query;

            if (error) {
                console.error('Detailed error:', error);
                if (error.code === '42501') {
                    throw new Error('Permission denied. Please check if RLS policies allow deletes or if you need to authenticate.');
                }
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    // Get unique club names for filter dropdown
    async getUniqueClubs() {
        try {
            const { data, error } = await supabaseClient
                .from(this.tableName)
                .select('club_name')
                .not('club_name', 'is', null);

            if (error) {
                throw error;
            }

            const uniqueClubs = [...new Set(data.map(item => item.club_name))];
            return uniqueClubs.sort();
        } catch (error) {
            console.error('Error fetching unique clubs:', error);
            throw error;
        }
    }

    // Determine event status based on date
    getEventStatus(eventDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time to compare dates only
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);

        const eventDateObj = new Date(eventDate);
        eventDateObj.setHours(0, 0, 0, 0);

        if (eventDateObj.getTime() === today.getTime()) {
            return 'Today';
        } else if (eventDateObj.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else if (eventDateObj.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else if (eventDateObj < today) {
            return 'Completed';
        } else {
            return 'Upcoming';
        }
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString || dateString === 'TBA') {
            return 'TBA';
        }

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'TBA';
        }
    }

    // Format time for display
    formatTime(timeString) {
        if (!timeString || timeString === 'TBA') {
            return 'TBA';
        }
        return timeString;
    }
}

// Initialize event manager
const eventManager = new EventManager();

// SQL for creating the table (run this in your Supabase SQL editor)
const CREATE_TABLE_SQL = `
-- Create club_events table
CREATE TABLE IF NOT EXISTS club_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    banner_url TEXT,
    event_name TEXT NOT NULL,
    status TEXT,
    event_date DATE,
    tentative_time TEXT,
    club_name TEXT NOT NULL,
    venue TEXT,
    description TEXT CHECK (length(description) <= 500),
    coordinator_1_name TEXT,
    coordinator_1_phone TEXT,
    coordinator_2_name TEXT,
    coordinator_2_phone TEXT,
    event_type TEXT CHECK (event_type IN ('Virtual', 'In-Person')),
    register_url TEXT,
    whatsapp_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_club_events_date ON club_events(event_date);
CREATE INDEX IF NOT EXISTS idx_club_events_club ON club_events(club_name);
CREATE INDEX IF NOT EXISTS idx_club_events_type ON club_events(event_type);

-- Enable Row Level Security (RLS)
ALTER TABLE club_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to all users" ON club_events
    FOR SELECT USING (true);

-- Create policy to allow insert/update/delete for authenticated users
-- (You can modify this based on your authentication requirements)
CREATE POLICY "Allow full access to authenticated users" ON club_events
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert sample data
INSERT INTO club_events (
    banner_url,
    event_name,
    event_date,
    tentative_time,
    club_name,
    venue,
    description,
    coordinator_1_name,
    coordinator_1_phone,
    coordinator_2_name,
    coordinator_2_phone,
    event_type,
    register_url,
    whatsapp_url
) VALUES
(
    'images/tech-workshop-banner.jpg',
    'AI & Machine Learning Workshop',
    '2024-02-15',
    '2:00 PM - 5:00 PM',
    'Tech Club',
    'Auditorium A',
    'Join us for an intensive workshop on AI and Machine Learning fundamentals. Learn hands-on techniques and build your first ML model.',
    'Rahul Sharma',
    '+91 9876543210',
    'Priya Patel',
    '+91 9876543211',
    'In-Person',
    'https://forms.google.com/tech-workshop',
    'https://chat.whatsapp.com/techclub'
),
(
    'images/cultural-night-banner.jpg',
    'Cultural Night 2024',
    '2024-02-20',
    '6:00 PM - 10:00 PM',
    'Cultural Club',
    'Main Campus Ground',
    'Experience the vibrant culture of Sandip University with performances, music, dance, and food from different regions.',
    'Anjali Singh',
    '+91 9876543212',
    'Vikram Reddy',
    '+91 9876543213',
    'In-Person',
    'https://forms.google.com/cultural-night',
    'https://chat.whatsapp.com/culturalclub'
),
(
    'images/startup-pitch-banner.jpg',
    'Startup Pitch Competition',
    '2024-02-25',
    '10:00 AM - 4:00 PM',
    'Entrepreneurship Club',
    'Innovation Hub',
    'Present your startup ideas to industry experts and win exciting prizes. Open to all students with innovative business ideas.',
    'Arjun Kumar',
    '+91 9876543214',
    'Sneha Joshi',
    '+91 9876543215',
    'In-Person',
    'https://forms.google.com/startup-pitch',
    NULL
);
`;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { eventManager, CREATE_TABLE_SQL };
}
