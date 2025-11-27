/**
 * TESTIFY MAIN APPLICATION v2.1
 * =============================
 * Ana uygulama - YKS Test Flow entegrasyonu ile
 */

'use strict';

// i18n fallback
if (typeof window.t !== 'function') {
    window.t = function (_key, fallback) {
        return fallback;
    };
}

const App = {
    // ═══════════════════════════════════════════════════════════════════════════
    // BAŞLATMA
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Uygulamayı başlat
     */
    init() {
        console.log('🎓 Testify başlatılıyor...');

        try {
            this.checkStorage();
            this.loadUserData();
            this.loadTheme();
            this.attachEventListeners();
            this.updateDashboard();
            this.updateLeaderboard();

            console.log('✅ Testify hazır!');
        } catch (error) {
            console.error('❌ Başlatma hatası:', error);
            if (window.Utils && typeof Utils.handleError === 'function') {
                Utils.handleError(error, 'App.init');
            }
        }
    },

    /**
     * Storage kontrolü
     */
    checkStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
        } catch (e) {
            if (window.Utils && typeof Utils.showToast === 'function') {
                Utils.showToast('LocalStorage kullanılamıyor!', 'warning');
            }
            console.error('Storage hatası:', e);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // KULLANICI VERİLERİ
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Kullanıcı verilerini yükle
     */
    loadUserData() {
        try {
            const userData = StorageManager.getUserData();

            const userAvatar = document.getElementById('userAvatar');
            const streak = document.getElementById('streak');
            const totalPoints = document.getElementById('totalPoints');
            const rank = document.getElementById('rank');

            if (userAvatar) {
                const username = userData.username || 'U';
                userAvatar.textContent = username.charAt(0).toUpperCase();
            }

            if (streak) {
                const streakText = t('header.streak', 'Gün');
                streak.innerHTML = `${userData.stats.streak} <span data-i18n="header.streak">${streakText}</span>`;
            }

            if (totalPoints) {
                const xpText = t('header.points', 'XP');
                totalPoints.innerHTML = `${userData.stats.xp} <span data-i18n="header.points">${xpText}</span>`;
            }

            if (rank) {
                rank.textContent = userData.stats.rank ? '#' + userData.stats.rank : '#--';
            }
        } catch (error) {
            console.error('Kullanıcı verisi yükleme hatası:', error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TEMA YÖNETİMİ
    // ═══════════════════════════════════════════════════════════════════════════

    themeManager: {
        toggle() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);

            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) {
                const iconClass = newTheme === 'light' ? 'ph-sun-dim' : 'ph-moon-stars';
                themeIcon.className = `ph ${iconClass} icon`;
            }

            const themeBtn = document.querySelector('.theme-toggle');
            if (themeBtn) {
                themeBtn.setAttribute('aria-pressed', newTheme === 'dark');
            }

            localStorage.setItem('theme', newTheme);
        }
    },

    /**
     * Temayı yükle
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            const iconClass = savedTheme === 'light' ? 'ph-sun-dim' : 'ph-moon-stars';
            themeIcon.className = `ph ${iconClass} icon`;
        }

        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            themeBtn.setAttribute('aria-pressed', savedTheme === 'dark');
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // LOADING OVERLAY
    // ═══════════════════════════════════════════════════════════════════════════

    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.setAttribute('aria-hidden', 'false');
        }
    },

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TAB NAVİGASYONU
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * URL hash'ine göre ilk sekmeyi ayarla
     */
    handleInitialTabFromHash() {
        try {
            const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
            const defaultTab = 'dashboard';
            const targetTab = hash && document.getElementById(hash) ? hash : defaultTab;

            if (targetTab !== defaultTab) {
                this.switchTab(targetTab, { skipHistory: true });
            } else {
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({ tab: defaultTab }, '', '#' + defaultTab);
                }
            }
        } catch (error) {
            console.error('İlk sekme ayarlama hatası:', error);
        }
    },

    /**
     * Tab değiştir
     */
    switchTab(tabName, options = {}) {
        try {
            this.showLoadingOverlay();

            // Tab butonlarını güncelle
            document.querySelectorAll('.nav-tab').forEach(tab => {
                const isActive = tab.dataset.tab === tabName;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive);
            });

            // Tab içeriklerini güncelle
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.id === tabName);
            });

            // Tab'a özel işlemler
            switch (tabName) {
                case 'test':
                    // YKS Test Flow'u başlat
                    this.initYKSTestFlow();
                    break;

                case 'library':
                    if (window.LibraryManager && typeof LibraryManager.loadLibrary === 'function') {
                        LibraryManager.loadLibrary();
                    }
                    break;

                case 'leaderboard':
                    this.updateLeaderboard();
                    break;

                case 'notes':
                    this.updateNotes();
                    break;

                case 'analysis':
                    this.updateAnalysis();
                    break;

                case 'dashboard':
                    this.updateDashboard();
                    break;

                case 'journey':
                    this.initYKSJourneyTab();
                    break;
            }

            // URL güncelle
            if (!options.skipHistory) {
                if (window.history && window.history.pushState) {
                    window.history.pushState({ tab: tabName }, '', '#' + tabName);
                }
            }

            setTimeout(() => {
                this.hideLoadingOverlay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 200);

        } catch (error) {
            console.error('Tab değiştirme hatası:', error);
            this.hideLoadingOverlay();
        }
    },

    /**
     * YKS Test Flow'u başlat
     */
    initYKSTestFlow() {
        try {
            const container = document.getElementById('yksTestFlowContainer');
            if (!container) {
                console.warn('⚠️ yksTestFlowContainer bulunamadı');
                return;
            }

            if (window.YKSTestFlow && typeof YKSTestFlow.init === 'function') {
                if (!container.dataset.initialized) {
                    YKSTestFlow.init(container);
                    container.dataset.initialized = 'true';
                    console.log('✅ YKS Test Flow başlatıldı');
                } else {
                    // Zaten başlatılmışsa sadece render et
                    YKSTestFlow.render();
                }
            } else {
                console.warn('⚠️ YKSTestFlow modülü bulunamadı');
                // Fallback: Basit bir mesaj göster
                container.innerHTML = `
                    <div class="empty-state" style="padding: 3rem;">
                        <div class="empty-state-icon">
                            <i class="ph ph-warning icon"></i>
                        </div>
                        <p>YKS Test Flow yükleniyor...</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('YKS Test Flow başlatma hatası:', error);
        }
    },

    /**
     * YKS Yolculuğu sekmesini başlat
     */
    initYKSJourneyTab() {
        try {
            const root = document.getElementById('journeyContent') || document.getElementById('journey');

            if (window.YKSJourneyManager) {
                if (typeof YKSJourneyManager.init === 'function' && !YKSJourneyManager._initialized) {
                    YKSJourneyManager.init(root);
                    YKSJourneyManager._initialized = true;
                } else if (typeof YKSJourneyManager.render === 'function') {
                    YKSJourneyManager.render();
                }
                return;
            }

            if (window.YKSJourney && typeof window.YKSJourney.init === 'function') {
                window.YKSJourney.init(root);
                return;
            }

            console.warn('⚠️ YKSJourney modülü bulunamadı');
        } catch (error) {
            console.error('YKS Yolculuğu başlatma hatası:', error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Dashboard'ı güncelle
     */
    updateDashboard() {
        try {
            const userData = StorageManager.getUserData();
            const stats = userData.stats;

            const elements = {
                totalTests: stats.totalTests,
                totalQuestions: stats.totalQuestions,
                successRate: stats.totalQuestions > 0 
                    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) + '%'
                    : '0%',
                avgTime: stats.totalTests > 0 
                    ? Math.round(stats.totalTime / stats.totalTests) + 's'
                    : '0s'
            };

            Object.entries(elements).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            });

            this.updateActivityList();
        } catch (error) {
            console.error('Dashboard güncelleme hatası:', error);
        }
    },

    /**
     * Aktivite listesini güncelle
     */
    updateActivityList() {
        try {
            const activities = StorageManager.getActivities(5);
            const activityList = document.getElementById('activityList');

            if (!activityList) return;

            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="ph ph-chart-line-up icon"></i>
                        </div>
                        <p>${t('dashboard.empty', 'Henüz aktivite yok. Test çözerek başla!')}</p>
                    </div>
                `;
                return;
            }

            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-content">
                        <div class="activity-title">${this.getActivityTitle(activity)}</div>
                        <div class="activity-desc">${this.getActivityDescription(activity)}</div>
                    </div>
                    <div class="activity-time">${Utils.formatDate(activity.timestamp)}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Aktivite listesi hatası:', error);
        }
    },

    getActivityTitle(activity) {
        const titles = {
            'test_completed': `<i class="ph ph-check-circle"></i> Test Tamamlandı`,
            'test_saved': `<i class="ph ph-floppy-disk"></i> Test Kaydedildi`,
            'test_exported': `<i class="ph ph-download-simple"></i> Test İndirildi`,
            'note_created': `<i class="ph ph-note-pencil"></i> Not Oluşturuldu`,
            'level_up': `<i class="ph ph-star"></i> Seviye Atlandı`,
            'yks_test_started': `<i class="ph ph-rocket-launch"></i> YKS Testi Başladı`
        };
        return titles[activity.type] || `<i class="ph ph-bell"></i> Aktivite`;
    },

    getActivityDescription(activity) {
        switch (activity.type) {
            case 'test_completed':
                return `${activity.data.correctAnswers}/${activity.data.totalQuestions} doğru - %${activity.data.successRate}`;
            case 'test_saved':
                return `${activity.data.title} - ${activity.data.questionCount} soru`;
            case 'test_exported':
                return `${activity.data.title} - ${activity.data.format.toUpperCase()}`;
            case 'note_created':
                return activity.data.title || 'Yeni not';
            case 'yks_test_started':
                return `${activity.data.field || ''} - ${activity.data.questionCount || 0} soru`;
            default:
                return '';
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // LEADERBOARD
    // ═══════════════════════════════════════════════════════════════════════════

    updateLeaderboard() {
        try {
            const leaderboard = StorageManager.getLeaderboard(100);
            const tbody = document.getElementById('leaderboardBody');

            if (!tbody) return;

            if (leaderboard.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty-cell">${t('leaderboard.empty', 'Henüz veri bulunmuyor')}</td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = leaderboard.map(user => `
                <tr>
                    <td>
                        <span class="rank-badge ${this.getRankClass(user.rank)}">${user.rank}</span>
                    </td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-small">${user.username.charAt(0).toUpperCase()}</div>
                            <span>${Utils.sanitizeHTML(user.username)}</span>
                        </div>
                    </td>
                    <td><strong>${user.xp} XP</strong></td>
                    <td>${user.totalTests}</td>
                    <td><span class="success-text">${user.successRate}%</span></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Leaderboard güncelleme hatası:', error);
        }
    },

    getRankClass(rank) {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return 'rank-default';
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // NOTLAR
    // ═══════════════════════════════════════════════════════════════════════════

    updateNotes() {
        try {
            const notes = StorageManager.getNotes();
            const notesList = document.getElementById('notesList');

            if (!notesList) return;

            if (notes.length === 0) {
                notesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="ph ph-note-pencil icon"></i>
                        </div>
                        <p>${t('notes.empty', 'Henüz not eklemedin')}</p>
                    </div>
                `;
                return;
            }

            notesList.innerHTML = notes.map(note => `
                <div class="note-card">
                    <h3 class="note-title">${Utils.sanitizeHTML(note.title || 'Başlıksız Not')}</h3>
                    <p class="note-content">${Utils.sanitizeHTML(note.content || '')}</p>
                    <div class="note-meta">
                        <span>${Utils.formatDate(note.createdAt)}</span>
                        <div class="note-actions">
                            <button class="btn btn-secondary btn-sm" onclick="App.editNote('${note.id}')">
                                Düzenle
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="App.deleteNote('${note.id}')">
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Notlar güncelleme hatası:', error);
        }
    },

    async addNote() {
        try {
            if (window.NoteModal && typeof NoteModal.openCreate === 'function') {
                NoteModal.openCreate();
                return;
            }

            const title = prompt(t('notes.titlePrompt', 'Not Başlığı:'));
            if (!title) return;

            const content = prompt(t('notes.contentPrompt', 'Not İçeriği:')) || '';

            if (StorageManager.saveNote({ title, content })) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not ekleme hatası:', error);
        }
    },

    async editNote(noteId) {
        try {
            const notes = StorageManager.getNotes();
            const note = notes.find(n => n.id === noteId);

            if (!note) return;

            if (window.NoteModal && typeof NoteModal.openEdit === 'function') {
                NoteModal.openEdit(note);
                return;
            }

            const title = prompt(t('notes.titlePrompt', 'Not Başlığı:'), note.title);
            if (title === null) return;

            const content = prompt(t('notes.contentPrompt', 'Not İçeriği:'), note.content);
            if (content === null) return;

            note.title = title;
            note.content = content;

            if (StorageManager.saveNote(note)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not düzenleme hatası:', error);
        }
    },

    async deleteNote(noteId) {
        try {
            const confirmed = await Utils.confirm(t('notes.deleteConfirm', 'Bu notu silmek istediğinizden emin misiniz?'));
            if (confirmed && StorageManager.deleteNote(noteId)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not silme hatası:', error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ANALİZ
    // ═══════════════════════════════════════════════════════════════════════════

    updateAnalysis() {
        try {
            const userData = StorageManager.getUserData();
            const stats = userData.stats;
            const analysisContent = document.getElementById('analysisContent');

            if (!analysisContent) return;

            if (stats.totalTests === 0) {
                analysisContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="ph ph-chart-line-up icon"></i>
                        </div>
                        <p>${t('analysis.empty', 'Analiz için daha fazla test çöz')}</p>
                    </div>
                `;
                return;
            }

            const totalQuestionsSafe = Math.max(stats.totalQuestions, 1);
            const successRate = Math.round((stats.correctAnswers / totalQuestionsSafe) * 100);
            const avgTime = stats.totalTests > 0 ? Math.round(stats.totalTime / stats.totalTests) : 0;

            analysisContent.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="ph ph-chart-line-up icon"></i></div>
                        <div class="stat-value">${successRate}%</div>
                        <div class="stat-label">${t('analysis.avgSuccess', 'Ortalama Başarı')}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="ph ph-timer icon"></i></div>
                        <div class="stat-value">${Utils.formatTime(avgTime)}</div>
                        <div class="stat-label">${t('analysis.avgTime', 'Ortalama Süre')}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="ph ph-check-circle icon"></i></div>
                        <div class="stat-value">${stats.correctAnswers}</div>
                        <div class="stat-label">${t('analysis.totalCorrect', 'Toplam Doğru')}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="ph ph-x-circle icon"></i></div>
                        <div class="stat-value">${stats.wrongAnswers}</div>
                        <div class="stat-label">${t('analysis.totalWrong', 'Toplam Yanlış')}</div>
                    </div>
                </div>
                <div class="performance-message">
                    <h3>${t('analysis.evaluation', 'Performans Değerlendirmesi')}</h3>
                    <p>${this.getPerformanceText(successRate)}</p>
                </div>
            `;
        } catch (error) {
            console.error('Analiz güncelleme hatası:', error);
        }
    },

    getPerformanceText(successRate) {
        if (successRate >= 90) return '🌟 Mükemmel! Harika bir performans gösteriyorsun.';
        if (successRate >= 75) return '👏 Çok iyi! Başarılı bir performans.';
        if (successRate >= 60) return '💪 İyi gidiyorsun! Biraz daha pratik yaparsan daha iyi olur.';
        if (successRate >= 40) return '📚 Daha fazla çalışma gerekiyor. Düzenli pratik yap.';
        return '🎯 Temel konuları tekrar etmen önerilir.';
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // AYARLAR
    // ═══════════════════════════════════════════════════════════════════════════

    saveSettings(event) {
        event.preventDefault();

        try {
            const form = event.target;
            const usernameInput = form.username;
            const emailInput = form.email;

            const isUsernameValid = Utils.validateInput(usernameInput, 'username');
            const isEmailValid = Utils.validateInput(emailInput, 'email');

            if (!isUsernameValid || !isEmailValid) return;

            const userData = StorageManager.getUserData();
            userData.username = usernameInput.value.trim();
            userData.email = emailInput.value.trim();
            userData.settings.notifications = {
                email: form.emailNotif.checked,
                push: form.pushNotif.checked
            };

            if (StorageManager.updateUserData(userData)) {
                Utils.showToast(t('msg.saved', 'Başarıyla kaydedildi!'), 'success');
                this.loadUserData();
            }
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
        }
    },

    async resetSettings() {
        try {
            const confirmed = await Utils.confirm(t('settings.resetConfirm', 'Ayarlar varsayılan değerlere dönecek. Emin misiniz?'));
            if (!confirmed) return;

            const userData = StorageManager.getUserData();

            const elements = {
                username: userData.username,
                email: userData.email || '',
                emailNotif: true,
                pushNotif: false
            };

            Object.entries(elements).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox') {
                        el.checked = value;
                    } else {
                        el.value = value;
                    }
                }
            });

            Utils.showToast(t('msg.reset', 'Ayarlar sıfırlandı'), 'info');
        } catch (error) {
            console.error('Ayar sıfırlama hatası:', error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DOSYA YÜKLEME
    // ═══════════════════════════════════════════════════════════════════════════

    handleFileUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > Config.FILE_UPLOAD.MAX_SIZE) {
                Utils.showToast(t('error.fileSize', 'Dosya boyutu çok büyük'), 'error');
                return;
            }

            const ext = file.name.split('.').pop().toLowerCase();
            if (!Config.FILE_UPLOAD.ALLOWED_TYPES.includes(ext)) {
                Utils.showToast(t('error.fileType', 'Desteklenmeyen dosya türü'), 'error');
                return;
            }

            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div class="file-info-content">
                        <i class="ph ph-file-text"></i>
                        <div>
                            <strong>${Utils.sanitizeHTML(file.name)}</strong>
                            <small>${Utils.formatFileSize(file.size)}</small>
                        </div>
                    </div>
                `;
            }

            Utils.showToast(t('msg.fileUploaded', 'Dosya yüklendi!'), 'success');
        } catch (error) {
            console.error('Dosya yükleme hatası:', error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════════

    attachEventListeners() {
        try {
            // Logo → Dashboard
            const logoLink = document.getElementById('logoLink') || document.querySelector('.header .logo');
            if (logoLink) {
                logoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab('dashboard');
                });
            }

            // Tab navigasyonu
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
            });

            // Ayarlar formu
            const settingsForm = document.getElementById('settingsForm');
            if (settingsForm) {
                settingsForm.addEventListener('submit', (e) => this.saveSettings(e));
            }

            // Ayarları sıfırla
            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetSettings());
            }

            // Dosya yükleme
            const fileUpload = document.getElementById('fileUpload');
            if (fileUpload) {
                fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
            }

            // Test başlığı → AI konu
            const testTitleInput = document.getElementById('testTitle');
            if (testTitleInput) {
                testTitleInput.addEventListener('input', () => {
                    const topicInput = document.getElementById('testTopic');
                    if (topicInput) topicInput.value = testTitleInput.value;
                });
            }

            // Not ekle butonu
            const addNoteBtn = document.getElementById('addNoteBtn');
            if (addNoteBtn) {
                addNoteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addNote();
                });
            }

            // Tema değiştir
            window.themeManager = this.themeManager;

            console.log('✅ Event listener\'lar eklendi');
        } catch (error) {
            console.error('Event listener hatası:', error);
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.handleInitialTabFromHash();

    // TestifyAI'yi başlat
    try {
        if (typeof TestifyAI !== 'undefined' && TestifyAI && typeof TestifyAI.init === 'function') {
            TestifyAI.init();
            window.TestifyAI = TestifyAI;
            window.aiChat = TestifyAI;
        }
    } catch (e) {
        console.error('TestifyAI init hatası:', e);
    }
});

// Tarayıcı geri/ileri
window.addEventListener('popstate', (event) => {
    try {
        const stateTab = event.state && event.state.tab;
        const hashTab = window.location.hash ? window.location.hash.replace('#', '') : null;
        const targetTab = stateTab || hashTab || 'dashboard';

        if (document.getElementById(targetTab)) {
            App.switchTab(targetTab, { skipHistory: true });
        }
    } catch (error) {
        console.error('popstate hatası:', error);
    }
});

// Global navigasyon helper
window.navigateTo = function (tabName) {
    if (tabName && document.getElementById(tabName)) {
        App.switchTab(tabName);
    }
};

// Export
window.App = App;

// ═══════════════════════════════════════════════════════════════════════════
// NOT MODAL
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    let initialized = false;
    let overlay, modal, titleInput, contentInput, cancelBtn, saveBtn, modalTitle;
    let mode = 'create';
    let editingNoteId = null;

    function init() {
        if (initialized) return;

        overlay = document.getElementById('noteModalOverlay');
        modal = document.getElementById('noteModal');
        titleInput = document.getElementById('noteTitleInput');
        contentInput = document.getElementById('noteContentInput');
        cancelBtn = document.getElementById('noteCancelBtn');
        saveBtn = document.getElementById('noteSaveBtn');
        modalTitle = document.getElementById('noteModalTitle');

        if (!overlay || !modal) return;

        cancelBtn?.addEventListener('click', closeModal);
        saveBtn?.addEventListener('click', saveNote);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        titleInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveNote();
            }
        });

        initialized = true;
    }

    function openCreate() {
        if (!initialized) init();
        if (!overlay) return;

        mode = 'create';
        editingNoteId = null;

        if (modalTitle) modalTitle.textContent = 'Yeni Not';
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');

        setTimeout(() => titleInput?.focus(), 10);
    }

    function openEdit(note) {
        if (!initialized) init();
        if (!overlay || !note) return;

        mode = 'edit';
        editingNoteId = note.id;

        if (modalTitle) modalTitle.textContent = 'Notu Düzenle';
        if (titleInput) titleInput.value = note.title || '';
        if (contentInput) contentInput.value = note.content || '';

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');

        setTimeout(() => titleInput?.focus(), 10);
    }

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        mode = 'create';
        editingNoteId = null;
    }

    function saveNote() {
        if (!initialized || !overlay) return;

        const title = titleInput?.value.trim();
        const content = contentInput?.value.trim();

        if (!title) {
            titleInput?.focus();
            return;
        }

        const note = { title, content };
        if (mode === 'edit' && editingNoteId) {
            note.id = editingNoteId;
        }

        if (StorageManager.saveNote(note)) {
            if (window.App && typeof App.updateNotes === 'function') {
                App.updateNotes();
            }
            closeModal();
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    window.NoteModal = { openCreate, openEdit, close: closeModal };
})();
