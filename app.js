/**
 * TESTIFY MAIN APPLICATION - TAM HATASIZ
 * Tüm özellikler çalışır hale getiren ana uygulama
 */

'use strict';

// i18n fallback: language.js yüklenmese bile t() hata vermesin
if (typeof window.t !== 'function') {
    window.t = function (_key, fallback) {
        return fallback;
    };
}

const App = {
    /**
     * Uygulamayı başlatır
     */
    init() {
        console.log('🎓 Testify başlatılıyor...');
        
        try {
            // Storage'ı kontrol et
            this.checkStorage();
            
            // Kullanıcı verilerini yükle
            this.loadUserData();
            
            // Tema yükle
            this.loadTheme();
            
            // Event listener'ları ekle
            this.attachEventListeners();
            
            // Dashboard'ı güncelle
            this.updateDashboard();
            
            // Leaderboard'ı güncelle
            this.updateLeaderboard();
            
            console.log('✅ Testify hazır!');
        } catch (error) {
            console.error('❌ Başlatma hatası:', error);
            Utils.handleError(error, 'App.init');
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
            Utils.showToast('LocalStorage kullanılamıyor! Veriler kaydedilmeyecek.', 'warning');
            console.error('Storage hatası:', e);
        }
    },

    /**
     * Kullanıcı verilerini yükler
     */
    loadUserData() {
        try {
            const userData = StorageManager.getUserData();
            
            // Header'daki bilgileri güncelle
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
                const streakSpan = streak.querySelector('span[data-i18n="header.streak"]');
                if (streakSpan) {
                    streak.innerHTML = `${userData.stats.streak} <span data-i18n="header.streak">${streakText}</span>`;
                } else {
                    streak.textContent = userData.stats.streak + ' ' + streakText;
                }
            }
            
            if (totalPoints) {
                const xpText = t('header.points', 'XP');
                const xpSpan = totalPoints.querySelector('span[data-i18n="header.points"]');
                if (xpSpan) {
                    totalPoints.innerHTML = `${userData.stats.xp} <span data-i18n="header.points">${xpText}</span>`;
                } else {
                    totalPoints.textContent = userData.stats.xp + ' ' + xpText;
                }
            }
            
            if (rank) {
                rank.textContent = userData.stats.rank ? '#' + userData.stats.rank : '#--';
            }
        } catch (error) {
            console.error('Kullanıcı verisi yükleme hatası:', error);
            Utils.handleError(error, 'loadUserData');
        }
    },

    /**
     * Tema yöneticisi
     */
    themeManager: {
        toggle() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            
            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) {
                themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
            }
            
            const themeBtn = document.querySelector('.theme-toggle');
            if (themeBtn) {
                themeBtn.setAttribute('aria-pressed', newTheme === 'dark');
            }
            
            Utils.setToStorage(Config.STORAGE_KEYS.THEME, newTheme);
        }
    },

    /**
     * Temayı yükler
     */
    loadTheme() {
        const savedTheme = Utils.getFromStorage(Config.STORAGE_KEYS.THEME, 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';
        }
        
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            themeBtn.setAttribute('aria-pressed', savedTheme === 'dark');
        }
    },

    /**
     * Sekme geçişlerinde kullanılan loading overlay
     */
    showLoadingOverlay() {
        try {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
                overlay.setAttribute('aria-hidden', 'false');
            }
        } catch (error) {
            console.error('Loading overlay gösterilemedi:', error);
        }
    },

    hideLoadingOverlay() {
        try {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = 'none';
                overlay.setAttribute('aria-hidden', 'true');
            }
        } catch (error) {
            console.error('Loading overlay gizlenemedi:', error);
        }
    },

    /**
     * URL hash'ine göre ilk açılacak sekmeyi ayarlar
     */
    handleInitialTabFromHash() {
        try {
            const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
            const defaultTab = 'dashboard';
            const targetTab = hash && document.getElementById(hash) ? hash : defaultTab;

            if (targetTab !== defaultTab) {
                this.switchTab(targetTab, { skipHistory: true });
            } else {
                // Varsayılan sekme için URL'i senkronla
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({ tab: defaultTab }, '', '#' + defaultTab);
                } else {
                    window.location.hash = '#' + defaultTab;
                }
            }
        } catch (error) {
            console.error('İlk sekme ayarlama hatası:', error);
        }
    },

    /**
     * Tab navigasyonu - Library kontrolü + sayfa/advert yenileme
     */
    switchTab(tabName, options = {}) {
        try {
            // Kısa bir loading efekti göster
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

            // Tab'a özel yüklemeler
            switch (tabName) {
                case 'library':
                    if (window.LibraryManager && typeof LibraryManager.loadLibrary === 'function') {
                        LibraryManager.loadLibrary();
                    } else {
                        console.warn('⚠️ LibraryManager henüz yüklenmedi');
                        setTimeout(() => {
                            if (window.LibraryManager) {
                                LibraryManager.loadLibrary();
                            } else {
                                console.error('❌ LibraryManager yüklenemedi');
                            }
                        }, 100);
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
            }

            // URL & history güncelle (SPA sayfa geçişi)
            if (!options.skipHistory) {
                if (window.history && window.history.pushState) {
                    window.history.pushState({ tab: tabName }, '', '#' + tabName);
                } else {
                    window.location.hash = '#' + tabName;
                }
            }

            // Kısa bir gecikmeden sonra loading'i kapat ve en üste kaydır
            setTimeout(() => {
                this.hideLoadingOverlay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 200);
        } catch (error) {
            console.error('Tab değiştirme hatası:', error);
            Utils.handleError(error, 'switchTab');
            this.hideLoadingOverlay();
        }
    },

    /**
     * Dashboard'ı günceller
     */
    updateDashboard() {
        try {
            const userData = StorageManager.getUserData();
            const stats = userData.stats;

            const totalTests = document.getElementById('totalTests');
            const totalQuestions = document.getElementById('totalQuestions');
            const successRate = document.getElementById('successRate');
            const avgTime = document.getElementById('avgTime');

            if (totalTests) totalTests.textContent = stats.totalTests;
            if (totalQuestions) totalQuestions.textContent = stats.totalQuestions;
            
            if (successRate) {
                const rate = stats.totalQuestions > 0 
                    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                    : 0;
                successRate.textContent = rate + '%';
            }
            
            if (avgTime) {
                const avg = stats.totalTests > 0 
                    ? Math.round(stats.totalTime / stats.totalTests)
                    : 0;
                avgTime.textContent = avg + 's';
            }

            // Son aktiviteleri göster
            this.updateActivityList();
        } catch (error) {
            console.error('Dashboard güncelleme hatası:', error);
            Utils.handleError(error, 'updateDashboard');
        }
    },

    /**
     * Aktivite listesini günceller
     */
    updateActivityList() {
        try {
            const activities = StorageManager.getActivities(5);
            const activityList = document.getElementById('activityList');
            
            if (!activityList) return;

            if (activities.length === 0) {
                const emptyText = t('dashboard.empty', 'Henüz aktivite yok. Test çözerek başla!');
                
                activityList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <p>${emptyText}</p>
                    </div>
                `;
                return;
            }

            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item" style="padding: 15px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${this.getActivityTitle(activity)}</strong>
                            <p style="margin: 5px 0 0; color: var(--text-secondary); font-size: 0.9rem;">
                                ${this.getActivityDescription(activity)}
                            </p>
                        </div>
                        <small style="color: var(--text-tertiary);">
                            ${Utils.formatDate(activity.timestamp)}
                        </small>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Aktivite listesi hatası:', error);
        }
    },

    /**
     * Aktivite başlığı
     */
    getActivityTitle(activity) {
        const titles = {
            'test_completed': '✅ ' + t('activity.testCompleted', 'Test Tamamlandı'),
            'test_saved': '💾 ' + t('activity.testSaved', 'Test Kaydedildi'),
            'test_exported': '📥 ' + t('activity.testExported', 'Test İndirildi'),
            'note_created': '📝 ' + t('activity.noteCreated', 'Not Oluşturuldu'),
            'level_up': '🎉 ' + t('activity.levelUp', 'Level Atlandı')
        };
        return titles[activity.type] || 'Aktivite';
    },

    /**
     * Aktivite açıklaması
     */
    getActivityDescription(activity) {
        switch (activity.type) {
            case 'test_completed':
                return `${activity.data.correctAnswers}/${activity.data.totalQuestions} doğru - %${activity.data.successRate} başarı`;
            case 'test_saved':
                return `${activity.data.title} - ${activity.data.questionCount} soru`;
            case 'test_exported':
                return `${activity.data.title} - ${activity.data.format.toUpperCase()}`;
            case 'note_created':
                return activity.data.title || 'Yeni not';
            case 'level_up':
                return `Level ${activity.data.level}!`;
            default:
                return '';
        }
    },

    /**
     * Leaderboard'ı günceller
     */
    updateLeaderboard() {
        try {
            const leaderboard = StorageManager.getLeaderboard(100);
            const tbody = document.getElementById('leaderboardBody');
            
            if (!tbody) return;

            if (leaderboard.length === 0) {
                const emptyText = t('leaderboard.empty', 'Henüz veri bulunmuyor');
                
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty-cell">${emptyText}</td>
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
                    <td><span style="color: var(--success);">${user.successRate}%</span></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Leaderboard güncelleme hatası:', error);
            Utils.handleError(error, 'updateLeaderboard');
        }
    },

    /**
     * Rank class
     */
    getRankClass(rank) {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return 'rank-default';
    },

    /**
     * Notları günceller
     */
    updateNotes() {
        try {
            const notes = StorageManager.getNotes();
            const notesList = document.getElementById('notesList');
            
            if (!notesList) return;

            if (notes.length === 0) {
                const emptyText = t('notes.empty', 'Henüz not eklemedin');
                
                notesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>${emptyText}</p>
                    </div>
                `;
                return;
            }

            notesList.innerHTML = notes.map(note => {
                const editText = t('notes.edit', 'Düzenle');
                const deleteText = t('notes.delete', 'Sil');
                
                return `
                    <div class="note-card">
                        <h3 class="note-title">${Utils.sanitizeHTML(note.title || 'Başlıksız Not')}</h3>
                        <p class="note-content">${Utils.sanitizeHTML(note.content || '')}</p>
                        <div class="note-meta">
                            <span>${Utils.formatDate(note.createdAt)}</span>
                            <div>
                                <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.editNote('${note.id}')">
                                    ${editText}
                                </button>
                                <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.deleteNote('${note.id}')">
                                    ${deleteText}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Notlar güncelleme hatası:', error);
            Utils.handleError(error, 'updateNotes');
        }
    },

    /**
     * Not ekler – ÖNCE modalı kullanır, yoksa prompt’a düşer
     */
    async addNote() {
        try {
            // Yeni modal sistemimiz varsa onu kullan
            if (window.NoteModal && typeof window.NoteModal.openCreate === 'function') {
                window.NoteModal.openCreate();
                return;
            }

            // Fallback: tarayıcı prompt (teoride artık kullanılmayacak)
            const titlePrompt = t('notes.titlePrompt', 'Not Başlığı:');
            const contentPrompt = t('notes.contentPrompt', 'Not İçeriği:');
            
            const title = prompt(titlePrompt);
            if (!title) return;

            const content = prompt(contentPrompt) || '';

            const note = {
                title: title,
                content: content
            };

            if (StorageManager.saveNote(note)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not ekleme hatası:', error);
            Utils.handleError(error, 'addNote');
        }
    },

    /**
     * Not düzenler – modal varsa onu kullanır
     */
    async editNote(noteId) {
        try {
            const notes = StorageManager.getNotes();
            const note = notes.find(n => n.id === noteId);
            
            if (!note) return;

            // Modal sistemimiz varsa onu kullan
            if (window.NoteModal && typeof window.NoteModal.openEdit === 'function') {
                window.NoteModal.openEdit(note);
                return;
            }

            // Fallback: eski prompt tabanlı düzenleme
            const titlePrompt = t('notes.titlePrompt', 'Not Başlığı:');
            const contentPrompt = t('notes.contentPrompt', 'Not İçeriği:');
            
            const title = prompt(titlePrompt, note.title);
            if (title === null) return;

            const content = prompt(contentPrompt, note.content);
            if (content === null) return;

            note.title = title;
            note.content = content;

            if (StorageManager.saveNote(note)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not düzenleme hatası:', error);
            Utils.handleError(error, 'editNote');
        }
    },

    /**
     * Not siler
     */
    async deleteNote(noteId) {
        try {
            const confirmMsg = t('notes.deleteConfirm', 'Bu notu silmek istediğinizden emin misiniz?');
            const confirmed = await Utils.confirm(confirmMsg);
            
            if (confirmed && StorageManager.deleteNote(noteId)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not silme hatası:', error);
            Utils.handleError(error, 'deleteNote');
        }
    },

    /**
     * Analiz sayfasını günceller
     */
    updateAnalysis() {
        try {
            const userData = StorageManager.getUserData();
            const stats = userData.stats;
            const analysisContent = document.getElementById('analysisContent');
            
            if (!analysisContent) return;

            if (stats.totalTests === 0) {
                const emptyText = t('analysis.empty', 'Analiz için daha fazla test çöz');
                
                analysisContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📈</div>
                        <p>${emptyText}</p>
                    </div>
                `;
                return;
            }

            const successRate = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
            const avgTime = Math.round(stats.totalTime / stats.totalTests);

            const avgSuccessText = t('analysis.avgSuccess', 'Ortalama Başarı');
            const avgTimeText = t('analysis.avgTime', 'Ortalama Süre');
            const totalCorrectText = t('analysis.totalCorrect', 'Toplam Doğru');
            const totalWrongText = t('analysis.totalWrong', 'Toplam Yanlış');
            const evaluationText = t('analysis.evaluation', 'Performans Değerlendirmesi');

            analysisContent.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">${successRate}%</div>
                        <div class="stat-label">${avgSuccessText}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-value">${Utils.formatTime(avgTime)}</div>
                        <div class="stat-label">${avgTimeText}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">${stats.correctAnswers}</div>
                        <div class="stat-label">${totalCorrectText}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">❌</div>
                        <div class="stat-value">${stats.wrongAnswers}</div>
                        <div class="stat-label">${totalWrongText}</div>
                    </div>
                </div>
                <div style="margin-top: 30px; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">
                    <h3>${evaluationText}</h3>
                    <p style="margin-top: 10px; line-height: 1.6;">
                        ${this.getPerformanceText(successRate)}
                    </p>
                </div>
            `;
        } catch (error) {
            console.error('Analiz güncelleme hatası:', error);
            Utils.handleError(error, 'updateAnalysis');
        }
    },

    /**
     * Performans metni (TR/EN)
     */
    getPerformanceText(successRate) {
        const lang =
            window.LanguageManager && LanguageManager.currentLang === 'en' ? 'en' : 'tr';

        if (lang === 'en') {
            if (successRate >= 90) {
                return '🌟 Excellent! Your performance is great. Keep it up!';
            } else if (successRate >= 75) {
                return '👏 Very good! Strong performance. With a bit more study you can improve even further.';
            } else if (successRate >= 60) {
                return '💪 You are doing well! With some more practice you can reach your goals.';
            } else if (successRate >= 40) {
                return '📚 You need to study more. Regular practice will help you improve.';
            } else {
                return '🎯 It is recommended to review the basics. Keep going step by step!';
            }
        } else {
            if (successRate >= 90) {
                return '🌟 Mükemmel! Harika bir performans gösteriyorsun. Böyle devam et!';
            } else if (successRate >= 75) {
                return '👏 Çok iyi! Başarılı bir performans. Biraz daha çalışarak daha da iyileştirebilirsin.';
            } else if (successRate >= 60) {
                return '💪 İyi gidiyorsun! Biraz daha pratik yaparsan hedeflerine ulaşabilirsin.';
            } else if (successRate >= 40) {
                return '📚 Daha fazla çalışma gerekiyor. Düzenli pratik yaparak gelişebilirsin.';
            } else {
                return '🎯 Temel konuları tekrar etmen önerilir. Yavaş yavaş ilerlemeye devam et!';
            }
        }
    },

    /**
     * Ayarları kaydeder - Validation ile
     */
    saveSettings(event) {
        event.preventDefault();

        try {
            const form = event.target;
            const usernameInput = form.username;
            const emailInput = form.email;

            // Validation
            const isUsernameValid = Utils.validateInput(usernameInput, 'username');
            const isEmailValid = Utils.validateInput(emailInput, 'email');

            if (!isUsernameValid || !isEmailValid) {
                return;
            }

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();

            const settings = {
                username: username,
                email: email,
                notifications: {
                    email: form.emailNotif.checked,
                    push: form.pushNotif.checked
                }
            };

            const userData = StorageManager.getUserData();
            userData.username = username;
            userData.email = email;
            userData.settings.notifications = settings.notifications;

            if (StorageManager.updateUserData(userData)) {
                const successMsg = t('msg.saved', 'Başarıyla kaydedildi!');
                Utils.showToast(successMsg, 'success');
                this.loadUserData();
            } else {
                const errorMsg = t('msg.error', 'Bir hata oluştu!');
                Utils.showToast(errorMsg, 'error');
            }
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
            Utils.handleError(error, 'saveSettings');
        }
    },

    /**
     * Ayarları sıfırlar
     */
    async resetSettings() {
        try {
            const confirmMsg = t(
                'settings.resetConfirm',
                'Ayarlar varsayılan değerlere dönecek. Emin misiniz?'
            );
            
            const confirmed = await Utils.confirm(confirmMsg);
            
            if (!confirmed) return;

            const userData = StorageManager.getUserData();
            const usernameEl = document.getElementById('username');
            const emailEl = document.getElementById('email');
            const emailNotifEl = document.getElementById('emailNotif');
            const pushNotifEl = document.getElementById('pushNotif');

            if (usernameEl) usernameEl.value = userData.username;
            if (emailEl) emailEl.value = userData.email || '';
            if (emailNotifEl) emailNotifEl.checked = true;
            if (pushNotifEl) pushNotifEl.checked = false;

            const infoMsg = t('msg.reset', 'Ayarlar sıfırlandı');
            Utils.showToast(infoMsg, 'info');
        } catch (error) {
            console.error('Ayar sıfırlama hatası:', error);
            Utils.handleError(error, 'resetSettings');
        }
    },

    /**
     * Dosya yükleme - Validation ile
     */
    handleFileUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            // Dosya boyutu kontrolü
            if (file.size > Config.FILE_UPLOAD.MAX_SIZE) {
                const errorMsg = t('error.fileSize', 'Dosya boyutu çok büyük');
                Utils.showToast(errorMsg, 'error');
                return;
            }

            // Dosya türü kontrolü
            const ext = file.name.split('.').pop().toLowerCase();
            if (!Config.FILE_UPLOAD.ALLOWED_TYPES.includes(ext)) {
                const errorMsg = t('error.fileType', 'Desteklenmeyen dosya türü');
                Utils.showToast(errorMsg, 'error');
                return;
            }

            // Dosya bilgisini göster
            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>📄</span>
                        <div>
                            <div><strong>${Utils.sanitizeHTML(file.name)}</strong></div>
                            <small style="color: var(--text-secondary);">${Utils.formatFileSize(file.size)}</small>
                        </div>
                    </div>
                `;
            }

            // AI için ek notlara dosya bilgisini geçir
            const notesInput = document.getElementById('testNotes');
            if (notesInput) {
                const baseText = notesInput.value ? notesInput.value + ' ' : '';
                notesInput.value = `${baseText}Bu test için yüklenen dosya: ${file.name} (${Utils.formatFileSize(file.size)}).`;
            }

            const successMsg = t('msg.fileUploaded', 'Dosya yüklendi!');
            Utils.showToast(successMsg, 'success');
        } catch (error) {
            console.error('Dosya yükleme hatası:', error);
            Utils.handleError(error, 'handleFileUpload');
        }
    },

    /**
     * Event listener'ları ekler
     */
    attachEventListeners() {
        try {
            // LOGO → DASHBOARD (ana sayfa)
            let logoLink = document.getElementById('logoLink');
            if (!logoLink) {
                logoLink = document.querySelector('.header .logo');
            }
            if (logoLink) {
                logoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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

            // Test başlığını AI konu alanına senkronize et
            const testTitleInput = document.getElementById('testTitle');
            if (testTitleInput) {
                testTitleInput.addEventListener('input', () => {
                    const topicInput = document.getElementById('testTopic');
                    if (topicInput) {
                        topicInput.value = testTitleInput.value;
                    }
                });
            }

            // Not ekleme butonu → App.addNote (içeride modal açıyor)
            const addNoteBtn = document.getElementById('addNoteBtn');
            if (addNoteBtn) {
                addNoteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addNote();
                });
            }

            // Tema değiştir - HTML'den erişim için
            window.themeManager = this.themeManager;

            console.log('✅ Event listener\'lar eklendi');
        } catch (error) {
            console.error('Event listener hatası:', error);
            Utils.handleError(error, 'attachEventListeners');
        }
    }
};

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.handleInitialTabFromHash();

    // TestifyAI'yi başlat (varsa)
    try {
        if (typeof TestifyAI !== 'undefined' && TestifyAI && typeof TestifyAI.init === 'function') {
            TestifyAI.init();
            window.TestifyAI = TestifyAI;
            window.aiChat = TestifyAI;
        }
    } catch (e) {
        console.error('TestifyAI init hatası (HTML):', e);
    }
});

