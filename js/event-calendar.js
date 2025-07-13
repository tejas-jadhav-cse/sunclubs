// Event Calendar JavaScript
class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.events = [];
        this.filteredEvents = [];
        this.selectedEvent = null;
        
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        this.init();
    }

    // Utility function to format date consistently and avoid timezone issues
    formatDateString(date) {
        try {
            return dateTimeManager.formatDateForInput(date);
        } catch (error) {
            // Fallback to original method if dateTimeManager is not available
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }

    // Get events for a specific day with proper timezone handling
    getEventsForDay(date) {
        try {
            if (typeof dateTimeManager !== 'undefined') {
                return dateTimeManager.getEventsForDay(this.filteredEvents, date);
            }
            
            // Fallback implementation with proper timezone handling
            const targetDateString = this.formatDateString(date);
            return this.filteredEvents.filter(event => {
                if (!event.event_date) return false;
                
                // Handle both date-only and datetime strings
                let eventDate;
                if (event.event_date.includes('T')) {
                    // Full datetime string
                    eventDate = new Date(event.event_date);
                } else {
                    // Date-only string, parse as local date
                    const [year, month, day] = event.event_date.split('-').map(Number);
                    eventDate = new Date(year, month - 1, day);
                }
                
                const eventDateString = this.formatDateString(eventDate);
                return eventDateString === targetDateString;
            });
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Error getting events for day', error);
            }
            return [];
        }
    }

    async init() {
        this.setupEventListeners();
        this.updateMonthDisplay();
        await this.loadEvents();
        await this.loadClubFilters();
        this.renderCalendar();
    }

    setupEventListeners() {
        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.previousMonth();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.nextMonth();
        });

        // Filters
        document.getElementById('clubFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('typeFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('goBackBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Action buttons
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.handleRegister();
        });

        document.getElementById('whatsappBtn').addEventListener('click', () => {
            this.handleWhatsApp();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.openShareModal();
        });

        // Share modal
        document.getElementById('closeShareModal').addEventListener('click', () => {
            this.closeShareModal();
        });

        document.getElementById('copyLink').addEventListener('click', () => {
            this.copyEventLink();
        });

        // Share platform buttons
        document.querySelectorAll('.shareOption[data-platform]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.currentTarget.getAttribute('data-platform');
                this.shareOnPlatform(platform);
            });
        });

        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.loadEvents();
        });

        // Close modals on outside click
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeModal();
            }
        });

        document.getElementById('shareModal').addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') {
                this.closeShareModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal();
                this.closeModal();
            }
        });

        // Handle window resize to re-render calendar
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.renderCalendar();
            }, 250);
        });
    }

    async loadEvents() {
        try {
            this.showLoading();
            this.events = await eventManager.getAllEvents();
            this.filteredEvents = [...this.events];
            this.hideLoading();
            this.renderCalendar();
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Failed to load events:', error);
            }
            this.showError();
        }
    }

    async loadClubFilters() {
        try {
            const clubs = await eventManager.getUniqueClubs();
            const clubFilter = document.getElementById('clubFilter');
            
            // Clear existing options (except "All Clubs")
            clubFilter.innerHTML = '<option value="">All Clubs</option>';
            
            clubs.forEach(club => {
                const option = document.createElement('option');
                option.value = club;
                option.textContent = club;
                clubFilter.appendChild(option);
            });
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Failed to load club filters:', error);
            }
        }
    }

    applyFilters() {
        const clubFilter = document.getElementById('clubFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;

        this.filteredEvents = this.events.filter(event => {
            const clubMatch = !clubFilter || event.club_name === clubFilter;
            const typeMatch = !typeFilter || event.event_type === typeFilter;
            return clubMatch && typeMatch;
        });

        this.renderCalendar();
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateMonthDisplay();
        this.renderCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateMonthDisplay();
        this.renderCalendar();
    }

    updateMonthDisplay() {
        const monthTitle = document.getElementById('currentMonth');
        monthTitle.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Create a timezone-safe "today" comparison
        const today = new Date();
        const todayDateString = this.formatDateString(today);

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayElement = this.createDayElement(currentDate, todayDateString);
            calendarDays.appendChild(dayElement);
        }

        // Show/hide appropriate states
        if (this.filteredEvents.length === 0) {
            this.showNoEvents();
        } else {
            this.hideNoEvents();
        }
    }

    createDayElement(date, todayDateString) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendarDay';

        // Add classes for styling
        if (date.getMonth() !== this.currentMonth) {
            dayElement.classList.add('otherMonth');
        }

        // Compare dates using consistent date strings to avoid timezone issues
        const currentDateString = this.formatDateString(date);
        
        if (currentDateString === todayDateString) {
            dayElement.classList.add('today');
        }

        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'dayNumber';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);

        // Create events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'eventsContainer';
        dayElement.appendChild(eventsContainer);

        // Get events for this day
        const dayEvents = this.getEventsForDay(date);
        const maxDisplayEvents = this.getMaxEventsForScreen();

        // Add events to the events container
        dayEvents.slice(0, maxDisplayEvents).forEach(event => {
            const eventElement = this.createEventElement(event);
            eventsContainer.appendChild(eventElement);
        });

        // Show "more events" indicator if needed
        if (dayEvents.length > maxDisplayEvents) {
            const moreElement = document.createElement('div');
            moreElement.className = 'moreEvents';
            moreElement.textContent = `+${dayEvents.length - maxDisplayEvents} more`;
            eventsContainer.appendChild(moreElement);
        }

        // Add click handler for day
        dayElement.addEventListener('click', () => {
            if (dayEvents.length === 1) {
                this.openEventModal(dayEvents[0]);
            } else if (dayEvents.length > 1) {
                this.showDayEvents(date, dayEvents);
            }
        });

        return dayElement;
    }

    getMaxEventsForScreen() {
        // Determine max events based on screen size
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 320) {
            return 2; // Very small screens
        } else if (screenWidth <= 480) {
            return 3; // Mobile
        } else if (screenWidth <= 768) {
            return 4; // Tablet
        } else {
            return 5; // Desktop
        }
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'eventIndicator';
        eventElement.textContent = event.event_name;
        eventElement.title = event.event_name;

        // Add classes based on event type and status
        if (event.event_type === 'Virtual') {
            eventElement.classList.add('virtualEvent');
        }

        const status = eventManager.getEventStatus(event.event_date);
        if (status === 'Completed' || status === 'Yesterday') {
            eventElement.classList.add('completedEvent');
        }

        // Click handler for individual event
        eventElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEventModal(event);
        });

        return eventElement;
    }

    getEventsForDay(date) {
        const dateString = this.formatDateString(date);
        
        const dayEvents = this.filteredEvents.filter(event => {
            return event.event_date === dateString;
        });

        // Sort events by time if available, then by event name
        return dayEvents.sort((a, b) => {
            // If both events have time, sort by time
            if (a.event_time && b.event_time) {
                return a.event_time.localeCompare(b.event_time);
            }
            // If only one has time, prioritize it
            if (a.event_time && !b.event_time) return -1;
            if (!a.event_time && b.event_time) return 1;
            // If neither has time, sort by name
            return a.event_name.localeCompare(b.event_name);
        });
    }

    openEventModal(event) {
        this.selectedEvent = event;
        this.populateEventModal(event);
        
        const modal = document.getElementById('eventModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    populateEventModal(event) {
        // Banner
        const bannerImg = document.getElementById('eventBannerImg');
        const bannerPlaceholder = document.getElementById('eventBannerPlaceholder');
        
        if (event.banner_url) {
            bannerImg.src = event.banner_url;
            bannerImg.style.display = 'block';
            bannerPlaceholder.style.display = 'none';
        } else {
            bannerImg.style.display = 'none';
            bannerPlaceholder.style.display = 'flex';
        }

        // Status badge
        const status = eventManager.getEventStatus(event.event_date);
        const statusElement = document.getElementById('eventStatus');
        statusElement.textContent = status;
        statusElement.className = `statusBadge ${status.toLowerCase()}`;

        // Basic info
        document.getElementById('eventName').textContent = event.event_name;
        document.getElementById('eventDate').textContent = eventManager.formatDate(event.event_date);
        document.getElementById('eventTime').textContent = eventManager.formatTime(event.tentative_time);
        document.getElementById('eventClub').textContent = event.club_name || 'TBA';
        document.getElementById('eventVenue').textContent = event.venue || 'TBA';
        document.getElementById('eventType').textContent = event.event_type || 'TBA';

        // Description
        document.getElementById('eventDescriptionText').textContent = 
            event.description || 'No description available.';

        // Coordinators
        document.getElementById('coordinator1Name').textContent = 
            event.coordinator_1_name || 'TBA';
        document.getElementById('coordinator1Phone').textContent = 
            event.coordinator_1_phone || '';
        document.getElementById('coordinator1Phone').href = 
            event.coordinator_1_phone ? `tel:${event.coordinator_1_phone}` : '#';

        document.getElementById('coordinator2Name').textContent = 
            event.coordinator_2_name || 'TBA';
        document.getElementById('coordinator2Phone').textContent = 
            event.coordinator_2_phone || '';
        document.getElementById('coordinator2Phone').href = 
            event.coordinator_2_phone ? `tel:${event.coordinator_2_phone}` : '#';

        // Action buttons
        const registerBtn = document.getElementById('registerBtn');
        const whatsappBtn = document.getElementById('whatsappBtn');

        if (event.register_url) {
            registerBtn.style.display = 'block';
        } else {
            registerBtn.style.display = 'none';
        }

        if (event.whatsapp_url) {
            whatsappBtn.style.display = 'block';
        } else {
            whatsappBtn.style.display = 'none';
        }
    }

    closeModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.selectedEvent = null;
    }

    handleRegister() {
        if (this.selectedEvent && this.selectedEvent.register_url) {
            window.open(this.selectedEvent.register_url, '_blank');
        }
    }

    handleWhatsApp() {
        if (this.selectedEvent && this.selectedEvent.whatsapp_url) {
            window.open(this.selectedEvent.whatsapp_url, '_blank');
        }
    }

    openShareModal() {
        const shareModal = document.getElementById('shareModal');
        shareModal.classList.add('active');
    }

    closeShareModal() {
        const shareModal = document.getElementById('shareModal');
        shareModal.classList.remove('active');
    }

    generateEventURL() {
        if (!this.selectedEvent) return window.location.href;
        
        const baseURL = window.location.origin + window.location.pathname;
        return `${baseURL}?event=${this.selectedEvent.id}`;
    }

    shareOnPlatform(platform) {
        if (!this.selectedEvent) return;

        const eventURL = this.generateEventURL();
        const eventTitle = this.selectedEvent.event_name;
        const eventDescription = this.selectedEvent.description || '';
        const shareText = `Check out this event: ${eventTitle}`;

        let shareURL;

        switch (platform) {
            case 'facebook':
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventURL)}`;
                break;
            case 'twitter':
                shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventURL)}`;
                break;
            case 'whatsapp':
                shareURL = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + eventURL)}`;
                break;
        }

        if (shareURL) {
            window.open(shareURL, '_blank', 'width=600,height=400');
        }

        this.closeShareModal();
    }

    async copyEventLink() {
        const eventURL = this.generateEventURL();
        
        try {
            await navigator.clipboard.writeText(eventURL);
            
            // Show success feedback
            const copyBtn = document.getElementById('copyLink');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
                Copied!
            `;
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
            
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Failed to copy link:', error);
            }
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = eventURL;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }

        this.closeShareModal();
    }

    showDayEvents(date, events) {
        // Create a simple list modal for multiple events on the same day
        // Use timezone-safe date formatting
        const dateString = this.formatDateString(date);
        
        const modal = document.createElement('div');
        modal.className = 'dayEventsModal';
        modal.innerHTML = `
            <div class="dayEventsContent">
                <div class="dayEventsHeader">
                    <h3>Events on ${eventManager.formatDate(dateString)}</h3>
                    <button class="closeDayEvents">×</button>
                </div>
                <div class="dayEventsList">
                    ${events.map(event => `
                        <div class="dayEventItem" data-event-id="${event.id}">
                            <h4>${event.event_name}</h4>
                            <p>${event.club_name} • ${eventManager.formatTime(event.tentative_time)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        // Event listeners
        modal.querySelector('.closeDayEvents').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        modal.querySelectorAll('.dayEventItem').forEach(item => {
            item.addEventListener('click', () => {
                const eventId = item.getAttribute('data-event-id');
                const event = events.find(e => e.id === eventId);
                document.body.removeChild(modal);
                this.openEventModal(event);
            });
        });
    }

    showLoading() {
        document.getElementById('loadingState').style.display = 'flex';
        document.getElementById('errorState').style.display = 'none';
        document.getElementById('calendarGrid').style.display = 'none';
        document.getElementById('noEventsMessage').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('calendarGrid').style.display = 'block';
    }

    showError() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('errorState').style.display = 'flex';
        document.getElementById('calendarGrid').style.display = 'none';
        document.getElementById('noEventsMessage').style.display = 'none';
    }

    showNoEvents() {
        document.getElementById('noEventsMessage').style.display = 'block';
    }

    hideNoEvents() {
        document.getElementById('noEventsMessage').style.display = 'none';
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if eventManager is available
    if (typeof eventManager === 'undefined') {
        if (typeof logger !== 'undefined') {
            logger.error('Event Manager not found. Make sure event-supabase-config.js is loaded.');
        }
        return;
    }

    // Initialize the calendar
    window.eventCalendar = new EventCalendar();

    // Handle URL parameters for direct event links
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    if (eventId) {
        // Load specific event if ID is provided
        setTimeout(async () => {
            try {
                const events = await eventManager.getAllEvents();
                const event = events.find(e => e.id === eventId);
                if (event) {
                    window.eventCalendar.openEventModal(event);
                }
            } catch (error) {
                if (typeof logger !== 'undefined') {
                    logger.error('Failed to load specific event:', error);
                }
            }
        }, 1000);
    }
});

// Add some additional CSS for day events modal
const additionalStyles = `
    .dayEventsContent {
        background: var(--black2);
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 70vh;
        overflow-y: auto;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dayEventsHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dayEventsHeader h3 {
        font-family: 'go-medium';
        color: var(--white);
        font-size: 20px;
        margin: 0;
    }

    .closeDayEvents {
        background: none;
        border: none;
        color: var(--white);
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
    }

    .dayEventsList {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .dayEventItem {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .dayEventItem:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .dayEventItem h4 {
        font-family: 'go-medium';
        color: var(--white);
        font-size: 16px;
        margin: 0 0 5px 0;
    }

    .dayEventItem p {
        font-family: 'go-regular';
        color: var(--grey5);
        font-size: 14px;
        margin: 0;
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
