/**
 * YKS Journey Manager - TAM SİSTEM
 * Seviye testi, kişiselleştirme ve ilerleme takibi
 */

'use strict';

const YKSJourney = {
    // Kullanıcı tercihleri ve durumu
    preferences: {
        field: null,
        difficultSubjects: [],
        levelTestPreference: null,
        levelTestCompleted: false,
        levelTestResults: {},
        onboardingCompleted: false,
        dailyGoals: [],
        weeklyProgress: {},
        totalStudyTime: 0,
        lastVisit: null
    },

    // Seviye testi durumu
    levelTest: {
        isActive: false,
        questions: [],
        currentIndex: 0,
        answers: [],
        startTime: null,
        subjects: []
    },

    // Ders ve konu yapısı
    subjects: {
        tyt: [
            { code: 'tyt-turkce', name: 'TYT Türkçe', icon: 'book-open' },
            { code: 'tyt-matematik', name: 'TYT Matematik', icon: 'calculator' },
            { code: 'tyt-fen', name: 'TYT Fen Bilimleri', icon: 'atom' },
            { code: 'tyt-sosyal', name: 'TYT Sosyal Bilimler', icon: 'globe' }
        ],
        ayt_sayisal: [
            { code: 'ayt-matematik', name: 'AYT Matematik', icon: 'function' },
            { code: 'ayt-fizik', name: 'AYT Fizik', icon: 'lightning' },
            { code: 'ayt-kimya', name: 'AYT Kimya', icon: 'flask' },
            { code: 'ayt-biyoloji', name: 'AYT Biyoloji', icon: 'dna' }
        ],
        ayt_sozel: [
            { code: 'ayt-edebiyat', name: 'AYT Edebiyat', icon: 'pen-nib' },
            { code: 'ayt-tarih', name: 'AYT Tarih', icon: 'scroll' },
            { code: 'ayt-cografya', name: 'AYT Coğrafya', icon: 'map-pin' },
            { code: 'ayt-felsefe', name: 'AYT Felsefe', icon: 'brain' }
        ],
        ayt_dil: [
            { code: 'ayt-ingilizce', name: 'AYT İngilizce', icon: 'translate' }
        ]
    },

    // Seviye testi soruları (örnek)
    levelTestQuestions: {
        'tyt-matematik': [
            {
                q: '2x + 5 = 13 denkleminde x kaçtır?',
                o: ['2', '3', '4', '5'],
                a: 2,
                difficulty: 'easy'
            },
            {
                q: 'Bir üçgenin iç açılarının toplamı kaç derecedir?',
                o: ['90', '180', '270', '360'],
                a: 1,
                difficulty: 'easy'
            },
            {
                q: 'f(x) = 3x² - 2x + 1 fonksiyonunda f(2) değeri kaçtır?',
                o: ['7', '8', '9', '10'],
                a: 2,
                difficulty: 'medium'
            }
        ],
        'tyt-turkce': [
            {
                q: 'Aşağıdakilerden hangisi fiilimsi değildir?',
                o: ['Koşarak', 'Güzel', 'Okumak', 'Gelen'],
                a: 1,
                difficulty: 'easy'
            }
        ],
        'ayt-fizik': [
            {
                q: 'Newton\'un ikinci yasası hangi formülle ifade edilir?',
                o: ['F = ma', 'E = mc²', 'V = IR', 'P = IV'],
                a: 0,
                difficulty: 'easy'
            }
        ]
    },

    /**
     * Başlatma
     */
    init() {
        console.log('🎓 YKS Journey başlatılıyor...');

        this.loadPreferences();
        this.checkDailyReset();
        this.renderJourneyContent();
        this.updateGlobalStats();
    },

    /**
     * Tercihleri yükle
     */
    loadPreferences() {
        const saved = localStorage.getItem('yks_journey_preferences');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.preferences = { ...this.preferences, ...parsed };
            } catch (e) {
                console.error('Tercihler yüklenemedi:', e);
            }
        }
    },

    /**
     * Tercihleri kaydet
     */
    savePreferences() {
        localStorage.setItem('yks_journey_preferences', JSON.stringify(this.preferences));
    },

    /**
     * Günlük sıfırlama kontrolü
     */
    checkDailyReset() {
        const today = new Date().toDateString();
        const lastVisit = this.preferences.lastVisit;

        if (lastVisit !== today) {
            // Yeni gün, hedefleri sıfırla
            this.preferences.dailyGoals = [];
            this.preferences.lastVisit = today;
            this.savePreferences();
        }
    },

    /**
     * Global istatistikleri güncelle
     */
    updateGlobalStats() {
        // Header'daki YKS bilgilerini güncelle
        const userData = window.StorageManager ? StorageManager.getUserData() : {};
        if (this.preferences.onboardingCompleted && userData) {
            userData.yksField = this.preferences.field;
            userData.yksLevel = this.calculateOverallLevel();
            if (window.StorageManager) {
                StorageManager.updateUserData(userData);
            }
        }
    },

    /**
     * Genel seviye hesapla
     */
    calculateOverallLevel() {
        const results = this.preferences.levelTestResults;
        if (!results || Object.keys(results).length === 0) return 'belirsiz';

        const levels = { 'weak': 1, 'medium': 2, 'good': 3, 'excellent': 4 };
        const values = Object.values(results).map(l => levels[l] || 2);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;

        if (avg < 1.5) return 'başlangıç';
        if (avg < 2.5) return 'orta';
        if (avg < 3.5) return 'iyi';
        return 'ileri';
    },

    /**
     * Ana içeriği render et
     */
    renderJourneyContent() {
        const container = document.getElementById('journeyContent');
        if (!container) return;

        if (!this.preferences.onboardingCompleted) {
            this.renderOnboarding(container);
        } else if (this.levelTest.isActive) {
            this.renderLevelTest(container);
        } else {
            this.renderDashboard(container);
        }
    },

    /**
     * Onboarding ekranı
     */
    renderOnboarding(container) {
        container.innerHTML = `
            <div class="yks-onboarding">
                <div class="onboarding-header animate-fadeInDown">
                    <h1>
                        <i class="ph ph-rocket-launch icon"></i>
                        YKS Yolculuğunu Başlat
                    </h1>
                    <p>3 kısa adımda ekranını sana göre ayarlayalım.</p>
                </div>

                <div class="onboarding-form animate-fadeInUp">
                    <!-- Step 1: Alan Seçimi -->
                    <div class="onboarding-step">
                        <label class="step-label">
                            <span class="step-number">1</span>
                            Alanını seç
                        </label>
                        <div class="field-options">
                            <button class="field-option" data-field="sayisal" tabindex="0">
                                <i class="ph ph-calculator icon"></i>
                                <span>Sayısal</span>
                            </button>
                            <button class="field-option" data-field="esit-agirlik" tabindex="0">
                                <i class="ph ph-scales icon"></i>
                                <span>Eşit Ağırlık</span>
                            </button>
                            <button class="field-option" data-field="sozel" tabindex="0">
                                <i class="ph ph-book-open icon"></i>
                                <span>Sözel</span>
                            </button>
                            <button class="field-option" data-field="dil" tabindex="0">
                                <i class="ph ph-translate icon"></i>
                                <span>Dil</span>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Zorlandığı Dersler -->
                    <div class="onboarding-step">
                        <label class="step-label">
                            <span class="step-number">2</span>
                            Hangi derslerde daha çok zorlanıyorsun? (çoklu seçim)
                        </label>
                        <div class="subjects-grid" id="difficultSubjects">
                            <p class="select-field-first">Önce alanını seç</p>
                        </div>
                    </div>

                    <!-- Step 3: Seviye Testi -->
                    <div class="onboarding-step">
                        <label class="step-label">
                            <span class="step-number">3</span>
                            Seviye belirleme sınavına girmek ister misin?
                        </label>
                        <p class="step-description">
                            20-30 soruluk kısa bir test ile mevcut seviyeni belirleyebiliriz.
                        </p>
                        <div class="level-test-options">
                            <button class="level-option" data-level="true" tabindex="0">
                                <i class="ph ph-check-circle icon"></i>
                                <span>Evet</span>
                                <small>Önerilen</small>
                            </button>
                            <button class="level-option" data-level="false" tabindex="0">
                                <i class="ph ph-x-circle icon"></i>
                                <span>Hayır</span>
                                <small>Sonra yapabilirim</small>
                            </button>
                        </div>
                    </div>

                    <!-- Kaydet Butonu -->
                    <div class="onboarding-actions">
                        <div class="progress-indicator">
                            <span class="progress-text">0/3 adım tamamlandı</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-large" id="saveOnboarding" disabled>
                            <i class="ph ph-check icon"></i>
                            Kaydet ve Devam Et
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachOnboardingEvents();
    },

    /**
     * Onboarding eventleri
     */
    attachOnboardingEvents() {
        // Alan seçimi
        document.querySelectorAll('.field-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.field-option').forEach(b =>
                    b.classList.remove('selected')
                );
                btn.classList.add('selected');
                this.preferences.field = btn.dataset.field;
                this.updateSubjectsList();
                this.updateOnboardingProgress();
            });

            // Klavye desteği
            btn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });

        // Seviye testi seçimi
        document.querySelectorAll('.level-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-option').forEach(b =>
                    b.classList.remove('selected')
                );
                btn.classList.add('selected');
                this.preferences.levelTestPreference = btn.dataset.level === 'true';
                this.updateOnboardingProgress();
            });

            btn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });

        // Kaydet butonu
        const saveBtn = document.getElementById('saveOnboarding');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.completeOnboarding());
        }
    },

    /**
     * Ders listesini güncelle
     */
    updateSubjectsList() {
        const container = document.getElementById('difficultSubjects');
        if (!container) return;

        let subjects = [...this.subjects.tyt];

        switch (this.preferences.field) {
            case 'sayisal':
                subjects.push(...this.subjects.ayt_sayisal);
                break;
            case 'esit-agirlik':
                subjects.push(...this.subjects.ayt_sayisal.slice(0, 1));
                subjects.push(...this.subjects.ayt_sozel);
                break;
            case 'sozel':
                subjects.push(...this.subjects.ayt_sozel);
                break;
            case 'dil':
                subjects.push(...this.subjects.ayt_dil);
                break;
        }

        container.innerHTML = subjects.map(subject => `
            <label class="subject-checkbox" tabindex="0">
                <input type="checkbox" 
                       value="${subject.code}" 
                       class="subject-select"
                       ${this.preferences.difficultSubjects.includes(subject.code) ? 'checked' : ''}>
                <i class="ph ph-${subject.icon} icon"></i>
                <span>${subject.name}</span>
            </label>
        `).join('');

        // Checkbox eventleri
        container.querySelectorAll('.subject-select').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!this.preferences.difficultSubjects.includes(checkbox.value)) {
                        this.preferences.difficultSubjects.push(checkbox.value);
                    }
                } else {
                    const index = this.preferences.difficultSubjects.indexOf(checkbox.value);
                    if (index > -1) {
                        this.preferences.difficultSubjects.splice(index, 1);
                    }
                }
                this.updateOnboardingProgress();
            });
        });

        // Klavye erişilebilirliği
        container.querySelectorAll('.subject-checkbox').forEach(label => {
            label.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const checkbox = label.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });
    },

    /**
     * Onboarding ilerlemesini güncelle
     */
    updateOnboardingProgress() {
        let completed = 0;

        if (this.preferences.field) completed++;
        if (this.preferences.difficultSubjects.length > 0) completed++;
        if (this.preferences.levelTestPreference !== null) completed++;

        const progressText = document.querySelector('.progress-text');
        const progressFill = document.querySelector('.progress-fill');
        const saveBtn = document.getElementById('saveOnboarding');

        if (progressText) progressText.textContent = `${completed}/3 adım tamamlandı`;
        if (progressFill) progressFill.style.width = `${(completed / 3) * 100}%`;
        if (saveBtn) saveBtn.disabled = completed < 3;
    },

    /**
     * Onboarding'i tamamla
     */
    completeOnboarding() {
        this.preferences.onboardingCompleted = true;
        this.savePreferences();

        // Seviye testi seçildiyse hemen başlat
        if (this.preferences.levelTestPreference) {
            this.startLevelTest();
        } else {
            this.renderJourneyContent();
            if (window.Utils) {
                Utils.showToast('🎉 YKS yolculuğun başladı! Başarılar!', 'success');
            }
        }
    },

    /**
     * Dashboard'ı render et
     */
    renderDashboard(container) {
        const fieldNames = {
            'sayisal': 'Sayısal',
            'esit-agirlik': 'Eşit Ağırlık',
            'sozel': 'Sözel',
            'dil': 'Dil'
        };

        const difficultSubjects = this.getDifficultSubjectsInfo();
        const todaySteps = this.generateTodaySteps();
        const recommendedTests = this.generateRecommendedTests();

        container.innerHTML = `
            <div class="yks-dashboard">
                <!-- Header -->
                <div class="dashboard-header">
                    <h1>
                        <i class="ph ph-rocket-launch icon"></i>
                        YKS Yolculuğuna Hoş Geldin
                    </h1>
                    <button class="btn btn-secondary btn-sm" id="editPreferences">
                        <i class="ph ph-pencil icon"></i>
                        Bilgilerimi Düzenle
                    </button>
                </div>

                <!-- Kullanıcı Özeti -->
                <div class="user-summary">
                    <div class="summary-icon">
                        <i class="ph ph-user-circle icon"></i>
                    </div>
                    <div class="summary-content">
                        <p>
                            Sen bir <strong>${fieldNames[this.preferences.field]}</strong> öğrencisisin.
                            ${difficultSubjects.length > 0 ?
                `Daha çok <strong>${difficultSubjects.map(s => s.name).join(', ')}</strong> 
                                derslerinde zorlandığını söyledin.` : ''}
                        </p>
                        <p class="summary-subtitle">Hedefine göre ekranını özelleştirdik.</p>
                    </div>
                </div>

                ${this.renderLevelTestSection()}

                <!-- İstatistikler -->
                <div class="journey-stats">
                    <div class="stat-box">
                        <i class="ph ph-fire icon"></i>
                        <div class="stat-content">
                            <span class="stat-value">${this.preferences.weeklyProgress.tests || 0}</span>
                            <span class="stat-label">Bu Hafta Test</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="ph ph-timer icon"></i>
                        <div class="stat-content">
                            <span class="stat-value">${this.formatStudyTime(this.preferences.totalStudyTime)}</span>
                            <span class="stat-label">Toplam Süre</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="ph ph-target icon"></i>
                        <div class="stat-content">
                            <span class="stat-value">${this.calculateSuccessRate()}%</span>
                            <span class="stat-label">Başarı Oranı</span>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="ph ph-chart-line-up icon"></i>
                        <div class="stat-content">
                            <span class="stat-value">${this.getOverallLevelText()}</span>
                            <span class="stat-label">Genel Seviye</span>
                        </div>
                    </div>
                </div>

                <!-- Bugünün Adımları -->
                <div class="today-steps">
                    <h2>
                        <i class="ph ph-list-checks icon"></i>
                        Bugün için ${todaySteps.length} adım
                    </h2>
                    <div class="steps-list">
                        ${todaySteps.map((step, i) => this.renderStepCard(step, i)).join('')}
                    </div>
                </div>

                <!-- Önerilen Testler -->
                <div class="recommended-tests">
                    <h2>
                        <i class="ph ph-sparkle icon"></i>
                        Sana Önerilen Testler
                    </h2>
                    <div class="tests-grid">
                        ${recommendedTests.map(test => this.renderTestCard(test)).join('')}
                    </div>
                </div>

                <!-- Haftalık İlerleme -->
                <div class="weekly-progress">
                    <h2>
                        <i class="ph ph-calendar icon"></i>
                        Haftalık İlerleme
                    </h2>
                    <div class="week-grid">
                        ${this.renderWeeklyProgress()}
                    </div>
                </div>
            </div>
        `;

        this.attachDashboardEvents();
    },

    /**
     * Seviye testi bölümü
     */
    renderLevelTestSection() {
        if (this.preferences.levelTestCompleted) {
            return this.renderLevelResults();
        }

        if (this.preferences.levelTestPreference === false) {
            return `
                <div class="level-test-optional">
                    <i class="ph ph-graduation-cap icon"></i>
                    <div class="card-content">
                        <h3>Seviye Sınavı (İsteğe Bağlı)</h3>
                        <p>Netlerini daha iyi analiz edebilmemiz için kısa bir seviye sınavı çözebilirsin.</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-sm" onclick="YKSJourney.startLevelTest()">
                            <i class="ph ph-play icon"></i>
                            Şimdi Çöz
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="level-test-reminder">
                <i class="ph ph-info icon"></i>
                <div>
                    <strong>Seviye Sınavı Bekliyor</strong>
                    <p>Zorlandığın derslere göre ${this.getTotalLevelTestQuestions()} soruluk bir test hazırladık.</p>
                </div>
                <div class="reminder-actions">
                    <button class="btn btn-primary btn-sm" onclick="YKSJourney.startLevelTest()">
                        <i class="ph ph-play icon"></i>
                        Teste Başla
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="YKSJourney.postponeLevelTest()">
                        Sonra
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Seviye sonuçlarını render et
     */
    renderLevelResults() {
        const results = this.preferences.levelTestResults;
        if (!results || Object.keys(results).length === 0) return '';

        return `
            <div class="level-results-section">
                <h3>
                    <i class="ph ph-chart-bar icon"></i>
                    Seviye Analizi
                </h3>
                <div class="level-results-grid">
                    ${Object.entries(results).map(([subject, level]) => {
            const subjectInfo = this.getSubjectInfo(subject);
            return `
                            <div class="level-result-card level-${level}">
                                <i class="ph ph-${subjectInfo.icon} icon"></i>
                                <strong>${subjectInfo.name}</strong>
                                <span class="level-badge">${this.getLevelText(level)}</span>
                                <div class="level-bar">
                                    <div class="level-fill" style="width: ${this.getLevelPercentage(level)}%"></div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
                <div class="level-recommendations">
                    <h4>Öneriler</h4>
                    ${this.generateLevelRecommendations()}
                </div>
            </div>
        `;
    },

    /**
     * Adım kartını render et
     */
    renderStepCard(step, index) {
        return `
            <div class="step-card ${step.completed ? 'completed' : ''}" data-step-id="${step.id}">
                <span class="step-number">${index + 1}</span>
                <div class="step-content">
                    <i class="ph ph-${step.icon} icon"></i>
                    <div>
                        <strong>${step.title}</strong>
                        <small>${step.duration}</small>
                    </div>
                </div>
                <button class="btn btn-sm ${step.completed ? 'btn-success' : 'btn-primary'}"
                        onclick="YKSJourney.${step.completed ? 'unmarkStep' : 'completeStep'}('${step.id}')">
                    ${step.completed ? '✓ Tamamlandı' : 'Başla'}
                </button>
            </div>
        `;
    },

    /**
     * Test kartını render et
     */
    renderTestCard(test) {
        return `
            <div class="test-card" data-test-id="${test.id}">
                <div class="test-card-header">
                    <i class="ph ph-${test.icon} icon"></i>
                    <span class="test-level ${test.level}">${test.levelText}</span>
                </div>
                <h4>${test.title}</h4>
                <div class="test-meta">
                    <span><i class="ph ph-list-bullets icon"></i> ${test.questions} Soru</span>
                    <span><i class="ph ph-timer icon"></i> ${test.duration} dk</span>
                </div>
                <button class="btn btn-primary btn-sm" 
                        onclick="YKSJourney.startTest('${test.id}')">
                    Testi Başlat
                </button>
            </div>
        `;
    },

    /**
     * Haftalık ilerlemeyi render et
     */
    renderWeeklyProgress() {
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1;

        return days.map((day, index) => {
            const isToday = index === adjustedToday;
            const completed = this.preferences.weeklyProgress[day] || false;

            return `
                <div class="day-box ${isToday ? 'today' : ''} ${completed ? 'completed' : ''}">
                    <span class="day-name">${day}</span>
                    <i class="ph ph-${completed ? 'check-circle' : 'circle'} icon"></i>
                </div>
            `;
        }).join('');
    },

    /**
     * Seviye testini render et
     */
    renderLevelTest(container) {
        const question = this.levelTest.questions[this.levelTest.currentIndex];
        const progress = ((this.levelTest.currentIndex + 1) / this.levelTest.questions.length) * 100;

        container.innerHTML = `
            <div class="level-test-container">
                <div class="level-test-header">
                    <h2>
                        <i class="ph ph-graduation-cap icon"></i>
                        Seviye Belirleme Testi
                    </h2>
                    <button class="btn btn-secondary btn-sm" onclick="YKSJourney.exitLevelTest()">
                        <i class="ph ph-x icon"></i>
                        Çık
                    </button>
                </div>

                <div class="test-progress">
                    <div class="progress-info">
                        <span>Soru ${this.levelTest.currentIndex + 1} / ${this.levelTest.questions.length}</span>
                        <span>${this.getSubjectInfo(question.subject).name}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="question-container">
                    <h3 class="question-text">${question.q}</h3>
                    <div class="options-grid">
                        ${question.o.map((option, index) => `
                            <button class="option-button" 
                                    data-index="${index}"
                                    onclick="YKSJourney.selectLevelTestAnswer(${index})">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span>${option}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="test-navigation">
                    <button class="btn btn-secondary" 
                            onclick="YKSJourney.previousLevelQuestion()"
                            ${this.levelTest.currentIndex === 0 ? 'disabled' : ''}>
                        <i class="ph ph-arrow-left icon"></i>
                        Önceki
                    </button>
                    <button class="btn btn-primary" 
                            onclick="YKSJourney.nextLevelQuestion()">
                        ${this.levelTest.currentIndex === this.levelTest.questions.length - 1 ? 'Testi Bitir' : 'Sonraki'}
                        <i class="ph ph-arrow-right icon"></i>
                    </button>
                </div>
            </div>
        `;

        // Önceki cevabı işaretle
        if (this.levelTest.answers[this.levelTest.currentIndex] !== undefined) {
            const selectedIndex = this.levelTest.answers[this.levelTest.currentIndex];
            document.querySelector(`.option-button[data-index="${selectedIndex}"]`)?.classList.add('selected');
        }
    },

    /**
     * Seviye testini başlat
     */
    startLevelTest() {
        // Test sorularını hazırla
        const questions = [];

        this.preferences.difficultSubjects.forEach(subject => {
            const subjectQuestions = this.levelTestQuestions[subject] || [];
            subjectQuestions.forEach(q => {
                questions.push({ ...q, subject });
            });
        });

        // En az soru yoksa varsayılan ekle
        if (questions.length < 10) {
            const defaultQuestions = this.levelTestQuestions['tyt-matematik'] || [];
            defaultQuestions.forEach(q => {
                questions.push({ ...q, subject: 'tyt-matematik' });
            });
        }

        // Soruları karıştır ve sınırla
        this.levelTest = {
            isActive: true,
            questions: this.shuffleArray(questions).slice(0, 20),
            currentIndex: 0,
            answers: [],
            startTime: Date.now(),
            subjects: [...new Set(questions.map(q => q.subject))]
        };

        this.renderJourneyContent();
    },

    /**
     * Seviye testi cevabını seç
     */
    selectLevelTestAnswer(index) {
        this.levelTest.answers[this.levelTest.currentIndex] = index;

        // Butonları güncelle
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`.option-button[data-index="${index}"]`).classList.add('selected');
    },

    /**
     * Önceki soru
     */
    previousLevelQuestion() {
        if (this.levelTest.currentIndex > 0) {
            this.levelTest.currentIndex--;
            this.renderJourneyContent();
        }
    },

    /**
     * Sonraki soru
     */
    nextLevelQuestion() {
        if (this.levelTest.currentIndex < this.levelTest.questions.length - 1) {
            this.levelTest.currentIndex++;
            this.renderJourneyContent();
        } else {
            this.completeLevelTest();
        }
    },

    /**
     * Seviye testini tamamla
     */
    completeLevelTest() {
        // Sonuçları hesapla
        const results = {};
        const subjectScores = {};

        this.levelTest.subjects.forEach(subject => {
            subjectScores[subject] = { correct: 0, total: 0 };
        });

        this.levelTest.questions.forEach((question, index) => {
            const userAnswer = this.levelTest.answers[index];
            const isCorrect = userAnswer === question.a;

            subjectScores[question.subject].total++;
            if (isCorrect) {
                subjectScores[question.subject].correct++;
            }
        });

        // Seviyeleri belirle
        Object.entries(subjectScores).forEach(([subject, score]) => {
            const percentage = (score.correct / score.total) * 100;

            if (percentage >= 80) results[subject] = 'excellent';
            else if (percentage >= 60) results[subject] = 'good';
            else if (percentage >= 40) results[subject] = 'medium';
            else results[subject] = 'weak';
        });

        // Sonuçları kaydet
        this.preferences.levelTestCompleted = true;
        this.preferences.levelTestResults = results;
        this.levelTest.isActive = false;
        this.savePreferences();

        // Dashboard'a dön
        this.renderJourneyContent();

        // Başarı mesajı
        if (window.Utils) {
            Utils.showToast('✅ Seviye testin tamamlandı! Sonuçlarını görebilirsin.', 'success');
        }
    },

    /**
     * Seviye testinden çık
     */
    exitLevelTest() {
        if (confirm('Seviye testinden çıkmak istediğine emin misin? İlerleme kaydedilmeyecek.')) {
            this.levelTest.isActive = false;
            this.renderJourneyContent();
        }
    },

    /**
     * Seviye testini ertele
     */
    postponeLevelTest() {
        if (window.Utils) {
            Utils.showToast('Seviye testini daha sonra yapabilirsin.', 'info');
        }
    },

    /**
     * Bugünün adımlarını oluştur
     */
    generateTodaySteps() {
        const steps = [];
        const difficulties = this.preferences.difficultSubjects;

        // Zorlandığı derslere göre adımlar
        if (difficulties.includes('tyt-matematik')) {
            steps.push({
                id: 'step-tyt-mat',
                icon: 'calculator',
                title: '20 soruluk TYT Matematik testi çöz',
                duration: '25 dakika',
                completed: false
            });
        }

        if (difficulties.includes('ayt-fizik')) {
            steps.push({
                id: 'step-ayt-fizik',
                icon: 'lightning',
                title: '10 soruluk AYT Fizik mini testi',
                duration: '15 dakika',
                completed: false
            });
        }

        if (difficulties.includes('tyt-turkce')) {
            steps.push({
                id: 'step-tyt-turkce',
                icon: 'book-open',
                title: 'TYT Türkçe paragraf soruları',
                duration: '20 dakika',
                completed: false
            });
        }

        // Varsayılan adım
        if (steps.length === 0) {
            steps.push({
                id: 'step-default',
                icon: 'list-bullets',
                title: 'Günlük deneme sınavı',
                duration: '45 dakika',
                completed: false
            });
        }

        // Çalışma süresi kaydı
        steps.push({
            id: 'step-time',
            icon: 'timer',
            title: 'En az 1 saat çalış',
            duration: 'Süre takibi',
            completed: this.preferences.totalStudyTime >= 3600
        });

        return steps.slice(0, 3);
    },

    /**
     * Önerilen testleri oluştur
     */
    generateRecommendedTests() {
        const tests = [];
        const levels = this.preferences.levelTestResults;

        this.preferences.difficultSubjects.forEach(subject => {
            const subjectInfo = this.getSubjectInfo(subject);
            const level = levels[subject] || 'medium';

            // Seviyeye göre test öner
            if (level === 'weak') {
                tests.push({
                    id: `test-${subject}-basic`,
                    icon: subjectInfo.icon,
                    title: `${subjectInfo.name} - Temel Kavramlar`,
                    level: 'easy',
                    levelText: 'Kolay',
                    questions: 15,
                    duration: 20
                });
            } else if (level === 'medium') {
                tests.push({
                    id: `test-${subject}-mixed`,
                    icon: subjectInfo.icon,
                    title: `${subjectInfo.name} - Karma Test`,
                    level: 'medium',
                    levelText: 'Orta',
                    questions: 20,
                    duration: 30
                });
            } else {
                tests.push({
                    id: `test-${subject}-advanced`,
                    icon: subjectInfo.icon,
                    title: `${subjectInfo.name} - İleri Seviye`,
                    level: 'hard',
                    levelText: 'Zor',
                    questions: 25,
                    duration: 40
                });
            }
        });

        return tests.slice(0, 4);
    },

    /**
     * Seviye önerilerini oluştur
     */
    generateLevelRecommendations() {
        const recommendations = [];
        const results = this.preferences.levelTestResults;

        Object.entries(results).forEach(([subject, level]) => {
            const subjectInfo = this.getSubjectInfo(subject);

            if (level === 'weak') {
                recommendations.push(`<li><strong>${subjectInfo.name}:</strong> Temel konuları tekrar et, günde 10-15 soru çöz.</li>`);
            } else if (level === 'medium') {
                recommendations.push(`<li><strong>${subjectInfo.name}:</strong> Orta seviye sorulara odaklan, haftada 2-3 deneme yap.</li>`);
            } else if (level === 'good') {
                recommendations.push(`<li><strong>${subjectInfo.name}:</strong> Zor soruları denemeye başla, hız kazanmaya odaklan.</li>`);
            } else {
                recommendations.push(`<li><strong>${subjectInfo.name}:</strong> Mükemmel! Seviyeni korumak için düzenli tekrar yap.</li>`);
            }
        });

        return `<ul>${recommendations.join('')}</ul>`;
    },

    /**
     * Dashboard eventleri
     */
    attachDashboardEvents() {
        // Bilgileri düzenle
        const editBtn = document.getElementById('editPreferences');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (confirm('Tercihlerini değiştirmek istediğine emin misin?')) {
                    this.preferences.onboardingCompleted = false;
                    this.renderJourneyContent();
                }
            });
        }
    },

    /**
     * Adımı tamamla
     */
    completeStep(stepId) {
        const steps = this.generateTodaySteps();
        const step = steps.find(s => s.id === stepId);

        if (step) {
            step.completed = true;

            // İstatistikleri güncelle
            const today = new Date();
            const dayName = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][today.getDay()];
            this.preferences.weeklyProgress[dayName] = true;

            this.savePreferences();
            this.renderJourneyContent();

            if (window.Utils) {
                Utils.showToast('👏 Adım tamamlandı! Böyle devam et!', 'success');
            }
        }
    },

    /**
     * Adımı geri al
     */
    unmarkStep(stepId) {
        const steps = this.generateTodaySteps();
        const step = steps.find(s => s.id === stepId);

        if (step) {
            step.completed = false;
            this.savePreferences();
            this.renderJourneyContent();
        }
    },

    /**
     * Testi başlat
     */
    startTest(testId) {
        // QuizManager'a yönlendir
        if (window.QuizManager) {
            // Test bilgilerini localStorage'a kaydet
            const test = this.generateRecommendedTests().find(t => t.id === testId);
            if (test) {
                localStorage.setItem('yks_selected_test', JSON.stringify(test));

                // Test sekmesine geç
                if (window.App && App.switchTab) {
                    App.switchTab('test');

                    // Quiz'i başlat
                    setTimeout(() => {
                        QuizManager.startQuiz('yks');
                    }, 100);
                }
            }
        } else {
            if (window.Utils) {
                Utils.showToast('Test modülü yükleniyor, lütfen tekrar dene.', 'info');
            }
        }
    },

    // Yardımcı fonksiyonlar
    getSubjectInfo(code) {
        const allSubjects = [
            ...this.subjects.tyt,
            ...this.subjects.ayt_sayisal,
            ...this.subjects.ayt_sozel,
            ...this.subjects.ayt_dil
        ];
        return allSubjects.find(s => s.code === code) || { name: code, icon: 'book' };
    },

    getDifficultSubjectsInfo() {
        return this.preferences.difficultSubjects.map(code => this.getSubjectInfo(code));
    },

    getTotalLevelTestQuestions() {
        return Math.min(this.preferences.difficultSubjects.length * 5, 30);
    },

    getLevelText(level) {
        const levels = {
            'weak': 'Başlangıç',
            'medium': 'Orta',
            'good': 'İyi',
            'excellent': 'İleri'
        };
        return levels[level] || level;
    },

    getLevelPercentage(level) {
        const percentages = {
            'weak': 25,
            'medium': 50,
            'good': 75,
            'excellent': 100
        };
        return percentages[level] || 0;
    },

    getOverallLevelText() {
        const level = this.calculateOverallLevel();
        return level.charAt(0).toUpperCase() + level.slice(1);
    },

    calculateSuccessRate() {
        // StorageManager'dan başarı oranını al
        if (window.StorageManager) {
            const userData = StorageManager.getUserData();
            const stats = userData.stats || {};

            if (stats.totalQuestions > 0) {
                return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
            }
        }
        return 0;
    },

    formatStudyTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}s ${minutes}dk`;
        }
        return `${minutes}dk`;
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    // App.js'e tab değişimi için entegre et
    if (window.App && !window.App._yksJourneyPatched) {
        const originalSwitchTab = window.App.switchTab;

        window.App.switchTab = function (tabName, options) {
            originalSwitchTab.call(this, tabName, options);

            if (tabName === 'journey') {
                YKSJourney.init();
            }
        };

        window.App._yksJourneyPatched = true;
    }
});

// Export
window.YKSJourney = YKSJourney;