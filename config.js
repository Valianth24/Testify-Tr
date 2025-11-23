/**
 * TESTIFY CONFIGURATION
 * Uygulama ayarları ve sabitler
 */

'use strict';

const Config = {
    // Uygulama Bilgileri
    APP_NAME: 'Testify',
    APP_VERSION: '1.0.0',
    APP_URL: 'https://testify.com',
    
    // API Ayarları (Backend hazır olduğunda)
    API: {
        BASE_URL: 'https://api.testify.com',
        TIMEOUT: 10000, // ms
        RETRY_ATTEMPTS: 3
    },
    
    // Storage Keys
    STORAGE_KEYS: {
        USER_DATA: 'testify_user_data',
        THEME: 'testify_theme',
        QUIZ_STATE: 'testify_quiz_state',
        SETTINGS: 'testify_settings',
        NOTES: 'testify_notes',
        LEADERBOARD: 'testify_leaderboard',
        ACTIVITY: 'testify_activity'
    },
    
    // Quiz Ayarları
    QUIZ: {
        DEFAULT_QUESTIONS: 10,
        MIN_QUESTIONS: 5,
        MAX_QUESTIONS: 50,
        TIME_PER_QUESTION: 60, // saniye
        MODES: {
            PRACTICE: 'practice',
            EXAM: 'exam',
            AI: 'ai',
            CUSTOM: 'custom'
        }
    },
    
    // Puanlama Sistemi
    SCORING: {
        CORRECT_ANSWER: 10,
        WRONG_ANSWER: -2,
        TIME_BONUS_THRESHOLD: 30, // saniye
        TIME_BONUS_POINTS: 5,
        STREAK_BONUS: 5
    },
    
    // XP ve Level Sistemi
    LEVELING: {
        XP_PER_TEST: 50,
        XP_PER_CORRECT: 10,
        LEVEL_UP_BASE: 100,
        LEVEL_UP_MULTIPLIER: 1.5
    },
    
    // Validation Rules
    VALIDATION: {
        USERNAME: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 20,
            PATTERN: /^[a-zA-Z0-9_]+$/
        },
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        TEST_TITLE: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 100
        },
        NOTE: {
            MIN_LENGTH: 1,
            MAX_LENGTH: 5000
        }
    },
    
    // File Upload
    FILE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: ['pdf', 'docx', 'txt'],
        MIME_TYPES: {
            pdf: 'application/pdf',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            txt: 'text/plain'
        }
    },
    
    // Toast Notifications
    TOAST: {
        SUCCESS_DURATION: 3000,
        ERROR_DURATION: 5000,
        WARNING_DURATION: 4000,
        INFO_DURATION: 3000
    },
    
    // Animation Durations
    ANIMATION: {
        FAST: 150,
        NORMAL: 200,
        SLOW: 300
    },
    
    // Debounce/Throttle Timings
    TIMING: {
        DEBOUNCE_SEARCH: 300,
        DEBOUNCE_INPUT: 500,
        THROTTLE_SCROLL: 100,
        THROTTLE_RESIZE: 200
    },
    
    // Leaderboard
    LEADERBOARD: {
        MAX_ENTRIES: 100,
        REFRESH_INTERVAL: 300000, // 5 dakika
        PERIODS: {
            DAILY: 'daily',
            WEEKLY: 'weekly',
            MONTHLY: 'monthly',
            ALL_TIME: 'all_time'
        }
    },
    
    // Analytics (İsteğe bağlı)
    ANALYTICS: {
        ENABLED: false,
        TRACKING_ID: 'UA-XXXXXXXXX-X'
    },
    
    // AdSense (Gerçek ID'niz ile değiştirilmeli)
    ADSENSE: {
        ENABLED: true,
        CLIENT_ID: 'ca-pub-1234567890123456',
        AD_SLOTS: {
            TOP_BANNER: '1234567890',
            BOTTOM_BANNER: '0987654321',
            SIDEBAR: '1357924680'
        }
    },
    
    // Theme
    THEME: {
        DEFAULT: 'light',
        OPTIONS: ['light', 'dark']
    },
    
    // Error Messages
    ERRORS: {
        NETWORK: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
        SERVER: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
        VALIDATION: 'Geçersiz veri. Lütfen bilgilerinizi kontrol edin.',
        FILE_SIZE: 'Dosya boyutu çok büyük.',
        FILE_TYPE: 'Desteklenmeyen dosya türü.',
        GENERIC: 'Bir hata oluştu. Lütfen tekrar deneyin.'
    },
    
    // Success Messages
    SUCCESS: {
        SAVED: 'Başarıyla kaydedildi!',
        DELETED: 'Başarıyla silindi!',
        UPDATED: 'Başarıyla güncellendi!',
        TEST_COMPLETED: 'Test tamamlandı!',
        FILE_UPLOADED: 'Dosya yüklendi!',
        COPIED: 'Panoya kopyalandı!'
    },
    
    // Categories (Test kategorileri)
    CATEGORIES: [
        { value: 'matematik', label: 'Matematik', icon: '🔢' },
        { value: 'fen', label: 'Fen Bilimleri', icon: '🔬' },
        { value: 'turkce', label: 'Türkçe', icon: '📖' },
        { value: 'sosyal', label: 'Sosyal Bilgiler', icon: '🌍' },
        { value: 'ingilizce', label: 'İngilizce', icon: '🇬🇧' },
        { value: 'tarih', label: 'Tarih', icon: '📜' },
        { value: 'cografya', label: 'Coğrafya', icon: '🗺️' },
        { value: 'fizik', label: 'Fizik', icon: '⚛️' },
        { value: 'kimya', label: 'Kimya', icon: '⚗️' },
        { value: 'biyoloji', label: 'Biyoloji', icon: '🧬' }
    ],
    
    // Difficulty Levels
    DIFFICULTY: {
        EASY: { value: 'easy', label: 'Kolay', color: '#10b981' },
        MEDIUM: { value: 'medium', label: 'Orta', color: '#f59e0b' },
        HARD: { value: 'hard', label: 'Zor', color: '#ef4444' }
    },
    
    // Accessibility
    ACCESSIBILITY: {
        ENABLE_SCREEN_READER: true,
        ENABLE_KEYBOARD_NAV: true,
        HIGH_CONTRAST: false,
        FONT_SIZE_MULTIPLIER: 1.0
    },
    
    // Performance
    PERFORMANCE: {
        ENABLE_LAZY_LOAD: true,
        IMAGE_QUALITY: 0.85,
        CACHE_DURATION: 86400000, // 1 gün
        PREFETCH_ENABLED: true
    },
    
    // Feature Flags
    FEATURES: {
        AI_CHAT: true,
        LEADERBOARD: true,
        NOTES: true,
        ANALYTICS: true,
        SOCIAL_SHARE: true,
        NOTIFICATIONS: true,
        DARK_MODE: true,
        FILE_UPLOAD: true
    },
    
    // Social Media (İsteğe bağlı)
    SOCIAL: {
        FACEBOOK: 'https://facebook.com/testify',
        TWITTER: 'https://twitter.com/testify',
        INSTAGRAM: 'https://instagram.com/testify',
        LINKEDIN: 'https://linkedin.com/company/testify'
    }
};

// Freeze configuration to prevent modifications
Object.freeze(Config);

// Export
window.Config = Config;
