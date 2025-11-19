/**
 * TESTIFY UTILS
 * Yardımcı fonksiyonlar (storage, tarih, format, toast, confirm, validation, vb.)
 * 
 * 🔇 TOAST BİLDİRİMLERİ DEVRE DIŞI (Kullanıcı talebi)
 */

'use strict';

const Utils = {
    /**
     * Güvenli JSON parse
     */
    safeParse(value, fallback = null) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return fallback;
        }
    },

    /**
     * LocalStorage'dan veri al (JSON destekli)
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    getFromStorage(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null || raw === undefined) return defaultValue;
            return this.safeParse(raw, raw);
        } catch (error) {
            console.error('getFromStorage hatası:', error);
            return defaultValue;
        }
    },

    /**
     * LocalStorage'a veri yaz (JSON)
     * @param {string} key
     * @param {*} value
     * @returns {boolean}
     */
    setToStorage(key, value) {
        try {
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('setToStorage hatası:', error);
            return false;
        }
    },

    /**
     * LocalStorage'dan veri sil
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('removeFromStorage hatası:', error);
        }
    },

    /**
     * ID üret
     */
    generateId(length = 16) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    },

    /**
     * Basit HTML sanitize (XSS önlemek için)
     */
    sanitizeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    /**
     * Tarih formatla
     * @param {number} timestamp ms
     * @returns {string}
     */
    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            if (Number.isNaN(date.getTime())) return '-';
            const d = String(date.getDate()).padStart(2, '0');
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const y = date.getFullYear();
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            return `${d}.${m}.${y} ${hh}:${mm}`;
        } catch {
            return '-';
        }
    },

    /**
     * Saniyeyi mm:ss veya hh:mm:ss formatına çevirir
     * @param {number} totalSeconds
     * @returns {string}
     */
    formatTime(totalSeconds) {
        const sec = Math.max(0, parseInt(totalSeconds, 10) || 0);
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;

        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');

        if (hours > 0) {
            const hh = String(hours).padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
        }
        return `${mm}:${ss}`;
    },

    /**
     * Dosya boyutunu okunabilir formatta döndür
     * @param {number} bytes
     * @returns {string}
     */
    formatFileSize(bytes) {
        if (!bytes || bytes <= 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let index = 0;
        let size = bytes;
        while (size >= 1024 && index < units.length - 1) {
            size /= 1024;
            index++;
        }
        return `${size.toFixed(1)} ${units[index]}`;
    },

    /**
     * Dizi karıştırma (Fisher-Yates)
     */
    shuffleArray(array) {
        if (!Array.isArray(array)) return array;
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    /**
     * Input validation
     * @param {HTMLInputElement} input
     * @param {"username"|"email"} type
     * @returns {boolean}
     */
    validateInput(input, type) {
        if (!input) return true;
        const value = input.value.trim();
        const errorElId = input.id + 'Error';
        const errorEl = document.getElementById(errorElId);

        const setError = (msg) => {
            if (errorEl) {
                errorEl.textContent = msg;
            } else {
                console.warn('Error span bulunamadı:', errorElId);
            }
            input.classList.add('input-error');
        };

        const clearError = () => {
            if (errorEl) errorEl.textContent = '';
            input.classList.remove('input-error');
        };

        clearError();

        if (type === 'username') {
            if (value.length < 3) {
                setError('Kullanıcı adı en az 3 karakter olmalı');
                return false;
            }
            if (value.length > 20) {
                setError('Kullanıcı adı en fazla 20 karakter olabilir');
                return false;
            }
            return true;
        }

        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setError('Geçerli bir e-posta adresi giriniz');
                return false;
            }
            return true;
        }

        return true;
    },

    /**
     * Hata yakalama helper
     */
    handleError(error, context = '') {
        console.error('🔴 Hata:', context, error);
        const msg = (error && error.message) ? error.message : 'Bilinmeyen hata';
        // Toast devre dışı - sadece console'a yazdır
        console.warn(`Hata bildirimi: ${msg}`);
    },

    /**
     * ═══════════════════════════════════════════════════════════════════
     * TOAST BİLDİRİMLERİ - DEVRE DIŞI
     * ═══════════════════════════════════════════════════════════════════
     * Şık toast bildirimi
     * @param {string} message
     * @param {"success"|"error"|"info"|"warning"} type
     * @param {number} duration ms
     * 
     * 🔇 KULLANICI TALEBİYLE DEVRE DIŞI BIRAKILDI
     */
    showToast(message, type = 'info', duration = 2500) {
        // Toast bildirimleri kapalı
        // Sadece console'a yazdır (debug için)
        console.log(`[Toast devre dışı] ${type.toUpperCase()}: ${message}`);
        return;

        /* ESKİ KOD - DEVRE DIŞI
        try {
            const container = document.getElementById('toastContainer');
            if (!container) {
                console.warn('toastContainer bulunamadı');
                return;
            }

            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;

            const icons = {
                success: '✅',
                error: '❌',
                info: 'ℹ️',
                warning: '⚠️'
            };

            const titles = {
                success: 'Başarılı',
                error: 'Hata',
                info: 'Bilgi',
                warning: 'Uyarı'
            };

            toast.innerHTML = `
                <div class="toast__icon">${icons[type] || 'ℹ️'}</div>
                <div class="toast__content">
                    <div class="toast__title">${titles[type] || 'Bilgi'}</div>
                    <div class="toast__message">${this.sanitizeHTML(message)}</div>
                </div>
                <button class="toast__close" aria-label="Kapat">×</button>
            `;

            const closeBtn = toast.querySelector('.toast__close');

            const removeToast = () => {
                toast.style.animation = 'toast-out 0.18s ease-in forwards';
                setTimeout(() => {
                    toast.remove();
                }, 180);
            };

            closeBtn.addEventListener('click', removeToast);

            container.appendChild(toast);

            if (duration > 0) {
                setTimeout(removeToast, duration);
            }
        } catch (error) {
            console.error('Toast hatası:', error);
        }
        */
    },

    /**
     * Custom confirm (Promise tabanlı)
     * Kullanım: const ok = await Utils.confirm('Emin misin?');
     */
    confirm(message) {
        return new Promise((resolve) => {
            // Eğer zaten bir dialog varsa önce kaldır
            const existing = document.getElementById('confirmOverlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'confirmOverlay';
            overlay.className = 'confirm-overlay';
            overlay.innerHTML = `
                <div class="confirm-dialog" role="dialog" aria-modal="true">
                    <div class="confirm-title">Onay gerekiyor</div>
                    <div class="confirm-message">${this.sanitizeHTML(message)}</div>
                    <div class="confirm-actions">
                        <button class="btn btn-secondary confirm-cancel">Vazgeç</button>
                        <button class="btn btn-primary confirm-ok">Onayla</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const okBtn = overlay.querySelector('.confirm-ok');
            const cancelBtn = overlay.querySelector('.confirm-cancel');

            const cleanup = (value) => {
                overlay.classList.add('confirm-overlay--closing');
                setTimeout(() => {
                    overlay.remove();
                    resolve(value);
                }, 150);
            };

            okBtn.addEventListener('click', () => cleanup(true));
            cancelBtn.addEventListener('click', () => cleanup(false));

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup(false);
                }
            });

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escHandler);
                    cleanup(false);
                }
            };

            document.addEventListener('keydown', escHandler);
        });
    }
};

// Export
window.Utils = Utils;

// Başlangıçta bilgi ver
console.log('🔇 Toast bildirimleri devre dışı bırakıldı (Utils.showToast)');
