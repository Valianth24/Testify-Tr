/**
 * TESTIFY LANGUAGE MANAGER
 * Çok dilli destek sistemi - Kolay entegrasyon
 * Desteklenen diller: Türkçe, English
 */

'use strict';

const LanguageManager = {
    // Mevcut dil
    currentLang: 'tr',
    
    // Dil çevirileri
    translations: {
        tr: {
            // Header
            'app.name': 'Testify',
            'header.streak': 'Gün',
            'header.points': 'XP',
            
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.test': 'Test Çöz',
            'nav.create': 'Test Oluştur',
            'nav.library': 'Kütüphanem',
            'nav.notes': 'Notlarım',
            'nav.leaderboard': 'Liderlik',
            'nav.analysis': 'Analizler',
            'nav.settings': 'Ayarlar',
            
            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.tests': 'Çözülen Test',
            'dashboard.success': 'Başarı Oranı',
            'dashboard.questions': 'Toplam Soru',
            'dashboard.avgTime': 'Ort. Süre',
            'dashboard.activity': 'Son Aktiviteler',
            'dashboard.empty': 'Henüz aktivite yok. Test çözerek başla!',
            
            // Test
            'test.title': 'Test Seç',
            'test.practice': 'Pratik Modu',
            'test.practiceDesc': 'Zaman baskısı olmadan pratik yap',
            'test.exam': 'Sınav Modu',
            'test.examDesc': 'Gerçek sınav deneyimi',
            'test.ai': 'AI Test',
            'test.aiDesc': 'AI tarafından oluşturulan sorular',
            'test.custom': 'Özel Test',
            'test.customDesc': 'Kendi kriterlerine göre',
            
            // Quiz
            'quiz.question': 'Soru',
            'quiz.of': '/',
            'quiz.prev': 'Önceki',
            'quiz.next': 'Sonraki',
            'quiz.finish': 'Testi Bitir',
            'quiz.exit': 'Çıkış',
            'quiz.exitConfirm': 'Testi bırakmak istediğine emin misin?\n\nİlerleme kaydedilmeyecek!',
            
            // Results
            'results.title': 'Test Tamamlandı!',
            'results.correct': 'Doğru',
            'results.wrong': 'Yanlış',
            'results.success': 'Başarı',
            'results.time': 'Süre',
            'results.review': 'Cevapları Gör',
            'results.newTest': 'Yeni Test',
            
            // Create Test
            'create.title': 'Test Oluştur',
            'create.testTitle': 'Test Başlığı',
            'create.testTitlePlaceholder': 'Örn: Matematik Final Sınavı',
            'create.category': 'Kategori',
            'create.selectCategory': 'Seçiniz...',
            'create.upload': 'Dosya Yükle',
            'create.uploadDesc': 'PDF, DOCX veya TXT dosyası yükle',
            'create.uploadHint': 'veya sürükle bırak',
            'create.submit': 'Testify AI ile Oluştur',
            
            // Library
            'library.title': 'Kütüphanem',
            'library.desc': 'AI ile oluşturduğun testler burada saklanır (24 saat)',
            'library.empty': 'Henüz test oluşturmadın',
            'library.emptyDesc': 'AI\'dan "test oluştur" diyerek başla!',
            'library.questions': 'Soru',
            'library.duration': 'dk',
            'library.remaining': 'kaldı',
            'library.start': 'Teste Başla',
            'library.download': 'PDF İndir',
            'library.view': 'İncele',
            'library.delete': 'Sil',
            'library.deleteConfirm': 'Bu testi silmek istediğinden emin misin?',
            
            // Notes
            'notes.title': 'Notlarım',
            'notes.add': 'Yeni Not',
            'notes.empty': 'Henüz not eklemedin',
            'notes.edit': 'Düzenle',
            'notes.delete': 'Sil',
            'notes.deleteConfirm': 'Bu notu silmek istediğinizden emin misiniz?',
            'notes.titlePrompt': 'Not Başlığı:',
            'notes.contentPrompt': 'Not İçeriği:',
            
            // Leaderboard
            'leaderboard.title': 'Liderlik Tablosu',
            'leaderboard.period': 'Haftalık Sıralama',
            'leaderboard.rank': 'Sıra',
            'leaderboard.user': 'Kullanıcı',
            'leaderboard.xp': 'XP',
            'leaderboard.tests': 'Test',
            'leaderboard.success': 'Başarı',
            'leaderboard.empty': 'Henüz veri bulunmuyor',
            
            // Analysis
            'analysis.title': 'Performans Analizi',
            'analysis.avgSuccess': 'Ortalama Başarı',
            'analysis.avgTime': 'Ortalama Süre',
            'analysis.totalCorrect': 'Toplam Doğru',
            'analysis.totalWrong': 'Toplam Yanlış',
            'analysis.evaluation': 'Performans Değerlendirmesi',
            'analysis.empty': 'Analiz için daha fazla test çöz',
            
            // Settings
            'settings.title': 'Ayarlar',
            'settings.username': 'Kullanıcı Adı',
            'settings.email': 'E-posta',
            'settings.notifications': 'Bildirimler',
            'settings.emailNotif': 'E-posta bildirimleri',
            'settings.pushNotif': 'Push bildirimleri',
            'settings.save': 'Kaydet',
            'settings.reset': 'Sıfırla',
            'settings.resetConfirm': 'Ayarlar varsayılan değerlere dönecek. Emin misiniz?',
            
            // AI Chat
            'ai.title': 'Testify AI',
            'ai.status': 'Çevrimiçi',
            'ai.placeholder': 'Testify AI\'ya sor...',
            'ai.send': '→',
            
            // Categories
            'category.matematik': 'Matematik',
            'category.fen': 'Fen Bilimleri',
            'category.turkce': 'Türkçe',
            'category.sosyal': 'Sosyal Bilgiler',
            'category.ingilizce': 'İngilizce',
            'category.tarih': 'Tarih',
            'category.cografya': 'Coğrafya',
            'category.fizik': 'Fizik',
            'category.kimya': 'Kimya',
            'category.biyoloji': 'Biyoloji',
            
            // Messages
            'msg.testStarted': 'Test başladı! Bol şans!',
            'msg.testCompleted': 'Test tamamlandı!',
            'msg.saved': 'Başarıyla kaydedildi!',
            'msg.deleted': 'Başarıyla silindi!',
            'msg.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
            'msg.loading': 'Yükleniyor...',
            'msg.copiedToClipboard': 'Panoya kopyalandı!',
            
            // Common
            'common.required': 'Zorunlu alan',
            'common.optional': 'İsteğe bağlı',
            'common.cancel': 'İptal',
            'common.confirm': 'Onayla',
            'common.close': 'Kapat',
            'common.back': 'Geri',
            'common.continue': 'Devam',
            'common.yes': 'Evet',
            'common.no': 'Hayır'
        },
        
        en: {
            // Header
            'app.name': 'Testify',
            'header.streak': 'Days',
            'header.points': 'XP',
            
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.test': 'Take Test',
            'nav.create': 'Create Test',
            'nav.library': 'My Library',
            'nav.notes': 'My Notes',
            'nav.leaderboard': 'Leaderboard',
            'nav.analysis': 'Analysis',
            'nav.settings': 'Settings',
            
            // Dashboard
            'dashboard.title': 'Dashboard',
            'dashboard.tests': 'Completed Tests',
            'dashboard.success': 'Success Rate',
            'dashboard.questions': 'Total Questions',
            'dashboard.avgTime': 'Avg. Time',
            'dashboard.activity': 'Recent Activity',
            'dashboard.empty': 'No activity yet. Start by taking a test!',
            
            // Test
            'test.title': 'Choose Test',
            'test.practice': 'Practice Mode',
            'test.practiceDesc': 'Practice without time pressure',
            'test.exam': 'Exam Mode',
            'test.examDesc': 'Real exam experience',
            'test.ai': 'AI Test',
            'test.aiDesc': 'AI-generated questions',
            'test.custom': 'Custom Test',
            'test.customDesc': 'Based on your criteria',
            
            // Quiz
            'quiz.question': 'Question',
            'quiz.of': 'of',
            'quiz.prev': 'Previous',
            'quiz.next': 'Next',
            'quiz.finish': 'Finish Test',
            'quiz.exit': 'Exit',
            'quiz.exitConfirm': 'Are you sure you want to quit?\n\nProgress will not be saved!',
            
            // Results
            'results.title': 'Test Completed!',
            'results.correct': 'Correct',
            'results.wrong': 'Wrong',
            'results.success': 'Success',
            'results.time': 'Time',
            'results.review': 'Review Answers',
            'results.newTest': 'New Test',
            
            // Create Test
            'create.title': 'Create Test',
            'create.testTitle': 'Test Title',
            'create.testTitlePlaceholder': 'E.g: Math Final Exam',
            'create.category': 'Category',
            'create.selectCategory': 'Select...',
            'create.upload': 'Upload File',
            'create.uploadDesc': 'Upload PDF, DOCX or TXT file',
            'create.uploadHint': 'or drag and drop',
            'create.submit': 'Create with Testify AI',
            
            // Library
            'library.title': 'My Library',
            'library.desc': 'AI-generated tests are stored here (24 hours)',
            'library.empty': 'You haven\'t created any tests yet',
            'library.emptyDesc': 'Ask AI to "create a test" to get started!',
            'library.questions': 'Questions',
            'library.duration': 'min',
            'library.remaining': 'remaining',
            'library.start': 'Start Test',
            'library.download': 'Download PDF',
            'library.view': 'View',
            'library.delete': 'Delete',
            'library.deleteConfirm': 'Are you sure you want to delete this test?',
            
            // Notes
            'notes.title': 'My Notes',
            'notes.add': 'New Note',
            'notes.empty': 'You haven\'t added any notes yet',
            'notes.edit': 'Edit',
            'notes.delete': 'Delete',
            'notes.deleteConfirm': 'Are you sure you want to delete this note?',
            'notes.titlePrompt': 'Note Title:',
            'notes.contentPrompt': 'Note Content:',
            
            // Leaderboard
            'leaderboard.title': 'Leaderboard',
            'leaderboard.period': 'Weekly Ranking',
            'leaderboard.rank': 'Rank',
            'leaderboard.user': 'User',
            'leaderboard.xp': 'XP',
            'leaderboard.tests': 'Tests',
            'leaderboard.success': 'Success',
            'leaderboard.empty': 'No data available yet',
            
            // Analysis
            'analysis.title': 'Performance Analysis',
            'analysis.avgSuccess': 'Average Success',
            'analysis.avgTime': 'Average Time',
            'analysis.totalCorrect': 'Total Correct',
            'analysis.totalWrong': 'Total Wrong',
            'analysis.evaluation': 'Performance Evaluation',
            'analysis.empty': 'Take more tests for analysis',
            
            // Settings
            'settings.title': 'Settings',
            'settings.username': 'Username',
            'settings.email': 'Email',
            'settings.notifications': 'Notifications',
            'settings.emailNotif': 'Email notifications',
            'settings.pushNotif': 'Push notifications',
            'settings.save': 'Save',
            'settings.reset': 'Reset',
            'settings.resetConfirm': 'Settings will be reset to defaults. Are you sure?',
            
            // AI Chat
            'ai.title': 'Testify AI',
            'ai.status': 'Online',
            'ai.placeholder': 'Ask Testify AI...',
            'ai.send': '→',
            
            // Categories
            'category.matematik': 'Mathematics',
            'category.fen': 'Science',
            'category.turkce': 'Turkish',
            'category.sosyal': 'Social Studies',
            'category.ingilizce': 'English',
            'category.tarih': 'History',
            'category.cografya': 'Geography',
            'category.fizik': 'Physics',
            'category.kimya': 'Chemistry',
            'category.biyoloji': 'Biology',
            
            // Messages
            'msg.testStarted': 'Test started! Good luck!',
            'msg.testCompleted': 'Test completed!',
            'msg.saved': 'Successfully saved!',
            'msg.deleted': 'Successfully deleted!',
            'msg.error': 'An error occurred. Please try again.',
            'msg.loading': 'Loading...',
            'msg.copiedToClipboard': 'Copied to clipboard!',
            
            // Common
            'common.required': 'Required',
            'common.optional': 'Optional',
            'common.cancel': 'Cancel',
            'common.confirm': 'Confirm',
            'common.close': 'Close',
            'common.back': 'Back',
            'common.continue': 'Continue',
            'common.yes': 'Yes',
            'common.no': 'No'
        }
    },
    
    /**
     * Dili değiştir
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error('Desteklenmeyen dil:', lang);
            return false;
        }
        
        this.currentLang = lang;
        localStorage.setItem('testify_language', lang);
        
        // Sayfayı güncelle
        this.updatePage();
        
        // HTML lang attribute
        document.documentElement.setAttribute('lang', lang);
        
        Utils.showToast(
            lang === 'tr' ? 'Dil değiştirildi: Türkçe' : 'Language changed: English',
            'success'
        );
        
        return true;
    },
    
    /**
     * Çeviri getir
     */
    t(key, defaultValue = '') {
        const translation = this.translations[this.currentLang][key];
        return translation || defaultValue || key;
    },
    
    /**
     * Sayfayı güncelle
     */
    updatePage() {
        // data-i18n attribute'leri güncelle
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                // İkon varsa koru
                const icon = element.querySelector('[role="img"]');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    element.innerHTML = iconHTML + ' ' + translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Placeholder'ları güncelle
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Title'ları güncelle
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        console.log('✅ Sayfa dili güncellendi:', this.currentLang);
    },
    
    /**
     * Başlat
     */
    init() {
        console.log('🌍 Language Manager başlatılıyor...');
        
        // Kaydedilmiş dili yükle
        const savedLang = localStorage.getItem('testify_language') || 'tr';
        this.currentLang = savedLang;
        
        // HTML lang attribute
        document.documentElement.setAttribute('lang', savedLang);
        
        // Dil seçici oluştur
        this.createLanguageSelector();
        
        // İlk yükleme
        setTimeout(() => {
            this.updatePage();
        }, 100);
        
        console.log('✅ Language Manager hazır, dil:', savedLang);
    },
    
    /**
     * Dil seçici oluştur
     */
    createLanguageSelector() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) {
            console.warn('Header actions bulunamadı');
            return;
        }
        
        // Mevcut seçiciyi kaldır
        const existingSelector = document.getElementById('languageSelector');
        if (existingSelector) {
            existingSelector.remove();
        }
        
        // Yeni seçici
        const selector = document.createElement('div');
        selector.id = 'languageSelector';
        selector.className = 'language-selector';
        selector.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'tr' ? 'active' : ''}" 
                    data-lang="tr" 
                    aria-label="Türkçe"
                    title="Türkçe">
                🇹🇷 TR
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" 
                    data-lang="en" 
                    aria-label="English"
                    title="English">
                🇬🇧 EN
            </button>
        `;
        
        // Theme toggle'dan önce ekle
        const themeToggle = headerActions.querySelector('.theme-toggle');
        if (themeToggle) {
            headerActions.insertBefore(selector, themeToggle);
        } else {
            headerActions.insertBefore(selector, headerActions.firstChild);
        }
        
        // Event listeners
        selector.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                
                // Active class değiştir
                selector.querySelectorAll('.lang-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                
                // Dili değiştir
                this.setLanguage(lang);
            });
        });
        
        console.log('✅ Dil seçici oluşturuldu');
    }
};

// CSS stilleri ekle
const languageStyles = document.createElement('style');
languageStyles.textContent = `
.language-selector {
    display: flex;
    gap: 4px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 4px;
}

.lang-btn {
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
    font-family: inherit;
}

.lang-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.lang-btn.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

/* Dark mode */
[data-theme="dark"] .language-selector {
    background: var(--bg-secondary);
    border-color: var(--border);
}

[data-theme="dark"] .lang-btn.active {
    box-shadow: 0 2px 8px rgba(129, 140, 248, 0.4);
}

/* Mobile responsive */
@media (max-width: 767px) {
    .lang-btn {
        padding: 4px 8px;
        font-size: 0.75rem;
    }
}
`;
document.head.appendChild(languageStyles);

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
});

// Export
window.LanguageManager = LanguageManager;
window.t = (key, defaultValue) => LanguageManager.t(key, defaultValue);
