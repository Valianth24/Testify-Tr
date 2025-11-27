// yks-flow.js
(function (window, document) {
    'use strict';

    const YKSFlow = {
        /**
         * Belirli alan için (sayisal, ea, sozel, dil, genel)
         * mevcut derslerin listesini döndürür (matematik, fizik, ...).
         * -> Ders seçimi sayfasında kullanacaksın.
         */
        getSubjectsForField(field) {
            const api = window.YKSQuestionPoolAPI;
            if (!api || !api.allLevelQuestions) {
                console.warn('YKSQuestionPoolAPI bulunamadı');
                return [];
            }

            const all = api.allLevelQuestions;
            const key = all[field] ? field : 'genel';
            const list = all[key] || [];

            const set = new Set();
            list.forEach(q => {
                if (q.subject) set.add(q.subject);
            });

            return Array.from(set).sort();
        },

        /**
         * Havuzdaki formatı QuizManager formatına çevirir:
         *  - text -> q
         *  - choices -> o
         *  - correctIndex -> answerIndex
         * QuizManager.getCorrectIndex zaten answerIndex'i destekliyor.
         */
        mapToQuizQuestions(poolQuestions) {
            if (!Array.isArray(poolQuestions)) return [];

            return poolQuestions.map(q => ({
                id: q.id,
                field: q.field,
                subject: q.subject,
                q: q.text,
                o: q.choices,
                answerIndex: q.correctIndex,     // ✅ direkt index
                explanation: q.explanation || '',
                difficulty: q.difficulty || 'medium',
                source: 'yks_level'
            }));
        },

        /**
         * Havuzdan soru listesi oluştur:
         * - subject seçiliyse: sadece o ders
         * - subject yoksa:
         *    - perSubject verilmişse: her dersten perSubject kadar
         *    - aksi halde: alanın genelinden count kadar
         */
        buildQuestionPool(config) {
            const api = window.YKSQuestionPoolAPI;
            if (!api || !api.allLevelQuestions) {
                console.error('YKSQuestionPoolAPI bulunamadı');
                return [];
            }

            const field = config.field || 'genel';
            const subject = config.subject || null;
            const count = config.questionCount || 15;
            const perSubject = config.perSubject || null;

            const all = api.allLevelQuestions;
            const key = all[field] ? field : 'genel';
            const list = all[key] || [];

            // 1) Belirli bir ders seçilmişse
            if (subject) {
                const filtered = list.filter(q => q.subject === subject);
                if (!filtered.length) return [];

                // basit shuffle
                const shuffled = filtered
                    .slice()
                    .sort(() => Math.random() - 0.5);

                return shuffled.slice(0, Math.min(count, shuffled.length));
            }

            // 2) Ders seçilmemiş ama "her dersten x soru" isteniyorsa
            if (perSubject) {
                return api.getLevelTestQuestionsPerSubject(field, perSubject) || [];
            }

            // 3) Alanın genelinden karışık
            return api.getLevelTestQuestions(field, count) || [];
        },

        /**
         * YKS testini başlat:
         * config:
         *  - field: 'sayisal' | 'ea' | 'sozel' | 'dil' | 'genel'
         *  - subject: 'matematik' | 'fizik' ... (opsiyonel, null = karışık)
         *  - questionCount: sayı (subject mode)
         *  - perSubject: sayı (alan geneli mode)
         *  - mode: 'practice' | 'exam' (şimdilik sadece başlık/desc için)
         *  - saveToLibrary: true/false (istersen sonra kullanırız)
         */
        startTest(config) {
            try {
                const field = config.field || 'genel';
                const subject = config.subject || null;

                const poolQuestions = this.buildQuestionPool(config);

                if (!poolQuestions.length) {
                    if (window.Utils) {
                        window.Utils.showToast('Bu alan/ders için soru bulunamadı!', 'error');
                    }
                    console.warn('YKS havuzunda soru bulunamadı', config);
                    return;
                }

                const quizQuestions = this.mapToQuizQuestions(poolQuestions);

                // Başlık / açıklama üret
                const fieldNames = {
                    sayisal: 'Sayısal',
                    ea: 'Eşit Ağırlık',
                    sozel: 'Sözel',
                    dil: 'Dil',
                    genel: 'Genel Tarama'
                };

                const modeText = config.mode === 'exam' ? 'Deneme Modu' : 'Pratik Modu';

                const fieldLabel = fieldNames[field] || fieldNames.genel;
                const subjectLabel = subject ? ` - ${subject.toUpperCase()}` : '';
                const title = `YKS ${fieldLabel}${subjectLabel} ${modeText}`;
                const descParts = [];

                descParts.push(`${fieldLabel} alanı için hazırlanmış seviye testi.`);
                if (subject) {
                    descParts.push(`${subject.toUpperCase()} dersine odaklanır.`);
                } else if (config.perSubject) {
                    descParts.push(`Her dersten yaklaşık ${config.perSubject} soru içerir.`);
                }
                descParts.push(`${quizQuestions.length} sorudan oluşur.`);

                const description = descParts.join(' ');

                const testData = {
                    id: 'yks_' + Date.now(),
                    title: title,
                    description: description,
                    questions: quizQuestions,
                    createdAt: Date.now(),
                    // AI testleri gibi 24 saat saklayalım
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                };

                // ✅ QuizManager, AI testlerini buradan okuyor
                localStorage.setItem('testify_generated_test', JSON.stringify(testData));

                // İstersek kütüphaneye de kaydedebiliriz (şimdilik opsiyonel)
                if (config.saveToLibrary && window.LibraryManager && typeof window.LibraryManager.saveTestToLibrary === 'function') {
                    window.LibraryManager.saveTestToLibrary(testData);
                }

                // Test sekmesine geç
                const testTab = document.querySelector('[data-tab="test"]');
                if (testTab) {
                    testTab.click();
                }

                // Quiz'i başlat (AI mod pipeline'ını kullanıyoruz)
                setTimeout(() => {
                    if (window.QuizManager && typeof window.QuizManager.startQuiz === 'function') {
                        window.QuizManager.startQuiz('ai'); // AI testi gibi davranır ama soru kaynağımız YKS havuzu
                    } else {
                        console.error('QuizManager.startQuiz bulunamadı');
                    }
                }, 400);

                if (window.Utils) {
                    window.Utils.showToast('YKS testi başlatılıyor...', 'info');
                }

                console.log('🎯 YKS testi hazır:', {
                    field,
                    subject,
                    questionCount: quizQuestions.length
                });

            } catch (err) {
                console.error('❌ YKS testi başlatma hatası:', err);
                if (window.Utils) {
                    window.Utils.showToast('YKS testi başlatılamadı!', 'error');
                }
            }
        }
    };

    window.YKSFlow = YKSFlow;
})(window, document);
