/**
 * TESTIFY QUIZ MANAGER v2.1
 * =========================
 * Test motoru - Tüm test akışlarını yönetir
 * 
 * Desteklenen modlar:
 * - practice: Pratik modu (süre yok, anında geri bildirim)
 * - exam: Sınav modu (süre var, sonuçlar sonda)
 * - quick: Hızlı test (5 soru)
 * - marathon: Maraton (30+ soru)
 * - ai: AI tarafından oluşturulan test
 * - library: Kütüphaneden yüklenen test
 * - yks: YKS soru havuzundan test
 */

'use strict';

const QuizManager = {
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════
    
    state: {
        currentMode: null,
        questions: [],
        currentIndex: 0,
        answers: [],
        startTime: null,
        timerInterval: null,
        elapsedSeconds: 0,
        timeLimit: null,           // Sınav modu için süre limiti (saniye)
        isReviewing: false,
        testTitle: null,
        testDescription: null,
        meta: null,
        eventListenersAttached: false,
        showInstantFeedback: true  // Pratik modda anında geri bildirim
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // YARDIMCI METOTLAR
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Doğru cevabın index'ini bulur
     * Desteklenen formatlar:
     * - question.answerIndex (number)
     * - question.a (string - tam metin veya harf)
     * - question.correctIndex (number)
     */
    getCorrectIndex(question) {
        if (!question || !Array.isArray(question.o)) return -1;

        const letters = ['A', 'B', 'C', 'D', 'E'];
        const a = question.a;

        // Doğrudan index
        if (typeof question.answerIndex === 'number') {
            return question.answerIndex;
        }
        if (typeof question.correctIndex === 'number') {
            return question.correctIndex;
        }
        if (typeof a === 'number') {
            return a;
        }

        // String olarak cevap
        if (typeof a === 'string') {
            const trimmed = a.trim();

            // Sadece harf (A, B, C...)
            if (/^[A-E]$/i.test(trimmed)) {
                return letters.indexOf(trimmed.toUpperCase());
            }

            // "C) ..." formatı veya tam metin
            const normalizedAnswer = trimmed.replace(/^\s*[A-E]\)\s*/i, '').trim();

            return question.o.findIndex(opt => {
                if (!opt) return false;
                const str = String(opt);
                const normalizedOpt = str.replace(/^\s*[A-E]\)\s*/i, '').trim();
                return (
                    normalizedOpt === normalizedAnswer ||
                    str.trim() === trimmed
                );
            });
        }

        return -1;
    },

    /**
     * Soru formatını normalize et
     * Farklı kaynaklardan gelen soruları standart formata çevir
     */
    normalizeQuestion(q, index) {
        // Zaten doğru formatta
        if (q.q && Array.isArray(q.o)) {
            return {
                ...q,
                id: q.id || `q_${index + 1}`
            };
        }

        // Alternatif formatlar
        const question = {
            id: q.id || `q_${index + 1}`,
            q: q.q || q.text || q.question || '',
            o: q.o || q.options || q.choices || [],
            a: null,
            explanation: q.explanation || q.hint || '',
            difficulty: q.difficulty || 'medium',
            subject: q.subject || null,
            topic: q.topic || null
        };

        // Doğru cevabı belirle
        if (typeof q.correctIndex === 'number') {
            question.a = question.o[q.correctIndex] || '';
            question.answerIndex = q.correctIndex;
        } else if (typeof q.answerIndex === 'number') {
            question.a = question.o[q.answerIndex] || '';
        } else if (q.a) {
            question.a = q.a;
        } else if (q.answer) {
            question.a = q.answer;
        }

        return question;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TEST YÜKLEME
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * AI tarafından oluşturulan testi yükle
     */
    loadAIGeneratedTest() {
        try {
            let raw = localStorage.getItem('testify_generated_test') 
                   || localStorage.getItem('testify_current_test');

            if (!raw) {
                console.log('ℹ️ AI testi bulunamadı');
                return null;
            }
            
            const testData = JSON.parse(raw);
            
            // Expiry kontrolü
            if (!testData.expiresAt) {
                testData.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
                localStorage.setItem('testify_generated_test', JSON.stringify(testData));
            }
            
            if (testData.expiresAt && Date.now() > testData.expiresAt) {
                console.log('⏰ AI testi süresi dolmuş');
                localStorage.removeItem('testify_generated_test');
                localStorage.removeItem('testify_current_test');
                return null;
            }
            
            console.log('✅ AI testi yüklendi:', testData.title);
            return testData;
            
        } catch (error) {
            console.error('❌ AI test yükleme hatası:', error);
            return null;
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ANA API - start()
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Yeni test başlat - Ana giriş noktası
     * 
     * @param {Object} config
     * @param {Array} config.questions - Soru listesi (ZORUNLU)
     * @param {string} config.mode - Test modu ('practice', 'exam', 'quick', 'marathon')
     * @param {string} config.testTitle - Test başlığı
     * @param {string} config.testDescription - Test açıklaması
     * @param {number} config.timeLimit - Süre limiti (saniye, exam modu için)
     * @param {Object} config.meta - Ek metadata
     */
    start(config) {
        console.log('🎯 QuizManager.start() çağrıldı:', config);

        // Önceki testi temizle
        this.cleanupPreviousQuiz();

        try {
            // Validasyon
            if (!config || !Array.isArray(config.questions) || config.questions.length === 0) {
                Utils.showToast('Bu test için soru bulunamadı.', 'error');
                console.error('QuizManager.start: geçersiz questions');
                return false;
            }

            // Mod belirleme
            const mode = config.mode || 'practice';
            const showInstantFeedback = mode === 'practice' || mode === 'quick';

            // Soruları normalize et
            const normalizedQuestions = config.questions.map((q, i) => this.normalizeQuestion(q, i));

            // State'i ayarla
            this.state = {
                currentMode: mode,
                questions: normalizedQuestions,
                currentIndex: 0,
                answers: new Array(normalizedQuestions.length).fill(null),
                startTime: Date.now(),
                timerInterval: null,
                elapsedSeconds: 0,
                timeLimit: config.timeLimit || null,
                isReviewing: false,
                testTitle: config.testTitle || null,
                testDescription: config.testDescription || null,
                meta: config.meta || null,
                eventListenersAttached: this.state.eventListenersAttached,
                showInstantFeedback: showInstantFeedback
            };

            // Sayfa geçişi
            const testSelection = document.getElementById('testSelection');
            const quizPage = document.getElementById('quizPage');

            if (!quizPage) {
                throw new Error('quizPage bulunamadı');
            }

            if (testSelection) {
                testSelection.classList.remove('active');
            }
            quizPage.classList.add('active');

            // UI'ı hazırla
            this.showExitButton();
            this.startTimer();
            this.displayQuestion();
            this.saveState();

            // Bildirim
            const questionCount = this.state.questions.length;
            const titlePart = this.state.testTitle ? `: ${this.state.testTitle}` : '';
            Utils.showToast(`Test başladı${titlePart} - ${questionCount} soru`, 'success');

            console.log(`✅ ${questionCount} soru yüklendi, mod: ${mode}`);
            return true;

        } catch (error) {
            console.error('❌ QuizManager.start hata:', error);
            Utils.showToast('Test başlatılamadı: ' + error.message, 'error');
            return false;
        }
    },

    /**
     * Eski API - Geriye dönük uyumluluk
     */
    startQuiz(mode) {
        console.log('🎯 QuizManager.startQuiz() çağrıldı, mod:', mode);
        
        this.cleanupPreviousQuiz();
        
        try {
            // AI testini kontrol et
            const aiTest = this.loadAIGeneratedTest();
            
            if (aiTest && aiTest.questions && aiTest.questions.length > 0) {
                return this.start({
                    questions: aiTest.questions,
                    mode: mode === 'exam' ? 'exam' : 'practice',
                    testTitle: aiTest.title,
                    testDescription: aiTest.description,
                    meta: {
                        source: 'ai',
                        id: aiTest.id || null
                    }
                });
            }

            // Varsayılan soru bankası
            if (!window.questionBank || !Array.isArray(window.questionBank) || window.questionBank.length === 0) {
                Utils.showToast('Soru bankası yüklenemedi!', 'error');
                console.error('questionBank bulunamadı veya boş!');
                return false;
            }

            return this.start({
                questions: Utils.shuffleArray([...window.questionBank]),
                mode: mode,
                testTitle: null,
                testDescription: null,
                meta: {
                    source: 'questionBank',
                    mode: mode
                }
            });
            
        } catch (error) {
            console.error('❌ Quiz başlatma hatası:', error);
            Utils.showToast('Test başlatılamadı: ' + error.message, 'error');
            return false;
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TIMER YÖNETİMİ
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Timer'ı başlat
     */
    startTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }

        this.state.timerInterval = setInterval(() => {
            this.state.elapsedSeconds++;
            this.updateTimerDisplay();
            
            // Süre limiti kontrolü (sınav modu)
            if (this.state.timeLimit && this.state.elapsedSeconds >= this.state.timeLimit) {
                this.handleTimeUp();
            }
            
            // State'i periyodik kaydet
            if (this.state.elapsedSeconds % 10 === 0) {
                this.saveState();
            }
        }, 1000);
    },

    /**
     * Timer'ı durdur
     */
    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    /**
     * Timer gösterimini güncelle
     */
    updateTimerDisplay() {
        const timerEl = document.getElementById('quizTimer');
        if (!timerEl) return;

        if (this.state.timeLimit) {
            // Geri sayım (sınav modu)
            const remaining = Math.max(0, this.state.timeLimit - this.state.elapsedSeconds);
            timerEl.textContent = Utils.formatTime(remaining);
            
            // Son 1 dakika uyarısı
            if (remaining <= 60 && remaining > 0) {
                timerEl.style.color = 'var(--danger)';
                timerEl.style.fontWeight = '700';
            }
        } else {
            // Normal sayım
            timerEl.textContent = Utils.formatTime(this.state.elapsedSeconds);
        }
    },

    /**
     * Süre dolduğunda
     */
    handleTimeUp() {
        Utils.showToast('⏰ Süre doldu! Test otomatik olarak bitiriliyor...', 'warning');
        this.finishQuiz(true); // Force finish
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SORU GÖSTERİMİ
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Mevcut soruyu göster
     */
    displayQuestion() {
        try {
            const question = this.state.questions[this.state.currentIndex];
            if (!question) {
                throw new Error('Soru bulunamadı');
            }

            // Soru numarası
            const currentQuestionEl = document.getElementById('currentQuestion');
            const totalQuestionsEl = document.getElementById('totalQuestionsQuiz');
            
            if (currentQuestionEl) {
                currentQuestionEl.textContent = this.state.currentIndex + 1;
            }
            if (totalQuestionsEl) {
                totalQuestionsEl.textContent = this.state.questions.length;
            }

            // Progress bar
            const progress = ((this.state.currentIndex + 1) / this.state.questions.length) * 100;
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = progress + '%';
                const progressBar = progressFill.parentElement;
                if (progressBar) {
                    progressBar.setAttribute('aria-valuenow', Math.round(progress));
                }
            }

            // Soru metni
            const questionTextEl = document.getElementById('questionText');
            if (questionTextEl) {
                questionTextEl.textContent = question.q;
            }

            // Seçenekleri göster
            this.displayOptions(question);

            // Butonları güncelle
            this.updateButtons();

        } catch (error) {
            console.error('Soru gösterme hatası:', error);
            Utils.showToast('Soru gösterilemedi', 'error');
        }
    },

    /**
     * Seçenekleri göster
     */
    displayOptions(question) {
        const optionsList = document.getElementById('optionsList');
        if (!optionsList) return;

        optionsList.innerHTML = '';

        const letters = ['A', 'B', 'C', 'D', 'E'];
        const correctIndex = this.getCorrectIndex(question);
        const userAnswer = this.state.answers[this.state.currentIndex];
        const hasAnswered = userAnswer !== null;

        question.o.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.setAttribute('role', 'radio');
            optionDiv.setAttribute('aria-checked', 'false');
            optionDiv.setAttribute('tabindex', '0');
            
            const isSelected = userAnswer === index;
            if (isSelected) {
                optionDiv.classList.add('selected');
                optionDiv.setAttribute('aria-checked', 'true');
            }

            // Review modunda veya anında geri bildirim aktifse ve cevap verildiyse
            const showFeedback = this.state.isReviewing || (this.state.showInstantFeedback && hasAnswered);

            if (showFeedback) {
                optionDiv.classList.add('disabled');
                const isCorrect = index === correctIndex;
                const isUserAnswer = isSelected;
                
                if (isCorrect) {
                    optionDiv.classList.add('correct');
                }
                
                if (isUserAnswer && !isCorrect) {
                    optionDiv.classList.add('incorrect');
                }
            }

            // "A) " prefix'ini kaldır
            const cleanText = String(option).replace(/^\s*[A-E]\)\s*/i, '');

            optionDiv.innerHTML = `
                <span class="option-letter">${letters[index]}</span>
                <span>${Utils.sanitizeHTML(cleanText)}</span>
            `;

            // Event listener (henüz cevaplanmamışsa veya review değilse)
            if (!showFeedback) {
                const clickHandler = () => this.selectOption(index);
                const keyHandler = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectOption(index);
                    }
                };
                
                optionDiv.addEventListener('click', clickHandler);
                optionDiv.addEventListener('keypress', keyHandler);
            }

            optionsList.appendChild(optionDiv);
        });

        // Açıklama göster (review veya anında geri bildirim)
        if (showFeedback && question.explanation) {
            const isCorrect = userAnswer === correctIndex;
            this.showExplanation(question, isCorrect);
        }
    },

    /**
     * Seçenek seç
     */
    selectOption(index) {
        if (this.state.isReviewing) return;
        if (this.state.answers[this.state.currentIndex] !== null) return; // Zaten cevaplandı

        try {
            const question = this.state.questions[this.state.currentIndex];
            const correctIndex = this.getCorrectIndex(question);
            const isCorrect = index === correctIndex;

            // Cevabı kaydet
            this.state.answers[this.state.currentIndex] = index;

            // Anında geri bildirim göster
            if (this.state.showInstantFeedback) {
                // Tüm seçenekleri disable et
                document.querySelectorAll('.option-item').forEach((item, idx) => {
                    item.classList.add('disabled');
                    item.style.pointerEvents = 'none';
                    
                    if (idx === correctIndex) {
                        item.classList.add('correct');
                    }
                    
                    if (idx === index && !isCorrect) {
                        item.classList.add('incorrect');
                    }
                    
                    if (idx === index) {
                        item.classList.add('selected');
                        item.setAttribute('aria-checked', 'true');
                    }
                });

                // Açıklama göster
                this.showExplanation(question, isCorrect);
            } else {
                // Sadece seçimi işaretle (sınav modu)
                document.querySelectorAll('.option-item').forEach((item, idx) => {
                    if (idx === index) {
                        item.classList.add('selected');
                        item.setAttribute('aria-checked', 'true');
                    } else {
                        item.classList.remove('selected');
                        item.setAttribute('aria-checked', 'false');
                    }
                });
            }

            // State'i kaydet
            this.saveState();

        } catch (error) {
            console.error('Seçenek seçme hatası:', error);
        }
    },

    /**
     * Açıklama göster
     */
    showExplanation(question, isCorrect) {
        // Eski açıklamayı kaldır
        const oldExplanation = document.querySelector('.question-explanation');
        if (oldExplanation) {
            oldExplanation.remove();
        }

        if (!question.explanation) return;

        const optionsList = document.getElementById('optionsList');
        if (!optionsList) return;

        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'question-explanation';
        
        const statusIcon = isCorrect ? '✅' : '❌';
        const statusText = isCorrect 
            ? (window.t ? t('quiz.correct', 'Doğru!') : 'Doğru!')
            : (window.t ? t('quiz.wrong', 'Yanlış!') : 'Yanlış!');
        const statusColor = isCorrect ? 'var(--success)' : 'var(--danger)';
        
        explanationDiv.innerHTML = `
            <div class="explanation-status" style="color: ${statusColor}">
                <span style="font-size: 1.2rem;">${statusIcon}</span>
                <strong>${statusText}</strong>
            </div>
            <div class="explanation-content">
                <span class="explanation-icon">💡</span>
                <div>
                    <strong style="color: var(--info);">${window.t ? t('quiz.explanation', 'Açıklama') : 'Açıklama'}:</strong>
                    <p>${Utils.sanitizeHTML(question.explanation)}</p>
                </div>
            </div>
        `;
        
        optionsList.appendChild(explanationDiv);
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVİGASYON
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Butonları güncelle
     */
    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        const isFirstQuestion = this.state.currentIndex === 0;
        const isLastQuestion = this.state.currentIndex === this.state.questions.length - 1;

        // Önceki butonu
        if (prevBtn) {
            prevBtn.disabled = isFirstQuestion;
            prevBtn.style.display = (!isFirstQuestion || this.state.isReviewing) ? 'inline-flex' : 'none';
            prevBtn.style.opacity = isFirstQuestion ? '0.5' : '1';
        }

        // Sonraki butonu
        if (nextBtn) {
            nextBtn.style.display = isLastQuestion ? 'none' : 'inline-flex';
        }
        
        // Bitir butonu
        if (submitBtn) {
            submitBtn.style.display = isLastQuestion && !this.state.isReviewing ? 'inline-flex' : 'none';
        }

        // Çıkış butonu
        this.showExitButton();
    },

    /**
     * Sonraki soru
     */
    nextQuestion() {
        if (this.state.currentIndex < this.state.questions.length - 1) {
            this.state.currentIndex++;
            this.displayQuestion();
            this.saveState();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    /**
     * Önceki soru
     */
    previousQuestion() {
        if (this.state.currentIndex > 0) {
            this.state.currentIndex--;
            this.displayQuestion();
            this.saveState();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TEST BİTİŞİ
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Testi bitir
     */
    async finishQuiz(forceFinish = false) {
        try {
            const unanswered = this.state.answers.filter(a => a === null).length;
            
            if (unanswered > 0 && !forceFinish) {
                const confirmMsg = window.t 
                    ? t('quiz.unansweredConfirm', `${unanswered} soru cevaplanmadı. Testi bitirmek istediğinizden emin misiniz?`)
                    : `${unanswered} soru cevaplanmadı. Testi bitirmek istediğinizden emin misiniz?`;
                
                const confirmed = await Utils.confirm(confirmMsg);
                if (!confirmed) return;
            }

            this.stopTimer();
            const results = this.calculateResults();

            // Sonuçları kaydet
            if (window.StorageManager) {
                StorageManager.saveTestResult(results);
                StorageManager.clearQuizState();
            }

            // YKS Journey'e bildir
            if (window.TestifyYKS && typeof TestifyYKS.addSolvedQuestions === 'function') {
                TestifyYKS.addSolvedQuestions(results.totalQuestions);
            }

            // Temizlik
            localStorage.removeItem('testify_generated_test');
            localStorage.removeItem('testify_current_test');

            // Sonuçları göster
            this.showResults(results);
            
        } catch (error) {
            console.error('Quiz bitirme hatası:', error);
            Utils.showToast('Test bitirilemedi', 'error');
        }
    },

    /**
     * Sonuçları hesapla
     */
    calculateResults() {
        let correct = 0;
        let wrong = 0;

        this.state.questions.forEach((question, index) => {
            const userAnswerIndex = this.state.answers[index];
            
            if (userAnswerIndex !== null && typeof userAnswerIndex === 'number') {
                const correctIndex = this.getCorrectIndex(question);
                if (userAnswerIndex === correctIndex) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        });

        const unanswered = this.state.questions.length - (correct + wrong);
        const successRate = this.state.questions.length > 0 
            ? Math.round((correct / this.state.questions.length) * 100) 
            : 0;

        // Net hesaplama (YKS formülü: Doğru - Yanlış/4)
        const net = correct - (wrong / 4);

        return {
            mode: this.state.currentMode,
            totalQuestions: this.state.questions.length,
            correctAnswers: correct,
            wrongAnswers: wrong,
            unanswered: unanswered,
            successRate: successRate,
            net: Math.max(0, net.toFixed(2)),
            time: this.state.elapsedSeconds,
            timestamp: Date.now(),
            testTitle: this.state.testTitle,
            meta: this.state.meta
        };
    },

    /**
     * Sonuçları göster
     */
    showResults(results) {
        try {
            const quizPage = document.getElementById('quizPage');
            const resultsPage = document.getElementById('resultsPage');
            
            if (!quizPage || !resultsPage) {
                throw new Error('Sonuç sayfası bulunamadı');
            }

            quizPage.classList.remove('active');
            resultsPage.classList.add('active');

            // Sonuç elemanlarını güncelle
            const elements = {
                finalScore: `${results.correctAnswers}/${results.totalQuestions}`,
                correctAnswers: results.correctAnswers,
                wrongAnswers: results.wrongAnswers,
                successPercent: results.successRate + '%',
                totalTimeResult: Utils.formatTime(results.time)
            };

            Object.entries(elements).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            });

            // Başarı ikonu
            const resultsIcon = document.querySelector('.results-icon');
            if (resultsIcon) {
                const icons = {
                    90: '🏆',
                    75: '🎉',
                    60: '👏',
                    40: '💪',
                    0: '📚'
                };
                
                for (const [threshold, icon] of Object.entries(icons)) {
                    if (results.successRate >= parseInt(threshold)) {
                        resultsIcon.innerHTML = `<i class="ph ph-trophy icon" style="font-size: 3rem;"></i>`;
                        break;
                    }
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Sonuç gösterme hatası:', error);
            Utils.showToast('Sonuçlar gösterilemedi', 'error');
        }
    },

    /**
     * Cevapları incele
     */
    reviewAnswers() {
        try {
            this.state.isReviewing = true;
            this.state.currentIndex = 0;
            this.state.showInstantFeedback = true; // Review'da her zaman göster

            const resultsPage = document.getElementById('resultsPage');
            const quizPage = document.getElementById('quizPage');
            
            if (!resultsPage || !quizPage) {
                throw new Error('Quiz sayfası bulunamadı');
            }

            resultsPage.classList.remove('active');
            quizPage.classList.add('active');

            this.displayQuestion();
            this.showExitButton();

            Utils.showToast(
                window.t ? t('quiz.reviewMode', 'İnceleme modu - Açıklamaları okuyabilirsiniz') : 'İnceleme modu',
                'info'
            );
            
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('İnceleme modu hatası:', error);
            Utils.showToast('İnceleme modu başlatılamadı', 'error');
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // YENİ TEST & ÇIKIŞ
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Yeni test
     */
    newQuiz() {
        try {
            this.cleanupPreviousQuiz();
            
            const resultsPage = document.getElementById('resultsPage');
            const quizPage = document.getElementById('quizPage');
            const testSelection = document.getElementById('testSelection');
            
            if (resultsPage) resultsPage.classList.remove('active');
            if (quizPage) quizPage.classList.remove('active');
            if (testSelection) testSelection.classList.add('active');

            this.resetState();

            localStorage.removeItem('testify_generated_test');
            localStorage.removeItem('testify_current_test');

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Yeni quiz başlatma hatası:', error);
            Utils.showToast('Yeni test başlatılamadı', 'error');
        }
    },

    /**
     * Testten çık
     */
    async exitQuiz() {
        if (this.state.isReviewing) {
            this.newQuiz();
            return;
        }

        const confirmMsg = window.t 
            ? t('quiz.exitConfirm', 'Testi bırakmak istediğine emin misin?\n\nİlerleme kaydedilmeyecek!')
            : 'Testi bırakmak istediğine emin misin?\n\nİlerleme kaydedilmeyecek!';
        
        const confirmed = await Utils.confirm(confirmMsg);
        if (!confirmed) return;

        try {
            const answeredCount = this.state.answers.filter(a => a !== null).length;
            const totalCount = this.state.questions.length;

            this.cleanupPreviousQuiz();

            if (window.StorageManager) {
                StorageManager.clearQuizState();
            }

            const quizPage = document.getElementById('quizPage');
            const resultsPage = document.getElementById('resultsPage');
            const testSelection = document.getElementById('testSelection');
            
            if (quizPage) quizPage.classList.remove('active');
            if (resultsPage) resultsPage.classList.remove('active');
            if (testSelection) testSelection.classList.add('active');

            this.resetState();

            if (answeredCount > 0) {
                Utils.showToast(
                    `📋 Test bırakıldı (${answeredCount}/${totalCount} soru cevaplanmıştı)`,
                    'info',
                    4000
                );
            } else {
                Utils.showToast('Test iptal edildi', 'info');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Quiz çıkış hatası:', error);
            Utils.showToast('Çıkış yapılamadı', 'error');
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // YARDIMCI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Önceki testi temizle
     */
    cleanupPreviousQuiz() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
        
        const optionsList = document.getElementById('optionsList');
        if (optionsList) {
            optionsList.innerHTML = '';
        }
    },

    /**
     * State'i sıfırla
     */
    resetState() {
        this.state = {
            currentMode: null,
            questions: [],
            currentIndex: 0,
            answers: [],
            startTime: null,
            timerInterval: null,
            elapsedSeconds: 0,
            timeLimit: null,
            isReviewing: false,
            testTitle: null,
            testDescription: null,
            meta: null,
            eventListenersAttached: this.state.eventListenersAttached,
            showInstantFeedback: true
        };
    },

    /**
     * Çıkış butonunu göster
     */
    showExitButton() {
        const exitBtn = document.getElementById('exitQuizBtn');
        if (exitBtn) {
            exitBtn.style.display = this.state.isReviewing ? 'none' : 'inline-flex';
        }
    },

    /**
     * State'i kaydet
     */
    saveState() {
        try {
            if (window.StorageManager) {
                StorageManager.saveQuizState({
                    currentMode: this.state.currentMode,
                    currentIndex: this.state.currentIndex,
                    answers: this.state.answers,
                    startTime: this.state.startTime,
                    elapsedSeconds: this.state.elapsedSeconds,
                    questionCount: this.state.questions.length
                });
            }
        } catch (error) {
            console.warn('Quiz durumu kaydedilemedi:', error);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Event listener'ları kur
     */
    setupEventListeners() {
        if (this.state.eventListenersAttached) {
            console.log('⚠️ Event listener\'lar zaten ekli');
            return;
        }

        console.log('🔧 Quiz event listener\'lar kuruluyor...');
        
        // Test kartları
        const testOptions = document.querySelector('.test-options');
        if (testOptions) {
            // Kartları tanımla: practice, exam, ai, custom, yks-quick
            const cards = testOptions.querySelectorAll('.test-option-card');
            
            cards.forEach((card) => {
                // YKS Quick kartı ayrı ele alınıyor (ID ile)
                if (card.id === 'yksQuickCard') return;

                const handleClick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Kart türünü belirle (aria-label veya içerik)
                    const label = card.getAttribute('aria-label') || '';
                    
                    if (label.includes('Pratik') || label.includes('practice')) {
                        // PRATİK MODU → Kütüphaneye yönlendir
                        if (window.LibraryManager && typeof LibraryManager.openAndLoad === 'function') {
                            LibraryManager.openAndLoad();
                        } else {
                            this.startQuiz('practice');
                        }
                    } else if (label.includes('Sınav') || label.includes('exam')) {
                        this.startQuiz('exam');
                    } else if (label.includes('AI') || label.includes('ai')) {
                        this.startQuiz('ai');
                    } else if (label.includes('Özel') || label.includes('custom')) {
                        // Özel test → Test oluştur sekmesine git
                        if (window.App && typeof App.switchTab === 'function') {
                            App.switchTab('create');
                        } else {
                            const createTab = document.querySelector('[data-tab="create"]');
                            if (createTab) createTab.click();
                        }
                    }
                };

                card.addEventListener('click', handleClick);
                card.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(e);
                    }
                });
            });
        }

        // Navigation butonları
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        const reviewBtn = document.getElementById('reviewBtn');
        const newQuizBtn = document.getElementById('newQuizBtn');
        const exitQuizBtn = document.getElementById('exitQuizBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousQuestion();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextQuestion();
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.finishQuiz();
            });
        }

        if (reviewBtn) {
            reviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.reviewAnswers();
            });
        }

        if (newQuizBtn) {
            newQuizBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.newQuiz();
            });
        }

        if (exitQuizBtn) {
            exitQuizBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exitQuiz();
            });
        }

        this.state.eventListenersAttached = true;
        console.log('✅ Quiz event listener\'lar kuruldu');
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        QuizManager.setupEventListeners();
    });
} else {
    QuizManager.setupEventListeners();
}

// Sayfa kapanırken temizlik
window.addEventListener('beforeunload', () => {
    QuizManager.stopTimer();
});

// Export
window.QuizManager = QuizManager;