// Export
window.App = App;

// Tarayıcı geri/ileri butonları ile sekme senkronizasyonu
window.addEventListener('popstate', (event) => {
    try {
        const stateTab = event.state && event.state.tab;
        const hashTab = window.location.hash ? window.location.hash.replace('#', '') : null;
        const targetTab = stateTab || hashTab || 'dashboard';

        if (document.getElementById(targetTab)) {
            App.switchTab(targetTab, { skipHistory: true });
        }
    } catch (error) {
        console.error('popstate navigation error:', error);
    }
});

// Eski örnekteki gibi kullanmak istersen: SPA içinde sekme değiştirme helper'ı
window.navigateTo = function(tabName) {
    if (!tabName) return;
    if (!document.getElementById(tabName)) return;
    App.switchTab(tabName);
};

// Basit oturum takibi (isteğe bağlı log)
(function() {
    const sessionStart = Date.now();
    window.addEventListener('beforeunload', () => {
        const duration = Math.round((Date.now() - sessionStart) / 1000);
        console.log('📊 Oturum süresi:', duration, 'sn');
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('📊 Kullanıcı sayfadan ayrıldı');
        } else {
            console.log('📊 Kullanıcı sayfaya geri döndü');
        }
    });
})();

/* === NOT EKLE / DÜZENLE MODALI ===
   HTML tarafında:
   - #noteModalOverlay
   - #noteModal
   - #noteTitleInput
   - #noteContentInput
   - #noteCancelBtn
   - #noteSaveBtn
   elementleri olmalı (sana verdiğim HTML ile uyumlu) */
