// yks-flow.js
(function () {
    'use strict';

    /**
     * Küçük yardımcı: güvenli shuffle
     */
    function shuffle(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Testify config / helper referansları
     */
    const hasUtils = typeof window.Utils !== 'undefined';
    const hasStorageManager = typeof window.StorageManager !== 'undefined';
    const hasQuizManager = typeof window.QuizManager !== 'undefined';

    // AI current test key (library ile aynı yolu kullanmak için)
    const CURRENT_TEST_KEY =
        (hasStorageManager &&
            StorageManager.INTERNAL_KEYS &&
            StorageManager.INTERNAL_KEYS.AI_CURRENT_TEST) ||
        'testify_current_test';

    /**
     * YKS soru havuzu referansı
     */
    const hasYKSAPI = typeof window.YKSQuestionPoolAPI !== 'undefined';

    if (!hasYKSAPI) {
        console.warn('[YKSFlow] YKSQuestionPoolAPI bulunamadı. yks-question-pool.js yüklü mü?');
    }

    /**
     * YKS havuzundan soruları seçer
     * @param {Object} config
     *  - field: "sayisal" | "ea" | "sozel" | "dil" | "genel"
     *  - subject: "matematik" | "fizik" | ... | "mixed"
     *  - questionCount: toplam soru
     *  - perSubject: mixed ise ders başına soru sayısı
     */
    function pickQuestionsFromPool(config) {
        if (!hasYKSAPI) return [];

        const field = config.field || 'genel';
        const subject = config.subject || 'mixed';
        const total = config.questionCount || 10;
        const perSubject = config.perSubject || 3;

        const api = window.YKSQuestionPoolAPI;
        const allByField = api.allLevelQuestions && api.allLevelQuestions[field];

        // Eğer belirli bir ders istendiyse: sadece o subject'ten sor
        if (subject && subject !== 'mixed' && allByField) {
            const filtered = allByField.filter(q => q.subject === subject);
            const shuffled = shuffle(filtered);
            return shuffled.slice(0, Math.min(total, shuffled.length));
        }

        // Ders karışık ise: her dersten perSubject kadar al
        if (typeof api.getLevelTestQuestionsPerSubject === 'function') {
            const list = api.getLevelTestQuestionsPerSubject(field, perSubject);
            if (list && list.length) {
                const shuffled = shuffle(list);
                return shuffled.slice(0, Math.min(total, shuffled.length));
            }
        }

        // Yedek: alanın genelinden karışık soru
        if (typeof api.getLevelTestQuestions === 'function') {
            return api.getLevelTestQuestions(field, total) || [];
        }

        return [];
    }

    /**
     * YKS sorularını QuizManager'ın tüketebileceği testData formatına çevirir
     * @param {Array} questionsFromPool
     * @param {Object} meta
     */
    function buildTestData(questionsFromPool, meta) {
        const now = Date.now();

        const fieldLabelMap = {
            sayisal: 'Sayısal',
            ea: 'Eşit Ağırlık',
            sozel: 'Sözel',
            dil: 'Dil',
            genel: 'Genel'
        };

        const fieldLabel = fieldLabelMap[meta.field] || 'Genel';

        const titleBase = meta.subject && meta.subject !== 'mixed'
            ? `YKS ${fieldLabel} – ${meta.subject} Seviye Testi`
            : `YKS ${fieldLabel} Karışık Seviye Testi`;

        const modeLabel = meta.mode === 'exam' ? 'Sınav Modu' : 'Pratik';

        const testData = {
            id: meta.id || (hasUtils && Utils.generateId ? Utils.generateId() : `yks_${now}`),
            source: 'yks-level',
            field: meta.field || 'genel',
            subject: meta.subject || 'mixed',
            title: `${titleBase} (${modeLabel})`,
            description: meta.description || 'YKS seviye belirleme testi',
            mode: meta.mode || 'practice',
            createdAt: now,
            // İstersen burada timeLimit de koyabilirsin (saniye cinsinden)
            // timeLimit: meta.mode === 'exam' ? 1200 : null,
            questions: []
        };

        testData.questions = questionsFromPool.map((q, index) => {
            const id = q.id || `yks_q_${index + 1}`;
            const choices = q.choices || q.options || [];

            return {
                // Genel alanlar
                id,
                text: q.text || '',
                // Hem "choices" hem "options" dolduruluyor;
                // QuizManager hangisini kullanıyorsa oradan okuyacak.
                choices: choices,
                options: choices,
                correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
                explanation: q.explanation || '',
                // Ek metadata
                field: q.field || meta.field || 'genel',
                subject: q.subject || meta.subject || 'genel',
                tags: ['yks', fieldLabel.toLowerCase(), q.subject || 'genel'],
                difficulty: q.difficulty || 'medium',
                // QuizManager için faydalı olabilecek ekstra alan
                order: index + 1
            };
        });

        return testData;
    }

    /**
     * Testi localStorage'a yazar ve QuizManager üzerinden başlatır
     * @param {Object} testData
     * @param {string} quizMode  - QuizManager.startQuiz için mod (örn: 'ai')
     */
    function launchQuiz(testData, quizMode) {
        try {
            const json = JSON.stringify(testData);

            // AI current test key üzerinden
            try {
                localStorage.setItem(CURRENT_TEST_KEY, json);
            } catch (e) {
                console.warn('[YKSFlow] CURRENT_TEST_KEY yazılamadı:', e);
            }

            // Eski olabilecek "testify_generated_test" desteği
            try {
                localStorage.setItem('testify_generated_test', json);
            } catch (e) {
                console.warn('[YKSFlow] testify_generated_test yazılamadı:', e);
            }

            if (!hasQuizManager || typeof QuizManager.startQuiz !== 'function') {
                console.error('[YKSFlow] QuizManager.startQuiz bulunamadı.');
                if (hasUtils && Utils.showToast) {
                    Utils.showToast('Quiz sistemi henüz hazır değil. Lütfen sayfayı yenileyin.', 'error');
                }
                return;
            }

            // AI test pipeline'ını kullanıyoruz (AI tarzı custom test)
            QuizManager.startQuiz(quizMode || 'ai');
        } catch (err) {
            console.error('[YKSFlow] launchQuiz hatası:', err);
            if (hasUtils && Utils.showToast) {
                Utils.showToast('YKS testi başlatılırken bir hata oluştu.', 'error');
            }
        }
    }

    /**
     * Ana API:
     * YKS havuzundan test üret + quiz başlat
     * @param {Object} config
     *  - field: sayisal / ea / sozel / dil / genel
     *  - subject: belirli ders veya "mixed"
     *  - mode: "practice" | "exam"
     *  - questionCount: toplam soru
     *  - perSubject: mixed için ders başına soru
     *  - saveToLibrary: true/false (ileride kullanmak istersen)
     */
    function startTest(config) {
        const cfg = Object.assign(
            {
                field: 'genel',
                subject: 'mixed',
                mode: 'practice',
                questionCount: 10,
                perSubject: 3,
                saveToLibrary: false
            },
            config || {}
        );

        const questions = pickQuestionsFromPool(cfg);

        if (!questions.length) {
            if (hasUtils && Utils.showToast) {
                Utils.showToast('Bu alan/derste henüz soru havuzu bulunmuyor.', 'warning');
            } else {
                alert('Bu alan/derste henüz soru havuzu bulunmuyor.');
            }
            return;
        }

        const testData = buildTestData(questions, cfg);

        // İsteğe bağlı: kütüphaneye kaydet (AI library / senin library.js’teki sistemine göre)
        if (cfg.saveToLibrary) {
            try {
                if (hasStorageManager && typeof StorageManager.saveTestToLibrary === 'function') {
                    StorageManager.saveTestToLibrary(testData);
                } else if (window.LibraryManager && typeof window.LibraryManager.saveTestToLibrary === 'function') {
                    window.LibraryManager.saveTestToLibrary(testData);
                }
            } catch (e) {
                console.warn('[YKSFlow] saveToLibrary sırasında hata:', e);
            }
        }

        // Quiz’i başlat
        launchQuiz(testData, 'ai');

        // Aktivite log (güzel dursun diye)
        try {
            if (hasStorageManager && typeof StorageManager.saveActivity === 'function') {
                StorageManager.saveActivity({
                    type: 'yks_test_started',
                    data: {
                        field: cfg.field,
                        subject: cfg.subject,
                        questionCount: testData.questions.length,
                        mode: cfg.mode
                    },
                    timestamp: Date.now()
                });
            }
        } catch (e) {
            console.warn('[YKSFlow] aktivite kaydı başarısız:', e);
        }
    }

    /**
     * Hızlı seviye testi (UI’den rahat çağırmak için)
     * Örnek kullanım:
     *   YKSFlow.startQuickLevelTest('sayisal');
     */
    function startQuickLevelTest(field, subject) {
        startTest({
            field: field || 'genel',
            subject: subject || 'mixed',
            mode: 'practice',
            questionCount: 10,
            perSubject: 3,
            saveToLibrary: false
        });
    }

    // Global API
    window.YKSFlow = {
        startTest,
        startQuickLevelTest,
        _buildTestData: buildTestData,         // istersen debug için
        _pickQuestionsFromPool: pickQuestionsFromPool
    };

    console.log('[YKSFlow] Yüklendi ve hazır.');
})();
