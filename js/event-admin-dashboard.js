/**
 * Event Admin Dashboard JavaScript
 * Handles authentication and event management for club presidents
 */

class EventAdminDashboard {
    constructor() {
        this.currentUser = null;
        this.currentClub = null;
        this.events = [];
        this.editingEvent = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Check authentication
            await this.checkAuth();
            
            // Initialize dashboard
            this.initializeDashboard();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load events data
            await this.loadEvents();
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Dashboard initialization error:', error);
            }
            this.showToast('Failed to initialize dashboard: ' + error.message, 'error');
            setTimeout(() => this.redirectToLogin(), 2000);
        }
    }
    
    // Authentication Methods
    async checkAuth() {
        try {
            const session = await PresidentAuth.getSession();
            
            if (!session) {
                throw new Error('No active session found. Please login again.');
            }
            
            const clubData = await PresidentAuth.getCurrentClubData();
            
            if (!clubData) {
                throw new Error('Club data not found. Please contact admin.');
            }
            
            this.currentUser = session.user;
            this.currentClub = clubData;
            
            if (typeof logger !== 'undefined') {
                logger.info('Authentication successful:', {
                    user: this.currentUser.email,
                    club: clubData.club_id,
                    role: clubData.role
                });
            }
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Authentication check failed:', error);
            }
            throw error;
        }
    }
    
    async logout() {
        try {
            await PresidentAuth.signOut();
            this.redirectToLogin();
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Logout error:', error);
            }
            this.showToast('Logout failed', 'error');
        }
    }
    
    redirectToLogin() {
        window.location.href = 'president-login.html';
    }
    
    // Dashboard Initialization
    initializeDashboard() {
        // Update header information
        document.getElementById('clubName').textContent = `${this.currentClub.clubs.name} - Event Dashboard`;
        document.getElementById('presidentName').textContent = `${this.currentClub.full_name} (${this.currentClub.role})`;
        
        // Update page title
        document.title = `${this.currentClub.clubs.name} Event Dashboard - Sandip University`;
        
        // Log the club data structure for debugging
        if (typeof logger !== 'undefined') {
            logger.info('Club data structure:', {
                club_id: this.currentClub.club_id,
                club_name: this.currentClub.clubs.name,
                president_name: this.currentClub.full_name,
                role: this.currentClub.role
            });
        }
    }
    
    // Event Listeners
    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        
        // Add event button
        document.getElementById('addEventBtn')?.addEventListener('click', () => this.openEventModal());
        
        // Search events
        document.getElementById('searchEvents')?.addEventListener('input', (e) => {
            this.searchEvents(e.target.value);
        });
        
        // Modal controls
        document.getElementById('closeFormModal')?.addEventListener('click', () => this.closeEventModal());
        document.getElementById('cancelFormBtn')?.addEventListener('click', () => this.closeEventModal());
        document.getElementById('eventForm')?.addEventListener('submit', (e) => this.handleEventSubmit(e));
        
        // Close modal on overlay click
        document.getElementById('eventFormModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'eventFormModal') {
                this.closeEventModal();
            }
        });
        
        // Add phone number formatting
        document.getElementById('coordinator1Phone')?.addEventListener('input', (e) => {
            this.formatPhoneInput(e.target);
        });
        document.getElementById('coordinator2Phone')?.addEventListener('input', (e) => {
            this.formatPhoneInput(e.target);
        });
    }
    
    // Data Loading
    async loadEvents() {
        try {
            const { data: events, error } = await supabasePresident
                .from('club_events')
                .select('*')
                .eq('club_name', this.currentClub.clubs.name)
                .order('event_date', { ascending: true });
            
            if (error) throw error;
            
            this.events = events || [];
            this.renderEvents();
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Error loading events:', error);
            }
            this.showToast('Failed to load events', 'error');
            // Show sample data for demonstration
            this.events = this.getSampleEvents();
            this.renderEvents();
        }
    }
    
    getSampleEvents() {
        return [
            {
                id: '1',
                event_name: 'React Workshop',
                description: 'Learn React fundamentals and build your first app',
                event_date: '2024-02-15',
                tentative_time: '2:00 PM - 5:00 PM',
                venue: 'Computer Lab 1',
                event_type: 'In-Person',
                status: 'planned',
                club_name: this.currentClub.clubs.name
            },
            {
                id: '2',
                event_name: 'Open Source Hackathon',
                description: 'Contribute to open source projects in this 24-hour hackathon',
                event_date: '2024-02-20',
                tentative_time: '9:00 AM onwards',
                venue: 'Main Auditorium',
                event_type: 'In-Person',
                status: 'planned',
                club_name: this.currentClub.clubs.name
            }
        ];
    }
    
    // Rendering Methods
    renderEvents() {
        const tableBody = document.getElementById('eventsTableBody');
        
        if (this.events.length === 0) {
            tableBody.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--grey5);">
                    <h3>No Events Found</h3>
                    <p>Click "Add New Event" to create your first event.</p>
                </div>
            `;
            return;
        }
        
        tableBody.innerHTML = this.events.map(event => `
            <div class="eventRow">
                <div class="eventInfo">
                    <h4>${event.event_name}</h4>
                    <p>${event.description || 'No description'}</p>
                </div>
                <div style="color: var(--white);">${event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBA'}</div>
                <div style="color: var(--white);">${event.club_name}</div>
                <div style="color: var(--white);">${this.formatEventType(event.event_type)}</div>
                <div><span class="statusBadge" style="background: ${this.getStatusColor(event.status)}; color: var(--white);">${event.status || 'planned'}</span></div>
                <div class="eventActions">
                    <button class="actionBtn editBtn" onclick="eventAdmin.editEvent('${event.id}')">Edit</button>
                    <button class="actionBtn deleteBtn" onclick="eventAdmin.deleteEvent('${event.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    formatEventType(type) {
        if (!type) return 'General';
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
    
    getStatusColor(status) {
        const colors = {
            'Upcoming': '#007bff',
            'Ongoing': '#ffc107', 
            'Completed': '#28a745',
            'Cancelled': '#dc3545',
            'planned': '#007bff',
            'ongoing': '#ffc107',
            'completed': '#28a745',
            'cancelled': '#dc3545'
        };
        return colors[status] || colors['planned'];
    }
    
    // Event Management
    openEventModal(event = null) {
        const modal = document.getElementById('eventFormModal');
        const title = document.getElementById('formTitle');
        const form = document.getElementById('eventForm');
        const clubNameInput = document.getElementById('clubNameInput');
        
        if (event) {
            title.textContent = 'Edit Event';
            this.editingEvent = event;
            this.populateEventForm(event);
        } else {
            title.textContent = 'Add New Event';
            this.editingEvent = null;
            form.reset();
            
            // Always set the club name to the logged-in president's club (read-only)
            clubNameInput.value = this.currentClub.clubs.name;
            clubNameInput.setAttribute('readonly', true);
            clubNameInput.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            clubNameInput.style.cursor = 'not-allowed';
        }
        
        modal.classList.add('active');
    }
    
    closeEventModal() {
        const modal = document.getElementById('eventFormModal');
        modal.classList.remove('active');
        this.editingEvent = null;
        document.getElementById('eventForm').reset();
    }
    
    populateEventForm(event) {
        const clubNameInput = document.getElementById('clubNameInput');
        
        document.getElementById('eventName').value = event.event_name || '';
        // Always set club name to the logged-in president's club (read-only)
        clubNameInput.value = this.currentClub.clubs.name;
        clubNameInput.setAttribute('readonly', true);
        clubNameInput.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        clubNameInput.style.cursor = 'not-allowed';
        
        document.getElementById('eventDate').value = event.event_date || '';
        document.getElementById('eventTime').value = event.tentative_time || '';
        document.getElementById('eventVenue').value = event.venue || '';
        document.getElementById('eventType').value = event.event_type || 'In-Person';
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('bannerUrl').value = event.banner_url || '';
        document.getElementById('registerUrl').value = event.register_url || '';
        document.getElementById('whatsappUrl').value = event.whatsapp_url || '';
        document.getElementById('coordinator1Name').value = event.coordinator_1_name || '';
        document.getElementById('coordinator1Phone').value = event.coordinator_1_phone || '';
        document.getElementById('coordinator2Name').value = event.coordinator_2_name || '';
        document.getElementById('coordinator2Phone').value = event.coordinator_2_phone || '';
    }
    
    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    async handleEventSubmit(e) {
        e.preventDefault();
        
        try {
            const submitBtn = document.getElementById('submitFormBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;
            
            const formData = new FormData(e.target);
            const eventData = {
                event_name: document.getElementById('eventName').value,
                description: document.getElementById('eventDescription').value,
                event_date: document.getElementById('eventDate').value,
                tentative_time: document.getElementById('eventTime').value || 'TBA',
                venue: document.getElementById('eventVenue').value || 'TBA',
                event_type: document.getElementById('eventType').value,
                register_url: document.getElementById('registerUrl').value || null,
                whatsapp_url: document.getElementById('whatsappUrl').value || null,
                banner_url: document.getElementById('bannerUrl').value || null,
                coordinator_1_name: document.getElementById('coordinator1Name').value || null,
                coordinator_1_phone: document.getElementById('coordinator1Phone').value || null,
                coordinator_2_name: document.getElementById('coordinator2Name').value || null,
                coordinator_2_phone: document.getElementById('coordinator2Phone').value || null,
                club_name: this.currentClub.clubs.name  // Always use the authenticated president's club name
                // Completely omit status field - let database handle it
            };
            
            // Validate event data
            const validationErrors = this.validateEventData(eventData);
            if (validationErrors.length > 0) {
                this.showToast('Validation errors: ' + validationErrors.join(', '), 'error');
                return;
            }
            
            // Debug: Log the event data being submitted
            if (typeof logger !== 'undefined') {
                logger.info('Submitting event data:', eventData);
                logger.info('Status value being sent:', eventData.status, typeof eventData.status);
                logger.info('Club name being used:', eventData.club_name);
                logger.info('Club data structure:', this.currentClub);
            }
            
            let result;
            if (this.editingEvent) {
                // Update existing event in database
                const { data, error } = await supabasePresident
                    .from('club_events')
                    .update(eventData)
                    .eq('id', this.editingEvent.id)
                    .select()
                    .single();
                
                if (error) throw error;
                
                // Update local array
                const eventIndex = this.events.findIndex(e => e.id === this.editingEvent.id);
                if (eventIndex !== -1) {
                    this.events[eventIndex] = data;
                }
            } else {
                // Add new event to database
                const { data, error } = await supabasePresident
                    .from('club_events')
                    .insert([eventData])
                    .select()
                    .single();
                
                if (error) throw error;
                
                // Add to local array
                this.events.push(data);
            }
            
            this.showToast(this.editingEvent ? 'Event updated successfully!' : 'Event created successfully!', 'success');
            this.closeEventModal();
            this.renderEvents();
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Error saving event:', error);
            }
            
            let errorMessage = 'Failed to save event: ';
            
            // Handle specific database constraint errors
            if (error.code === '23514') {
                if (error.message.includes('coordinator_1_phone_check')) {
                    errorMessage += 'Coordinator 1 phone number must be in format +91XXXXXXXXXX (10 digits after +91)';
                } else if (error.message.includes('coordinator_2_phone_check')) {
                    errorMessage += 'Coordinator 2 phone number must be in format +91XXXXXXXXXX (10 digits after +91)';
                } else if (error.message.includes('description')) {
                    errorMessage += 'Description cannot exceed 500 characters';
                } else if (error.message.includes('event_type')) {
                    errorMessage += 'Event type must be either "Virtual" or "In-Person"';
                } else if (error.message.includes('status_check')) {
                    errorMessage += 'Status must be one of: planned, ongoing, completed, cancelled';
                } else {
                    errorMessage += 'Data validation failed. Please check all fields.';
                }
            } else {
                errorMessage += error.message || 'Unknown error occurred';
            }
            
            this.showToast(errorMessage, 'error');
        } finally {
            const submitBtn = document.getElementById('submitFormBtn');
            submitBtn.textContent = 'Save Event';
            submitBtn.disabled = false;
        }
    }
    
    combineDateTime(date, time) {
        if (!date) return new Date().toISOString();
        
        let dateTime = date;
        if (time) {
            // Convert time to 24-hour format if needed
            const timeParts = time.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
            if (timeParts) {
                let hours = parseInt(timeParts[1]);
                const minutes = timeParts[2];
                const ampm = timeParts[3];
                
                if (ampm) {
                    if (ampm.toUpperCase() === 'PM' && hours !== 12) hours += 12;
                    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
                }
                
                dateTime += `T${hours.toString().padStart(2, '0')}:${minutes}:00`;
            } else {
                dateTime += 'T09:00:00';
            }
        } else {
            dateTime += 'T09:00:00';
        }
        
        return dateTime;
    }
    
    async editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.openEventModal(event);
        }
    }
    
    async deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            // Delete from database
            const { error } = await supabasePresident
                .from('club_events')
                .delete()
                .eq('id', eventId);
            
            if (error) throw error;
            
            // Remove from local array
            this.events = this.events.filter(e => e.id !== eventId);
            this.showToast('Event deleted successfully!', 'success');
            this.renderEvents();
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Error deleting event:', error);
            }
            this.showToast('Failed to delete event: ' + error.message, 'error');
        }
    }
    
    // Utility Methods
    formatPhoneInput(input) {
        let value = input.value.replace(/\D/g, ''); // Remove all non-digits
        
        if (value.length > 0) {
            // If doesn't start with 91, add it
            if (!value.startsWith('91')) {
                if (value.length === 10) {
                    value = '91' + value;
                }
            }
            
            // Limit to 12 digits (91 + 10 digit number)
            if (value.length > 12) {
                value = value.slice(0, 12);
            }
            
            // Add +91 prefix for display
            if (value.length >= 2) {
                input.value = '+' + value;
            } else {
                input.value = value;
            }
        }
    }

    searchEvents(query) {
        const rows = document.querySelectorAll('.eventRow');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    validatePhoneNumber(phone) {
        if (!phone || phone.trim() === '') return null;
        
        // Remove all spaces, dashes, and parentheses
        let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        // If it starts with +91, keep as is
        if (cleanPhone.startsWith('+91')) {
            // Ensure it has exactly 13 characters (+91 + 10 digits)
            if (cleanPhone.length === 13 && /^\+91\d{10}$/.test(cleanPhone)) {
                return cleanPhone;
            }
        }
        
        // If it starts with 91, add +
        if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
            if (/^91\d{10}$/.test(cleanPhone)) {
                return '+' + cleanPhone;
            }
        }
        
        // If it's 10 digits, add +91
        if (cleanPhone.length === 10 && /^\d{10}$/.test(cleanPhone)) {
            return '+91' + cleanPhone;
        }
        
        // Return null for invalid formats - let the database handle the error
        return null;
    }

    validateEventData(eventData) {
        const errors = [];
        
        // Validate required fields
        if (!eventData.event_name || eventData.event_name.trim() === '') {
            errors.push('Event name is required');
        }
        
        // Note: Club name validation removed as it's now read-only and always set from authenticated user
        
        // Validate phone numbers if provided
        if (eventData.coordinator_1_phone) {
            const validPhone1 = this.validatePhoneNumber(eventData.coordinator_1_phone);
            if (validPhone1 === null && eventData.coordinator_1_phone.trim() !== '') {
                errors.push('Coordinator 1 phone number must be in format +91XXXXXXXXXX');
            } else {
                eventData.coordinator_1_phone = validPhone1;
            }
        }
        
        if (eventData.coordinator_2_phone) {
            const validPhone2 = this.validatePhoneNumber(eventData.coordinator_2_phone);
            if (validPhone2 === null && eventData.coordinator_2_phone.trim() !== '') {
                errors.push('Coordinator 2 phone number must be in format +91XXXXXXXXXX');
            } else {
                eventData.coordinator_2_phone = validPhone2;
            }
        }
        
        // Validate URLs if provided
        const urlFields = ['banner_url', 'register_url', 'whatsapp_url'];
        urlFields.forEach(field => {
            if (eventData[field] && eventData[field].trim() !== '') {
                try {
                    new URL(eventData[field]);
                } catch {
                    errors.push(`${field.replace('_', ' ')} must be a valid URL starting with http:// or https://`);
                }
            }
        });
        
        // Validate description length
        if (eventData.description && eventData.description.length > 500) {
            errors.push('Description cannot exceed 500 characters');
        }
        
        // Note: Status validation removed since we're letting database handle default values
        
        return errors;
    }

    // UI Helper Methods
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        toast.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventAdmin = new EventAdminDashboard();
});
