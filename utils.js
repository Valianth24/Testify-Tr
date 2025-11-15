/**
 * TESTIFY UTILITY FUNCTIONS
 * Güvenli ve optimize edilmiş yardımcı fonksiyonlar
 */

'use strict';

const Utils = {
    /**
     * XSS saldırılarını önlemek için HTML'i sanitize eder
     * @param {string} text - Temizlenecek metin
     * @returns {string} - Temizlenmiş metin
     */
    sanitizeHTML(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    },

    /**
     * HTML entity'lerini decode eder
     * @param {string} html - Decode edilecek HTML
     * @returns {string} - Decode edilmiş metin
     */
    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    },

    /**
     * Email formatını kontrol eder
     * @param {string} email - Kontrol edilecek email
     * @returns {boolean} - Geçerli mi?
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    /**
     * Kullanıcı adı formatını kontrol eder
     * @param {string} username - Kontrol edilecek kullanıcı adı
     * @returns {boolean} - Geçerli mi?
     */
    validateUsername(username) {
        // 3-20 karakter, sadece harf, rakam ve alt çizgi
        const re = /^[a-zA-Z0-9_]{3,20}$/;
        return re.test(username);
    },

    /**
     * Süreyi formatlar (saniye -> MM:SS)
     * @param {number} seconds - Saniye
     * @returns {string} - Formatlanmış süre
     */
    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    /**
     * Tarihi formatlar (dil desteği ile)
     * @param {Date|string|number} date - Tarih
     * @returns {string} - Formatlanmış tarih
     */
    formatDate(date) {
        try {
            const d = new Date(date);
            const lang =
                window.LanguageManager && LanguageManager.currentLang === 'en' ? 'en' : 'tr';

            if (isNaN(d.getTime())) {
                return lang === 'en' ? 'Invalid date' : 'Geçersiz tarih';
            }

            const now = new Date();
            const diff = now - d;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds < 60) {
                return lang === 'en' ? 'Just now' : 'Az önce';
            }
            if (minutes < 60) {
                return lang === 'en'
                    ? `${minutes} minute(s) ago`
                    : `${minutes} dakika önce`;
            }
            if (hours < 24) {
                return lang === 'en'
                    ? `${hours} hour(s) ago`
                    : `${hours} saat önce`;
            }
            if (days < 7) {
                return lang === 'en'
                    ? `${days} day(s) ago`
                    : `${days} gün önce`;
            }

            const locale = lang === 'en' ? 'en-US' : 'tr-TR';
            return d.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Tarih formatlama hatası:', error);
            const lang =
                window.LanguageManager && LanguageManager.currentLang === 'en' ? 'en' : 'tr';
            return lang === 'en' ? 'Invalid date' : 'Geçersiz tarih';
        }
    },

    /**
     * Sayıyı formatlar (1000 -> 1K)
     * @param {number} num - Sayı
     * @returns {string} - Formatlanmış sayı
     */
    formatNumber(num) {
        if (typeof num !== 'number') return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    /**
     * Debounce fonksiyonu - Performans için
     * @param {Function} func - Çalıştırılacak fonksiyon
     * @param {number} wait - Bekleme süresi (ms)
     * @returns {Function} - Debounced fonksiyon
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle fonksiyonu - Performans için
     * @param {Function} func - Çalıştırılacak fonksiyon
     * @param {number} limit - Limit süresi (ms)
     * @returns {Function} - Throttled fonksiyon
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    /**
     * Deep clone - Nesne kopyalama
     * @param {Object} obj - Kopyalanacak nesne
     * @returns {Object} - Kopya nesne
     */
    deepClone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (error) {
            console.error('Deep clone hatası:', error);
            return obj;
        }
    },

    /**
     * Rastgele ID oluşturur
     * @param {number} length - ID uzunluğu
     * @returns {string} - Rastgele ID
     */
    generateId(length = 16) {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Array'i karıştırır (Fisher-Yates)
     * @param {Array} array - Karıştırılacak array
     * @returns {Array} - Karıştırılmış array
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    /**
     * Local storage'dan güvenli okuma
     * @param {string} key - Key
     * @param {*} defaultValue - Varsayılan değer
     * @returns {*} - Değer
     */
    getFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Storage okuma hatası (${key}):`, error);
            return defaultValue;
        }
    },

    /**
     * Local storage'a güvenli yazma
     * @param {string} key - Key
     * @param {*} value - Değer
     * @returns {boolean} - Başarılı mı?
     */
    setToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage yazma hatası (${key}):`, error);
            // Storage dolu olabilir
            if (error && error.name === 'QuotaExceededError') {
                const msg =
                    window.LanguageManager &&
                    LanguageManager.currentLang === 'en'
                        ? 'Storage is full!'
                        : 'Depolama alanı dolu!';
                this.showToast(msg, 'error');
            }
            return false;
        }
    },

    /**
     * Local storage'dan silme
     * @param {string} key - Key
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Storage silme hatası (${key}):`, error);
        }
    },

    /**
     * Toast bildirim gösterir
     * @param {string} message - Mesaj
     * @param {string} type - Tip (success, error, warning, info)
     * @param {number} duration - Süre (ms)
     */
    showToast(message, type = 'info', duration = 3000) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const closeLabel =
            typeof window !== 'undefined' && typeof window.t === 'function'
                ? t('common.close', 'Kapat')
                : 'Kapat';

        toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
            <div class="toast-content">
                <p class="toast-message">${this.sanitizeHTML(message)}</p>
            </div>
            <button class="toast-close" aria-label="${closeLabel}">×</button>
        `;

        container.appendChild(toast);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            });
        }

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    },

    /**
     * Loading overlay gösterir/gizler
     * @param {boolean} show - Göster/Gizle
     */
    toggleLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (!overlay) return;

        if (show) {
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
        } else {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        }
    },

    /**
     * Confirm dialog gösterir
     * @param {string} message - Mesaj
     * @returns {Promise<boolean>} - Kullanıcı onayı
     */
    async confirm(message) {
        return new Promise((resolve) => {
            const result = window.confirm(message);
            resolve(result);
        });
    },

    /**
     * Element'in görünür olup olmadığını kontrol eder
     * @param {HTMLElement} element - Element
     * @returns {boolean} - Görünür mü?
     */
    isElementVisible(element) {
        if (!element) return false;
        return !!(
            element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length
        );
    },

    /**
     * Smooth scroll
     * @param {string|HTMLElement} target - Target element veya selector
     * @param {number} offset - Offset (px)
     */
    scrollTo(target, offset = 0) {
        const element =
            typeof target === 'string' ? document.querySelector(target) : target;

        if (!element) return;

        const top =
            element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    },

    /**
     * Dosya boyutunu formatlar
     * @param {number} bytes - Byte cinsinden boyut
     * @returns {string} - Formatlanmış boyut
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    },

    /**
     * Dosya uzantısını kontrol eder
     * @param {string} filename - Dosya adı
     * @param {Array} allowedExtensions - İzin verilen uzantılar
     * @returns {boolean} - Geçerli mi?
     */
    validateFileExtension(filename, allowedExtensions) {
        const ext = filename.split('.').pop().toLowerCase();
        return allowedExtensions.includes(ext);
    },

    /**
     * Copy to clipboard
     * @param {string} text - Kopyalanacak metin
     * @returns {Promise<boolean>} - Başarılı mı?
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            }
        } catch (error) {
            console.error('Kopyalama hatası:', error);
            return false;
        }
    },

    /**
     * Form input doğrulama
     * @param {HTMLInputElement} input - Input elemanı
     * @param {string} type - 'required' | 'email' | 'username'
     * @returns {boolean}
     */
    validateInput(input, type = 'required') {
        if (!input) return false;

        const value = (input.value || '').trim();
        const lang =
            window.LanguageManager && LanguageManager.currentLang === 'en' ? 'en' : 'tr';

        const msg = (tr, en) => (lang === 'en' ? en : tr);

        let isValid = true;
        let errorMessage = '';

        if (type === 'email') {
            if (!value) {
                isValid = false;
                errorMessage = msg('E-posta zorunlu', 'Email is required');
            } else if (!this.validateEmail(value)) {
                isValid = false;
                errorMessage = msg(
                    'Geçerli bir e-posta girin',
                    'Please enter a valid email'
                );
            }
        } else if (type === 'username') {
            if (!value) {
                isValid = false;
                errorMessage = msg('Kullanıcı adı zorunlu', 'Username is required');
            } else if (!this.validateUsername(value)) {
                isValid = false;
                errorMessage = msg(
                    '3-20 karakter, sadece harf, rakam ve alt çizgi kullanabilirsiniz',
                    'Username must be 3-20 characters and can contain letters, numbers and underscore'
                );
            }
        } else if (type === 'required') {
            if (!value) {
                isValid = false;
                errorMessage = msg('Bu alan zorunlu', 'This field is required');
            }
        }

        // Hata elemanını bul
        let errorEl =
            document.getElementById(input.id + 'Error') ||
            (input.closest('.form-group')
                ? input.closest('.form-group').querySelector('.error-message')
                : null);

        if (errorEl) {
            errorEl.textContent = errorMessage || '';
        }

        if (!isValid) {
            input.classList.add('input-error');
        } else {
            input.classList.remove('input-error');
        }

        return isValid;
    },

    /**
     * Genel hata yakalama helper'ı
     * @param {Error} error
     * @param {string} context
     */
    handleError(error, context = '') {
        console.error('Hata:', context, error);

        const lang =
            window.LanguageManager && LanguageManager.currentLang === 'en' ? 'en' : 'tr';
        const defaultMsg =
            lang === 'en'
                ? 'An unexpected error occurred.'
                : 'Beklenmeyen bir hata oluştu.';

        try {
            this.showToast(defaultMsg, 'error');
        } catch (e) {
            console.error('Toast gösterilemedi:', e);
        }
    }
};

// CSS animasyonu ekleme
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Export
window.Utils = Utils;
