// yks-journey.js - Gelişmiş tek sürüm
// YKS Journey Manager (onboarding + dashboard + seviye testi)

(function () {
    'use strict';

    const YKSJourneyManager = {
        // Storage anahtarı (sadece v2)
        STORAGE_KEY: 'testify.yksJourney.v2',

        // YKS TYT tarihi
        EXAM_DATE: new Date('2025-06-14'),

        // Pomodoro durumu
        pomodoro: {
            intervalId: null,
            seconds: 0,
            running: false
        },

        // Yeni alan tanımları (haftalık plan vs için)
        FIELDS: {
            sayisal: {
                label: 'Sayısal',
                icon: 'ph-function',
                subjects: ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji'],
                tytWeight: 0.4,
                aytWeight: 0.6
            },
            ea: {
                label: 'Eşit Ağırlık',
                icon: 'ph-graph',
                subjects: ['Matematik', 'Geometri', 'Türkçe', 'Tarih', 'Coğrafya'],
                tytWeight: 0.5,
                aytWeight: 0.5
            },
            sozel: {
                label: 'Sözel',
                icon: 'ph-quotes',
                subjects: ['Türkçe', 'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü'],
                tytWeight: 0.6,
                aytWeight: 0.4
            },
            dil: {
                label: 'Yabancı Dil',
                icon: 'ph-translate',
                subjects: ['İngilizce', 'Reading', 'Kelime Bilgisi', 'Gramer', 'Çeviri'],
                tytWeight: 0.3,
                aytWeight: 0.7
            }
        },

        // Detaylı konu başlıkları
        TOPICS: {
            Matematik: {
                tyt: [
                    'Temel Kavramlar', 'Sayılar', 'Bölme-Bölünebilme', 'EBOB-EKOK', 'Rasyonel Sayılar',
                    'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma',
                    'Oran-Orantı', 'Problemler', 'Kümeler', 'Fonksiyonlar', 'Polinomlar'
                ],
                ayt: [
                    'Limit', 'Türev', 'İntegral', 'Logaritma', 'Diziler', 'Seriler', 'Matris', 'Determinant',
                    'Kompleks Sayılar', 'İstatistik', 'Olasılık'
                ]
            },
            Geometri: {
                tyt: [
                    'Temel Geometrik Kavramlar', 'Açılar', 'Üçgenler', 'Dörtgenler', 'Çokgenler', 'Çember'
                ],
                ayt: [
                    'Analitik Geometri', 'Katı Cisimler', 'Konikler', 'Vektörler', 'Dönüşüm Geometrisi'
                ]
            },
            Fizik: {
                tyt: [
                    'Fizik Bilimine Giriş', 'Madde ve Özkütle', 'Hareket', 'Kuvvet',
                    'Enerji', 'Isı', 'Elektrik'
                ],
                ayt: [
                    'Vektörler', 'Kuvvet ve Hareket', 'Elektrik ve Manyetizma',
                    'Dalgalar', 'Optik', 'Modern Fizik', 'Atom Fiziği'
                ]
            }
            // Diğer dersler istenirse eklenebilir
        },

        // Alan label'ları
        FIELD_LABELS: {
            sayisal: 'Sayısal',
            ea: 'Eşit Ağırlık',
            sozel: 'Sözel',
            dil: 'Dil',
            genel: 'Genel'
        },

        // Eski sürümde onboarding 2. adımda kullanılan ders listeleri (dışarıdan ihtiyaç olursa diye tutuluyor)
        FIELD_SUBJECTS: {
            sayisal: [
                { id: 'matematik', label: 'TYT Matematik', icon: 'ph ph-calculator' },
                { id: 'geometri', label: 'Geometri', icon: 'ph ph-shapes' },
                { id: 'fizik', label: 'Fizik', icon: 'ph ph-atom' },
                { id: 'kimya', label: 'Kimya', icon: 'ph ph-flask' },
                { id: 'biyoloji', label: 'Biyoloji', icon: 'ph ph-dna' }
            ],
            ea: [
                { id: 'matematik', label: 'TYT Matematik', icon: 'ph ph-calculator' },
                { id: 'geometri', label: 'Geometri', icon: 'ph ph-shapes' },
                { id: 'turkce', label: 'TYT Türkçe', icon: 'ph ph-text-aa' },
                { id: 'tarih', label: 'Tarih', icon: 'ph ph-scroll' },
                { id: 'cografya', label: 'Coğrafya', icon: 'ph ph-globe' }
            ],
            sozel: [
                { id: 'turkce', label: 'TYT Türkçe', icon: 'ph ph-text-aa' },
                { id: 'tarih', label: 'Tarih', icon: 'ph ph-scroll' },
                { id: 'cografya', label: 'Coğrafya', icon: 'ph ph-globe' },
                { id: 'felsefe', label: 'Felsefe', icon: 'ph ph-brain' },
                { id: 'din', label: 'Din Kültürü', icon: 'ph ph-book-open' }
            ],
            dil: [
                { id: 'ingilizce', label: 'İngilizce', icon: 'ph ph-translate' },
                { id: 'okuma', label: 'Reading', icon: 'ph ph-book-open-text' },
                { id: 'kelime', label: 'Kelime Bilgisi', icon: 'ph ph-text-t' }
            ]
        },

        // Rozet sistemi (UI şu an göstermiyor ama istatistik için hazır)
        BADGES: {
            beginner: { name: 'Yeni Başlayan', icon: '🌱', requirement: 100, xp: 50 },
            consistent: { name: 'Düzenli Çalışkan', icon: '📚', requirement: 7, xp: 100 }, // 7 gün streak
            solver: { name: 'Soru Makinesi', icon: '⚡', requirement: 1000, xp: 200 },
            expert: { name: 'Uzman', icon: '🎯', requirement: 5000, xp: 500 },
            champion: { name: 'Şampiyon', icon: '🏆', requirement: 10000, xp: 1000 },
            legend: { name: 'Efsane', icon: '⭐', requirement: 20000, xp: 2000 }
        },

        /**
         * Başlatma
         */
        init() {
            const container = document.getElementById('journeyContent');
            if (!container) return;

            const state = this.loadState();

            if (!state.profile) {
                // Profil yoksa onboarding (tek kart tek adım)
                this.currentOnboardingStep = 1;
                this.renderOnboarding(container, state);
            } else if (state.levelTest && state.levelTest.status === 'in_progress') {
                // Seviye testi yarım kaldıysa devam
                this.renderLevelTest(container, state);
            } else {
                // Ana dashboard
                this.renderMainDashboard(container, state);
            }
        },

        /**
         * Varsayılan state
         */
        createDefaultState() {
            return {
                profile: null,
                weeklyPlan: null,
                dailyTasks: [],
                weakPoints: [],
                stats: {
                    totalQuestions: 0,
                    correctAnswers: 0,
                    studyTime: 0,
                    streakDays: 0,
                    lastStudyDate: null,
                    xp: 0,
                    level: 1,
                    badges: [],
                    // Eski sürümle uyum için:
                    solvedQuestions: 0,
                    completedTests: 0
                },
                spacedRepetition: {
                    queue: [],
                    history: []
                },
                reports: [],
                levelTest: {
                    status: 'not_started', // 'not_started' | 'in_progress' | 'completed'
                    lastResult: null
                }
            };
        },

        /**
         * State yükleme (sadece v2, legacy migration yok)
         */
        loadState() {
            let state = null;

            try {
                const saved = window.localStorage.getItem(this.STORAGE_KEY);
                if (saved) {
                    state = JSON.parse(saved);
                }
            } catch (e) {
                console.error('YKS state yükleme hatası:', e);
            }

            if (!state) {
                state = this.createDefaultState();
            }

            // Eksik alanları tamamla (geriye dönük uyumluluk)
            const defaults = this.createDefaultState();

            state.stats = Object.assign({}, defaults.stats, state.stats || {});
            state.spacedRepetition = Object.assign(
                {},
                defaults.spacedRepetition,
                state.spacedRepetition || {}
            );
            state.levelTest = Object.assign({}, defaults.levelTest, state.levelTest || {});

            if (!Array.isArray(state.reports)) state.reports = [];
            if (!Array.isArray(state.dailyTasks)) state.dailyTasks = [];
            if (!Array.isArray(state.weakPoints)) state.weakPoints = [];

            return state;
        },

        saveState(state) {
            try {
                window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
                return true;
            } catch (e) {
                console.error('YKS state kaydetme hatası:', e);
                return false;
            }
        },

        /**
         * Eski subject ID -> Yeni görünen isim (dışarıdan kullanılırsa diye bırakıldı)
         */
        mapSubjectIdToName(id) {
            const map = {
                matematik: 'Matematik',
                geometri: 'Geometri',
                fizik: 'Fizik',
                kimya: 'Kimya',
                biyoloji: 'Biyoloji',
                turkce: 'Türkçe',
                tarih: 'Tarih',
                cografya: 'Coğrafya',
                felsefe: 'Felsefe',
                din: 'Din Kültürü',
                ingilizce: 'İngilizce',
                okuma: 'Reading',
                kelime: 'Kelime Bilgisi'
            };
            return map[id] || id;
        },

        /**
         * ONBOARDING - Çok adımlı, tek kart tek seçim
         */
        renderOnboarding(container, state) {
            void state;

            this.currentOnboardingStep = 1;

            container.innerHTML = `
                <div class="yks-onboarding animate-fadeInUp">
                    <div class="onboarding-header">
                        <h1>🎓 Seni Tanıyalım</h1>
                        <p>YKS yolculuğunu adım adım kişiselleştirelim.</p>
                    </div>

                    <form class="onboarding-form" id="yksOnboardingForm" novalidate>
                        <!-- Adım 1 - Alan seçimi -->
                        <div class="onboarding-step" data-step="1">
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="ph ph-target"></i> Hangi alanda sınava hazırlanıyorsun?
                                </label>
                                <div class="field-options">
                                    ${Object.entries(this.FIELDS).map(([key, field]) => `
                                        <label class="field-option">
                                            <input type="radio" name="field" value="${key}">
                                            <div class="option-card">
                                                <i class="ph ${field.icon}"></i>
                                                <span>${field.label}</span>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Adım 2 - Sınıf seçimi -->
                        <div class="onboarding-step" data-step="2">
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="ph ph-graduation-cap"></i> Sınıf Düzeyin
                                </label>
                                <div class="grade-options">
                                    <label class="grade-option">
                                        <input type="radio" name="grade" value="10">
                                        <span>10. Sınıf</span>
                                    </label>
                                    <label class="grade-option">
                                        <input type="radio" name="grade" value="11">
                                        <span>11. Sınıf</span>
                                    </label>
                                    <label class="grade-option">
                                        <input type="radio" name="grade" value="12">
                                        <span>12. Sınıf</span>
                                    </label>
                                    <label class="grade-option">
                                        <input type="radio" name="grade" value="mezun">
                                        <span>Mezun</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Adım 3 - Hedefler -->
                        <div class="onboarding-step" data-step="3">
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="ph ph-rocket-launch"></i> Hedefin Nedir?
                                </label>
                                <div class="target-inputs">
                                    <input
                                        type="text"
                                        name="targetDepartment"
                                        placeholder="Hedef bölüm (ör: Tıp, Mühendislik)"
                                        class="form-input"
                                    >
                                    <input
                                        type="number"
                                        name="targetRank"
                                        placeholder="Hedef sıralama (ör: 50000)"
                                        class="form-input"
                                        min="1"
                                        max="2000000"
                                    >
                                </div>
                                <div class="form-actions" style="margin-top:0.8rem; justify-content:flex-end;">
                                    <button type="button" class="btn btn-primary btn-sm" data-onboarding-next>
                                        Devam et
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Adım 4 - Günlük çalışma süresi -->
                        <div class="onboarding-step" data-step="4">
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="ph ph-timer"></i> Günde Kaç Saat Çalışabilirsin?
                                </label>
                                <div class="time-slider">
                                    <input
                                        type="range"
                                        name="dailyTime"
                                        min="0.5"
                                        max="8"
                                        step="0.5"
                                        value="2"
                                        id="timeSlider"
                                    >
                                    <div class="time-display">
                                        <span id="timeValue">2</span> saat/gün
                                    </div>
                                </div>
                                <div class="form-actions" style="margin-top:0.8rem; justify-content:flex-end;">
                                    <button type="button" class="btn btn-primary btn-sm" data-onboarding-next>
                                        Devam et
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Adım 5 - Zorlandığı dersler -->
                        <div class="onboarding-step" data-step="5">
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="ph ph-warning-circle"></i> Hangi Derslerde Zorlanıyorsun?
                                </label>
                                <div class="subject-checkboxes">
                                    ${[
                                        'Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji',
                                        'Türkçe', 'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü', 'İngilizce'
                                    ].map(subject => `
                                        <label class="subject-checkbox">
                                            <input type="checkbox" name="weakSubjects" value="${subject}">
                                            <span>${subject}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <div class="form-actions" style="margin-top:0.8rem; justify-content:flex-end;">
                                    <button type="button" class="btn btn-primary btn-sm" data-onboarding-next>
                                        Son adıma geç
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Adım 6 - Seviye testi ve başlangıç -->
                        <div class="onboarding-step" data-step="6">
                            <div class="form-section level-test-section">
                                <label class="section-label">
                                    <i class="ph ph-chart-line-up"></i> Seviye Belirleme Testi
                                </label>
                                <p class="section-desc">
                                    20 soruluk kısa bir test ile mevcut seviyeni belirleyelim mi?
                                </p>
                                <div class="test-options">
                                    <button
                                        type="button"
                                        class="btn btn-primary"
                                        id="startLevelTest"
                                    >
                                        <i class="ph ph-play"></i> Şimdi Teste Başla
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-secondary"
                                        id="skipLevelTest"
                                    >
                                        <i class="ph ph-clock"></i> Sonra Yapacağım
                                    </button>
                                </div>
                            </div>

                            <div class="form-actions" style="margin-top:0.8rem;">
                                <button type="button" class="btn btn-secondary btn-sm" data-onboarding-prev>
                                    Geri
                                </button>
                                <button type="submit" class="btn btn-primary btn-large">
                                    <i class="ph ph-rocket-launch"></i> YKS Yolculuğuma Başla
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            `;

            this.updateOnboardingStepUI(container);
            this.attachOnboardingEvents(container, state);
        },

        updateOnboardingStepUI(container) {
            const root = container || document.getElementById('journeyContent');
            if (!root) return;

            const steps = root.querySelectorAll('.onboarding-step');
            if (!steps.length) return;

            const maxStep = steps.length;
            if (!this.currentOnboardingStep) this.currentOnboardingStep = 1;
            if (this.currentOnboardingStep < 1) this.currentOnboardingStep = 1;
            if (this.currentOnboardingStep > maxStep) this.currentOnboardingStep = maxStep;

            steps.forEach(stepEl => {
                const s = Number(stepEl.getAttribute('data-step') || '1');
                stepEl.hidden = (s !== this.currentOnboardingStep);
            });
        },

        goToOnboardingStep(step) {
            this.currentOnboardingStep = step;
            const container = document.getElementById('journeyContent');
            if (container) {
                this.updateOnboardingStepUI(container);
            }
        },

        attachOnboardingEvents(container, state) {
            const form = container.querySelector('#yksOnboardingForm');
            const timeSlider = container.querySelector('#timeSlider');
            const timeValue = container.querySelector('#timeValue');
            const startTestBtn = container.querySelector('#startLevelTest');
            const skipTestBtn = container.querySelector('#skipLevelTest');

            // Adımlar arası ileri-geri
            container.querySelectorAll('[data-onboarding-next]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.goToOnboardingStep((this.currentOnboardingStep || 1) + 1);
                });
            });

            container.querySelectorAll('[data-onboarding-prev]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.goToOnboardingStep((this.currentOnboardingStep || 1) - 1);
                });
            });

            // Alan seçince otomatik ikinci adıma
            container.querySelectorAll('input[name="field"]').forEach(input => {
                input.addEventListener('change', () => {
                    if (input.checked) {
                        this.goToOnboardingStep(2);
                    }
                });
            });

            // Sınıf seçince otomatik üçüncü adıma
            container.querySelectorAll('input[name="grade"]').forEach(input => {
                input.addEventListener('change', () => {
                    if (input.checked) {
                        this.goToOnboardingStep(3);
                    }
                });
            });

            if (timeSlider && timeValue) {
                timeSlider.addEventListener('input', (e) => {
                    timeValue.textContent = e.target.value;
                });
            }

            if (startTestBtn) {
                startTestBtn.addEventListener('click', () => {
                    this.saveOnboardingAndStartTest(form, state, true);
                });
            }

            if (skipTestBtn) {
                skipTestBtn.addEventListener('click', () => {
                    this.saveOnboardingAndStartTest(form, state, false);
                });
            }

            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveOnboardingAndStartTest(form, state, false);
                });
            }
        },

        /**
         * Onboarding verilerini kaydet + seviye testi veya dashboard
         */
        saveOnboardingAndStartTest(form, state, startTest) {
            if (!form) return;
            const formData = new FormData(form);
            const weakSubjects = Array.from(formData.getAll('weakSubjects') || []);

            const field = formData.get('field');
            if (!field) {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Lütfen alanını seç.', 'warning');
                }
                this.goToOnboardingStep(1);
                return;
            }

            const grade = formData.get('grade');
            if (!grade) {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Lütfen sınıf düzeyini seç.', 'warning');
                }
                this.goToOnboardingStep(2);
                return;
            }

            const targetDepartment = (formData.get('targetDepartment') || '').toString().trim();
            if (!targetDepartment) {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Lütfen hedef bölümünü yaz.', 'warning');
                }
                this.goToOnboardingStep(3);
                return;
            }

            const targetRankRaw = formData.get('targetRank');
            const targetRank = targetRankRaw ? parseInt(targetRankRaw, 10) : null;
            if (!targetRank || Number.isNaN(targetRank)) {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Lütfen geçerli bir hedef sıralama gir.', 'warning');
                }
                this.goToOnboardingStep(3);
                return;
            }

            const dailyTimeRaw = formData.get('dailyTime');
            const dailyTime = dailyTimeRaw ? parseFloat(dailyTimeRaw) : 0;
            if (!dailyTime) {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Lütfen günlük çalışma süreni ayarla.', 'warning');
                }
                this.goToOnboardingStep(4);
                return;
            }

            state.profile = {
                field,
                grade,
                targetDepartment,
                targetRank,
                dailyTime,
                weakSubjects,
                subjects: weakSubjects.slice(), // Eski yapı ile uyum
                levelTestPreference: startTest ? 'now' : 'never',
                createdAt: new Date().toISOString()
            };

            // Haftalık plan + günlük görevler + zayıf noktalar
            state.weeklyPlan = this.generateWeeklyPlan(state.profile);
            state.dailyTasks = this.generateDailyTasks(state.profile, state.weeklyPlan);
            state.weakPoints = this.analyzeWeakPoints(state.profile);

            // Seviye testi state'i
            state.levelTest = state.levelTest || { status: 'not_started', lastResult: null };
            state.levelTest.status = startTest ? 'in_progress' : 'not_started';

            this.saveState(state);

            const container = document.getElementById('journeyContent');
            if (!container) return;

            if (startTest) {
                this.renderLevelTest(container, state);
            } else {
                this.renderMainDashboard(container, state);
            }
        },

        /**
         * HAFTALIK PLAN
         */
        generateWeeklyPlan(profile) {
            const plan = {};
            const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
            const dailyHours = profile.dailyTime || 2;
            const field = this.FIELDS[profile.field] || this.FIELDS.sayisal;

            days.forEach(day => {
                const sessions = [];
                let remainingTime = dailyHours * 60;

                const tytTime = remainingTime * field.tytWeight;
                const aytTime = remainingTime * field.aytWeight;
                void tytTime;
                void aytTime;

                const prioritySubjects =
                    (profile.weakSubjects && profile.weakSubjects.length > 0)
                        ? profile.weakSubjects
                        : field.subjects;

                const dailySubjects = this.shuffleArray(prioritySubjects).slice(0, 3);

                dailySubjects.forEach((subject, index) => {
                    const duration = Math.floor(remainingTime / (3 - index));
                    const type = index === 0 ? 'TYT' : (Math.random() > 0.5 ? 'TYT' : 'AYT');

                    sessions.push({
                        subject,
                        type,
                        duration,
                        topic: this.getRandomTopic(subject, type),
                        completed: false
                    });

                    remainingTime -= duration;
                });

                if (day === 'Cumartesi' && dailyHours >= 3) {
                    sessions.unshift({
                        subject: 'Deneme Sınavı',
                        type: 'TYT',
                        duration: 135,
                        topic: 'Haftalık TYT Deneme',
                        completed: false
                    });
                }

                plan[day] = sessions;
            });

            return plan;
        },

        /**
         * Günlük görevler
         */
        generateDailyTasks(profile, weeklyPlan) {
            const today = new Date();
            const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
            const todayName = dayNames[today.getDay()];

            const todayPlan = (weeklyPlan && weeklyPlan[todayName]) || [];

            const tasks = todayPlan.map(session => ({
                id: this.generateId(),
                title: `${session.duration} dk ${session.type} ${session.subject}`,
                description: `Konu: ${session.topic}`,
                type: 'study',
                duration: session.duration,
                subject: session.subject,
                completed: false,
                xp: Math.floor(session.duration * 1.5)
            }));

            // Ekstra görevler
            tasks.push({
                id: this.generateId(),
                title: 'Günlük Kelime Çalışması',
                description: '10 yeni İngilizce kelime',
                type: 'vocabulary',
                duration: 15,
                completed: false,
                xp: 20
            });

            if (profile.weakSubjects && profile.weakSubjects.length > 0) {
                tasks.push({
                    id: this.generateId(),
                    title: 'Hata Tekrarı',
                    description: 'Önceki yanlışlarını gözden geçir',
                    type: 'review',
                    duration: 20,
                    completed: false,
                    xp: 30
                });
            }

            return tasks;
        },

        /**
         * Zayıf noktalar
         */
        analyzeWeakPoints(profile) {
            const weak = profile.weakSubjects || [];
            return weak.map(subject => ({
                subject,
                accuracy: Math.floor(Math.random() * 30) + 40, // 40-70 (placeholder)
                totalQuestions: 0,
                correctAnswers: 0,
                lastStudied: null,
                improvement: 0
            }));
        },

        /**
         * ANA DASHBOARD (kart grid + section sayfaları)
         */
        renderMainDashboard(container, state) {
            const daysLeft = Math.ceil((this.EXAM_DATE - new Date()) / (1000 * 60 * 60 * 24));
            const todayProgress = this.calculateTodayProgress(state);
            const todayStudyTime = this.getTodayStudyTime(state);
            const todayXP = this.getTodayXP(state);

            // --- Parça HTML’ler ---

            const headerHTML = `
                <div class="dashboard-header-card">
                    <div class="countdown-section">
                        <h1>YKS Yolculuğum</h1>
                        <div class="countdown-timer">
                            <i class="ph ph-calendar-check"></i>
                            <span class="countdown-text">YKS'ye <strong>${daysLeft}</strong> gün kaldı!</span>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" type="button" onclick="YKSJourneyManager.editProfile()">
                            <i class="ph ph-gear-six"></i> Ayarlar
                        </button>
                    </div>
                </div>
            `;

            const todayProgressCard = `
                <div class="today-progress-card">
                    <div class="progress-header">
                        <h3><i class="ph ph-target"></i> Bugünkü İlerleme</h3>
                        <span class="progress-percent">${todayProgress}%</span>
                    </div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${todayProgress}%"></div>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <div class="stat">
                            <i class="ph ph-check-circle"></i>
                            <span>${state.dailyTasks.filter(t => t.completed).length} / ${state.dailyTasks.length} görev</span>
                        </div>
                        <div class="stat">
                            <i class="ph ph-timer"></i>
                            <span>${this.formatTime(todayStudyTime)} çalışma</span>
                        </div>
                        <div class="stat">
                            <i class="ph ph-lightning"></i>
                            <span>${todayXP} XP</span>
                        </div>
                    </div>
                </div>
            `;

            const pomodoroCard = `
                <div class="pomodoro-card yks-pomodoro-card">
                    <h3><i class="ph ph-timer"></i> Odak Zamanı</h3>
                    <div class="pomodoro-layout">
                        <div class="pomodoro-timer yks-pomodoro-timer">
                            <div id="pomodoroTimeDisplay">00:00</div>
                            <span>Odak süresi</span>
                        </div>
                        <div class="pomodoro-info">
                            <div>Toplam odak süresi: <strong id="pomodoroTotalFocus">${this.formatTime(state.stats.studyTime || 0)}</strong></div>
                            <div>Toplam çözülen soru: <strong id="pomodoroTotalQuestions">${state.stats.totalQuestions || 0}</strong></div>
                            <div class="pomodoro-controls">
                                <button type="button" class="btn btn-primary btn-sm yks-pomodoro-button" id="pomodoroStartBtn">
                                    Başlat
                                </button>
                                <button type="button" class="btn btn-secondary btn-sm yks-pomodoro-button" id="pomodoroPauseBtn">
                                    Duraklat
                                </button>
                                <button type="button" class="btn btn-ghost btn-sm yks-pomodoro-button" id="pomodoroResetBtn">
                                    Sıfırla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const dailyTasksCard = `
                <div class="daily-tasks-card">
                    <h3><i class="ph ph-list-checks"></i> Bugünkü Görevler</h3>
                    <div class="tasks-list yks-tasks-list">
                        ${state.dailyTasks.map(task => `
                            <div class="task-item yks-task-item ${task.completed ? 'completed is-done' : ''}" data-task-id="${task.id}">
                                <button class="task-checkbox yks-task-check" type="button" onclick="YKSJourneyManager.toggleTask('${task.id}')">
                                    <i class="ph ${task.completed ? 'ph-check-circle-fill' : 'ph-circle'}"></i>
                                </button>
                                <div class="task-content">
                                    <div class="task-title">${task.title}</div>
                                    <div class="task-meta">
                                        ${task.description} • +${task.xp} XP
                                    </div>
                                </div>
                                <button class="task-action" type="button" onclick="YKSJourneyManager.startTask('${task.id}')">
                                    <i class="ph ph-play"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            const weeklyPlanCard = `
                <div class="weekly-plan-card">
                    <h3><i class="ph ph-calendar"></i> Haftalık Çalışma Planı</h3>
                    ${this.renderWeeklyPlan(state.weeklyPlan || {})}
                </div>
            `;

            const weakPointsCard = `
                <div class="weak-points-card">
                    <h3><i class="ph ph-warning-circle"></i> Zayıf Noktalar</h3>
                    <div class="weak-points-list">
                        ${state.weakPoints && state.weakPoints.length > 0 ? state.weakPoints.map(point => `
                            <div class="weak-point-item">
                                <div class="subject-info">
                                    <span class="subject-name">${point.subject}</span>
                                    <span class="accuracy ${this.getAccuracyClass(point.accuracy)}">
                                        %${point.accuracy} başarı
                                    </span>
                                </div>
                                <div class="accuracy-bar">
                                    <div class="accuracy-fill" style="width: ${point.accuracy}%"></div>
                                </div>
                                <button class="practice-btn btn btn-secondary btn-sm" type="button" onclick="YKSJourneyManager.practiceSubject('${point.subject}')">
                                    <i class="ph ph-brain"></i> Pratik Yap
                                </button>
                            </div>
                        `).join('') : `
                            <p class="empty-message">Henüz veri yok. Test çözdükçe zayıf noktalar belirlenecek.</p>
                        `}
                    </div>
                </div>
            `;

            const repetitionCard = `
                <div class="repetition-card">
                    <h3><i class="ph ph-arrows-clockwise"></i> Bugünün Tekrarları</h3>
                    ${this.renderSpacedRepetition(state)}
                </div>
            `;

            const statsCard = `
                <div class="stats-achievements">
                    <div class="stats-card">
                        <h3><i class="ph ph-chart-line-up"></i> İstatistikler</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-icon"><i class="ph ph-flame"></i></div>
                                <div class="stat-value">${state.stats.streakDays}</div>
                                <div class="stat-label">Gün Serisi</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon"><i class="ph ph-target"></i></div>
                                <div class="stat-value">${state.stats.totalQuestions}</div>
                                <div class="stat-label">Toplam Soru</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon"><i class="ph ph-lightning"></i></div>
                                <div class="stat-value">${state.stats.xp}</div>
                                <div class="stat-label">Toplam XP</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon"><i class="ph ph-trophy"></i></div>
                                <div class="stat-value">Seviye ${state.stats.level}</div>
                                <div class="stat-label">Mevcut Seviye</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const weeklyReportCard = this.renderWeeklyReport(state);

            const coachingCard = `
                <div class="coaching-card">
                    <h3><i class="ph ph-book-open"></i> YKS Koçluk İçerikleri</h3>
                    <div class="coaching-grid">
                        ${this.getCoachingContent(state).map(content => `
                            <article class="coaching-item" onclick="YKSJourneyManager.openContent('${content.id}')">
                                <div class="content-icon"><i class="ph ${content.icon}"></i></div>
                                <h4>${content.title}</h4>
                                <p>${content.description}</p>
                                ${content.recommended ? '<span class="recommended-badge">Önerilen</span>' : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;

            const legacyExtras = this.renderLegacyDashboardExtras(state);

            // --- Ana layout (kart grid + sayfalar) ---

            container.innerHTML = `
                <div class="yks-dashboard animate-fadeInUp">
                    ${headerHTML}

                    <!-- Kart grid -->
                    <section class="yks-section-grid" id="yksDashboardSectionGrid">
                        <button class="yks-section-card" data-section="overview">
                            <div class="card-icon"><i class="ph ph-target"></i></div>
                            <div class="card-title">Günlük Özet</div>
                            <div class="card-sub">${todayProgress}% tamamlandı</div>
                        </button>

                        <button class="yks-section-card" data-section="focus">
                            <div class="card-icon"><i class="ph ph-timer"></i></div>
                            <div class="card-title">Odak Zamanı</div>
                            <div class="card-sub">Pomodoro + toplam süre</div>
                        </button>

                        <button class="yks-section-card" data-section="tasks">
                            <div class="card-icon"><i class="ph ph-list-checks"></i></div>
                            <div class="card-title">Bugünkü Görevler</div>
                            <div class="card-sub">${state.dailyTasks.filter(t => t.completed).length} / ${state.dailyTasks.length} tamamlandı</div>
                        </button>

                        <button class="yks-section-card" data-section="plan">
                            <div class="card-icon"><i class="ph ph-calendar"></i></div>
                            <div class="card-title">Haftalık Plan</div>
                            <div class="card-sub">Haftanın çalışma programı</div>
                        </button>

                        <button class="yks-section-card" data-section="stats">
                            <div class="card-icon"><i class="ph ph-chart-line-up"></i></div>
                            <div class="card-title">İstatistikler</div>
                            <div class="card-sub">Soru, süre, seri, zayıf noktalar</div>
                        </button>

                        <button class="yks-section-card" data-section="report">
                            <div class="card-icon"><i class="ph ph-file-text"></i></div>
                            <div class="card-title">Haftalık Rapor</div>
                            <div class="card-sub">Haftanın özet değerlendirmesi</div>
                        </button>

                        <button class="yks-section-card" data-section="coach">
                            <div class="card-icon"><i class="ph ph-book-open-text"></i></div>
                            <div class="card-title">Koçluk İçerikleri</div>
                            <div class="card-sub">Strateji ve motivasyon</div>
                        </button>
                    </section>

                    <!-- Görünümler -->

                    <!-- 1) ÖZET -->
                    <section class="yks-section-view yks-daily-page" data-section="overview">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <h2>Günlük Özet</h2>
                        </div>
                        <div class="yks-detail-main">
                            ${todayProgressCard}
                            ${legacyExtras}
                        </div>
                    </section>

                    <!-- 2) POMODORO -->
                    <section class="yks-section-view yks-focus-page" data-section="focus">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <h2>Odak Zamanı</h2>
                        </div>
                        <div class="yks-detail-main">
                            ${pomodoroCard}
                        </div>
                    </section>

                    <!-- 3) GÜNLÜK GÖREVLER -->
                    <section class="yks-section-view yks-tasks-page" data-section="tasks">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <div class="section-view-title">
                                <h2>Bugünkü Görevler</h2>
                                <button type="button" class="btn btn-secondary btn-sm" id="yksEditTasksToggle">
                                    <i class="ph ph-pencil-simple"></i> Görevleri düzenle
                                </button>
                            </div>
                        </div>
                        <div class="yks-detail-main">
                            ${dailyTasksCard}
                            <div class="form-section" id="yksTasksEditPanel" hidden>
                                <label class="section-label">
                                    <i class="ph ph-list-plus"></i> Kendi görevlerini ekle
                                </label>
                                <p style="font-size:0.85rem; margin-top:0; margin-bottom:0.5rem;">
                                    Her satıra bir görev yaz. Örneğin: <em>40 dk TYT Fizik</em>, <em>20 soru Paragraf</em> gibi.
                                </p>
                                <textarea id="yksTasksCustomInput" rows="3" class="form-input" style="border-radius:12px;"></textarea>
                                <div style="margin-top:0.6rem; display:flex; gap:0.5rem; justify-content:flex-end;">
                                    <button type="button" class="btn btn-ghost btn-sm" id="yksTasksEditCancel">Kapat</button>
                                    <button type="button" class="btn btn-primary btn-sm" id="yksTasksEditSave">Görevleri ekle</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 4) HAFTALIK PLAN -->
                    <section class="yks-section-view yks-plan-page" data-section="plan">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <h2>Haftalık Çalışma Planı</h2>
                        </div>
                        <div class="yks-detail-main">
                            ${weeklyPlanCard}
                            <section class="weekly-progress">
                                <h2><i class="ph ph-calendar"></i> Haftalık ilerleme görünümü</h2>
                                <div class="week-grid">
                                    ${this.renderWeekBoxes()}
                                </div>
                            </section>
                        </div>
                    </section>

                    <!-- 5) İSTATİSTİKLER -->
                    <section class="yks-section-view yks-stats-page" data-section="stats">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <h2>İstatistikler & Zayıf Noktalar</h2>
                        </div>
                        <div class="yks-detail-main">
                            ${statsCard}
                            ${weakPointsCard}
                            ${repetitionCard}
                        </div>
                    </section>

                    <!-- 6) RAPOR -->
                    <section class="yks-section-view yks-report-page" data-section="report">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <h2>Haftalık Rapor</h2>
                        </div>
                        <div class="yks-detail-main">
                            ${weeklyReportCard || ''}
                        </div>
                    </section>

                    <!-- 7) KOÇLUK -->
                    <section class="yks-section-view yks-coach-page" data-section="coach">
                        <div class="section-view-header">
                            <button type="button" class="btn btn-ghost btn-sm" data-yks-back>
                                <i class="ph ph-arrow-left"></i> Kartlara dön
                            </button>
                            <h2>Koçluk İçerikleri</h2>
                        </div>
                        <div class="yks-detail-main">
                            ${coachingCard}
                        </div>
                    </section>
                </div>
            `;

            const root = container.querySelector('.yks-dashboard');

            // Kart → sayfa geçişi
            this.initSectionNavigation(root);

            // Eski dashboard event’leri (teste git vs.)
            this.attachDashboardEvents(container, state);

            // Pomodoro butonları
            this.initPomodoroControls(state);

            // Görev düzenleme paneli
            this.attachTaskEditEvents(container, state);
        },

        /**
         * Kart grid → section view geçişi
         */
        initSectionNavigation(root) {
            if (!root) return;

            const grid = root.querySelector('.yks-section-grid');
            const cards = root.querySelectorAll('.yks-section-card');
            const views = root.querySelectorAll('.yks-section-view');
            const backButtons = root.querySelectorAll('[data-yks-back]');

            if (!grid || !cards.length || !views.length) return;

            // Başlangıçta tüm view'lar kapalı
            views.forEach(v => v.style.display = 'none');

            const openSection = (id) => {
                grid.style.display = 'none';
                views.forEach(v => {
                    const active = v.getAttribute('data-section') === id;
                    v.style.display = active ? 'block' : 'none';
                    v.classList.toggle('active', active);
                    if (active) {
                        v.classList.add('animate-fadeInUp');
                    } else {
                        v.classList.remove('animate-fadeInUp');
                    }
                });
                cards.forEach(c => {
                    c.classList.toggle('yks-section-card-active', c.getAttribute('data-section') === id);
                });
                window.scrollTo({ top: root.offsetTop || 0, behavior: 'smooth' });
            };

            const backToGrid = () => {
                grid.style.display = 'grid';
                cards.forEach(c => c.classList.remove('yks-section-card-active'));
                views.forEach(v => {
                    v.style.display = 'none';
                    v.classList.remove('active', 'animate-fadeInUp');
                });
                window.scrollTo({ top: root.offsetTop || 0, behavior: 'smooth' });
            };

            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-section');
                    if (id) openSection(id);
                });
            });

            backButtons.forEach(btn => {
                btn.addEventListener('click', () => backToGrid());
            });
        },

        /**
         * Günlük görevler sayfasında "Görevleri düzenle" paneli
         */
        attachTaskEditEvents(container, state) {
            void state;

            const toggleBtn = container.querySelector('#yksEditTasksToggle');
            const panel = container.querySelector('#yksTasksEditPanel');
            const input = container.querySelector('#yksTasksCustomInput');
            const saveBtn = container.querySelector('#yksTasksEditSave');
            const cancelBtn = container.querySelector('#yksTasksEditCancel');

            if (!toggleBtn || !panel) return;

            const showPanel = (show) => {
                panel.hidden = !show;
            };

            toggleBtn.addEventListener('click', () => {
                showPanel(panel.hidden);
            });

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => showPanel(false));
            }

            if (saveBtn && input) {
                saveBtn.addEventListener('click', () => {
                    const text = (input.value || '').trim();
                    if (!text) {
                        if (window.Utils && typeof Utils.showToast === 'function') {
                            Utils.showToast('Lütfen her satıra bir görev yazarak alanı doldur.', 'warning');
                        }
                        return;
                    }

                    const lines = text
                        .split('\n')
                        .map(l => l.trim())
                        .filter(Boolean);

                    if (!lines.length) return;

                    const freshState = this.loadState();

                    const newTasks = lines.map(line => ({
                        id: this.generateId(),
                        title: line,
                        description: 'Kendi belirlediğin görev',
                        type: 'custom',
                        duration: 30,
                        subject: null,
                        completed: false,
                        xp: 25
                    }));

                    freshState.dailyTasks = (freshState.dailyTasks || []).concat(newTasks);
                    this.saveState(freshState);

                    showPanel(false);
                    input.value = '';

                    if (window.Utils && typeof Utils.showToast === 'function') {
                        Utils.showToast('Görevlerin eklendi.', 'success');
                    }

                    // Ekranı güncelle
                    this.init();
                });
            }
        },

        /**
         * Özet + seviye testi hatırlatıcısı + adımlar
         */
        renderLegacyDashboardExtras(state) {
            const profile = state.profile || {};
            const fieldKey = profile.field || 'genel';
            const fieldLabel =
                this.FIELD_LABELS[fieldKey] ||
                (this.FIELDS[fieldKey] && this.FIELDS[fieldKey].label) ||
                'Genel';

            const weakSubjects = profile.weakSubjects && profile.weakSubjects.length
                ? profile.weakSubjects
                : (profile.subjects || []);

            const subjectsText = weakSubjects.length ? weakSubjects.join(', ') : 'Henüz seçilmedi';

            const lastResult = state.levelTest && state.levelTest.lastResult;
            const hasCompletedLevelTest = !!lastResult;

            const solved = state.stats.solvedQuestions != null
                ? state.stats.solvedQuestions
                : (state.stats.totalQuestions || 0);
            const completedTests = state.stats.completedTests || 0;
            const streak = state.stats.streakDays || 0;
            const scoreDisplay = lastResult ? `${lastResult.score}%` : '--';

            return `
                <section class="user-summary">
                    <div class="summary-icon" aria-hidden="true">
                        <i class="ph ph-rocket-launch"></i>
                    </div>
                    <div class="summary-content">
                        <p><strong>Alan:</strong> ${fieldLabel}</p>
                        <p><strong>Öncelikli dersler:</strong> ${subjectsText}</p>
                        ${hasCompletedLevelTest
                ? '<p class="summary-subtitle">Seviye testine göre seni bekleyen özel hedefler hazır. Aşağıdaki adımlardan başlayabilirsin.</p>'
                : '<p class="summary-subtitle">Henüz seviye testini tamamlamadın. İstersen önce kısa bir seviye testi ile başlangıç seviyeni netleştirebilirsin.</p>'
            }
                    </div>
                </section>

                ${this.renderLevelTestReminderHTML(state)}

                <section class="journey-stats" aria-label="Yolculuk istatistikleri">
                    <article class="stat-box">
                        <i class="ph ph-list-bullets" aria-hidden="true"></i>
                        <div class="stat-content">
                            <span class="stat-value">${completedTests}</span>
                            <span class="stat-label">Tamamlanan test</span>
                        </div>
                    </article>
                    <article class="stat-box">
                        <i class="ph ph-target" aria-hidden="true"></i>
                        <div class="stat-content">
                            <span class="stat-value">${solved}</span>
                            <span class="stat-label">Çözülen soru</span>
                        </div>
                    </article>
                    <article class="stat-box">
                        <i class="ph ph-flame" aria-hidden="true"></i>
                        <div class="stat-content">
                            <span class="stat-value">${streak}</span>
                            <span class="stat-label">Günlük seri</span>
                        </div>
                    </article>
                    <article class="stat-box">
                        <i class="ph ph-brain" aria-hidden="true"></i>
                        <div class="stat-content">
                            <span class="stat-value">${scoreDisplay}</span>
                            <span class="stat-label">Seviye testi puanı</span>
                        </div>
                    </article>
                </section>

                <section class="today-steps">
                    <h2><i class="ph ph-calendar-check"></i> Bugünkü önerilen adımlar</h2>
                    <div class="steps-list">
                        <article class="step-card">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <i class="ph ph-list-bullets"></i>
                                <div>
                                    <strong>Hedef dersinden 1 kısa test çöz</strong>
                                    <small>Test sekmesinden alanına uygun bir deneme seçebilirsin.</small>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm" data-yks-action="go-tests">
                                Teste git
                            </button>
                        </article>
                        <article class="step-card">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <i class="ph ph-note-pencil"></i>
                                <div>
                                    <strong>Yanlışlara mini not çıkar</strong>
                                    <small>Notlarım sekmesinden tekrar görmek için kısa özetler yaz.</small>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm" data-yks-action="go-notes">
                                Notlara git
                            </button>
                        </article>
                        <article class="step-card">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <i class="ph ph-chart-line-up"></i>
                                <div>
                                    <strong>Gün sonu performansını kontrol et</strong>
                                    <small>Analizler sekmesinden netlerini ve süreni takip et.</small>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm" data-yks-action="go-analysis">
                                Analizlere git
                            </button>
                        </article>
                    </div>
                </section>

                <section class="recommended-tests">
                    <h2><i class="ph ph-target"></i> Sana özel test önerileri</h2>
                    <div class="tests-grid">
                        <article class="test-card">
                            <div class="test-card-header">
                                <div>
                                    <h4>Hızlı TYT Karışık Test</h4>
                                    <span class="test-level easy">Kolay</span>
                                </div>
                                <i class="ph ph-lightning"></i>
                            </div>
                            <div class="test-meta">
                                <span><i class="ph ph-list-bullets"></i> 10 soru</span>
                                <span><i class="ph ph-timer"></i> ~12 dk</span>
                            </div>
                            <button type="button" class="btn btn-primary btn-sm" data-yks-action="start-quick-tyt">
                                Başlat
                            </button>
                        </article>

                        <article class="test-card">
                            <div class="test-card-header">
                                <div>
                                    <h4>Zorlandığın ders odaklı test</h4>
                                    <span class="test-level medium">Orta</span>
                                </div>
                                <i class="ph ph-target"></i>
                            </div>
                            <div class="test-meta">
                                <span><i class="ph ph-list-bullets"></i> 15 soru</span>
                                <span><i class="ph ph-hourglass-simple"></i> ~20 dk</span>
                            </div>
                            <button type="button" class="btn btn-primary btn-sm" data-yks-action="custom-from-journey">
                                Özel test oluştur
                            </button>
                        </article>
                    </div>
                </section>

                <section class="weekly-progress">
                    <h2><i class="ph ph-calendar"></i> Haftalık ilerleme görünümü</h2>
                    <div class="week-grid">
                        ${this.renderWeekBoxes()}
                    </div>
                </section>
            `;
        },

        /**
         * Haftalık plan görünümü
         */
        renderWeeklyPlan(weeklyPlan) {
            const days = Object.keys(weeklyPlan || {});
            const today = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date().getDay()];

            if (!days.length) {
                return `<p class="empty-message">Henüz haftalık plan oluşturulmadı.</p>`;
            }

            return `
                <div class="weekly-plan-grid">
                    ${days.map(day => `
                        <div class="day-plan ${day === today ? 'today' : ''}">
                            <div class="day-header">
                                <span class="day-name">${day}</span>
                                ${day === today ? '<span class="today-badge">Bugün</span>' : ''}
                            </div>
                            <div class="day-sessions">
                                ${weeklyPlan[day].map(session => `
                                    <div class="session-item ${session.completed ? 'completed' : ''}">
                                        <i class="ph ${session.completed ? 'ph-check-circle' : 'ph-clock'}"></i>
                                        <div class="session-details">
                                            <div class="session-title">${session.duration}dk ${session.subject}</div>
                                            <div class="session-topic">${session.topic}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        /**
         * Spaced repetition görünümü
         */
        renderSpacedRepetition(state) {
            const repetitions = this.getSpacedRepetitions(state);

            if (!repetitions.length) {
                return '<p class="empty-message">Bugün tekrar edilecek konu yok.</p>';
            }

            return `
                <div class="repetition-list">
                    ${repetitions.map(rep => `
                        <div class="repetition-item">
                            <div class="rep-subject">${rep.subject}</div>
                            <div class="rep-topics">${rep.topics.join(', ')}</div>
                            <button class="btn btn-sm btn-primary" type="button" onclick="YKSJourneyManager.startRepetition('${rep.id}')">
                                <i class="ph ph-play"></i> Başla
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        renderBadges(earnedBadges) {
            const allBadges = Object.entries(this.BADGES);
            return allBadges.map(([key, badge]) => {
                const earned = earnedBadges.includes(key);
                return `
                    <div class="badge-item ${earned ? 'earned' : 'locked'}">
                        <div class="badge-icon">${badge.icon}</div>
                        <div class="badge-name">${badge.name}</div>
                        <div class="badge-xp">+${badge.xp} XP</div>
                    </div>
                `;
            }).join('');
        },

        renderWeeklyReport(state) {
            const report = this.generateWeeklyReport(state);
            if (!report) return '';

            return `
                <div class="weekly-report-card">
                    <h3><i class="ph ph-file-text"></i> Bu Haftanın Raporu</h3>
                    <div class="report-content">
                        <div class="report-stats">
                            <div class="report-stat">
                                <span class="label">Toplam Çalışma:</span>
                                <span class="value">${this.formatTime(report.totalTime)}</span>
                            </div>
                            <div class="report-stat">
                                <span class="label">Çözülen Soru:</span>
                                <span class="value">${report.totalQuestions}</span>
                            </div>
                            <div class="report-stat">
                                <span class="label">En Çok Gelişim:</span>
                                <span class="value">${report.mostImproved}</span>
                            </div>
                            <div class="report-stat">
                                <span class="label">Odaklanılacak:</span>
                                <span class="value">${report.needsFocus}</span>
                            </div>
                        </div>
                        <div class="report-message">
                            <p>${report.message}</p>
                        </div>
                        <div class="report-recommendations">
                            <h4>Önümüzdeki Hafta İçin Öneriler:</h4>
                            <ul>
                                ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        },

        getCoachingContent(state) {
            const contents = [
                {
                    id: 'goal-setting',
                    title: 'YKS\'de Hedef Belirleme',
                    description: 'Gerçekçi ve ulaşılabilir hedefler nasıl belirlenir?',
                    icon: 'ph-target',
                    recommended: !state.profile || !state.profile.targetRank
                },
                {
                    id: 'time-management',
                    title: 'Zaman Yönetimi',
                    description: 'Verimli ders çalışma teknikleri ve zaman planlaması',
                    icon: 'ph-clock',
                    recommended: state.profile && state.profile.dailyTime < 2
                },
                {
                    id: 'stress-management',
                    title: 'Sınav Stresi ile Başa Çıkma',
                    description: 'Kaygı ve stres yönetimi teknikleri',
                    icon: 'ph-heart',
                    recommended: state.stats.streakDays < 3
                },
                {
                    id: 'last-3-months',
                    title: 'Son 3 Ay Stratejisi',
                    description: 'Sınava son dönemde nasıl çalışılmalı?',
                    icon: 'ph-calendar-x',
                    recommended: this.daysUntilExam() < 90
                }
            ];

            return contents;
        },

        /**
         * Helper fonksiyonlar
         */
        calculateTodayProgress(state) {
            const completed = state.dailyTasks.filter(t => t.completed).length;
            const total = state.dailyTasks.length;
            return total > 0 ? Math.round((completed / total) * 100) : 0;
        },

        calculateWeeklyProgress(state) {
            void state;
            // Şimdilik örnek
            return 65;
        },

        getTodayStudyTime(state) {
            return state.dailyTasks
                .filter(t => t.completed)
                .reduce((sum, t) => sum + t.duration, 0);
        },

        getTodayXP(state) {
            return state.dailyTasks
                .filter(t => t.completed)
                .reduce((sum, t) => sum + t.xp, 0);
        },

        formatTime(minutes) {
            const total = Math.round(minutes || 0);
            const hours = Math.floor(total / 60);
            const mins = total % 60;
            if (hours > 0) {
                return `${hours}s ${mins}dk`;
            }
            return `${mins}dk`;
        },

        getAccuracyClass(accuracy) {
            if (accuracy >= 80) return 'high';
            if (accuracy >= 60) return 'medium';
            return 'low';
        },

        getRandomTopic(subject, type) {
            const topics = this.TOPICS[subject];
            if (!topics) return 'Genel Tekrar';

            const topicList = topics[type.toLowerCase()] || topics.tyt || ['Genel Konu'];
            return topicList[Math.floor(Math.random() * topicList.length)];
        },

        daysUntilExam() {
            return Math.ceil((this.EXAM_DATE - new Date()) / (1000 * 60 * 60 * 24));
        },

        getSpacedRepetitions(state) {
            // Şimdilik boş – ileride gerçek algoritma ile doldurulabilir
            void state;
            return [];
        },

        generateWeeklyReport(state) {
            // Şimdilik örnek statik rapor
            void state;
            return {
                totalTime: 420,
                totalQuestions: 850,
                mostImproved: 'Matematik',
                needsFocus: 'Paragraf',
                message: "Bu hafta harika bir performans gösterdin! Matematik'te belirgin bir gelişim var.",
                recommendations: [
                    'Paragraf çözümüne günde 30 dakika ayır',
                    'Hafta sonu bir TYT denemesi çöz',
                    'Geometri formüllerini tekrar et'
                ]
            };
        },

        /**
         * Action Methods
         */
        toggleTask(taskId) {
            const state = this.loadState();
            const task = state.dailyTasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                if (task.completed) {
                    state.stats.xp += task.xp;
                    state.stats.totalQuestions += Math.round(task.duration / 2); // örnek
                    this.checkBadges(state);
                }
                this.saveState(state);
                this.init();
            }
        },

        startTask(taskId) {
            sessionStorage.setItem('yks_task', taskId);
            if (window.App && typeof window.App.switchTab === 'function') {
                window.App.switchTab('test');
            } else {
                const tabBtn = document.getElementById('tab-test');
                if (tabBtn) tabBtn.click();
            }
        },

        practiceSubject(subject) {
            sessionStorage.setItem('yks_practice_subject', subject);
            if (window.App && typeof window.App.switchTab === 'function') {
                window.App.switchTab('test');
            } else {
                const tabBtn = document.getElementById('tab-test');
                if (tabBtn) tabBtn.click();
            }
        },

        startRepetition(repId) {
            console.log('Tekrar başlatılıyor:', repId);
        },

        openContent(contentId) {
            console.log('İçerik açılıyor:', contentId);
        },

        editProfile() {
            // Profili sıfırla ve onboarding'e dön
            const fresh = this.createDefaultState();
            this.saveState(fresh);
            this.init();
        },

        checkBadges(state) {
            const badges = state.stats.badges || [];

            // Soru sayısı rozetleri
            if (state.stats.totalQuestions >= 100 && !badges.includes('beginner')) {
                badges.push('beginner');
                state.stats.xp += this.BADGES.beginner.xp;
            }
            if (state.stats.totalQuestions >= 1000 && !badges.includes('solver')) {
                badges.push('solver');
                state.stats.xp += this.BADGES.solver.xp;
            }

            // Seri rozetleri
            if (state.stats.streakDays >= 7 && !badges.includes('consistent')) {
                badges.push('consistent');
                state.stats.xp += this.BADGES.consistent.xp;
            }

            state.stats.badges = badges;
            state.stats.level = Math.floor(state.stats.xp / 500) + 1;
        },

        /**
         * Test/çözüm ekranlarından soru sayısını artırmak için
         * örn: window.TestifyYKS.addSolvedQuestions(20)
         */
        addSolvedQuestions(count) {
            const n = Number(count || 0);
            if (!Number.isFinite(n) || n <= 0) return;

            const state = this.loadState();
            state.stats.totalQuestions = (state.stats.totalQuestions || 0) + n;

            // Eski alanla uyum
            if (state.stats.solvedQuestions != null) {
                state.stats.solvedQuestions += n;
            }

            this.saveState(state);

            const el = document.getElementById('pomodoroTotalQuestions');
            if (el) {
                el.textContent = state.stats.totalQuestions || 0;
            }
        },

        /**
         * Utility
         */
        generateId() {
            return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        shuffleArray(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        },

        /**
         * Seviye testi kartları (dashboard içinde kullanılan)
         */
        renderLevelTestReminderHTML(state) {
            const profile = state.profile;
            if (!profile) return '';

            const levelTest = state.levelTest || { status: 'not_started', lastResult: null };
            const pref = profile.levelTestPreference || 'never';

            if (levelTest.status === 'completed' && levelTest.lastResult) {
                const r = levelTest.lastResult;
                return `
                    <section class="level-test-optional">
                        <i class="ph ph-seal-check"></i>
                        <div class="card-content">
                            <h3>Seviye testi tamamlandı</h3>
                            <p>Son sonucun: <strong>${r.correct}/${r.total}</strong> (${r.score}%). İstersen testi tekrar edebilirsin.</p>
                        </div>
                        <div class="card-actions">
                            <button type="button" class="btn btn-secondary btn-sm" id="yksRetakeLevelTestBtn">
                                Tekrar çöz
                            </button>
                        </div>
                    </section>
                `;
            }

            if (pref === 'never') {
                return `
                    <section class="level-test-optional">
                        <i class="ph ph-info"></i>
                        <div class="card-content">
                            <h3>İstersen seviye testi ekleyebilirsin</h3>
                            <p>Başlangıçta seviye testi istememiştin. Fikrin değişirse kısa bir test ile seviyeni ölçebiliriz.</p>
                        </div>
                        <div class="card-actions">
                            <button type="button" class="btn btn-primary btn-sm" id="yksStartLevelTestBtn">
                                Seviye testine başla
                            </button>
                        </div>
                    </section>
                `;
            }

            return `
                <section class="level-test-reminder">
                    <i class="ph ph-rocket-launch"></i>
                    <div class="card-content">
                        <h3>Seviye belirleme sınavını tamamla</h3>
                        <p>Seçtiğin alandaki derslerden kısa sorularla seviyeni netleştirelim.</p>
                    </div>
                    <div class="reminder-actions">
                        <button type="button" class="btn btn-primary btn-sm" id="yksStartLevelTestBtn">
                            Şimdi başla
                        </button>
                    </div>
                </section>
            `;
        },

        renderWeekBoxes() {
            const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            const todayIndex = new Date().getDay(); // 0: Pazar, 1: Pazartesi...

            return days.map((d, i) => {
                const isToday = (i === (todayIndex === 0 ? 6 : todayIndex - 1));
                const classes = ['day-box'];
                if (isToday) classes.push('today');
                return `
                    <div class="${classes.join(' ')}">
                        <span class="day-name">${d}</span>
                        <i class="ph ph-check-circle"></i>
                    </div>
                `;
            }).join('');
        },

        /**
         * Dashboard event’leri (seviye testi başlat/tekrar + sekme yönlendirmeleri)
         */
        attachDashboardEvents(container, state) {
            const self = this;
            void state;

            const startLevelBtn = container.querySelector('#yksStartLevelTestBtn');
            if (startLevelBtn) {
                startLevelBtn.addEventListener('click', () => {
                    self.startLevelTest();
                });
            }

            const retakeBtn = container.querySelector('#yksRetakeLevelTestBtn');
            if (retakeBtn) {
                retakeBtn.addEventListener('click', () => {
                    self.startLevelTest();
                });
            }

            // Yönlendirme butonları
            container.querySelectorAll('[data-yks-action="go-tests"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.App && typeof window.App.switchTab === 'function') {
                        window.App.switchTab('test');
                    } else {
                        const tabBtn = document.getElementById('tab-test');
                        if (tabBtn) tabBtn.click();
                    }
                });
            });

            container.querySelectorAll('[data-yks-action="go-notes"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.App && typeof window.App.switchTab === 'function') {
                        window.App.switchTab('notes');
                    } else {
                        const tabBtn = document.getElementById('tab-notes');
                        if (tabBtn) tabBtn.click();
                    }
                });
            });

            container.querySelectorAll('[data-yks-action="go-analysis"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.App && typeof window.App.switchTab === 'function') {
                        window.App.switchTab('analysis');
                    } else {
                        const tabBtn = document.getElementById('tab-analysis');
                        if (tabBtn) tabBtn.click();
                    }
                });
            });

            container.querySelectorAll('[data-yks-action="start-quick-tyt"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.App && typeof window.App.switchTab === 'function') {
                        window.App.switchTab('test');
                    } else {
                        const tabBtn = document.getElementById('tab-test');
                        if (tabBtn) tabBtn.click();
                    }
                });
            });

            container.querySelectorAll('[data-yks-action="custom-from-journey"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.App && typeof window.App.switchTab === 'function') {
                        window.App.switchTab('create');
                    } else {
                        const tabBtn = document.getElementById('tab-create');
                        if (tabBtn) tabBtn.click();
                    }
                });
            });
        },

        /**
         * Seviye testi giriş noktası
         */
        startLevelTest() {
            const container = document.getElementById('journeyContent');
            if (!container) return;

            const state = this.loadState();
            state.levelTest = state.levelTest || { status: 'not_started', lastResult: null };
            state.levelTest.status = 'in_progress';
            this.saveState(state);

            this.renderLevelTest(container, state);
        },

        /**
         * Seviye testi ekranı
         */
        renderLevelTest(container, state) {
            const self = this;
            const profile = state.profile || { field: 'genel' };
            const fieldKey = profile.field || 'genel';

            const api = window.YKSQuestionPoolAPI;
            const questions = api && typeof api.getLevelTestQuestionsPerSubject === 'function'
                ? api.getLevelTestQuestionsPerSubject(fieldKey, 3)
                : api && typeof api.getLevelTestQuestions === 'function'
                    ? api.getLevelTestQuestions(fieldKey, 12)
                    : [];

            if (!questions || !questions.length) {
                container.innerHTML = `
                    <div class="yks-dashboard animate-fadeInUp">
                        <div class="user-summary">
                            <div class="summary-icon">
                                <i class="ph ph-warning"></i>
                            </div>
                            <div class="summary-content">
                                <p><strong>Seviye testi için soru havuzu bulunamadı.</strong></p>
                                <p class="summary-subtitle">yks-question-pool.js dosyasına alanına göre daha fazla soru ekledikten sonra bu alanı kullanabilirsin.</p>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" id="yksBackToDashboardBtn">
                            YKS Dashboard&apos;a dön
                        </button>
                    </div>
                `;
                const backBtn = container.querySelector('#yksBackToDashboardBtn');
                if (backBtn) {
                    backBtn.addEventListener('click', () => {
                        state.levelTest.status = 'not_started';
                        self.saveState(state);
                        self.renderMainDashboard(container, state);
                    });
                }
                return;
            }

            let currentIndex = 0;
            const userAnswers = new Array(questions.length).fill(null);

            container.innerHTML = `
                <div class="level-test-container animate-fadeInUp">
                    <header class="level-test-header">
                        <h2><i class="ph ph-rocket-launch"></i> Seviye Belirleme Sınavı</h2>
                        <button type="button" class="btn btn-secondary btn-sm" id="yksExitLevelTestBtn">
                            Yolculuğa dön
                        </button>
                    </header>

                    <section class="test-progress">
                        <div class="progress-info">
                            <span id="yksLevelQuestionInfo">Soru 1 / ${questions.length}</span>
                            <span id="yksLevelProgressPercent">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="yksLevelProgressFill" style="width: 0%;"></div>
                        </div>
                    </section>

                    <section class="question-container" id="yksLevelQuestionContainer">
                    </section>

                    <nav class="test-navigation">
                        <button type="button" class="btn btn-secondary" id="yksLevelPrevBtn" disabled>Önceki</button>
                        <button type="button" class="btn btn-primary" id="yksLevelNextBtn">Sonraki</button>
                        <button type="button" class="btn btn-primary" id="yksLevelFinishBtn" style="display:none;">Testi Bitir</button>
                    </nav>
                </div>
            `;

            const questionContainer = container.querySelector('#yksLevelQuestionContainer');
            const prevBtn = container.querySelector('#yksLevelPrevBtn');
            const nextBtn = container.querySelector('#yksLevelNextBtn');
            const finishBtn = container.querySelector('#yksLevelFinishBtn');
            const infoEl = container.querySelector('#yksLevelQuestionInfo');
            const percentEl = container.querySelector('#yksLevelProgressPercent');
            const progressFill = container.querySelector('#yksLevelProgressFill');
            const exitBtn = container.querySelector('#yksExitLevelTestBtn');

            function updateProgress() {
                const idx = currentIndex + 1;
                const percent = Math.round((idx / questions.length) * 100);
                infoEl.textContent = `Soru ${idx} / ${questions.length}`;
                percentEl.textContent = `${percent}%`;
                progressFill.style.width = percent + '%';
            }

            function renderQuestion() {
                const q = questions[currentIndex];
                const letters = ['A', 'B', 'C', 'D', 'E'];
                const selectedIndex = userAnswers[currentIndex];

                questionContainer.innerHTML = `
                    <h3 class="question-text">${q.text}</h3>
                    <div class="options-grid">
                        ${q.choices.map((choice, i) => `
                            <button type="button" class="option-button ${selectedIndex === i ? 'selected' : ''}" data-index="${i}">
                                <span class="option-letter">${letters[i] || ''}</span>
                                <span>${choice}</span>
                            </button>
                        `).join('')}
                    </div>
                `;

                questionContainer.querySelectorAll('.option-button').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = Number(btn.getAttribute('data-index'));
                        userAnswers[currentIndex] = idx;
                        questionContainer.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                    });
                });

                prevBtn.disabled = currentIndex === 0;
                if (currentIndex === questions.length - 1) {
                    nextBtn.style.display = 'inline-flex';
                    nextBtn.style.visibility = 'hidden';
                    finishBtn.style.display = 'inline-flex';
                } else {
                    nextBtn.style.display = 'inline-flex';
                    nextBtn.style.visibility = 'visible';
                    finishBtn.style.display = 'none';
                }

                updateProgress();
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        renderQuestion();
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentIndex < questions.length - 1) {
                        currentIndex++;
                        renderQuestion();
                    }
                });
            }

            if (finishBtn) {
                finishBtn.addEventListener('click', () => {
                    const result = self.calculateLevelTestResult(questions, userAnswers);
                    state.levelTest = {
                        status: 'completed',
                        lastResult: result
                    };
                    self.saveState(state);
                    self.renderLevelResults(container, state, result);
                });
            }

            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    state.levelTest.status = 'not_started';
                    self.saveState(state);
                    self.renderMainDashboard(container, state);
                });
            }

            state.levelTest.status = 'in_progress';
            this.saveState(state);
            renderQuestion();
        },

        calculateLevelTestResult(questions, answers) {
            let correct = 0;
            for (let i = 0; i < questions.length; i++) {
                if (answers[i] === questions[i].correctIndex) {
                    correct++;
                }
            }
            const total = questions.length;
            const score = total > 0 ? Math.round((correct / total) * 100) : 0;

            let levelClass = 'level-weak';
            let levelLabel = 'Geliştirmeye açık';
            if (score >= 80) {
                levelClass = 'level-excellent';
                levelLabel = 'Çok iyi';
            } else if (score >= 60) {
                levelClass = 'level-good';
                levelLabel = 'İyi';
            } else if (score >= 40) {
                levelClass = 'level-medium';
                levelLabel = 'Orta';
            }

            return {
                correct,
                total,
                score,
                levelClass,
                levelLabel
            };
        },

        renderLevelResults(container, state, result) {
            const profile = state.profile || { field: 'genel', subjects: [] };
            const fieldLabel =
                this.FIELD_LABELS[profile.field] ||
                (this.FIELDS[profile.field] && this.FIELDS[profile.field].label) ||
                'Genel';

            container.innerHTML = `
                <div class="level-test-container animate-fadeInUp">
                    <header class="level-test-header">
                        <h2><i class="ph ph-rocket-launch"></i> Seviye Testi Sonucu</h2>
                    </header>

                    <section class="level-results-section">
                        <h3><i class="ph ph-seal-check"></i> Genel Durumun</h3>

                        <div class="level-results-grid">
                            <article class="level-result-card ${result.levelClass}">
                                <i class="ph ph-target"></i>
                                <strong>Doğru / Toplam</strong>
                                <span>${result.correct} / ${result.total}</span>
                                <div class="level-badge">${result.levelLabel}</div>
                                <div class="level-bar">
                                    <div class="level-fill" style="width: ${result.score}%;"></div>
                                </div>
                            </article>

                            <article class="level-result-card">
                                <i class="ph ph-book-open-text"></i>
                                <strong>Alan</strong>
                                <span>${fieldLabel}</span>
                                <div class="level-badge">YKS ${fieldLabel}</div>
                            </article>
                        </div>

                        <div class="level-recommendations">
                            <h4>Önerilen sonraki adımlar</h4>
                            <ul>
                                <li><strong>Hedef derslerinden kısa testler çöz:</strong> Test sekmesinden 10–15 soruluk mini denemeler seç.</li>
                                <li><strong>Yanlışlarına odaklan:</strong> Özellikle zorlandığın dersleri filtreleyerek tekrar çöz.</li>
                                <li><strong>Not çıkar:</strong> Notlarım sekmesinde kavram ve soru tipi bazlı kısa özetler yaz.</li>
                            </ul>
                        </div>
                    </section>

                    <div class="test-navigation">
                        <button type="button" class="btn btn-secondary" id="yksResultToDashboardBtn">
                            Yolculuk Dashboard&apos;una dön
                        </button>
                        <button type="button" class="btn btn-primary" id="yksResultRetakeBtn">
                            Seviye testini tekrar çöz
                        </button>
                    </div>
                </div>
            `;
            const toDashboardBtn = container.querySelector('#yksResultToDashboardBtn');
            const retakeBtn = container.querySelector('#yksResultRetakeBtn');
            const self = this;

            if (toDashboardBtn) {
                toDashboardBtn.addEventListener('click', () => {
                    self.renderMainDashboard(container, state);
                });
            }

            if (retakeBtn) {
                retakeBtn.addEventListener('click', () => {
                    state.levelTest.status = 'in_progress';
                    self.saveState(state);
                    self.renderLevelTest(container, state);
                });
            }
        },

        /**
         * Eski beginTest için geriye dönük uyumluluk
         */
        beginTest() {
            this.startLevelTest();
        },

        /**
         * Pomodoro kontrolü
         */
        initPomodoroControls(state) {
            const timeEl = document.getElementById('pomodoroTimeDisplay');
            const focusEl = document.getElementById('pomodoroTotalFocus');
            const questionsEl = document.getElementById('pomodoroTotalQuestions');
            const startBtn = document.getElementById('pomodoroStartBtn');
            const pauseBtn = document.getElementById('pomodoroPauseBtn');
            const resetBtn = document.getElementById('pomodoroResetBtn');

            if (!timeEl || !startBtn || !pauseBtn || !resetBtn) return;

            // Mevcut state'i yansıt
            if (!this.pomodoro) {
                this.pomodoro = { intervalId: null, seconds: 0, running: false };
            }

            timeEl.textContent = this.formatPomodoroSeconds(this.pomodoro.seconds);
            if (focusEl) focusEl.textContent = this.formatTime(state.stats.studyTime || 0);
            if (questionsEl) questionsEl.textContent = state.stats.totalQuestions || 0;

            const self = this;

            startBtn.onclick = function () {
                if (self.pomodoro.running) return;
                self.pomodoro.running = true;

                self.pomodoro.intervalId = setInterval(() => {
                    self.pomodoro.seconds += 1;
                    const timeElInner = document.getElementById('pomodoroTimeDisplay');
                    if (timeElInner) {
                        timeElInner.textContent = self.formatPomodoroSeconds(self.pomodoro.seconds);
                    }

                    // Her 60 sn'de bir çalışma süresine 1 dk ekle
                    if (self.pomodoro.seconds % 60 === 0) {
                        const st = self.loadState();
                        st.stats.studyTime = (st.stats.studyTime || 0) + 1;
                        self.saveState(st);
                        const focusInner = document.getElementById('pomodoroTotalFocus');
                        if (focusInner) {
                            focusInner.textContent = self.formatTime(st.stats.studyTime || 0);
                        }
                    }
                }, 1000);
            };

            pauseBtn.onclick = function () {
                self.stopPomodoroTimer();
            };

            resetBtn.onclick = function () {
                self.stopPomodoroTimer();
                self.pomodoro.seconds = 0;
                const timeElInner = document.getElementById('pomodoroTimeDisplay');
                if (timeElInner) {
                    timeElInner.textContent = self.formatPomodoroSeconds(0);
                }
            };
        },

        stopPomodoroTimer() {
            if (this.pomodoro && this.pomodoro.intervalId) {
                clearInterval(this.pomodoro.intervalId);
                this.pomodoro.intervalId = null;
            }
            if (this.pomodoro) {
                this.pomodoro.running = false;
            }
        },

        formatPomodoroSeconds(totalSeconds) {
            const sec = totalSeconds || 0;
            const minutes = Math.floor(sec / 60);
            const seconds = sec % 60;
            const mm = minutes.toString().padStart(2, '0');
            const ss = seconds.toString().padStart(2, '0');
            return `${mm}:${ss}`;
        }
    };

    // Export
    window.YKSJourneyManager = YKSJourneyManager;

    // Test/çözüm ekranlarından kullanmak için
    window.TestifyYKS = window.TestifyYKS || {};
    window.TestifyYKS.addSolvedQuestions = function (count) {
        YKSJourneyManager.addSolvedQuestions(count);
    };

    // DOM yüklendiğinde otomatik başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => YKSJourneyManager.init());
    } else {
        YKSJourneyManager.init();
    }
})();