(function () {
    'use strict';

    let initialized = false;
    let overlay, modal, titleInput, contentInput, cancelBtn, saveBtn, modalTitle, messageEl;
    let mode = 'create'; // 'create' | 'edit'
    let editingNoteId = null;

    function init() {
        if (initialized) return;

        overlay      = document.getElementById('noteModalOverlay');
        modal        = document.getElementById('noteModal');
        titleInput   = document.getElementById('noteTitleInput');
        contentInput = document.getElementById('noteContentInput');
        cancelBtn    = document.getElementById('noteCancelBtn');
        saveBtn      = document.getElementById('noteSaveBtn');
        modalTitle   = document.getElementById('noteModalTitle');
        messageEl    = modal ? modal.querySelector('.confirm-dialog-message') : null;

        if (!overlay || !modal || !titleInput || !contentInput || !cancelBtn || !saveBtn) {
            // Not modalı HTML'de yoksa sessizce çık
            return;
        }

        // Kapat butonu
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });

        // Kaydet butonu
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveNoteFromModal();
        });

        // Overlay boş alanına tıklayınca kapat
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Title input'ta Enter → kaydet
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveNoteFromModal();
            }
        });

        initialized = true;
    }

    function openCreate() {
        if (!initialized) init();
        if (!overlay) return;

        mode = 'create';
        editingNoteId = null;

        if (modalTitle) {
            modalTitle.textContent = t('notes.newNoteTitle', 'Yeni Not');
        }
        if (messageEl) {
            messageEl.textContent = t(
                'notes.newNoteMessage',
                'Notun için bir başlık ve içerik ekle.'
            );
        }

        titleInput.value = '';
        contentInput.value = '';

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');

        setTimeout(() => titleInput.focus(), 10);
    }

    function openEdit(note) {
        if (!initialized) init();
        if (!overlay || !note) return;

        mode = 'edit';
        editingNoteId = note.id;

        if (modalTitle) {
            modalTitle.textContent = t('notes.editNoteTitle', 'Notu Düzenle');
        }
        if (messageEl) {
            messageEl.textContent = t(
                'notes.editNoteMessage',
                'Not başlığını ve içeriğini güncelleyebilirsin.'
            );
        }

        titleInput.value = note.title || '';
        contentInput.value = note.content || '';

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');

        setTimeout(() => titleInput.focus(), 10);
    }

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        mode = 'create';
        editingNoteId = null;
    }

    function saveNoteFromModal() {
        if (!initialized || !overlay) return;

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title) {
            titleInput.focus();
            return;
        }

        let note = {
            title,
            content
        };

        // Düzenleme modundaysa id'yi ekle
        if (mode === 'edit' && editingNoteId) {
            note.id = editingNoteId;
        }

        if (StorageManager.saveNote(note)) {
            // Aktivite kaydı (özellikle yeni not için)
            try {
                StorageManager.saveActivity({
                    type: 'note_created',
                    data: { title },
                    timestamp: Date.now()
                });
            } catch (e) {
                console.warn('Aktivite kaydı yapılamadı:', e);
            }

            if (window.App && typeof window.App.updateNotes === 'function') {
                window.App.updateNotes();
            }

            closeModal();
        }
    }

    // DOM yüklendikten sonra modalı hazırla
    document.addEventListener('DOMContentLoaded', init);

    // Global erişim için
    window.NoteModal = {
        openCreate,
        openEdit,
        close: closeModal
    };
})();
