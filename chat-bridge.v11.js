/**
 * ═══════════════════════════════════════════════════════════════════════
 * TESTIFY CHAT BRIDGE v11
 * UI ↔ TestifyAI v12.0 PROFESSIONAL entegrasyon katmanı
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Görev:
 * - Kullanıcıdan gelen istekleri (konu, soru sayısı, zorluk vb.)
 *   toplayıp TestifyAI.generateTestFromAI(...) fonksiyonuna aktarmak
 * - Chat arayüzünü (aiChat) TestifyAI ile entegre etmek
 * - API key girişini TestifyAI.config.setApiKey ile beslemek
 * 
 * Bu dosya, testify-ai.js yüklendikten sonra eklenmelidir.
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

(function () {

    const TestifyChatBridge = {
        initialized: false,
        dom: {
            promptInput: null,
            generateBtn: null,
            apiKeyInput: null,
            subjectInput: null,
            questionCountInput: null,
            questionCountSlider: null,
            difficultySelect: null,
            topicsInput: null,
            examTypeSelect: null,
            examNameInput: null,
            questionTimeInput: null,
            osymStandardsToggle: null,
            loadSavedTestBtn: null
        },

        /**
         * Basit yardımcı: verilen ID listesinden ilk bulunan elementi döndür
         */
        resolveElement(...ids) {
            for (const id of ids) {
                if (!id) continue;
                const el = document.getElementById(id);
                if (el) return el;
            }
            return null;
        },

        /**
         * DOM elementlerini bul
         */
        cacheDom() {
            this.dom.promptInput        = this.resolveElement('aiPromptInput', 'testifyPromptInput', 'promptInput');
            this.dom.generateBtn        = this.resolveElement('generateTestBtn', 'aiGenerateBtn', 'btnGenerateTest');
            this.dom.apiKeyInput        = this.resolveElement('apiKeyInput', 'openaiApiKey', 'testifyApiKey');
            this.dom.subjectInput       = this.resolveElement('subjectInput', 'testSubjectInput');
            this.dom.questionCountInput = this.resolveElement('questionCountInput', 'questionCount');
            this.dom.questionCountSlider= this.resolveElement('questionCountSlider', 'questionCountRange');
            this.dom.difficultySelect   = this.resolveElement('difficultySelect', 'difficulty', 'testDifficulty');
            this.dom.topicsInput        = this.resolveElement('topicsInput', 'topicsField');
            this.dom.examTypeSelect     = this.resolveElement('examTypeSelect', 'examType');
            this.dom.examNameInput      = this.resolveElement('examNameInput', 'testNameInput');
            this.dom.questionTimeInput  = this.resolveElement('questionTimeInput', 'questionTime');
            this.dom.osymStandardsToggle= this.resolveElement('osymStandardsToggle', 'osymModeToggle');
            this.dom.loadSavedTestBtn   = this.resolveElement('loadSavedTestBtn', 'btnLoadSavedTest');
        },

        /**
         * UI event’lerini bağla
         */
        attachEvents() {
            const self = this;

            // “Testi Oluştur” butonu
            if (this.dom.generateBtn) {
                this.dom.generateBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    self.handleGenerateClick();
                });
            }

            // Prompt inputta Ctrl+Enter ile tetikleme
            if (this.dom.promptInput) {
                this.dom.promptInput.addEventListener('keydown', function (e) {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        self.handleGenerateClick();
                    }
                });
            }

            // Kaydedilmiş testi yükleme
            if (this.dom.loadSavedTestBtn) {
                this.dom.loadSavedTestBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    self.handleLoadSavedTest();
                });
            }

            // QuestionCount slider ↔ input senkronizasyonu (varsa)
            if (this.dom.questionCountSlider && this.dom.questionCountInput) {
                this.dom.questionCountSlider.addEventListener('input', function () {
                    self.dom.questionCountInput.value = String(self.dom.questionCountSlider.value);
                });

                this.dom.questionCountInput.addEventListener('input', function () {
                    const val = parseInt(self.dom.questionCountInput.value, 10);
                    if (!isNaN(val)) self.dom.questionCountSlider.value = String(val);
                });
            }
        },

        /**
         * UI’dan parametreleri topla ve TestifyAI.generateTestFromAI’ye uygun options objesini hazırla
         */
        buildOptionsFromUI(userPrompt) {
            const subject = (this.dom.subjectInput?.value || '').trim() || 'Genel';
            let questionCount = 10;

            if (this.dom.questionCountInput && this.dom.questionCountInput.value) {
                const n = parseInt(this.dom.questionCountInput.value, 10);
                if (!isNaN(n) && n > 0) questionCount = n;
            } else if (this.dom.questionCountSlider && this.dom.questionCountSlider.value) {
                const n = parseInt(this.dom.questionCountSlider.value, 10);
                if (!isNaN(n) && n > 0) questionCount = n;
            }

            const difficulty = (this.dom.difficultySelect?.value || '').trim() || 'orta';

            const topicsRaw = (this.dom.topicsInput?.value || '').trim();
            const topics = topicsRaw
                ? topicsRaw.split(',').map(t => t.trim()).filter(Boolean)
                : [];

            const examType = (this.dom.examTypeSelect?.value || '').trim() || 'generic';
            const examName = (this.dom.examNameInput?.value || '').trim() || examType || 'Genel Test';

            let questionTime = 90;
            if (this.dom.questionTimeInput && this.dom.questionTimeInput.value) {
                const qt = parseInt(this.dom.questionTimeInput.value, 10);
                if (!isNaN(qt) && qt > 0) questionTime = qt;
            }

            const osymStandards = !!(this.dom.osymStandardsToggle && this.dom.osymStandardsToggle.checked);

            // Bloom tercihi: UI’da checkbox yoksa mantıklı varsayılan
            const bloomPreference = ['understand', 'apply', 'analyze'];

            const options = {
                subject,
                questionCount,
                difficulty,
                topics,
                originalRequest: userPrompt,
                examType,
                examInfo: {
                    name: examName,
                    questionTime,
                    optionCount: 5,
                    bloomPreference,
                    osymStandards
                }
            };

            return options;
        },

        /**
         * API key’i TestifyAI.config’e aktar
         */
        syncApiKeyToTestify() {
            if (!window.TestifyAI) return;

            const input = this.dom.apiKeyInput;
            if (input && input.value && typeof window.TestifyAI.config?.setApiKey === 'function') {
                window.TestifyAI.config.setApiKey(input.value.trim());
            }
        },

        /**
         * “Testi Oluştur” tıklandığında çalışacak ana handler
         */
        async handleGenerateClick() {
            if (!window.TestifyAI || typeof window.TestifyAI.generateTestFromAI !== 'function') {
                console.error('TestifyAI veya generateTestFromAI fonksiyonu bulunamadı. Lütfen testify-ai.js dosyasının yüklü olduğundan emin olun.');
                alert('Testify AI sistemi yüklenemedi. Lütfen sayfayı yenileyin veya geliştiriciye bildirin.');
                return;
            }

            const promptInput = this.dom.promptInput;
            const generateBtn = this.dom.generateBtn;

            const userPrompt = (promptInput?.value || '').trim();
            if (!userPrompt) {
                alert('Lütfen hangi konuda test istediğini yaz :)');
                if (promptInput) promptInput.focus();
                return;
            }

            // API key senkronizasyonu
            this.syncApiKeyToTestify();

            // UI: butonu kilitle
            if (generateBtn) {
                generateBtn.disabled = true;
                generateBtn.dataset.originalText = generateBtn.dataset.originalText || generateBtn.textContent;
                generateBtn.textContent = 'Oluşturuluyor...';
            }

            // Kullanıcı mesajını sohbete ekle
            if (typeof window.TestifyAI.addMessage === 'function') {
                window.TestifyAI.addMessage(userPrompt, 'user');
            }

            // Seçenekleri hazırla
            const options = this.buildOptionsFromUI(userPrompt);

            try {
                await window.TestifyAI.generateTestFromAI(userPrompt, options);
                // TestifyAI zaten AI mesajını ve tab highlight'ını hallediyor
            } catch (err) {
                console.error('❌ Test oluşturma hatası (chat-bridge):', err);
                if (typeof window.TestifyAI.addMessage === 'function') {
                    window.TestifyAI.addMessage(
                        `🚨 Test oluşturma sırasında bir hata oluştu.\n\n**Detay:** ${err.message || err}`,
                        'ai'
                    );
                }
            } finally {
                // UI: butonu geri aç
                if (generateBtn) {
                    generateBtn.disabled = false;
                    if (generateBtn.dataset.originalText) {
                        generateBtn.textContent = generateBtn.dataset.originalText;
                    } else {
                        generateBtn.textContent = 'Testi Oluştur';
                    }
                }
            }
        },

        /**
         * Kaydedilmiş testi yükle (localStorage → TestifyAI.loadSavedTest)
         */
        handleLoadSavedTest() {
            if (!window.TestifyAI || typeof window.TestifyAI.loadSavedTest !== 'function') {
                console.error('TestifyAI.loadSavedTest fonksiyonu bulunamadı.');
                return;
            }

            const loaded = window.TestifyAI.loadSavedTest();
            if (!loaded) {
                if (typeof window.TestifyAI.addMessage === 'function') {
                    window.TestifyAI.addMessage(
                        '📦 Kayıtlı bir test bulunamadı. Önce bir test oluşturup çözmeyi deneyebilirsin.',
                        'ai'
                    );
                } else {
                    alert('Kayıtlı test bulunamadı.');
                }
                return;
            }

            if (typeof window.TestifyAI.addMessage === 'function') {
                const qCount = loaded.questions?.length || 0;
                window.TestifyAI.addMessage(
                    `✅ Kayıtlı test yüklendi.\n\n` +
                    `• Başlık: ${loaded.title || 'Kayıtlı Test'}\n` +
                    `• Soru Sayısı: ${qCount}\n` +
                    `• Konu: ${(loaded.metadata && loaded.metadata.subject) || 'Belirtilmedi'}`,
                    'ai'
                );
            }

            // UI tarafında “Test Çöz” sekmesini vurgulama
            if (typeof window.TestifyAI.highlightTestTab === 'function') {
                window.TestifyAI.highlightTestTab();
            }
        },

        /**
         * İlk hoş geldin mesajı (opsiyonel)
         */
        sendWelcomeMessage() {
            if (!window.TestifyAI || typeof window.TestifyAI.addMessage !== 'function') return;

            const alreadyWelcomed = sessionStorage.getItem('testify_welcome_shown');
            if (alreadyWelcomed) return;

            window.TestifyAI.addMessage(
                "👋 Merhaba, ben **Testify AI Profesyonel Öğretmen**.\n\n" +
                "• İstediğin **konuyu** yaz (ör: \"Yapay zeka temel kavramları\", \"Matematik: Limit\", \"Python döngüler\")\n" +
                "• Sağdan **soru sayısını** ve **zorluk seviyesini** seç\n" +
                "• Ardından **\"Testi Oluştur\"** butonuna tıkla\n\n" +
                "Her soru 5 şıklı ve doğru cevaplar **A–E arasında dengeli & rastgele** dağıtılmış olacak.\n\n" +
                "Hazırsan, ne çalışmak istediğini yazalım 🎯",
                'ai'
            );

            sessionStorage.setItem('testify_welcome_shown', '1');
        },

        /**
         * Ana init fonksiyonu
         */
        init() {
            if (this.initialized) return;
            this.initialized = true;

            console.log('\n' + '─'.repeat(80));
            console.log('🔌 TESTIFY CHAT BRIDGE v11 başlatılıyor...');
            console.log('─'.repeat(80));

            if (!window.TestifyAI) {
                console.error('❌ TestifyAI global nesnesi bulunamadı. Lütfen testify-ai.js dosyasının yüklü olduğundan emin olun.');
                return;
            }

            this.cacheDom();
            this.attachEvents();
            this.sendWelcomeMessage();

            console.log('✅ TestifyChatBridge hazır (UI ↔ TestifyAI entegrasyonu aktif).');
            console.log('─'.repeat(80) + '\n');
        }
    };

    // Global export
    window.TestifyChatBridge = TestifyChatBridge;

    // DOM yüklendiğinde otomatik init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            TestifyChatBridge.init();
        });
    } else {
        // DOM zaten hazır
        TestifyChatBridge.init();
    }

})();
