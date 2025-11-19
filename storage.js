/**
 * TESTIFY STORAGE MANAGER
 * LocalStorage yönetimi ve veri işlemleri
 */

'use strict';

const StorageManager = {
    /**
     * Dahili anahtarlar (Config.STORAGE_KEYS dışında kullanılan)
     */
    INTERNAL_KEYS: {
        AI_CURRENT_TEST: 'testify_current_test',
        AI_LIBRARY: 'testify_test_library_v1'
    },

    /**
     * Kullanıcı verilerini başlatır veya normalize eder
     */
    initializeUser() {
        let userData = Utils.getFromStorage(Config.STORAGE_KEYS.USER_DATA);

        // Yeni kullanıcı oluştur
        if (!userData || typeof userData !== 'object') {
            userData = {
                id: Utils.generateId(),
                username: 'user' + Math.floor(Math.random() * 10000),
                email: '',
                avatar: '',
                createdAt: Date.now(),
                lastLogin: Date.now(),
                stats: {
                    totalTests: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    wrongAnswers: 0,
                    totalTime: 0,
                    xp: 0,
                    level: 1,
                    streak: 0,
                    lastTestDate: null,
                    rank: null
                },
                settings: {
                    theme: Config.THEME && Config.THEME.DEFAULT ? Config.THEME.DEFAULT : 'light',
                    notifications: {
                        email: true,
                        push: false
                    },
                    privacy: {
                        showInLeaderboard: true,
                        shareProgress: false
                    }
                }
            };

            Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
            return userData;
        }

        // Backward compatibility: eksik alanları doldur
        if (!userData.stats || typeof userData.stats !== 'object') {
            userData.stats = {};
        }
        userData.stats = Object.assign({
            totalTests: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalTime: 0,
            xp: 0,
            level: 1,
            streak: 0,
            lastTestDate: null,
            rank: null
        }, userData.stats);

        if (!userData.settings || typeof userData.settings !== 'object') {
            userData.settings = {};
        }
        userData.settings = Object.assign({
            theme: (Config.THEME && Config.THEME.DEFAULT) ? Config.THEME.DEFAULT : 'light',
            notifications: {
                email: true,
                push: false
            },
            privacy: {
                showInLeaderboard: true,
                shareProgress: false
            }
        }, userData.settings);

        if (!userData.settings.notifications) {
            userData.settings.notifications = { email: true, push: false };
        }
        if (!userData.settings.privacy) {
            userData.settings.privacy = { showInLeaderboard: true, shareProgress: false };
        }

        userData.lastLogin = Date.now();
        Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        return userData;
    },

    /**
     * Kullanıcı verilerini getirir (her zaman normalize edilmiş halde döner)
     * @returns {Object} - Kullanıcı verisi
     */
    getUserData() {
        const data = Utils.getFromStorage(Config.STORAGE_KEYS.USER_DATA);
        if (!data || typeof data !== 'object') {
            return this.initializeUser();
        }
        // normalize etmek için initializeUser'ı yeniden çalıştır
        return this.initializeUser();
    },

    /**
     * Kullanıcı verilerini günceller (derin birleştirme ile)
     * @param {Object} updates - Güncellenecek veriler
     * @returns {boolean} - Başarılı mı?
     */
    updateUserData(updates) {
        try {
            const userData = this.getUserData();

            const merged = {
                ...userData,
                ...updates
            };

            // stats & settings için derin merge
            if (updates && updates.stats) {
                merged.stats = {
                    ...userData.stats,
                    ...updates.stats
                };
            }
            if (updates && updates.settings) {
                merged.settings = {
                    ...userData.settings,
                    ...updates.settings
                };
            }

            return Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, merged);
        } catch (error) {
            console.error('Kullanıcı verisi güncelleme hatası:', error);
            return false;
        }
    },

    /**
     * Kullanıcı istatistiklerini günceller
     * @param {Object} stats - İstatistikler (patch)
     * @returns {boolean} - Başarılı mı?
     */
    updateUserStats(stats) {
        try {
            const userData = this.getUserData();
            userData.stats = { ...userData.stats, ...stats };

            // Level hesaplama
            const newLevel = this.calculateLevel(userData.stats.xp);
            if (newLevel > userData.stats.level) {
                userData.stats.level = newLevel;
                Utils.showToast(`🎉 Level ${newLevel}! Tebrikler!`, 'success');
            }

            // Streak hesaplama
            this.updateStreak(userData);

            return Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        } catch (error) {
            console.error('İstatistik güncelleme hatası:', error);
            return false;
        }
    },

    /**
     * Level hesaplar
     * @param {number} xp - Toplam XP
     * @returns {number} - Level
     */
    calculateLevel(xp) {
        try {
            const base = Config.LEVELING.LEVEL_UP_BASE;
            const multiplier = Config.LEVELING.LEVEL_UP_MULTIPLIER;

            let level = 1;
            let requiredXP = base;

            while (xp >= requiredXP) {
                level++;
                requiredXP = Math.floor(base * Math.pow(multiplier, level - 1));
            }

            return level;
        } catch (e) {
            // Config.LEVELING tanımlı değilse en basit mantık
            if (typeof xp !== 'number' || xp <= 0) return 1;
            if (xp < 100) return 1;
            if (xp < 250) return 2;
            if (xp < 500) return 3;
            if (xp < 1000) return 4;
            return 5;
        }
    },

    /**
     * Streak (seri) günceller
     * @param {Object} userData - Kullanıcı verisi
     */
    updateStreak(userData) {
        const today = new Date().setHours(0, 0, 0, 0);
        const lastTestDate = userData.stats.lastTestDate
            ? new Date(userData.stats.lastTestDate).setHours(0, 0, 0, 0)
            : null;

        if (!lastTestDate) {
            userData.stats.streak = 1;
        } else {
            const daysDiff = Math.floor((today - lastTestDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Aynı gün - değişiklik yok
            } else if (daysDiff === 1) {
                // Ardışık gün - streak artır
                userData.stats.streak++;
            } else {
                // Seri kırıldı
                userData.stats.streak = 1;
            }
        }

        userData.stats.lastTestDate = Date.now();
    },

    /**
     * Test sonucunu kaydeder
     * @param {Object} result - Test sonucu
     * @returns {boolean} - Başarılı mı?
     */
    saveTestResult(result) {
        try {
            const userData = this.getUserData();

            // İstatistikleri güncelle
            const stats = { ...userData.stats };
            stats.totalTests++;
            stats.totalQuestions += result.totalQuestions;
            stats.correctAnswers += result.correctAnswers;
            stats.wrongAnswers += result.wrongAnswers;
            stats.totalTime += result.time;

            // XP hesapla
            let earnedXP = Config.LEVELING.XP_PER_TEST;
            earnedXP += result.correctAnswers * Config.LEVELING.XP_PER_CORRECT;

            // Bonus XP
            if (result.successRate >= 80) {
                earnedXP += 20; // Yüksek başarı bonusu
            }

            stats.xp += earnedXP;

            // Güncelle
            this.updateUserStats(stats);

            // Aktivite kaydet
            this.saveActivity({
                type: 'test_completed',
                data: result,
                timestamp: Date.now()
            });

            // Leaderboard güncelle
            this.updateLeaderboard();

            Utils.showToast(`+${earnedXP} XP kazandın!`, 'success');

            return true;
        } catch (error) {
            console.error('Test sonucu kaydetme hatası:', error);
            return false;
        }
    },

    /**
     * Aktivite kaydeder
     * @param {Object} activity - Aktivite
     */
    saveActivity(activity) {
        try {
            let activities = Utils.getFromStorage(Config.STORAGE_KEYS.ACTIVITY, []);
            if (!Array.isArray(activities)) {
                activities = [];
            }
            activities.unshift(activity);

            // Son 50 aktiviteyi tut
            if (activities.length > 50) {
                activities = activities.slice(0, 50);
            }

            Utils.setToStorage(Config.STORAGE_KEYS.ACTIVITY, activities);
        } catch (error) {
            console.error('Aktivite kaydetme hatası:', error);
        }
    },

    /**
     * Aktiviteleri getirir
     * @param {number} limit - Limit
     * @returns {Array} - Aktiviteler
     */
    getActivities(limit = 10) {
        const activities = Utils.getFromStorage(Config.STORAGE_KEYS.ACTIVITY, []);
        if (!Array.isArray(activities)) return [];
        return activities.slice(0, limit);
    },

    /**
     * Not kaydeder
     * @param {Object} note - Not
     * @returns {boolean} - Başarılı mı?
     */
    saveNote(note) {
        try {
            const notes = this.getNotes();

            if (note.id) {
                // Güncelleme
                const index = notes.findIndex(n => n.id === note.id);
                if (index !== -1) {
                    notes[index] = { ...notes[index], ...note, updatedAt: Date.now() };
                }
            } else {
                // Yeni not
                note.id = Utils.generateId();
                note.createdAt = Date.now();
                note.updatedAt = Date.now();
                notes.unshift(note);
            }

            Utils.setToStorage(Config.STORAGE_KEYS.NOTES, notes);
            if (Config.SUCCESS && Config.SUCCESS.SAVED) {
                Utils.showToast(Config.SUCCESS.SAVED, 'success');
            }
            return true;
        } catch (error) {
            console.error('Not kaydetme hatası:', error);
            if (Config.ERRORS && Config.ERRORS.GENERIC) {
                Utils.showToast(Config.ERRORS.GENERIC, 'error');
            }
            return false;
        }
    },

    /**
     * Notları getirir
     * @returns {Array} - Notlar
     */
    getNotes() {
        const notes = Utils.getFromStorage(Config.STORAGE_KEYS.NOTES, []);
        return Array.isArray(notes) ? notes : [];
    },

    /**
     * Not siler
     * @param {string} noteId - Not ID
     * @returns {boolean} - Başarılı mı?
     */
    deleteNote(noteId) {
        try {
            let notes = this.getNotes();
            notes = notes.filter(n => n.id !== noteId);
            Utils.setToStorage(Config.STORAGE_KEYS.NOTES, notes);
            if (Config.SUCCESS && Config.SUCCESS.DELETED) {
                Utils.showToast(Config.SUCCESS.DELETED, 'success');
            }
            return true;
        } catch (error) {
            console.error('Not silme hatası:', error);
            if (Config.ERRORS && Config.ERRORS.GENERIC) {
                Utils.showToast(Config.ERRORS.GENERIC, 'error');
            }
            return false;
        }
    },

    /**
     * Leaderboard günceller
     */
    updateLeaderboard() {
        try {
            const userData = this.getUserData();
            let leaderboard = Utils.getFromStorage(Config.STORAGE_KEYS.LEADERBOARD, []);
            if (!Array.isArray(leaderboard)) leaderboard = [];

            // Kullanıcı varsa güncelle, yoksa ekle
            const existingIndex = leaderboard.findIndex(u => u.id === userData.id);

            const entry = {
                id: userData.id,
                username: userData.username,
                xp: userData.stats.xp,
                level: userData.stats.level,
                totalTests: userData.stats.totalTests,
                successRate: userData.stats.totalQuestions > 0
                    ? Math.round((userData.stats.correctAnswers / userData.stats.totalQuestions) * 100)
                    : 0,
                updatedAt: Date.now()
            };

            if (existingIndex !== -1) {
                leaderboard[existingIndex] = entry;
            } else {
                leaderboard.push(entry);
            }

            // XP'ye göre sırala
            leaderboard.sort((a, b) => b.xp - a.xp);

            // Max entry sayısı ile sınırla
            const maxEntries = (Config.LEADERBOARD && Config.LEADERBOARD.MAX_ENTRIES)
                ? Config.LEADERBOARD.MAX_ENTRIES
                : 100;
            if (leaderboard.length > maxEntries) {
                leaderboard = leaderboard.slice(0, maxEntries);
            }

            // Sıra numaralarını güncelle
            leaderboard.forEach((e, index) => {
                e.rank = index + 1;
            });

            Utils.setToStorage(Config.STORAGE_KEYS.LEADERBOARD, leaderboard);

            // Kullanıcının sırasını güncelle
            const userEntry = leaderboard.find(u => u.id === userData.id);
            if (userEntry) {
                this.updateUserData({
                    stats: {
                        ...userData.stats,
                        rank: userEntry.rank
                    }
                });
            }
        } catch (error) {
            console.error('Leaderboard güncelleme hatası:', error);
        }
    },

    /**
     * Leaderboard getirir
     * @param {number} limit - Limit
     * @returns {Array} - Leaderboard
     */
    getLeaderboard(limit = 100) {
        const leaderboard = Utils.getFromStorage(Config.STORAGE_KEYS.LEADERBOARD, []);
        if (!Array.isArray(leaderboard)) return [];
        return leaderboard.slice(0, limit);
    },

    /**
     * Quiz durumunu kaydeder
     * @param {Object} state - Quiz durumu
     */
    saveQuizState(state) {
        try {
            Utils.setToStorage(Config.STORAGE_KEYS.QUIZ_STATE, {
                ...state,
                savedAt: Date.now()
            });
        } catch (error) {
            console.error('Quiz durumu kaydedilemedi:', error);
        }
    },

    /**
     * Quiz durumunu getirir
     * @returns {Object|null} - Quiz durumu
     */
    getQuizState() {
        const state = Utils.getFromStorage(Config.STORAGE_KEYS.QUIZ_STATE);

        // 1 saatten eski durumları temizle
        if (state && state.savedAt && Date.now() - state.savedAt > 3600000) {
            this.clearQuizState();
            return null;
        }

        return state || null;
    },

    /**
     * Quiz durumunu temizler
     */
    clearQuizState() {
        try {
            Utils.removeFromStorage(Config.STORAGE_KEYS.QUIZ_STATE);
        } catch (error) {
            console.error('Quiz durumu temizlenemedi:', error);
        }
    },

    /**
     * Ayarları kaydeder
     * @param {Object} settings - Ayarlar
     * @returns {boolean} - Başarılı mı?
     */
    saveSettings(settings) {
        try {
            const userData = this.getUserData();
            userData.settings = { ...userData.settings, ...settings };
            return Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
            return false;
        }
    },

    /**
     * Tüm verileri sıfırlar (Dikkatli kullanın!)
     * @returns {Promise<boolean>} - Başarılı mı?
     */
    async resetAllData() {
        const confirmed = await Utils.confirm(
            'Tüm veriler silinecek! Bu işlem geri alınamaz. Emin misiniz?'
        );

        if (!confirmed) return false;

        try {
            Object.values(Config.STORAGE_KEYS).forEach(key => {
                Utils.removeFromStorage(key);
            });

            // Dahili anahtarları da temizle
            Object.values(this.INTERNAL_KEYS).forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (_) {}
            });

            // Yeni kullanıcı oluştur
            this.initializeUser();

            Utils.showToast('Tüm veriler sıfırlandı.', 'success');

            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            return true;
        } catch (error) {
            console.error('Veri sıfırlama hatası:', error);
            if (Config.ERRORS && Config.ERRORS.GENERIC) {
                Utils.showToast(Config.ERRORS.GENERIC, 'error');
            }
            return false;
        }
    },

    /**
     * Verileri dışa aktar (JSON)
     * @returns {string|null} - JSON string
     */
    exportData() {
        try {
            const data = {
                version: Config.APP_VERSION,
                exportedAt: Date.now(),
                userData: this.getUserData(),
                notes: this.getNotes(),
                activities: this.getActivities(50),
                leaderboard: this.getLeaderboard(100)
            };

            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Veri dışa aktarma hatası:', error);
            return null;
        }
    },

    /**
     * Verileri içe aktar (JSON)
     * @param {string} jsonData - JSON string
     * @returns {Promise<boolean>} - Başarılı mı?
     */
    async importData(jsonData) {
        const confirmed = await Utils.confirm(
            'Mevcut veriler silinip yeni veriler yüklenecek. Emin misiniz?'
        );

        if (!confirmed) return false;

        try {
            const data = JSON.parse(jsonData);

            // Versiyon kontrolü (sadece bilgilendirme amaçlı)
            if (data.version && data.version !== Config.APP_VERSION) {
                Utils.showToast('Uyumsuz veri versiyonu! Yine de yükleniyor...', 'warning');
            }

            // Verileri yükle
            if (data.userData) {
                Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, data.userData);
            }
            if (data.notes) {
                Utils.setToStorage(Config.STORAGE_KEYS.NOTES, data.notes);
            }
            if (data.activities) {
                Utils.setToStorage(Config.STORAGE_KEYS.ACTIVITY, data.activities);
            }
            if (data.leaderboard) {
                Utils.setToStorage(Config.STORAGE_KEYS.LEADERBOARD, data.leaderboard);
            }

            Utils.showToast('Veriler başarıyla yüklendi!', 'success');

            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            return true;
        } catch (error) {
            console.error('Veri içe aktarma hatası:', error);
            Utils.showToast('Geçersiz veri formatı!', 'error');
            return false;
        }
    },

    /**
     * 🔹 AI ile oluşturulan testleri Library için sakla (24 saat TTL)
     * Tamamen opsiyonel yardımcı; LibraryManager kullanabilir.
     * @param {Object} testData
     */
    saveTestToLibrary(testData) {
        try {
            if (!testData) return;
            const now = Date.now();
            const ttl = 24 * 60 * 60 * 1000; // 24 saat

            const libraryRaw = localStorage.getItem(this.INTERNAL_KEYS.AI_LIBRARY);
            let library = [];
            if (libraryRaw) {
                try {
                    library = JSON.parse(libraryRaw);
                    if (!Array.isArray(library)) library = [];
                } catch (_) {
                    library = [];
                }
            }

            const entry = {
                id: testData.id || Utils.generateId(),
                title: testData.title || 'AI Test',
                description: testData.description || '',
                questionCount: Array.isArray(testData.questions) ? testData.questions.length : 0,
                createdAt: now,
                expiresAt: now + ttl,
                data: testData
            };

            library.unshift(entry);

            // En fazla 20 test tut
            if (library.length > 20) {
                library = library.slice(0, 20);
            }

            localStorage.setItem(this.INTERNAL_KEYS.AI_LIBRARY, JSON.stringify(library));
        } catch (error) {
            console.error('AI test library kaydetme hatası:', error);
        }
    },

    /**
     * Library'deki testleri getir (süresi geçenleri temizler)
     */
    getLibraryTests() {
        try {
            const raw = localStorage.getItem(this.INTERNAL_KEYS.AI_LIBRARY);
            if (!raw) return [];

            let library = JSON.parse(raw);
            if (!Array.isArray(library)) return [];

            const now = Date.now();
            library = library.filter(item => !item.expiresAt || item.expiresAt > now);

            // Temizlenmiş halini geri yaz
            localStorage.setItem(this.INTERNAL_KEYS.AI_LIBRARY, JSON.stringify(library));

            return library;
        } catch (error) {
            console.error('AI test library okuma hatası:', error);
            return [];
        }
    },

    /**
     * Belirli bir library testini sil
     */
    deleteLibraryTest(id) {
        try {
            const raw = localStorage.getItem(this.INTERNAL_KEYS.AI_LIBRARY);
            if (!raw) return;
            let library = JSON.parse(raw);
            if (!Array.isArray(library)) return;

            library = library.filter(item => item.id !== id);
            localStorage.setItem(this.INTERNAL_KEYS.AI_LIBRARY, JSON.stringify(library));
        } catch (error) {
            console.error('AI test library silme hatası:', error);
        }
    }
};

// Global erişim
window.StorageManager = StorageManager;
