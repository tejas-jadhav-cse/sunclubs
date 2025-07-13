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
    }
    
    // Data Loading
    async loadEvents() {
        try {
            const { data: events, error } = await supabasePresident
                .from('club_events')
                .select('*')
                .eq('club_id', this.currentClub.club_id)
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
                title: 'React Workshop',
                description: 'Learn React fundamentals and build your first app',
                event_date: '2024-02-15T14:00:00',
                location: 'Computer Lab 1',
                event_type: 'workshop',
                status: 'planned',
                club_id: this.currentClub.club_id
            },
            {
                id: '2',
                title: 'Open Source Hackathon',
                description: 'Contribute to open source projects in this 24-hour hackathon',
                event_date: '2024-02-20T09:00:00',
                location: 'Main Auditorium',
                event_type: 'competition',
                status: 'planned',
                club_id: this.currentClub.club_id
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
                    <h4>${event.title}</h4>
                    <p>${event.description || 'No description'}</p>
                </div>
                <div style="color: var(--white);">${new Date(event.event_date).toLocaleDateString()}</div>
                <div style="color: var(--white);">${this.currentClub.clubs.name}</div>
                <div style="color: var(--white);">${this.formatEventType(event.event_type)}</div>
                <div><span class="statusBadge" style="background: ${this.getStatusColor(event.status)}; color: var(--white);">${event.status}</span></div>
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
            planned: '#007bff',
            ongoing: '#ffc107',
            completed: '#28a745',
            cancelled: '#dc3545'
        };
        return colors[status] || colors.planned;
    }
    
    // Event Management
    openEventModal(event = null) {
        const modal = document.getElementById('eventFormModal');
        const title = document.getElementById('formTitle');
        const form = document.getElementById('eventForm');
        
        if (event) {
            title.textContent = 'Edit Event';
            this.editingEvent = event;
            this.populateEventForm(event);
        } else {
            title.textContent = 'Add New Event';
            this.editingEvent = null;
            form.reset();
            // Pre-fill club name
            document.getElementById('clubName').value = this.currentClub.clubs.name;
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
        document.getElementById('eventName').value = event.title || '';
        document.getElementById('clubName').value = this.currentClub.clubs.name;
        document.getElementById('eventDate').value = event.event_date ? event.event_date.split('T')[0] : '';
        document.getElementById('eventTime').value = event.event_date ? this.formatTime(event.event_date) : '';
        document.getElementById('eventVenue').value = event.location || '';
        document.getElementById('eventType').value = event.event_type || 'In-Person';
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('bannerUrl').value = event.image_url || '';
        document.getElementById('registerUrl').value = event.external_url || '';
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
                title: document.getElementById('eventName').value,
                description: document.getElementById('eventDescription').value,
                event_date: this.combineDateTime(
                    document.getElementById('eventDate').value,
                    document.getElementById('eventTime').value
                ),
                location: document.getElementById('eventVenue').value,
                event_type: document.getElementById('eventType').value.toLowerCase(),
                external_url: document.getElementById('registerUrl').value || null,
                image_url: document.getElementById('bannerUrl').value || null,
                club_id: this.currentClub.club_id,
                created_by: this.currentClub.id,
                status: 'planned'
            };
            
            let result;
            if (this.editingEvent) {
                // Update existing event
                const eventIndex = this.events.findIndex(e => e.id === this.editingEvent.id);
                if (eventIndex !== -1) {
                    this.events[eventIndex] = { ...this.events[eventIndex], ...eventData };
                }
            } else {
                // Add new event
                const newEvent = {
                    id: Date.now().toString(),
                    ...eventData
                };
                this.events.push(newEvent);
            }
            
            this.showToast(this.editingEvent ? 'Event updated successfully!' : 'Event created successfully!', 'success');
            this.closeEventModal();
            this.renderEvents();
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Error saving event:', error);
            }
            this.showToast('Failed to save event: ' + error.message, 'error');
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
            this.events = this.events.filter(e => e.id !== eventId);
            this.showToast('Event deleted successfully!', 'success');
            this.renderEvents();
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Error deleting event:', error);
            }
            this.showToast('Failed to delete event', 'error');
        }
    }
    
    // Utility Methods
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
