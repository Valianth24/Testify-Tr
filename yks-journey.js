/**
 * YKS JOURNEY MANAGER
 * Testify - "YKS Yolculuğum" sekmesi için gelişmiş arayüz + state yönetimi
 *
 * - App.initYKSJourneyTab() ile uyumludur (window.YKSJourneyManager.init(root))
 * - Tüm içerik #journeyContent içine render edilir.
 * - State localStorage'da testify.yksJourney.v1 altında saklanır.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'testify.yksJourney.v1';

    function safeParse(json, fallback) {
        if (!json) return fallback;
        try {
            const parsed = JSON.parse(json);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (err) {
            console.error('YKSJourney state parse error:', err);
            return fallback;
        }
    }

    function getTodayString() {
        return new Date().toISOString().slice(0, 10);
    }

    function clone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch {
            return obj;
        }
    }

    function escapeHtml(str) {
        if (str == null) return '';
        if (window.Utils && typeof Utils.sanitizeHTML === 'function') {
            return Utils.sanitizeHTML(str);
        }
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const defaultState = {
        onboardingCompleted: false,
        profile: {
            grade: null,              // '9','10','11','12','mezun'
            examTrack: 'say',         // 'say','ea','soz','dil'
            dailyMinutes: 90,
            targetQuestionCount: 80,
            targetScore: '',
            targetDepartment: '',
            examDate: null,           // 'YYYY-MM-DD'
            weakSubjects: []          // ['matematik','tarih',...]
        },
        today: {
            targetQuestionCount: 80,
            solvedQuestions: 0,
            pomodoroCompleted: 0,
            lastReset: null
        },
        timers: {
            remainingSeconds: 25 * 60,
            isRunning: false
        }
    };

    const YKSJourneyManager = {
        _initialized: false,
        root: null,
        state: clone(defaultState),
        _countdownInterval: null,
        _pomodoroInterval: null,

        init(rootEl) {
            if (!rootEl) {
                rootEl =
                    document.getElementById('journeyContent') ||
                    document.querySelector('#journey #journeyContent');
            }

            if (!rootEl) {
                console.warn('YKSJourney root (#journeyContent) bulunamadı.');
                return;
            }

            this.root = rootEl;

            if (!this.state || !this.state.profile) {
                this.loadState();
            } else {
                this.normalizeDailyStats();
            }

            this._initialized = true;
            this.render();
        },

        loadState() {
            const base = clone(defaultState);

            if (!window.localStorage) {
                this.state = base;
                this.normalizeDailyStats();
                return;
            }

            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                this.state = base;
                this.normalizeDailyStats();
                return;
            }

            const parsed = safeParse(raw, null);
            if (!parsed || typeof parsed !== 'object') {
                this.state = base;
                this.normalizeDailyStats();
                return;
            }

            this.state = clone(defaultState);

            this.state.onboardingCompleted = !!parsed.onboardingCompleted;

            this.state.profile = Object.assign(
                {},
                defaultState.profile,
                parsed.profile || {}
            );

            this.state.today = Object.assign(
                {},
                defaultState.today,
                parsed.today || {}
            );

            this.state.timers = Object.assign(
                {},
                defaultState.timers,
                parsed.timers || {}
            );

            this.normalizeDailyStats();
        },

        saveState() {
            if (!window.localStorage) return;
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            } catch (err) {
                console.error('YKSJourney state kaydedilemedi:', err);
            }
        },

        normalizeDailyStats() {
            if (!this.state) this.state = clone(defaultState);
            if (!this.state.today) this.state.today = clone(defaultState.today);

            const todayStr = getTodayString();
            if (!this.state.today.lastReset || this.state.today.lastReset !== todayStr) {
                this.state.today.lastReset = todayStr;
                this.state.today.solvedQuestions = 0;
                this.state.today.pomodoroCompleted = 0;
            }
        },

        render() {
            if (!this.root) return;

            if (this.state && this.state.onboardingCompleted) {
                this.renderDashboard();
            } else {
                this.renderOnboarding();
            }
        },

        /* =========================
           ONBOARDING
           ========================= */

        renderOnboarding() {
            if (!this.root) return;
            this.cleanupIntervals();

            const profile = this.state.profile || {};
            const today = this.state.today || {};

            const gradeOptions = [
                { value: '9', label: '9. Sınıf' },
                { value: '10', label: '10. Sınıf' },
                { value: '11', label: '11. Sınıf' },
                { value: '12', label: '12. Sınıf' },
                { value: 'mezun', label: 'Mezun' }
            ];

            const gradeOptionsHtml = gradeOptions.map(opt => `
                <label class="grade-option">
                    <input type="radio" name="grade" value="${opt.value}" ${profile.grade === opt.value ? 'checked' : ''}>
                    <span>${opt.label}</span>
                </label>
            `).join('');

            const trackOptions = [
                { value: 'say', label: 'Sayısal', icon: 'ph-calculator' },
                { value: 'ea', label: 'Eşit Ağırlık', icon: 'ph-graph' },
                { value: 'soz', label: 'Sözel', icon: 'ph-quotes' },
                { value: 'dil', label: 'YDT / Dil', icon: 'ph-translate' }
            ];

            const trackOptionsHtml = trackOptions.map(opt => `
                <label class="field-option">
                    <input type="radio" name="examTrack" value="${opt.value}" ${profile.examTrack === opt.value ? 'checked' : ''}>
                    <div class="option-card">
                        <i class="ph ${opt.icon} icon"></i>
                        <div class="option-text">${opt.label}</div>
                    </div>
                </label>
            `).join('');

            const subjectOptions = [
                'Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji',
                'Türkçe', 'Tarih', 'Coğrafya', 'Felsefe', 'Din', 'İngilizce'
            ];

            const weakSet = new Set(profile.weakSubjects || []);

            const subjectHtml = subjectOptions.map(subj => {
                const value = subj.toLowerCase();
                const checked = weakSet.has(value) ? 'checked' : '';
                return `
                    <label class="subject-checkbox">
                        <input type="checkbox" name="weakSubjects" value="${value}" ${checked}>
                        <span>${subj}</span>
                    </label>
                `;
            }).join('');

            const dailyMinutes = profile.dailyMinutes || 90;
            const dailyQuestions = today.targetQuestionCount || profile.targetQuestionCount || 80;
            const examDateValue = profile.examDate || '';

            const titleText = (typeof t === 'function')
                ? t('journey.onboarding.title', 'YKS Yolculuğuna Başlayalım')
                : 'YKS Yolculuğuna Başlayalım';

            const subtitleText = (typeof t === 'function')
                ? t('journey.onboarding.subtitle', 'Hedefini, seviyeni ve günlük çalışma düzenini belirleyelim.')
                : 'Hedefini, seviyeni ve günlük çalışma düzenini belirleyelim.';

            this.root.innerHTML = `
                <section class="yks-onboarding" aria-label="YKS Yolculuğu Başlangıç Formu">
                    <header class="onboarding-header">
                        <h1>${titleText}</h1>
                        <p>${subtitleText}</p>
                    </header>

                    <form class="onboarding-form" id="yksOnboardingForm">
                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-identification-badge icon"></i>
                                <span>Kaçıncı sınıftasın?</span>
                            </div>
                            <div class="grade-options">
                                ${gradeOptionsHtml}
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-compass icon"></i>
                                <span>Alan tercihin nedir?</span>
                            </div>
                            <div class="field-options">
                                ${trackOptionsHtml}
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-target icon"></i>
                                <span>Hedef bölüm / üniversite</span>
                            </div>
                            <div class="target-inputs">
                                <input type="text"
                                       id="yksTargetDepartment"
                                       class="form-input"
                                       placeholder="Örn: Hacettepe Tıp / ODTÜ Bilgisayar"
                                       value="${escapeHtml(profile.targetDepartment || '')}">
                                <input type="text"
                                       id="yksTargetScore"
                                       class="form-input"
                                       placeholder="Hedef puan (isteğe bağlı)"
                                       value="${escapeHtml(profile.targetScore || '')}">
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-hourglass-medium icon"></i>
                                <span>Günlük çalışma süren</span>
                            </div>
                            <div class="time-slider">
                                <input type="range"
                                       id="yksDailyMinutes"
                                       name="dailyMinutes"
                                       min="30"
                                       max="360"
                                       step="15"
                                       value="${dailyMinutes}">
                                <div class="time-display" id="yksDailyMinutesDisplay">${dailyMinutes} dk / gün</div>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-list-bullets icon"></i>
                                <span>Günlük soru hedefin</span>
                            </div>
                            <input type="number"
                                   id="yksDailyQuestions"
                                   name="dailyQuestions"
                                   class="form-input"
                                   min="10"
                                   max="500"
                                   step="10"
                                   value="${dailyQuestions}"
                                   placeholder="Örn: 120 soru">
                        </div>

                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-warning-circle icon"></i>
                                <span>Zorlandığın dersler</span>
                            </div>
                            <div class="subject-checkboxes">
                                ${subjectHtml}
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="section-label">
                                <i class="ph ph-calendar icon"></i>
                                <span>YKS sınav tarihi</span>
                            </div>
                            <input type="date"
                                   id="yksExamDate"
                                   name="examDate"
                                   class="form-input"
                                   value="${examDateValue}">
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary btn-large">
                                <i class="ph ph-rocket-launch icon"></i>
                                <span>Yolculuğu Başlat</span>
                            </button>
                        </div>
                    </form>
                </section>
            `;

            this.attachOnboardingEvents();
        },

        attachOnboardingEvents() {
            if (!this.root) return;
            const form = this.root.querySelector('#yksOnboardingForm');
            if (!form) return;

            const minutesInput = form.querySelector('#yksDailyMinutes');
            const minutesDisplay = form.querySelector('#yksDailyMinutesDisplay');

            if (minutesInput && minutesDisplay) {
                minutesInput.addEventListener('input', () => {
                    const val = parseInt(minutesInput.value, 10) || 0;
                    minutesDisplay.textContent = val + ' dk / gün';
                });
            }

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const gradeInput = form.querySelector('input[name="grade"]:checked');
                const trackInput = form.querySelector('input[name="examTrack"]:checked');
                const dailyMinutesInput = form.querySelector('#yksDailyMinutes');
                const dailyQuestionsInput = form.querySelector('#yksDailyQuestions');
                const targetDepartmentInput = form.querySelector('#yksTargetDepartment');
                const targetScoreInput = form.querySelector('#yksTargetScore');
                const examDateInput = form.querySelector('#yksExamDate');

                const grade = gradeInput ? gradeInput.value : null;
                const examTrack = trackInput ? trackInput.value : null;
                const dailyMinutes = dailyMinutesInput ? parseInt(dailyMinutesInput.value, 10) || 0 : 0;
                const dailyQuestions = dailyQuestionsInput ? parseInt(dailyQuestionsInput.value, 10) || 0 : 0;
                const targetDepartment = targetDepartmentInput ? targetDepartmentInput.value.trim() : '';
                const targetScore = targetScoreInput ? targetScoreInput.value.trim() : '';
                const examDate = examDateInput ? examDateInput.value : '';

                if (!grade || !examTrack) {
                    if (window.Utils && typeof Utils.showToast === 'function') {
                        Utils.showToast('Lütfen sınıfını ve alanını seç.', 'warning');
                    } else {
                        alert('Lütfen sınıfını ve alanını seç.');
                    }
                    return;
                }

                if (!examDate) {
                    if (window.Utils && typeof Utils.showToast === 'function') {
                        Utils.showToast('Lütfen YKS sınav tarihini seç.', 'warning');
                    } else {
                        alert('Lütfen YKS sınav tarihini seç.');
                    }
                    return;
                }

                const weakSubjects = Array.from(
                    form.querySelectorAll('input[name="weakSubjects"]:checked')
                ).map(input => input.value);

                this.state.onboardingCompleted = true;
                this.state.profile.grade = grade;
                this.state.profile.examTrack = examTrack;
                this.state.profile.dailyMinutes = dailyMinutes || 90;
                this.state.profile.targetQuestionCount = dailyQuestions || 80;
                this.state.profile.targetDepartment = targetDepartment;
                this.state.profile.targetScore = targetScore;
                this.state.profile.examDate = examDate;
                this.state.profile.weakSubjects = weakSubjects;

                this.state.today.targetQuestionCount = dailyQuestions || 80;
                this.state.today.solvedQuestions = this.state.today.solvedQuestions || 0;
                this.state.timers.remainingSeconds = 25 * 60;
                this.state.timers.isRunning = false;

                this.saveState();

                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('YKS yolculuğun kaydedildi. 🎯', 'success');
                }

                this.renderDashboard();
            });
        },

        /* =========================
           DASHBOARD
           ========================= */

        renderDashboard() {
            if (!this.root) return;
            this.cleanupIntervals();

            const profile = this.state.profile || {};
            const today = this.state.today || {};

            const gradeLabel = this.getGradeLabel(profile.grade);
            const trackLabel = this.getTrackLabel(profile.examTrack);
            const targetDepartment = profile.targetDepartment || '';
            const targetScore = profile.targetScore || '';

            const targetQuestions = today.targetQuestionCount || profile.targetQuestionCount || 80;
            const solvedQuestions = today.solvedQuestions || 0;
            const percent = targetQuestions > 0
                ? Math.min(100, Math.round((solvedQuestions / targetQuestions) * 100))
                : 0;

            const weakSubjects = profile.weakSubjects || [];

            const weakSubjectsListHtml = weakSubjects.length
                ? `<ul class="goal-list">
                        ${weakSubjects.map(sub => `
                            <li>
                                <i class="ph ph-warning-circle icon"></i>
                                <span>${this.getSubjectLabel(sub)}</span>
                            </li>
                        `).join('')}
                   </ul>`
                : `<p style="font-size:0.9rem; color:var(--text-secondary);">
                        Şu anda seçili bir zayıf dersin yok. Onboarding ekranından güncelleyebilirsin.
                   </p>`;

            this.root.innerHTML = `
                <section class="yks-dashboard" aria-label="YKS Yolculuğu Paneli">
                    <div class="dashboard-header-card">
                        <div class="countdown-section">
                            <h1>YKS'ye Kalan Süre</h1>
                            <div class="countdown-timer">
                                <i class="ph ph-rocket-launch icon" aria-hidden="true"></i>
                                <span id="yksCountdownValue">-</span>
                            </div>
                            <p style="margin-top:0.35rem; font-size:0.9rem;">
                                ${gradeLabel ? `${gradeLabel} · ` : ''}${trackLabel}
                            </p>
                            ${targetDepartment || targetScore ? `
                                <p style="margin-top:0.25rem; font-size:0.9rem;">
                                    Hedef: <strong>${escapeHtml(targetDepartment || 'Henüz hedef belirlemedin')}</strong>
                                    ${targetScore ? ` · Tahmini puan: <strong>${escapeHtml(targetScore)}</strong>` : ''}
                                </p>
                            ` : ''}
                        </div>

                        <div class="today-progress-card">
                            <div class="progress-header">
                                <h3>
                                    <i class="ph ph-target icon"></i>
                                    Bugünün hedefi
                                </h3>
                                <span class="progress-percent" id="yksDailyProgressPercent">${percent}%</span>
                            </div>
                            <div class="progress-bar-wrapper">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${percent}%;"></div>
                                </div>
                            </div>
                            <div class="progress-stats">
                                <div class="stat">
                                    <i class="ph ph-list-bullets icon"></i>
                                    <span><strong id="yksDailySolved">${solvedQuestions}</strong> / <span id="yksDailyTarget">${targetQuestions}</span> soru</span>
                                </div>
                                <div class="stat">
                                    <i class="ph ph-hourglass-medium icon"></i>
                                    <span>Günlük odak süresi: <strong>${profile.dailyMinutes || 90} dk</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="yks-section-grid" aria-label="YKS alt bölümler">
                        <article class="yks-section-card yks-section-card-active" data-view="overview" tabindex="0">
                            <div class="card-icon"><i class="ph ph-compass icon"></i></div>
                            <div class="yks-section-card-main">
                                <div class="yks-section-card-title">
                                    <span class="card-title">Genel Bakış</span>
                                </div>
                                <p class="card-sub">Yolculuğunun özeti ve bugünkü mini görevlerin.</p>
                            </div>
                            <div class="yks-section-card-meta">
                                <div class="yks-section-card-meta-left">
                                    <span><i class="ph ph-calendar icon"></i> Bugün</span>
                                </div>
                                <span class="yks-section-card-pill">Önerilen</span>
                            </div>
                            <div class="yks-section-card-progress">
                                <div class="yks-section-card-progress-fill" style="--progress:${percent}%;"></div>
                            </div>
                        </article>

                        <article class="yks-section-card" data-view="plan" tabindex="0">
                            <div class="card-icon"><i class="ph ph-list-checks icon"></i></div>
                            <div class="yks-section-card-main">
                                <div class="yks-section-card-title">
                                    <span class="card-title">Günlük Plan</span>
                                </div>
                                <p class="card-sub">Bugün çözmen gereken soru ve test önerileri.</p>
                            </div>
                            <div class="yks-section-card-meta">
                                <div class="yks-section-card-meta-left">
                                    <span><i class="ph ph-lightning icon"></i> Odak modu</span>
                                </div>
                                <span class="yks-section-card-pill">Plan</span>
                            </div>
                            <div class="yks-section-card-progress">
                                <div class="yks-section-card-progress-fill" style="--progress:${percent}%;"></div>
                            </div>
                        </article>

                        <article class="yks-section-card" data-view="weak" tabindex="0">
                            <div class="card-icon"><i class="ph ph-warning-circle icon"></i></div>
                            <div class="yks-section-card-main">
                                <div class="yks-section-card-title">
                                    <span class="card-title">Zayıf Konular</span>
                                </div>
                                <p class="card-sub">Daha fazla soru çözmen gereken dersler.</p>
                            </div>
                            <div class="yks-section-card-meta">
                                <div class="yks-section-card-meta-left">
                                    <span><i class="ph ph-arrow-up-right icon"></i> Hedef odaklı</span>
                                </div>
                                <span class="yks-section-card-pill is-warning">Öncelik</span>
                            </div>
                            <div class="yks-section-card-progress">
                                <div class="yks-section-card-progress-fill" style="--progress:50%;"></div>
                            </div>
                        </article>

                        <article class="yks-section-card" data-view="timers" tabindex="0">
                            <div class="card-icon"><i class="ph ph-timer icon"></i></div>
                            <div class="yks-section-card-main">
                                <div class="yks-section-card-title">
                                    <span class="card-title">Odak Zamanlayıcı</span>
                                </div>
                                <p class="card-sub">Pomodoro ile 25 dk odaklan, 5 dk mola ver.</p>
                            </div>
                            <div class="yks-section-card-meta">
                                <div class="yks-section-card-meta-left">
                                    <span><i class="ph ph-clock-countdown icon"></i> Pomodoro</span>
                                </div>
                                <span class="yks-section-card-pill">Zaman</span>
                            </div>
                            <div class="yks-section-card-progress">
                                <div class="yks-section-card-progress-fill" style="--progress:0%;"></div>
                            </div>
                        </article>

                        <article class="yks-section-card" data-view="coach" tabindex="0">
                            <div class="card-icon"><i class="ph ph-brain icon"></i></div>
                            <div class="yks-section-card-main">
                                <div class="yks-section-card-title">
                                    <span class="card-title">Çalışma Koçu</span>
                                </div>
                                <p class="card-sub">Verilerine göre akıllı çalışma önerileri.</p>
                            </div>
                            <div class="yks-section-card-meta">
                                <div class="yks-section-card-meta-left">
                                    <span><i class="ph ph-sparkle icon"></i> AI destekli</span>
                                </div>
                                <span class="yks-section-card-pill">Motivasyon</span>
                            </div>
                            <div class="yks-section-card-progress">
                                <div class="yks-section-card-progress-fill" style="--progress:100%;"></div>
                            </div>
                        </article>

                        <article class="yks-section-card" data-view="level" tabindex="0">
                            <div class="card-icon"><i class="ph ph-ranking icon"></i></div>
                            <div class="yks-section-card-main">
                                <div class="yks-section-card-title">
                                    <span class="card-title">Seviye Testi</span>
                                </div>
                                <p class="card-sub">YKS deneme / seviye belirleme testi başlat.</p>
                            </div>
                            <div class="yks-section-card-meta">
                                <div class="yks-section-card-meta-left">
                                    <span><i class="ph ph-chart-line-up icon"></i> Ölç - Değerlendir</span>
                                </div>
                                <span class="yks-section-card-pill is-completed">Test</span>
                            </div>
                            <div class="yks-section-card-progress">
                                <div class="yks-section-card-progress-fill" style="--progress:0%;"></div>
                            </div>
                        </article>
                    </div>

                    <div class="yks-section-views">
                        <section class="yks-section-view active" data-view="overview">
                            <div class="yks-card">
                                <h2 style="margin-top:0;">Bugünkü 3 küçük adım</h2>
                                <ul class="goal-list">
                                    <li>
                                        <i class="ph ph-check-circle icon"></i>
                                        <span>Toplam en az ${targetQuestions} soru çöz (${solvedQuestions}/${targetQuestions}).</span>
                                    </li>
                                    <li>
                                        <i class="ph ph-check-circle icon"></i>
                                        <span>En az 1 pomodoro odak çalışması tamamla.</span>
                                    </li>
                                    <li>
                                        <i class="ph ph-check-circle icon"></i>
                                        <span>Zayıf derslerinden kısa bir konu özeti çıkar.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section class="yks-section-view" data-view="plan">
                            <div class="yks-card">
                                <h2 style="margin-top:0;">Günlük plan</h2>
                                <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:0.75rem;">
                                    Plan, günlük soru hedefin ve zorlandığın derslere göre otomatik önerilir.
                                </p>
                                <div class="yks-section-grid">
                                    <div class="yks-widget-card">
                                        <div class="widget-header">
                                            <h3><i class="ph ph-list-bullets icon"></i> Soru hedefi</h3>
                                        </div>
                                        <div class="widget-stats">
                                            <div class="widget-stat">
                                                <div class="stat-icon"><i class="ph ph-list-bullets icon"></i></div>
                                                <div class="stat-info">
                                                    <div class="stat-value">${targetQuestions}</div>
                                                    <div class="stat-label">Bugünkü hedef soru</div>
                                                </div>
                                            </div>
                                            <div class="widget-stat">
                                                <div class="stat-icon"><i class="ph ph-check-circle icon"></i></div>
                                                <div class="stat-info">
                                                    <div class="stat-value">${solvedQuestions}</div>
                                                    <div class="stat-label">Şu ana kadar çözdüğün</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="widget-goals">
                                            <h4>Önerilen dağılım</h4>
                                            <ul class="goal-list">
                                                <li>
                                                    <i class="ph ph-number-circle-one icon"></i>
                                                    <span>Sözel derslerden en az 20 soru.</span>
                                                </li>
                                                <li>
                                                    <i class="ph ph-number-circle-two icon"></i>
                                                    <span>Sayısal derslerden en az 20 soru.</span>
                                                </li>
                                                <li>
                                                    <i class="ph ph-number-circle-three icon"></i>
                                                    <span>Genel tekrar için 1 kısa deneme.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="yks-section-view" data-view="weak">
                            <div class="yks-card">
                                <h2 style="margin-top:0;">Zayıf dersler</h2>
                                ${weakSubjectsListHtml}
                            </div>
                        </section>

                        <section class="yks-section-view" data-view="timers">
                            <div class="yks-timers-grid">
                                <div class="yks-pomodoro-card">
                                    <div class="yks-pomodoro-card-header">
                                        <div class="yks-pomodoro-title">Pomodoro Odak Zamanlayıcı</div>
                                        <span class="yks-pomodoro-badge">25 dk odak · 5 dk mola</span>
                                    </div>
                                    <div class="yks-pomodoro-timer" id="yksPomodoroDisplay">25:00</div>
                                    <div class="yks-pomodoro-controls">
                                        <button type="button" class="yks-pomodoro-button" data-action="start">
                                            <i class="ph ph-play icon"></i> Başlat
                                        </button>
                                        <button type="button" class="yks-pomodoro-button" data-action="pause">
                                            <i class="ph ph-pause icon"></i> Duraklat
                                        </button>
                                        <button type="button" class="yks-pomodoro-button" data-action="reset">
                                            <i class="ph ph-arrow-counter-clockwise icon"></i> Sıfırla
                                        </button>
                                    </div>
                                </div>
                                <div class="yks-coach-card">
                                    <div class="yks-coach-card-title">
                                        <div class="yks-coach-card-title-icon">
                                            <i class="ph ph-lightbulb icon"></i>
                                        </div>
                                        <span>Odaklanma ipucu</span>
                                    </div>
                                    <p class="yks-coach-card-desc">
                                        25 dakikalık odak süresinde sadece soru çöz. Telefonu başka bir odaya bırak,
                                        sosyal medyayı tamamen kapat. Mola sırasında da ekrana değil, su içmeye veya
                                        kısa yürüyüşe odaklan.
                                    </p>
                                    <div class="yks-coach-card-tag">bilimsel çalışma tekniği</div>
                                </div>
                            </div>
                        </section>

                        <section class="yks-section-view" data-view="coach">
                            <div class="yks-coach-layout">
                                <div class="yks-coach-card">
                                    <div class="yks-coach-card-title">
                                        <div class="yks-coach-card-title-icon">
                                            <i class="ph ph-fire icon"></i>
                                        </div>
                                        <span>Mini koçluk notu</span>
                                    </div>
                                    <p class="yks-coach-card-desc">
                                        Hedefine göre her gün küçük ama düzenli adımlar atman sınav öncesi fark yaratır.
                                        Bugün kendine <strong>en fazla 3 görev</strong> yaz ve sadece onları tamamlamaya odaklan.
                                    </p>
                                    <div class="yks-coach-card-tag">yks koçu</div>
                                </div>
                                <div class="yks-coach-card">
                                    <div class="yks-coach-card-title">
                                        <div class="yks-coach-card-title-icon">
                                            <i class="ph ph-notebook icon"></i>
                                        </div>
                                        <span>Tekrar önerisi</span>
                                    </div>
                                    <p class="yks-coach-card-desc">
                                        Bugün çözdüğün sorulardaki yanlışlarını kısa notlara dönüştür. Testify içindeki
                                        <strong>Notlarım</strong> bölümünü kullanarak her derse özel mini özetler çıkartabilirsin.
                                    </p>
                                    <div class="yks-coach-card-tag">etkili tekrar</div>
                                </div>
                            </div>
                        </section>

                        <section class="yks-section-view" data-view="level">
                            <div class="yks-card">
                                <h2 style="margin-top:0;">Seviye belirleme testi</h2>
                                <p style="font-size:0.9rem; color:var(--text-secondary);">
                                    Testify içindeki soru havuzunu kullanarak kendine özel bir YKS denemesi başlatabilirsin.
                                    Doğru / yanlış dağılımına göre hedef derslerin güncellenecek.
                                </p>
                                <button type="button" class="btn btn-primary btn-large" data-role="start-level-test">
                                    <i class="ph ph-rocket-launch icon"></i>
                                    <span>Seviye Testini Başlat</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </section>
            `;

            this.attachDashboardEvents();
            this.updateCountdownUI();
            this.startCountdown();
            this.initPomodoro();
        },

        attachDashboardEvents() {
            if (!this.root) return;

            const cards = this.root.querySelectorAll('.yks-section-card');
            cards.forEach(card => {
                const view = card.getAttribute('data-view');
                card.addEventListener('click', () => {
                    this.switchSection(view);
                });
                card.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.switchSection(view);
                    }
                });
            });

            const levelBtn = this.root.querySelector('[data-role="start-level-test"]');
            if (levelBtn) {
                levelBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.startLevelTest();
                });
            }

            const pomButtons = this.root.querySelectorAll('.yks-pomodoro-button');
            pomButtons.forEach(btn => {
                const action = btn.getAttribute('data-action');
                btn.addEventListener('click', () => {
                    this.handlePomodoroAction(action);
                });
            });
        },

        switchSection(view) {
            if (!this.root) return;

            const cards = this.root.querySelectorAll('.yks-section-card');
            cards.forEach(card => {
                const cardView = card.getAttribute('data-view');
                const isActive = cardView === view;
                card.classList.toggle('yks-section-card-active', isActive);
            });

            const views = this.root.querySelectorAll('.yks-section-view');
            views.forEach(section => {
                const sectionView = section.getAttribute('data-view');
                const isActive = sectionView === view;
                section.classList.toggle('active', isActive);
            });
        },

        /* =========================
           COUNTDOWN
           ========================= */

        getExamDate() {
            const dateStr =
                this.state &&
                this.state.profile &&
                this.state.profile.examDate;

            if (!dateStr) return null;

            const dt = new Date(dateStr + 'T09:00:00');
            if (isNaN(dt.getTime())) return null;
            return dt;
        },

        updateCountdownUI() {
            if (!this.root) return;
            const el = this.root.querySelector('#yksCountdownValue');
            if (!el) return;

            const examDate = this.getExamDate();
            if (!examDate) {
                el.textContent = 'Sınav tarihi ayarlanmamış';
                return;
            }

            const now = new Date();
            const diffMs = examDate.getTime() - now.getTime();
            if (diffMs <= 0) {
                el.textContent = 'Sınav günü geldi!';
                return;
            }

            const totalSeconds = Math.floor(diffMs / 1000);
            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

            if (days > 0) {
                el.textContent = `${days} gün ${hours} saat`;
            } else if (hours > 0) {
                el.textContent = `${hours} saat ${minutes} dakika`;
            } else {
                el.textContent = `${minutes} dakika`;
            }
        },

        startCountdown() {
            if (this._countdownInterval) {
                clearInterval(this._countdownInterval);
                this._countdownInterval = null;
            }

            const examDate = this.getExamDate();
            if (!examDate) return;

            this._countdownInterval = setInterval(() => {
                this.updateCountdownUI();
            }, 60000);
        },

        /* =========================
           POMODORO
           ========================= */

        initPomodoro() {
            this.updatePomodoroDisplay();
        },

        handlePomodoroAction(action) {
            if (!this.state || !this.state.timers) return;

            if (action === 'start') {
                if (this.state.timers.isRunning) return;

                this.state.timers.isRunning = true;

                if (this._pomodoroInterval) {
                    clearInterval(this._pomodoroInterval);
                }

                this._pomodoroInterval = setInterval(() => {
                    if (!this.state.timers.isRunning) return;

                    if (this.state.timers.remainingSeconds <= 0) {
                        this.state.timers.remainingSeconds = 0;
                        this.state.timers.isRunning = false;
                        this.updatePomodoroDisplay();
                        clearInterval(this._pomodoroInterval);
                        this._pomodoroInterval = null;

                        this.state.today.pomodoroCompleted =
                            (this.state.today.pomodoroCompleted || 0) + 1;
                        this.saveState();

                        if (window.Utils && typeof Utils.showToast === 'function') {
                            Utils.showToast('Pomodoro bitti! 5 dk mola ver. ☕', 'success');
                        }
                        return;
                    }

                    this.state.timers.remainingSeconds -= 1;
                    this.updatePomodoroDisplay();
                }, 1000);
            } else if (action === 'pause') {
                this.state.timers.isRunning = false;
                if (this._pomodoroInterval) {
                    clearInterval(this._pomodoroInterval);
                    this._pomodoroInterval = null;
                }
            } else if (action === 'reset') {
                this.state.timers.isRunning = false;
                if (this._pomodoroInterval) {
                    clearInterval(this._pomodoroInterval);
                    this._pomodoroInterval = null;
                }
                this.state.timers.remainingSeconds = 25 * 60;
                this.updatePomodoroDisplay();
            }

            this.saveState();
        },

        updatePomodoroDisplay() {
            if (!this.root) return;
            const display = this.root.querySelector('#yksPomodoroDisplay');
            if (!display || !this.state || !this.state.timers) return;

            const total = this.state.timers.remainingSeconds || 0;
            const minutes = Math.floor(total / 60);
            const seconds = total % 60;

            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');

            display.textContent = `${mm}:${ss}`;
        },

        /* =========================
           PROGRESS HELPERS
           ========================= */

        updateDailyProgressUI() {
            if (!this.root || !this.state) return;

            const targetQuestions =
                this.state.today.targetQuestionCount ||
                this.state.profile.targetQuestionCount ||
                80;

            const solvedQuestions = this.state.today.solvedQuestions || 0;
            const percent = targetQuestions > 0
                ? Math.min(100, Math.round((solvedQuestions / targetQuestions) * 100))
                : 0;

            const solvedEl = this.root.querySelector('#yksDailySolved');
            const targetEl = this.root.querySelector('#yksDailyTarget');
            const percentEl = this.root.querySelector('#yksDailyProgressPercent');
            const barFillEl = this.root.querySelector('.today-progress-card .progress-fill');

            if (solvedEl) solvedEl.textContent = solvedQuestions;
            if (targetEl) targetEl.textContent = targetQuestions;
            if (percentEl) percentEl.textContent = percent + '%';
            if (barFillEl) barFillEl.style.width = percent + '%';
        },

        getGradeLabel(grade) {
            switch (grade) {
                case '9': return '9. Sınıf';
                case '10': return '10. Sınıf';
                case '11': return '11. Sınıf';
                case '12': return '12. Sınıf';
                case 'mezun': return 'Mezun';
                default: return '';
            }
        },

        getTrackLabel(track) {
            switch (track) {
                case 'say': return 'Sayısal';
                case 'ea': return 'Eşit Ağırlık';
                case 'soz': return 'Sözel';
                case 'dil': return 'Yabancı Dil (YDT)';
                default: return 'Alan belirtilmedi';
            }
        },

        getSubjectLabel(value) {
            const map = {
                matematik: 'Matematik',
                geometri: 'Geometri',
                fizik: 'Fizik',
                kimya: 'Kimya',
                biyoloji: 'Biyoloji',
                'türkçe': 'Türkçe',
                turkce: 'Türkçe',
                tarih: 'Tarih',
                'coğrafya': 'Coğrafya',
                cografya: 'Coğrafya',
                felsefe: 'Felsefe',
                din: 'Din Kültürü',
                ingilizce: 'İngilizce'
            };
            const key = (value || '').toString().toLowerCase();
            return map[key] || value;
        },

        /* =========================
           SEVİYE TESTİ
           ========================= */

        startLevelTest() {
            try {
                if (window.YKSQuestionPool && typeof window.YKSQuestionPool.startLevelExam === 'function') {
                    window.YKSQuestionPool.startLevelExam();
                    if (typeof window.navigateTo === 'function') {
                        window.navigateTo('test');
                    }
                    return;
                }

                if (window.QuizManager && typeof window.QuizManager.startYKSLevelTest === 'function') {
                    window.QuizManager.startYKSLevelTest();
                    if (typeof window.navigateTo === 'function') {
                        window.navigateTo('test');
                    }
                    return;
                }

                if (typeof window.navigateTo === 'function') {
                    window.navigateTo('test');
                } else if (window.App && typeof window.App.switchTab === 'function') {
                    window.App.switchTab('test');
                }

                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Seviye testi için Test sekmesine yönlendirildin.', 'info');
                }
            } catch (err) {
                console.error('Seviye testi başlatılamadı:', err);
            }
        },

        /* =========================
           GENEL HELPER'lar
           ========================= */

        cleanupIntervals() {
            if (this._countdownInterval) {
                clearInterval(this._countdownInterval);
                this._countdownInterval = null;
            }
            if (this._pomodoroInterval) {
                clearInterval(this._pomodoroInterval);
                this._pomodoroInterval = null;
            }
        },

        getState() {
            return clone(this.state || defaultState);
        },

        /**
         * Diğer modüller (ör: QuizManager) test bitince bunu çağırıp
         * günlük çözülen soru sayısını artırabilir.
         *
         * Örnek: YKSJourneyManager.updateAfterTest({ totalQuestions: 40 })
         */
        updateAfterTest(result) {
            if (!result) return;
            const totalQuestions = Number(result.totalQuestions || result.questionCount || 0);
            if (totalQuestions > 0) {
                this.state.today.solvedQuestions =
                    (this.state.today.solvedQuestions || 0) + totalQuestions;
                this.saveState();
                this.updateDailyProgressUI();
            }
        }
    };

    window.YKSJourneyManager = YKSJourneyManager;
})();
