/* ============================================
   RED1DARK PLATFORM - MAIN JAVASCRIPT
   Interactive functionality for all components
   ============================================ */

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initTabs();
    initModals();
    initDropdowns();
    initToasts();
    initLanguageSwitcher();
    initSearchFilter();
    initCopyToClipboard();
    initMessenger();
    initDashboard();
});

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// TABS FUNCTIONALITY
// ============================================
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.tab');
        const contents = tabContainer.parentElement.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(target);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
}

// ============================================
// MODALS
// ============================================
function initModals() {
    // Open modal
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });
    
    // Close modal on close button click
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// DROPDOWNS
// ============================================
function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other dropdowns
                document.querySelectorAll('.dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown').forEach(d => {
            d.classList.remove('active');
        });
    });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
let toastContainer = null;

function initToasts() {
    // Create toast container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

function showToast(message, type = 'info', duration = 5000) {
    if (!toastContainer) {
        initToasts();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span>${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Make showToast available globally
window.showToast = showToast;

// ============================================
// LANGUAGE SWITCHER
// ============================================
const translations = {
    ru: {
        home: 'Главная',
        about: 'О студии',
        projects: 'Проекты',
        verify: 'RedVerify',
        services: 'Услуги',
        media: 'Контент / СМИ',
        philosophy: 'Философия',
        privacy: 'Политика конфиденциальности',
        contacts: 'Контакты',
        profile: 'Профиль',
        dashboard: 'Панель управления',
        messenger: 'Мессенджер',
        login: 'Войти',
        signup: 'Регистрация',
        logout: 'Выйти',
        settings: 'Настройки',
        search: 'Поиск...',
        send: 'Отправить',
        cancel: 'Отмена',
        save: 'Сохранить',
        delete: 'Удалить',
        edit: 'Редактировать',
        create: 'Создать',
        loading: 'Загрузка...',
        success: 'Успешно',
        error: 'Ошибка',
        warning: 'Предупреждение',
        info: 'Информация'
    },
    en: {
        home: 'Home',
        about: 'About Studio',
        projects: 'Projects',
        verify: 'RedVerify',
        services: 'Services',
        media: 'Content / Media',
        philosophy: 'Philosophy',
        privacy: 'Privacy Policy',
        contacts: 'Contacts',
        profile: 'Profile',
        dashboard: 'Dashboard',
        messenger: 'Messenger',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        settings: 'Settings',
        search: 'Search...',
        send: 'Send',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    }
};

let currentLang = 'ru';

function initLanguageSwitcher() {
    const langSwitchers = document.querySelectorAll('.lang-switcher');
    
    langSwitchers.forEach(switcher => {
        switcher.addEventListener('click', () => {
            currentLang = currentLang === 'ru' ? 'en' : 'ru';
            updateLanguage(currentLang);
            switcher.textContent = currentLang.toUpperCase();
        });
    });
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Save preference
    localStorage.setItem('red1dark_lang', lang);
}

// Load saved language preference
const savedLang = localStorage.getItem('red1dark_lang');
if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
}

// ============================================
// SEARCH FILTER
// ============================================
function initSearchFilter() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filterTarget = e.target.dataset.filterTarget;
            
            if (filterTarget) {
                const items = document.querySelectorAll(filterTarget);
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            
            try {
                await navigator.clipboard.writeText(text);
                showToast('Copied to clipboard!', 'success');
                
                // Visual feedback
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            } catch (err) {
                showToast('Failed to copy', 'error');
            }
        });
    });
}

// ============================================
// MESSENGER FUNCTIONALITY
// ============================================
function initMessenger() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.messages-container');
    
    if (messageInput && sendButton && messagesContainer) {
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Chat item selection
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const messagesContainer = document.querySelector('.messages-container');
    
    if (!messageInput || !messagesContainer) return;
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    const messageHTML = `
        <div class="message sent">
            <div class="message-content">
                <div class="message-text">${escapeHTML(text)}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show toast
    showToast('Message sent', 'success', 2000);
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// DASHBOARD FUNCTIONALITY
// ============================================
function initDashboard() {
    // Dashboard navigation
    document.querySelectorAll('.dashboard-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.dashboard-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Stats counter animation
    animateStats();
}

function animateStats() {
    const statValues = document.querySelectorAll('.stat-card-value, .stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = /^[\d,]+$/.test(finalValue.replace(/,/g, ''));
        
        if (isNumber) {
            const numericValue = parseInt(finalValue.replace(/,/g, ''));
            let currentValue = 0;
            const increment = numericValue / 50;
            const duration = 1000;
            const stepTime = duration / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }, stepTime);
        }
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Show error message
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = 'This field is required';
                error.style.color = 'var(--status-error)';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '4px';
                input.parentElement.appendChild(error);
            }
        } else {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// ============================================
// SCROLL TO TOP
// ============================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const content = accordion.querySelector('.accordion-content');
            
            // Toggle current accordion
            accordion.classList.toggle('active');
            
            // Close other accordions (optional)
            document.querySelectorAll('.accordion').forEach(other => {
                if (other !== accordion) {
                    other.classList.remove('active');
                }
            });
        });
    });
}

// ============================================
// THEME TOGGLE (Future feature)
// ============================================
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('red1dark_theme', isLight ? 'light' : 'dark');
}

// Load saved theme
const savedTheme = localStorage.getItem('red1dark_theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

// Get cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}

// ============================================
// API HELPER (for future backend integration)
// ============================================
async function apiRequest(endpoint, options = {}) {
    const baseURL = '/api';
    const token = localStorage.getItem('red1dark_token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(`${baseURL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showToast('Request failed: ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// USER AUTHENTICATION HELPERS
// ============================================
function isAuthenticated() {
    return !!localStorage.getItem('red1dark_token');
}

function getUserRole() {
    return localStorage.getItem('red1dark_role') || 'user';
}

function hasPermission(requiredRole) {
    const roles = ['user', 'media', 'moderator', 'admin', 'owner'];
    const userRole = getUserRole();
    return roles.indexOf(userRole) >= roles.indexOf(requiredRole);
}

function requireAuth() {
    if (!isAuthenticated()) {
        showToast('Please login first', 'warning');
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

function requireRole(role) {
    if (!requireAuth()) return false;
    if (!hasPermission(role)) {
        showToast('Access denied', 'error');
        window.location.href = '/index.html';
        return false;
    }
    return true;
}

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        openModal,
        closeModal,
        validateForm,
        apiRequest,
        isAuthenticated,
        getUserRole,
        hasPermission,
        requireAuth,
        requireRole,
        debounce,
        throttle,
        formatNumber,
        getQueryParam,
        setCookie,
        getCookie
    };
}

console.log('🚀 Red1dark Platform initialized successfully!');
