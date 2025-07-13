/**
 * Modal Manager
 * Handles modal conflicts and stacking order
 */

class ModalManager {
    constructor() {
        this.activeModals = [];
        this.baseZIndex = 2000;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.setupKeyboardHandling();
        this.fixExistingModals();
        
        this.isInitialized = true;
        
        if (typeof logger !== 'undefined') {
            logger.info('Modal manager initialized');
        }
    }

    /**
     * Fix existing modals in the DOM
     */
    fixExistingModals() {
        // Find all existing modals and register them
        const modals = document.querySelectorAll('[class*="modal"], [id*="modal"], [data-modal]');
        
        modals.forEach(modal => {
            if (!modal.dataset.modalId) {
                modal.dataset.modalId = this.generateModalId();
            }
            
            // Ensure proper z-index setup
            this.setupModalZIndex(modal);
        });
    }

    /**
     * Setup event listeners for modal interactions
     */
    setupEventListeners() {
        // Handle clicks outside modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('eventModal') || 
                e.target.classList.contains('shareModal') ||
                e.target.classList.contains('modal-backdrop')) {
                this.closeTopModal();
            }
        });

        // Handle close button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('closeModalBtn') || 
                e.target.closest('.closeModalBtn') ||
                e.target.classList.contains('modal-close')) {
                e.preventDefault();
                e.stopPropagation();
                this.closeTopModal();
            }
        });
    }

    /**
     * Setup keyboard handling
     */
    setupKeyboardHandling() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                e.preventDefault();
                this.closeTopModal();
            }
        });

        // Trap focus in active modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.activeModals.length > 0) {
                this.trapFocus(e);
            }
        });
    }

    /**
     * Trap focus within the active modal
     */
    trapFocus(e) {
        const topModal = this.getTopModal();
        if (!topModal) return;

        const focusableElements = topModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Generate unique modal ID
     */
    generateModalId() {
        return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Setup proper z-index for modal
     */
    setupModalZIndex(modal) {
        const level = this.activeModals.length;
        const zIndex = this.baseZIndex + (level * 10);
        
        modal.style.zIndex = zIndex;
        
        // If modal has a backdrop, set its z-index too
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.style.zIndex = zIndex - 1;
        }
    }

    /**
     * Open a modal
     */
    openModal(modalElement, options = {}) {
        if (!modalElement) {
            if (typeof logger !== 'undefined') {
                logger.error('Modal element not found');
            }
            return false;
        }

        // Ensure modal has an ID
        if (!modalElement.dataset.modalId) {
            modalElement.dataset.modalId = this.generateModalId();
        }

        // Check if modal is already active
        if (this.isModalActive(modalElement)) {
            return false;
        }

        // Setup z-index before adding to active list
        this.setupModalZIndex(modalElement);

        // Add to active modals list
        this.activeModals.push({
            element: modalElement,
            id: modalElement.dataset.modalId,
            options: options
        });

        // Show modal
        modalElement.classList.add('active');
        modalElement.style.display = 'flex';

        // Handle body scroll
        if (this.activeModals.length === 1) {
            document.body.style.overflow = 'hidden';
        }

        // Focus management
        this.focusModal(modalElement);

        // Trigger custom event
        modalElement.dispatchEvent(new CustomEvent('modalOpened', {
            detail: { modalId: modalElement.dataset.modalId }
        }));

        if (typeof logger !== 'undefined') {
            logger.debug('Modal opened:', modalElement.dataset.modalId);
        }

        return true;
    }

    /**
     * Close a specific modal or the top modal
     */
    closeModal(modalElement = null) {
        if (!modalElement) {
            return this.closeTopModal();
        }

        const modalIndex = this.activeModals.findIndex(
            modal => modal.element === modalElement
        );

        if (modalIndex === -1) {
            return false;
        }

        // Remove from active list
        const modal = this.activeModals.splice(modalIndex, 1)[0];

        // Hide modal
        modalElement.classList.remove('active');
        modalElement.style.display = 'none';

        // Update z-indexes for remaining modals
        this.updateZIndexes();

        // Handle body scroll
        if (this.activeModals.length === 0) {
            document.body.style.overflow = '';
        }

        // Focus management
        this.restoreFocus();

        // Trigger custom event
        modalElement.dispatchEvent(new CustomEvent('modalClosed', {
            detail: { modalId: modal.id }
        }));

        if (typeof logger !== 'undefined') {
            logger.debug('Modal closed:', modal.id);
        }

        return true;
    }

    /**
     * Close the top modal
     */
    closeTopModal() {
        if (this.activeModals.length === 0) return false;
        
        const topModal = this.activeModals[this.activeModals.length - 1];
        return this.closeModal(topModal.element);
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        while (this.activeModals.length > 0) {
            this.closeTopModal();
        }
    }

    /**
     * Get the top modal element
     */
    getTopModal() {
        if (this.activeModals.length === 0) return null;
        return this.activeModals[this.activeModals.length - 1].element;
    }

    /**
     * Check if a modal is active
     */
    isModalActive(modalElement) {
        return this.activeModals.some(modal => modal.element === modalElement);
    }

    /**
     * Update z-indexes for all active modals
     */
    updateZIndexes() {
        this.activeModals.forEach((modal, index) => {
            const zIndex = this.baseZIndex + (index * 10);
            modal.element.style.zIndex = zIndex;
            
            const backdrop = modal.element.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.style.zIndex = zIndex - 1;
            }
        });
    }

    /**
     * Focus management for modal
     */
    focusModal(modalElement) {
        // Store the currently focused element
        modalElement.dataset.previousFocus = document.activeElement?.id || '';

        // Focus the first focusable element in the modal
        setTimeout(() => {
            const focusableElement = modalElement.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElement) {
                focusableElement.focus();
            } else {
                modalElement.focus();
            }
        }, 100);
    }

    /**
     * Restore focus when modal closes
     */
    restoreFocus() {
        const topModal = this.getTopModal();
        
        if (topModal) {
            // Focus the new top modal
            this.focusModal(topModal);
        } else {
            // Restore focus to previously focused element
            const previousFocusId = this.activeModals.length > 0 ? 
                this.activeModals[this.activeModals.length - 1].element.dataset.previousFocus : '';
                
            if (previousFocusId) {
                const previousElement = document.getElementById(previousFocusId);
                if (previousElement) {
                    previousElement.focus();
                }
            }
        }
    }

    /**
     * Get modal statistics
     */
    getStats() {
        return {
            activeModals: this.activeModals.length,
            modals: this.activeModals.map(modal => ({
                id: modal.id,
                className: modal.element.className,
                zIndex: modal.element.style.zIndex
            }))
        };
    }

    /**
     * Legacy support for existing modal functions
     */
    setupLegacySupport() {
        // Override existing modal functions if they exist
        if (typeof window.openEventModal === 'function') {
            const originalOpenEventModal = window.openEventModal;
            window.openEventModal = (...args) => {
                const result = originalOpenEventModal.apply(this, args);
                const modal = document.querySelector('.eventModal.active');
                if (modal) {
                    this.openModal(modal);
                }
                return result;
            };
        }

        if (typeof window.closeEventModal === 'function') {
            const originalCloseEventModal = window.closeEventModal;
            window.closeEventModal = (...args) => {
                this.closeModal(document.querySelector('.eventModal.active'));
                return originalCloseEventModal.apply(this, args);
            };
        }
    }
}

// Create singleton instance
const modalManager = new ModalManager();

// Setup legacy support after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        modalManager.setupLegacySupport();
    });
} else {
    modalManager.setupLegacySupport();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModalManager, modalManager };
}
