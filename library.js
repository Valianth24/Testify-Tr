/**
 * TESTIFY LIBRARY MANAGER v2.1
 * ============================
 * Kullanıcı test kütüphanesi yönetimi
 * AI ve YKS testlerini saklar, PDF indirme sağlar
 */

(function (window, document) {
    'use strict';

    const t = window.t || function (key, fallback) { return fallback || key; };

    const LibraryManager = {
        // ═══════════════════════════════════════════════════════════════════════
        // YAPILANDIRMA
        // ═══════════════════════════════════════════════════════════════════════

        config: {
            STORAGE_PREFIX: 'testify_library_',
            EXPIRY_HOURS: 24,
            MAX_TESTS: 50
        },

        // ═══════════════════════════════════════════════════════════════════════
        // KÜTÜPHANE YÜKLEME
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Kütüphaneyi yükle ve göster
         */
        loadLibrary() {
            console.log('📚 Library loading...');

            const tests = this.getSavedTests();
            const libraryList = document.getElementById('libraryList');

            if (!libraryList) {
                console.error('❌ #libraryList bulunamadı');
                return;
            }

            if (tests.length === 0) {
                libraryList.innerHTML = this.renderEmptyState();
                return;
            }

            // Kart grid olarak render et
            libraryList.innerHTML = `
                <div class="library-grid">
                    ${tests.map(test => this.createTestCard(test)).join('')}
                </div>
            `;

            console.log(`✅ ${tests.length} test listelendi`);
        },

        /**
         * Boş durum gösterimi
         */
        renderEmptyState() {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon" aria-hidden="true">
                        <i class="ph ph-books icon"></i>
                    </div>
                    <h3>${t('library.empty', 'Henüz test oluşturmadın')}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 8px;">
                        ${t('library.emptyDesc', 'YKS Soru Çöz veya AI ile test oluştur!')}
                    </p>
                    <div class="empty-actions" style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn btn-primary" onclick="LibraryManager.goToYKSTestFlow()">
                            <i class="ph ph-rocket-launch"></i>
                            YKS Soru Çöz
                        </button>
                        <button class="btn btn-secondary" onclick="LibraryManager.goToTestCreate()">
                            <i class="ph ph-plus-circle"></i>
                            Test Oluştur
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * Pratik modu / başka yerden çağırmak için:
         * sekmeyi aç + listeyi doldur
         */
        openAndLoad() {
            console.log('📚 LibraryManager.openAndLoad()');

            // Library sekmesini aç
            if (window.App && typeof App.switchTab === 'function') {
                App.switchTab('library');
            } else {
                const libraryTab = document.querySelector('[data-tab="library"]');
                if (libraryTab) {
                    libraryTab.click();
                }
            }

            // Listeyi doldur
            setTimeout(() => {
                this.loadLibrary();
            }, 100);
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TEST KARTI
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Test kartı HTML'i oluştur
         */
        createTestCard(test) {
            const now = Date.now();
            const remainingTime = (test.expiresAt || 0) - now;
            const hoursRemaining = Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60)));
            const minutesRemaining = Math.max(0, Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)));

            const isExpiringSoon = remainingTime > 0 && hoursRemaining < 6;
            const isExpired = remainingTime <= 0;

            // Kaynak ikonu
            const sourceIcon = this.getSourceIcon(test.source);
            const sourceLabel = this.getSourceLabel(test.source);

            // Zorluk badge
            const difficultyBadge = this.getDifficultyBadge(test);

            // Süre bilgisi
            const durationMinutes = Math.ceil((test.questions?.length || 0) * 1.5);

            const remainingText = isExpired
                ? `<span style="color: var(--danger)">${t('library.expired', 'Süresi doldu')}</span>`
                : `${hoursRemaining}h ${minutesRemaining}m ${t('library.remaining', 'kaldı')}`;

            return `
                <article class="library-card ${isExpired ? 'expired' : ''}" data-test-id="${test.id}">
                    <div class="library-card-header">
                        <div class="card-source">
                            ${sourceIcon}
                            <span>${sourceLabel}</span>
                        </div>
                        <button class="btn-icon btn-delete" 
                                onclick="LibraryManager.deleteTest('${test.id}')" 
                                aria-label="${t('library.delete', 'Sil')}" 
                                title="${t('library.delete', 'Sil')}">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>

                    <div class="library-card-body">
                        <h3 class="card-title">${Utils.sanitizeHTML(test.title)}</h3>
                        ${test.description ? `<p class="card-desc">${Utils.sanitizeHTML(test.description)}</p>` : ''}
                        
                        <div class="card-meta">
                            <div class="meta-item">
                                <i class="ph ph-list-bullets"></i>
                                <span>${test.questions?.length || 0} soru</span>
                            </div>
                            <div class="meta-item">
                                <i class="ph ph-timer"></i>
                                <span>~${durationMinutes} dk</span>
                            </div>
                            ${difficultyBadge}
                        </div>

                        <div class="card-footer">
                            <div class="card-time ${isExpiringSoon ? 'warning' : ''}">
                                <i class="ph ph-clock"></i>
                                ${remainingText}
                            </div>
                            <div class="card-date">
                                ${Utils.formatDate(test.createdAt)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="library-card-actions">
                        <button class="btn btn-primary btn-start" 
                                onclick="LibraryManager.startTest('${test.id}')"
                                ${isExpired ? 'disabled' : ''}>
                            <i class="ph ph-play-fill"></i>
                            ${t('library.start', 'Başla')}
                        </button>
                        <button class="btn btn-secondary btn-icon-only" 
                                onclick="LibraryManager.viewTestDetails('${test.id}')"
                                title="${t('library.view', 'İncele')}">
                            <i class="ph ph-eye"></i>
                        </button>
                        <button class="btn btn-secondary btn-icon-only" 
                                onclick="LibraryManager.downloadTestPDF('${test.id}')"
                                title="${t('library.download', 'PDF İndir')}">
                            <i class="ph ph-file-pdf"></i>
                        </button>
                    </div>
                </article>
            `;
        },

        /**
         * Kaynak ikonu
         */
        getSourceIcon(source) {
            const icons = {
                'ai': '<i class="ph ph-robot" style="color: var(--primary)"></i>',
                'yks-test-flow': '<i class="ph ph-rocket-launch" style="color: var(--success)"></i>',
                'yks-level': '<i class="ph ph-chart-line-up" style="color: var(--info)"></i>',
                'user': '<i class="ph ph-user" style="color: var(--warning)"></i>',
                'default': '<i class="ph ph-file-text" style="color: var(--text-secondary)"></i>'
            };
            return icons[source] || icons['default'];
        },

        /**
         * Kaynak etiketi
         */
        getSourceLabel(source) {
            const labels = {
                'ai': 'AI Test',
                'yks-test-flow': 'YKS Test',
                'yks-level': 'Seviye Testi',
                'user': 'Kullanıcı',
                'default': 'Test'
            };
            return labels[source] || labels['default'];
        },

        /**
         * Zorluk rozeti
         */
        getDifficultyBadge(test) {
            // Ortalama zorluk hesapla
            if (!test.questions || test.questions.length === 0) {
                return '';
            }

            const difficulties = test.questions.map(q => q.difficulty || 'medium');
            const counts = { easy: 0, medium: 0, hard: 0 };
            difficulties.forEach(d => {
                if (counts[d] !== undefined) counts[d]++;
            });

            const total = difficulties.length;
            const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

            const badges = {
                easy: { label: 'Kolay', color: 'var(--success)', icon: 'ph-smiley' },
                medium: { label: 'Orta', color: 'var(--warning)', icon: 'ph-minus-circle' },
                hard: { label: 'Zor', color: 'var(--danger)', icon: 'ph-flame' }
            };

            const badge = badges[dominant[0]] || badges.medium;

            return `
                <div class="meta-item difficulty-badge" style="color: ${badge.color}">
                    <i class="ph ${badge.icon}"></i>
                    <span>${badge.label}</span>
                </div>
            `;
        },

        // ═══════════════════════════════════════════════════════════════════════
        // STORAGE İŞLEMLERİ
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Kaydedilmiş testleri getir
         */
        getSavedTests() {
            try {
                const tests = [];

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);

                    if (key && key.startsWith(this.config.STORAGE_PREFIX)) {
                        try {
                            const raw = localStorage.getItem(key);
                            if (!raw) continue;

                            const test = JSON.parse(raw);

                            // Süresi dolmamış testleri ekle
                            if (test.expiresAt && Date.now() < test.expiresAt) {
                                tests.push(test);
                            } else {
                                // Süresi dolmuşları temizle
                                localStorage.removeItem(key);
                                console.log('🗑️ Süresi dolmuş test silindi:', test.title);
                            }
                        } catch (parseError) {
                            console.error('Test parse hatası:', parseError);
                        }
                    }
                }

                // Tarihe göre sırala (yeniden eskiye)
                tests.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                return tests;

            } catch (error) {
                console.error('❌ Test yükleme hatası:', error);
                return [];
            }
        },

        /**
         * Testi kütüphaneye kaydet
         */
        saveTestToLibrary(testData) {
            try {
                // Test limitini kontrol et
                const existingTests = this.getSavedTests();
                if (existingTests.length >= this.config.MAX_TESTS) {
                    // En eski testi sil
                    const oldestTest = existingTests[existingTests.length - 1];
                    if (oldestTest) {
                        localStorage.removeItem(`${this.config.STORAGE_PREFIX}${oldestTest.id}`);
                        console.log('🗑️ Limit aşıldı, eski test silindi:', oldestTest.title);
                    }
                }

                const testToSave = {
                    ...testData,
                    id: testData.id || 'test_' + Date.now(),
                    createdAt: testData.createdAt || Date.now(),
                    expiresAt: testData.expiresAt || (Date.now() + this.config.EXPIRY_HOURS * 60 * 60 * 1000)
                };

                const key = `${this.config.STORAGE_PREFIX}${testToSave.id}`;
                localStorage.setItem(key, JSON.stringify(testToSave));

                console.log('💾 Test kütüphaneye kaydedildi:', testToSave.title);

                // Aktivite kaydet
                if (window.StorageManager && typeof StorageManager.saveActivity === 'function') {
                    StorageManager.saveActivity({
                        type: 'test_saved',
                        data: {
                            title: testToSave.title,
                            questionCount: testToSave.questions?.length || 0,
                            source: testToSave.source
                        },
                        timestamp: Date.now()
                    });
                }

                return true;

            } catch (error) {
                console.error('❌ Test kaydetme hatası:', error);
                Utils.showToast(t('msg.error', 'Test kaydedilemedi!'), 'error');
                return false;
            }
        },

        /**
         * Testi sil
         */
        async deleteTest(testId) {
            const confirmMsg = t('library.deleteConfirm', 'Bu testi silmek istediğinden emin misin?');
            const confirmed = await Utils.confirm(confirmMsg);
            if (!confirmed) return;

            try {
                const key = `${this.config.STORAGE_PREFIX}${testId}`;
                localStorage.removeItem(key);

                this.loadLibrary();

                Utils.showToast(t('msg.deleted', 'Test silindi!'), 'success');
                console.log('🗑️ Test silindi:', testId);

            } catch (error) {
                console.error('❌ Test silme hatası:', error);
                Utils.showToast(t('msg.error', 'Test silinemedi!'), 'error');
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TEST BAŞLATMA
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Testi başlat
         */
        startTest(testId) {
            try {
                const key = `${this.config.STORAGE_PREFIX}${testId}`;
                const raw = localStorage.getItem(key);

                if (!raw) {
                    Utils.showToast(t('msg.error', 'Test bulunamadı!'), 'error');
                    return;
                }

                const testData = JSON.parse(raw);

                // Süresi dolmuş mu kontrol et
                if (testData.expiresAt && Date.now() > testData.expiresAt) {
                    Utils.showToast(t('library.testExpired', 'Bu testin süresi dolmuş!'), 'warning');
                    return;
                }

                // Test sekmesine geç
                if (window.App && typeof App.switchTab === 'function') {
                    App.switchTab('test');
                } else {
                    const testTab = document.querySelector('[data-tab="test"]');
                    if (testTab) testTab.click();
                }

                // QuizManager ile başlat
                setTimeout(() => {
                    if (window.QuizManager && typeof QuizManager.start === 'function') {
                        QuizManager.start({
                            questions: testData.questions || [],
                            mode: testData.mode || 'practice',
                            testTitle: testData.title,
                            testDescription: testData.description,
                            timeLimit: testData.timeLimit || null,
                            meta: {
                                source: 'library',
                                testId: testData.id,
                                originalSource: testData.source,
                                createdAt: testData.createdAt
                            }
                        });
                    } else {
                        console.error('❌ QuizManager bulunamadı');
                        Utils.showToast(t('msg.error', 'Quiz modülü bulunamadı!'), 'error');
                    }
                }, 300);

                Utils.showToast(t('msg.testStarted', 'Test başlatılıyor...'), 'info');

            } catch (error) {
                console.error('❌ Test başlatma hatası:', error);
                Utils.showToast(t('msg.error', 'Test başlatılamadı!'), 'error');
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TEST DETAYLARI
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Test detaylarını göster
         */
        viewTestDetails(testId) {
            try {
                const key = `${this.config.STORAGE_PREFIX}${testId}`;
                const raw = localStorage.getItem(key);

                if (!raw) {
                    Utils.showToast(t('msg.error', 'Test bulunamadı!'), 'error');
                    return;
                }

                const testData = JSON.parse(raw);
                const questions = testData.questions || [];

                const modal = document.createElement('div');
                modal.className = 'modal-overlay library-detail-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>${Utils.sanitizeHTML(testData.title)}</h2>
                            <button class="modal-close" aria-label="${t('common.close', 'Kapat')}">
                                <i class="ph ph-x"></i>
                            </button>
                        </div>
                        
                        <div class="modal-body">
                            ${testData.description ? `
                                <p class="modal-desc">${Utils.sanitizeHTML(testData.description)}</p>
                            ` : ''}
                            
                            <div class="detail-stats">
                                <div class="stat-item">
                                    <i class="ph ph-list-bullets"></i>
                                    <div>
                                        <strong>${questions.length}</strong>
                                        <span>Soru</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <i class="ph ph-timer"></i>
                                    <div>
                                        <strong>~${Math.ceil(questions.length * 1.5)}</strong>
                                        <span>Dakika</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <i class="ph ph-calendar"></i>
                                    <div>
                                        <strong>${Utils.formatDate(testData.createdAt)}</strong>
                                        <span>Oluşturulma</span>
                                    </div>
                                </div>
                            </div>

                            <h3 class="questions-title">
                                <i class="ph ph-question"></i>
                                Sorular
                            </h3>
                            
                            <div class="questions-list">
                                ${questions.map((q, i) => `
                                    <div class="question-preview">
                                        <div class="question-number">${i + 1}</div>
                                        <div class="question-content">
                                            <p class="question-text">${Utils.sanitizeHTML(q.q || q.text || '')}</p>
                                            ${q.difficulty ? `
                                                <span class="difficulty-tag ${q.difficulty}">
                                                    ${this.getDifficultyLabel(q.difficulty)}
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button class="btn btn-secondary" data-action="close">
                                ${t('common.close', 'Kapat')}
                            </button>
                            <button class="btn btn-primary" data-action="start">
                                <i class="ph ph-play-fill"></i>
                                ${t('library.start', 'Teste Başla')}
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Event listeners
                const closeModal = () => modal.remove();
                
                modal.querySelector('.modal-close').addEventListener('click', closeModal);
                modal.querySelector('[data-action="close"]').addEventListener('click', closeModal);
                modal.querySelector('[data-action="start"]').addEventListener('click', () => {
                    closeModal();
                    this.startTest(testId);
                });
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });

            } catch (error) {
                console.error('❌ Test detay hatası:', error);
                Utils.showToast(t('msg.error', 'Test detayları gösterilemedi!'), 'error');
            }
        },

        /**
         * Zorluk etiketi
         */
        getDifficultyLabel(difficulty) {
            const labels = {
                easy: t('library.difficulty.easy', 'Kolay'),
                medium: t('library.difficulty.medium', 'Orta'),
                hard: t('library.difficulty.hard', 'Zor')
            };
            return labels[difficulty] || labels.medium;
        },

        // ═══════════════════════════════════════════════════════════════════════
        // PDF İNDİRME
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * PDF olarak indir
         */
        async downloadTestPDF(testId) {
            try {
                const key = `${this.config.STORAGE_PREFIX}${testId}`;
                const raw = localStorage.getItem(key);

                if (!raw) {
                    Utils.showToast(t('msg.error', 'Test bulunamadı!'), 'error');
                    return;
                }

                const testData = JSON.parse(raw);

                Utils.showToast(t('library.pdf.creating', 'PDF oluşturuluyor...'), 'info', 2000);

                // jsPDF kontrolü
                if (typeof window.jspdf === 'undefined') {
                    Utils.showToast(t('library.pdf.error', 'PDF kütüphanesi yüklenmedi!'), 'error');
                    return;
                }

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                let yPos = 20;
                const pageHeight = 297;
                const marginBottom = 20;
                const lineHeight = 7;
                const questions = testData.questions || [];

                // Başlık
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.text(testData.title || 'Test', 15, yPos);
                yPos += 10;

                // Açıklama
                if (testData.description) {
                    doc.setFontSize(11);
                    doc.setFont(undefined, 'normal');
                    const descLines = doc.splitTextToSize(testData.description, 180);
                    doc.text(descLines, 15, yPos);
                    yPos += descLines.length * lineHeight;
                }
                yPos += 5;

                // Bilgiler
                doc.setFontSize(10);
                doc.text(`Soru Sayısı: ${questions.length}`, 15, yPos);
                yPos += 6;
                doc.text(`Tahmini Süre: ~${Math.ceil(questions.length * 1.5)} dakika`, 15, yPos);
                yPos += 6;
                doc.text(`Tarih: ${new Date(testData.createdAt).toLocaleDateString('tr-TR')}`, 15, yPos);
                yPos += 15;

                // Sorular
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('SORULAR', 15, yPos);
                yPos += 10;

                doc.setFontSize(10);

                questions.forEach((q, index) => {
                    if (yPos > pageHeight - marginBottom - 40) {
                        doc.addPage();
                        yPos = 20;
                    }

                    // Soru metni
                    doc.setFont(undefined, 'bold');
                    const questionText = `${index + 1}. ${q.q || q.text || ''}`;
                    const questionLines = doc.splitTextToSize(questionText, 180);
                    doc.text(questionLines, 15, yPos);
                    yPos += questionLines.length * lineHeight;

                    // Seçenekler
                    doc.setFont(undefined, 'normal');
                    const letters = ['A', 'B', 'C', 'D', 'E'];
                    const options = q.o || q.options || q.choices || [];
                    
                    options.forEach((option, i) => {
                        if (yPos > pageHeight - marginBottom) {
                            doc.addPage();
                            yPos = 20;
                        }
                        
                        const cleanOption = String(option).replace(/^\s*[A-E]\)\s*/i, '');
                        const optionText = `${letters[i]}) ${cleanOption}`;
                        const optionLines = doc.splitTextToSize(optionText, 175);
                        doc.text(optionLines, 20, yPos);
                        yPos += optionLines.length * lineHeight;
                    });

                    yPos += 8;
                });

                // Cevap Anahtarı
                doc.addPage();
                yPos = 20;

                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text('CEVAP ANAHTARI', 15, yPos);
                yPos += 10;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');

                const letters = ['A', 'B', 'C', 'D', 'E'];
                let col = 0;
                const colWidth = 35;
                const startX = 15;

                questions.forEach((q, index) => {
                    const options = q.o || q.options || q.choices || [];
                    let answerIndex = -1;

                    // Doğru cevap index'ini bul
                    if (typeof q.correctIndex === 'number') {
                        answerIndex = q.correctIndex;
                    } else if (typeof q.answerIndex === 'number') {
                        answerIndex = q.answerIndex;
                    } else if (q.a) {
                        answerIndex = options.findIndex(opt => {
                            const cleanOpt = String(opt).replace(/^\s*[A-E]\)\s*/i, '').trim();
                            const cleanAns = String(q.a).replace(/^\s*[A-E]\)\s*/i, '').trim();
                            return cleanOpt === cleanAns || opt === q.a;
                        });
                    }

                    const answerLetter = answerIndex >= 0 ? letters[answerIndex] : '?';
                    const x = startX + (col * colWidth);

                    doc.text(`${index + 1}. ${answerLetter}`, x, yPos);

                    col++;
                    if (col >= 5) {
                        col = 0;
                        yPos += lineHeight;
                        
                        if (yPos > pageHeight - marginBottom) {
                            doc.addPage();
                            yPos = 20;
                        }
                    }
                });

                // Kaydet
                const fileName = `${(testData.title || 'test')
                    .toLowerCase()
                    .replace(/[^a-z0-9äöüğşıçÄÖÜĞŞİÇ]/gi, '_')
                    .replace(/_+/g, '_')
                    .substring(0, 50)}.pdf`;
                
                doc.save(fileName);

                Utils.showToast(t('library.pdf.downloaded', 'PDF indirildi!'), 'success');

                // Aktivite kaydet
                if (window.StorageManager && typeof StorageManager.saveActivity === 'function') {
                    StorageManager.saveActivity({
                        type: 'test_exported',
                        data: { title: testData.title, format: 'pdf' },
                        timestamp: Date.now()
                    });
                }

            } catch (error) {
                console.error('❌ PDF oluşturma hatası:', error);
                Utils.showToast(t('library.pdf.error', 'PDF oluşturulamadı!'), 'error');
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // YÖNLENDİRME
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * YKS Test Flow'a git
         */
        goToYKSTestFlow() {
            if (window.App && typeof App.switchTab === 'function') {
                App.switchTab('test');
            } else {
                const testTab = document.querySelector('[data-tab="test"]');
                if (testTab) testTab.click();
            }

            // YKS kartına tıklama simüle et
            setTimeout(() => {
                const yksCard = document.getElementById('yksQuickCard');
                if (yksCard) yksCard.click();
            }, 300);
        },

        /**
         * Test oluştur sayfasına git
         */
        goToTestCreate() {
            if (window.App && typeof App.switchTab === 'function') {
                App.switchTab('create');
            } else {
                const createTab = document.querySelector('[data-tab="create"]');
                if (createTab) createTab.click();
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TEMİZLİK
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Süresi dolmuş testleri temizle
         */
        cleanExpiredTests() {
            try {
                let cleaned = 0;

                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);

                    if (key && key.startsWith(this.config.STORAGE_PREFIX)) {
                        try {
                            const raw = localStorage.getItem(key);
                            if (!raw) continue;

                            const test = JSON.parse(raw);

                            if (test.expiresAt && Date.now() >= test.expiresAt) {
                                localStorage.removeItem(key);
                                cleaned++;
                            }
                        } catch (parseError) {
                            localStorage.removeItem(key);
                            cleaned++;
                        }
                    }
                }

                if (cleaned > 0) {
                    console.log(`🧹 ${cleaned} süresi dolmuş test temizlendi`);
                }

            } catch (error) {
                console.error('❌ Temizleme hatası:', error);
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // BAŞLATMA
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Başlat
         */
        init() {
            console.log('📚 Library Manager başlatılıyor...');

            this.cleanExpiredTests();

            // Periyodik temizlik
            setInterval(() => {
                this.cleanExpiredTests();
            }, 10 * 60 * 1000); // 10 dakika

            console.log('✅ Library Manager hazır!');
        }
    };

    // DOM yüklendiğinde başlat
    document.addEventListener('DOMContentLoaded', () => {
        LibraryManager.init();
    });

    // Global export
    window.LibraryManager = LibraryManager;

})(window, document);
