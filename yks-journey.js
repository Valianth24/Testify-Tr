// yks-journey.js
// YKS Yolculuğum – Dashboard + Onboarding (v1)
// Tamamen #journey sekmesine gömülü çalışır

(function () {
    'use strict';

    const STORAGE_KEY = 'yksJourney.v1';

    // Güvenli i18n
    const i18n = (typeof window !== 'undefined' && typeof window.t === 'function')
        ? window.t
        : function (_key, fallback) { return fallback || _key; };

    // Basit storage helper
    function loadStateFromStorage() {
        try {
            // Önce Utils varsa onu kullan
            if (typeof window !== 'undefined' &&
                window.Utils &&
                typeof Utils.getFromStorage === 'function') {
                return Utils.getFromStorage(STORAGE_KEY, null);
            }

            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return null;
                return JSON.parse(raw);
            }
        } catch (e) {
            console.error('YKSJourney storage load error:', e);
        }
        return null;
    }

    function saveStateToStorage(state) {
        try {
            if (typeof window !== 'undefined' &&
                window.Utils &&
                typeof Utils.setToStorage === 'function') {
                Utils.setToStorage(STORAGE_KEY, state);
                return;
            }

            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            }
        } catch (e) {
            console.error('YKSJourney storage save error:', e);
        }
    }

    function deepMerge(base, patch) {
        const result = Array.isArray(base) ? [...base] : { ...base };
        if (!patch || typeof patch !== 'object') return result;

        Object.keys(patch).forEach((key) => {
            const val = patch[key];
            if (val && typeof val === 'object' && !Array.isArray(val)) {
                result[key] = deepMerge(base[key] || {}, val);
            } else {
                result[key] = val;
            }
        });

        return result;
    }

    // Default state
    const defaultState = {
        configured: false,
        examName: 'YKS',
        examDate: null,            // ISO string: "2026-06-20"
        targetDepartment: '',
        dailyQuestionGoal: 80,
        weakSubjects: [],          // ['matematik', 'geometri', ...]
        studySlots: [
            { id: 'morning', label: 'Sabah', minutes: 90 },
            { id: 'afternoon', label: 'Öğlen', minutes: 90 },
            { id: 'night', label: 'Akşam', minutes: 120 }
        ]
    };

    function getDaysLeft(examDate) {
        if (!examDate) return null;
        try {
            const today = new Date();
            const target = new Date(examDate);
            // Saat farkı saçmalamasın diye gün bazında hesap
            const diffMs = target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (e) {
            console.error('daysLeft calc error:', e);
            return null;
        }
    }

    function getUserStats() {
        try {
            if (typeof window !== 'undefined' &&
                window.StorageManager &&
                typeof StorageManager.getUserData === 'function') {
                const userData = StorageManager.getUserData();
                return userData && userData.stats ? userData.stats : null;
            }
        } catch (e) {
            console.warn('YKSJourney user stats error:', e);
        }
        return null;
    }

    const YKSJourneyManager = {
        _initialized: false,
        _root: null,
        _state: null,

        init(rootEl) {
            try {
                const root = rootEl || document.getElementById('journeyContent');
                if (!root) {
                    console.error('YKSJourney: #journeyContent bulunamadı');
                    return;
                }

                this._root = root;

                // State yükle
                const stored = loadStateFromStorage();
                this._state = deepMerge(defaultState, stored || {});

                // İlk render
                this.render();

                this._initialized = true;
                console.log('✅ YKSJourneyManager hazır');
            } catch (e) {
                console.error('YKSJourney init hatası:', e);
                if (window.Utils && typeof Utils.handleError === 'function') {
                    Utils.handleError(e, 'YKSJourney.init');
                }
            }
        },

        // Ana render: onboarding mi dashboard mu?
        render() {
            if (!this._root) return;

            if (!this._state.configured) {
                this.renderOnboarding();
            } else {
                this.renderDashboard();
            }
        },

        // 1) ONBOARDING EKRANI
        renderOnboarding() {
            const s = this._state;
            const todayIso = new Date().toISOString().slice(0, 10);

            this._root.innerHTML = `
                <div class="yks-journey-widget">
                    <div class="yks-widget-card yks-onboarding-card">
                        <div class="yks-widget-header">
                            <div>
                                <p class="yks-widget-eyebrow">YKS Yolculuğuna Başla</p>
                                <h1 class="yks-widget-title">Hedefini ve planını birlikte oluşturalım.</h1>
                                <p class="yks-widget-subtitle">
                                    Sadece birkaç bilgiyle sana özel YKS panelini hazırlayacağım.
                                </p>
                            </div>
                        </div>

                        <div class="yks-widget-body">
                            <form id="yksOnboardingForm" class="yks-form-grid">
                                <div class="yks-form-group">
                                    <label class="yks-label" for="yksExamName">
                                        Sınav
                                    </label>
                                    <input
                                        id="yksExamName"
                                        type="text"
                                        class="yks-input"
                                        value="${s.examName || 'YKS'}"
                                        placeholder="Örn: YKS"
                                    />
                                </div>

                                <div class="yks-form-group">
                                    <label class="yks-label" for="yksExamDate">
                                        Sınav Tarihi
                                    </label>
                                    <input
                                        id="yksExamDate"
                                        type="date"
                                        class="yks-input"
                                        min="${todayIso}"
                                        value="${s.examDate ? s.examDate.slice(0, 10) : ''}"
                                    />
                                </div>

                                <div class="yks-form-group">
                                    <label class="yks-label" for="yksTargetDepartment">
                                        Hedef Bölüm (opsiyonel)
                                    </label>
                                    <input
                                        id="yksTargetDepartment"
                                        type="text"
                                        class="yks-input"
                                        value="${s.targetDepartment || ''}"
                                        placeholder="Örn: Tıp, Hukuk, Psikoloji..."
                                    />
                                </div>

                                <div class="yks-form-group">
                                    <label class="yks-label" for="yksDailyGoal">
                                        Günlük soru hedefin
                                    </label>
                                    <div class="yks-input-with-hint">
                                        <input
                                            id="yksDailyGoal"
                                            type="number"
                                            class="yks-input"
                                            min="10"
                                            max="1000"
                                            step="10"
                                            value="${s.dailyQuestionGoal || 80}"
                                        />
                                        <span class="yks-input-hint">soru / gün</span>
                                    </div>
                                </div>

                                <div class="yks-form-group yks-form-group-full">
                                    <label class="yks-label">
                                        Şu an en zayıf olduğun alanlar
                                    </label>
                                    <div class="yks-chip-group" id="yksWeakSubjects">
                                        ${this.renderWeakSubjectChip('turkce', 'Türkçe')}
                                        ${this.renderWeakSubjectChip('matematik', 'Matematik')}
                                        ${this.renderWeakSubjectChip('geometri', 'Geometri')}
                                        ${this.renderWeakSubjectChip('fizik', 'Fizik')}
                                        ${this.renderWeakSubjectChip('kimya', 'Kimya')}
                                        ${this.renderWeakSubjectChip('biyoloji', 'Biyoloji')}
                                        ${this.renderWeakSubjectChip('tarih', 'Tarih')}
                                        ${this.renderWeakSubjectChip('cografya', 'Coğrafya')}
                                        ${this.renderWeakSubjectChip('felsefe', 'Felsefe')}
                                        ${this.renderWeakSubjectChip('dinkulturu', 'Din Kültürü')}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="yks-widget-footer">
                            <button class="btn btn-secondary" id="yksSkipSetupBtn">
                                Daha sonra ayarlayacağım
                            </button>
                            <button class="btn btn-primary" id="yksSaveSetupBtn">
                                Planı Kaydet ve Devam Et
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.bindOnboardingEvents();
        },

        renderWeakSubjectChip(key, label) {
            const active = this._state.weakSubjects.includes(key);
            return `
                <button
                    type="button"
                    class="yks-chip ${active ? 'yks-chip-active' : ''}"
                    data-subject="${key}"
                >
                    <span>${label}</span>
                </button>
            `;
        },

        bindOnboardingEvents() {
            const root = this._root;
            if (!root) return;

            const chipContainer = root.querySelector('#yksWeakSubjects');
            const saveBtn = root.querySelector('#yksSaveSetupBtn');
            const skipBtn = root.querySelector('#yksSkipSetupBtn');

            if (chipContainer) {
                chipContainer.addEventListener('click', (e) => {
                    const btn = e.target.closest('.yks-chip');
                    if (!btn) return;

                    const key = btn.getAttribute('data-subject');
                    if (!key) return;

                    const idx = this._state.weakSubjects.indexOf(key);
                    if (idx === -1) {
                        this._state.weakSubjects.push(key);
                        btn.classList.add('yks-chip-active');
                    } else {
                        this._state.weakSubjects.splice(idx, 1);
                        btn.classList.remove('yks-chip-active');
                    }
                });
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSaveOnboarding();
                });
            }

            if (skipBtn) {
                skipBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._state.configured = true;
                    saveStateToStorage(this._state);
                    this.renderDashboard();
                });
            }
        },

        handleSaveOnboarding() {
            const root = this._root;
            if (!root) return;

            const examNameEl = root.querySelector('#yksExamName');
            const examDateEl = root.querySelector('#yksExamDate');
            const targetDeptEl = root.querySelector('#yksTargetDepartment');
            const dailyGoalEl = root.querySelector('#yksDailyGoal');

            const examName = (examNameEl && examNameEl.value.trim()) || 'YKS';
            const examDate = examDateEl && examDateEl.value ? examDateEl.value : null;
            const targetDept = targetDeptEl ? targetDeptEl.value.trim() : '';
            const dailyGoal = dailyGoalEl && dailyGoalEl.value
                ? Math.max(10, Math.min(1000, parseInt(dailyGoalEl.value, 10)))
                : 80;

            this._state.examName = examName;
            this._state.examDate = examDate;
            this._state.targetDepartment = targetDept;
            this._state.dailyQuestionGoal = dailyGoal;
            this._state.configured = true;

            saveStateToStorage(this._state);

            // Küçük bir toast göstermek istersen Utils kullan
            try {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('YKS planın kaydedildi!', 'success');
                }
            } catch (_) { }

            this.renderDashboard();
        },

        // 2) DASHBOARD EKRANI
        renderDashboard() {
            const s = this._state;
            const stats = getUserStats();
            const daysLeft = getDaysLeft(s.examDate);
            const totalQuestions = stats ? stats.totalQuestions : 0;
            const totalTests = stats ? stats.totalTests : 0;
            const successRate = stats && stats.totalQuestions > 0
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                : 0;

            const examDateText = s.examDate
                ? new Date(s.examDate).toLocaleDateString('tr-TR')
                : 'Henüz seçilmedi';

            const daysLeftText = (daysLeft === null || isNaN(daysLeft))
                ? '—'
                : (daysLeft > 0 ? `${daysLeft} gün` : (daysLeft === 0 ? 'Bugün!' : `${Math.abs(daysLeft)} gün önce`));

            const weakSubjectsText = s.weakSubjects.length
                ? s.weakSubjects.map(mapSubjectLabel).join(', ')
                : 'Belirtilmedi';

            const dailyGoal = s.dailyQuestionGoal || 80;

            this._root.innerHTML = `
                <div class="yks-journey-root">
                    <!-- Üst Özet Kartı -->
                    <section class="yks-journey-widget">
                        <div class="yks-widget-card">
                            <header class="yks-widget-header">
                                <div class="yks-widget-title-area">
                                    <p class="yks-widget-eyebrow">YKS Yolculuğun</p>
                                    <h1 class="yks-widget-title">
                                        ${s.examName || 'YKS'} için yolculuğun hazır.
                                    </h1>
                                    <p class="yks-widget-subtitle">
                                        Hedefine uygun bir tempo oluşturmak için günlük soru hedefini ve zayıf alanlarını takip ediyorum.
                                    </p>
                                </div>
                                <div class="yks-widget-actions">
                                    <button class="btn btn-secondary btn-sm" id="yksEditPlanBtn">
                                        Planı Düzenle
                                    </button>
                                </div>
                            </header>

                            <div class="yks-widget-body yks-widget-body-grid">
                                <!-- Geri Sayım -->
                                <article class="yks-metric-card">
                                    <div class="yks-metric-label">Sınava Kalan</div>
                                    <div class="yks-metric-value">${daysLeftText}</div>
                                    <div class="yks-metric-footer">
                                        <i class="ph ph-calendar icon"></i>
                                        <span>${examDateText}</span>
                                    </div>
                                </article>

                                <!-- Günlük Hedef -->
                                <article class="yks-metric-card">
                                    <div class="yks-metric-label">Günlük Hedefin</div>
                                    <div class="yks-metric-value">${dailyGoal} soru</div>
                                    <div class="yks-metric-footer">
                                        <i class="ph ph-target icon"></i>
                                        <span>Bugün: 0 / ${dailyGoal}</span>
                                    </div>
                                </article>

                                <!-- Toplam İlerleme -->
                                <article class="yks-metric-card">
                                    <div class="yks-metric-label">Toplam İlerleme</div>
                                    <div class="yks-metric-value">${totalQuestions} soru</div>
                                    <div class="yks-metric-footer">
                                        <i class="ph ph-chart-line-up icon"></i>
                                        <span>${totalTests} test • %${successRate} başarı</span>
                                    </div>
                                </article>

                                <!-- Zayıf Alanlar -->
                                <article class="yks-metric-card yks-metric-card-wide">
                                    <div class="yks-metric-label">Zayıf Alanlar</div>
                                    <p class="yks-metric-text">
                                        ${weakSubjectsText}
                                    </p>
                                    <p class="yks-metric-hint">
                                        Bu alanlarda daha fazla hedef soru çözdükçe kartın rengi değişecek.
                                    </p>
                                </article>
                            </div>
                        </div>
                    </section>

                    <!-- Çalışma Blokları -->
                    <section class="yks-journey-widget">
                        <div class="yks-widget-card">
                            <header class="yks-widget-header">
                                <div class="yks-widget-title-area">
                                    <p class="yks-widget-eyebrow">Günlük Plan</p>
                                    <h2 class="yks-widget-title">
                                        Çalışma blokların
                                    </h2>
                                    <p class="yks-widget-subtitle">
                                        Günü 2-3 odaklı bloklara bölersen verimin artar. Bu blokları
                                        uygulayarak soru hedefini rahat yakalayabilirsin.
                                    </p>
                                </div>
                            </header>

                            <div class="yks-widget-body yks-study-blocks">
                                ${s.studySlots.map(slot => `
                                    <article class="yks-study-block">
                                        <div class="yks-study-block-header">
                                            <span class="yks-study-block-label">${slot.label}</span>
                                            <span class="yks-study-block-duration">${slot.minutes} dk</span>
                                        </div>
                                        <p class="yks-study-block-text">
                                            Bu bloğu zorlandığın derslerden kısa tekrar + soru çözümü için kullan.
                                        </p>
                                    </article>
                                `).join('')}
                            </div>
                        </div>
                    </section>
                </div>
            `;

            this.bindDashboardEvents();
        },

        bindDashboardEvents() {
            const root = this._root;
            if (!root) return;

            const editBtn = root.querySelector('#yksEditPlanBtn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._state.configured = false; // tekrar onboarding aç
                    this.renderOnboarding();
                });
            }
        }
    };

    function mapSubjectLabel(key) {
        switch (key) {
            case 'turkce': return 'Türkçe';
            case 'matematik': return 'Matematik';
            case 'geometri': return 'Geometri';
            case 'fizik': return 'Fizik';
            case 'kimya': return 'Kimya';
            case 'biyoloji': return 'Biyoloji';
            case 'tarih': return 'Tarih';
            case 'cografya': return 'Coğrafya';
            case 'felsefe': return 'Felsefe';
            case 'dinkulturu': return 'Din Kültürü';
            default: return key;
        }
    }

    // Global’e bağla
    if (typeof window !== 'undefined') {
        window.YKSJourneyManager = YKSJourneyManager;
    }
})();
