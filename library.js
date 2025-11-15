/**
 * TESTIFY LIBRARY MANAGER
 * AI ile oluşturulan testleri yönetir, PDF indirme sağlar
 */

(function (window, document) {
    'use strict';

    const t = window.t || function (key, fallback) { return fallback || key; };

    const LibraryManager = {
        /**
         * Kütüphaneyi yükler ve gösterir
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
                libraryList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon" aria-hidden="true">📚</div>
                        <p>${t('library.empty', 'Henüz test oluşturmadın')}</p>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 8px;">
                            ${t('library.emptyDesc', 'AI\'dan "test oluştur" diyerek başla!')}
                        </p>
                    </div>
                `;
                return;
            }

            libraryList.innerHTML = tests.map(test => this.createTestCard(test)).join('');
            console.log(`✅ ${tests.length} test listelendi`);
        },

        /**
         * Test kartı HTML'i oluşturur
         */
        createTestCard(test) {
            const now = Date.now();
            const remainingTime = (test.expiresAt || 0) - now;
            const hoursRemaining = Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60)));
            const minutesRemaining = Math.max(0, Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)));

            const timeColor =
                remainingTime > 0 && hoursRemaining < 6
                    ? 'var(--danger)'
                    : 'var(--text-secondary)';

            const durationUnit = t('library.duration', 'dk');
            const questionLabel = t('library.questionsLabel', t('library.questions', 'Soru'));
            const createdLabel = t('library.createdAtLabel', 'Oluşturulma');

            const remainingText = remainingTime > 0
                ? `${hoursRemaining}h ${minutesRemaining}m ${t('library.remaining', 'kaldı')}`
                : t('library.expired', 'Süresi doldu');

            return `
                <div class="library-card" data-test-id="${test.id}">
                    <div class="library-card-header">
                        <div>
                            <h3 class="library-card-title">📝 ${Utils.sanitizeHTML(test.title)}</h3>
                            <p class="library-card-desc">${Utils.sanitizeHTML(test.description || '')}</p>
                        </div>
                        <button class="btn-icon" 
                                onclick="LibraryManager.deleteTest('${test.id}')" 
                                aria-label="${t('library.delete', 'Sil')}" 
                                title="${t('library.delete', 'Sil')}">
                            🗑️
                        </button>
                    </div>
                    
                    <div class="library-card-info">
                        <div class="library-info-item">
                            <span class="info-icon">📊</span>
                            <span>${test.questions.length} ${questionLabel}</span>
                        </div>
                        <div class="library-info-item">
                            <span class="info-icon">⏱️</span>
                            <span>~${Math.ceil(test.questions.length * 1.5)} ${durationUnit}</span>
                        </div>
                        <div class="library-info-item">
                            <span class="info-icon">📅</span>
                            <span>${createdLabel}: ${Utils.formatDate(test.createdAt)}</span>
                        </div>
                        <div class="library-info-item" style="color: ${timeColor};">
                            <span class="info-icon">⏰</span>
                            <span>${remainingText}</span>
                        </div>
                    </div>
                    
                    <div class="library-card-actions">
                        <button class="btn btn-primary" 
                                onclick="LibraryManager.startTest('${test.id}')" 
                                style="flex: 1;">
                            🎯 ${t('library.start', 'Teste Başla')}
                        </button>
                        <button class="btn btn-secondary" 
                                onclick="LibraryManager.downloadTestPDF('${test.id}')"
                                title="${t('library.download', 'PDF İndir')}">
                            📥 ${t('library.download', 'PDF İndir')}
                        </button>
                        <button class="btn btn-secondary" 
                                onclick="LibraryManager.viewTestDetails('${test.id}')"
                                title="${t('library.view', 'İncele')}">
                            👁️ ${t('library.view', 'İncele')}
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * Kaydedilmiş testleri getirir
         */
        getSavedTests() {
            try {
                const tests = [];

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);

                    if (key && key.startsWith('testify_library_')) {
                        try {
                            const raw = localStorage.getItem(key);
                            if (!raw) continue;

                            const test = JSON.parse(raw);

                            if (test.expiresAt && Date.now() < test.expiresAt) {
                                tests.push(test);
                            } else {
                                localStorage.removeItem(key);
                                console.log('🗑️ Süresi dolmuş test silindi:', test.title);
                            }
                        } catch (parseError) {
                            console.error('Test parse hatası:', parseError);
                        }
                    }
                }

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
                const testToSave = {
                    ...testData,
                    id: testData.id || 'test_' + Date.now(),
                    createdAt: testData.createdAt || Date.now(),
                    expiresAt: testData.expiresAt || (Date.now() + 24 * 60 * 60 * 1000)
                };

                const key = `testify_library_${testToSave.id}`;
                localStorage.setItem(key, JSON.stringify(testToSave));

                console.log('💾 Test kütüphaneye kaydedildi:', testToSave.title);

                if (window.StorageManager) {
                    window.StorageManager.saveActivity({
                        type: 'test_saved',
                        data: {
                            title: testToSave.title,
                            questionCount: testToSave.questions.length
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
         * Testi siler
         */
        async deleteTest(testId) {
            const confirmMsg = t(
                'library.deleteConfirm',
                'Bu testi silmek istediğinden emin misin?'
            );

            const confirmed = await Utils.confirm(confirmMsg);
            if (!confirmed) return;

            try {
                const key = `testify_library_${testId}`;
                localStorage.removeItem(key);

                this.loadLibrary();

                Utils.showToast(t('msg.deleted', 'Test silindi!'), 'success');
                console.log('🗑️ Test silindi:', testId);
            } catch (error) {
                console.error('❌ Test silme hatası:', error);
                Utils.showToast(t('msg.error', 'Test silinemedi!'), 'error');
            }
        },

        /**
         * Teste başla
         */
        startTest(testId) {
            try {
                const key = `testify_library_${testId}`;
                const raw = localStorage.getItem(key);

                if (!raw) {
                    Utils.showToast(t('msg.error', 'Test bulunamadı!'), 'error');
                    return;
                }

                const testData = JSON.parse(raw);

                localStorage.setItem('testify_generated_test', JSON.stringify(testData));

                const testTab = document.querySelector('[data-tab="test"]');
                if (testTab) {
                    testTab.click();
                }

                setTimeout(() => {
                    if (window.QuizManager && typeof QuizManager.startQuiz === 'function') {
                        QuizManager.startQuiz('ai');
                    }
                }, 500);

                Utils.showToast(t('msg.testStarted', 'Test başlatılıyor...'), 'info');
            } catch (error) {
                console.error('❌ Test başlatma hatası:', error);
                Utils.showToast(t('msg.error', 'Test başlatılamadı!'), 'error');
            }
        },

        /**
         * Test detaylarını göster
         */
        viewTestDetails(testId) {
            try {
                const key = `testify_library_${testId}`;
                const raw = localStorage.getItem(key);

                if (!raw) {
                    Utils.showToast(t('msg.error', 'Test bulunamadı!'), 'error');
                    return;
                }

                const testData = JSON.parse(raw);

                const modal = document.createElement('div');
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                        <div class="modal-header">
                            <h2>📝 ${Utils.sanitizeHTML(testData.title)}</h2>
                            <button class="modal-close" 
                                    onclick="this.closest('.modal-overlay').remove()"
                                    aria-label="${t('common.close', 'Kapat')}">
                                ×
                            </button>
                        </div>
                        <div class="modal-body">
                            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                                ${Utils.sanitizeHTML(testData.description || '')}
                            </p>
                            
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                                <div class="stat-card">
                                    <div class="stat-icon">📊</div>
                                    <div class="stat-value">${testData.questions.length}</div>
                                    <div class="stat-label">${t('library.questionsLabel', 'Soru Sayısı')}</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">⏱️</div>
                                    <div class="stat-value">
                                        ${Math.ceil(testData.questions.length * 1.5)} ${t('library.duration', 'dk')}
                                    </div>
                                    <div class="stat-label">${t('library.estimatedTimeLabel', 'Tahmini Süre')}</div>
                                </div>
                            </div>
                            
                            <h3 style="margin-bottom: 15px;">${t('library.questionsTitle', 'Sorular')}:</h3>
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                ${testData.questions.map((q, i) => `
                                    <div style="padding: 10px; background: var(--bg-secondary); border-radius: 8px;">
                                        <strong>${i + 1}. ${Utils.sanitizeHTML(q.q)}</strong>
                                        <p style="margin-top: 5px; color: var(--text-secondary); font-size: 0.9rem;">
                                            ${t('library.difficultyLabel', 'Zorluk')}: ${this.getDifficultyBadge(q.difficulty)}
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                                ${t('common.close', 'Kapat')}
                            </button>
                            <button class="btn btn-primary" onclick="LibraryManager.startTest('${testId}'); this.closest('.modal-overlay').remove();">
                                🎯 ${t('library.start', 'Teste Başla')}
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });

            } catch (error) {
                console.error('❌ Test detay hatası:', error);
                Utils.showToast(t('msg.error', 'Test detayları gösterilemedi!'), 'error');
            }
        },

        /**
         * Zorluk rozeti
         */
        getDifficultyBadge(difficulty) {
            const labels = {
                easy: t('library.difficulty.easy', 'Kolay'),
                medium: t('library.difficulty.medium', 'Orta'),
                hard: t('library.difficulty.hard', 'Zor')
            };

            const icons = {
                easy: '✅',
                medium: '⚠️',
                hard: '🔥'
            };

            const label = labels[difficulty] || labels.medium;
            const icon = icons[difficulty] || icons.medium;

            return `<span>${icon} ${label}</span>`;
        },

        /**
         * PDF olarak indir (jsPDF kullanarak)
         */
        async downloadTestPDF(testId) {
            try {
                const key = `testify_library_${testId}`;
                const raw = localStorage.getItem(key);

                if (!raw) {
                    Utils.showToast(t('msg.error', 'Test bulunamadı!'), 'error');
                    return;
                }

                const testData = JSON.parse(raw);

                Utils.showToast(t('library.pdf.creating', 'PDF oluşturuluyor...'), 'info', 2000);

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

                // Başlık
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.text(testData.title, 15, yPos);
                yPos += 10;

                // Açıklama
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                if (testData.description) {
                    const descLines = doc.splitTextToSize(testData.description, 180);
                    doc.text(descLines, 15, yPos);
                    yPos += descLines.length * lineHeight;
                } else {
                    yPos += 10;
                }

                // Bilgiler
                doc.setFontSize(10);
                const locale =
                    window.LanguageManager && LanguageManager.currentLang === 'en'
                        ? 'en-US'
                        : 'tr-TR';

                doc.text(
                    `${t('library.questionsLabel', 'Soru Sayısı')}: ${testData.questions.length}`,
                    15,
                    yPos
                );
                yPos += 6;

                doc.text(
                    `${t('library.estimatedTimeLabel', 'Tahmini Süre')}: ${Math.ceil(
                        testData.questions.length * 1.5
                    )} ${t('library.duration', 'dk')}`,
                    15,
                    yPos
                );
                yPos += 6;

                doc.text(
                    `${t('library.createdAtLabel', 'Oluşturulma')}: ${new Date(
                        testData.createdAt
                    ).toLocaleDateString(locale)}`,
                    15,
                    yPos
                );
                yPos += 15;

                // Sorular
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text(t('library.pdf.title', 'SORULAR'), 15, yPos);
                yPos += 10;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');

                testData.questions.forEach((q, index) => {
                    if (yPos > pageHeight - marginBottom) {
                        doc.addPage();
                        yPos = 20;
                    }

                    doc.setFont(undefined, 'bold');
                    const questionText = `${index + 1}. ${q.q}`;
                    const questionLines = doc.splitTextToSize(questionText, 180);
                    doc.text(questionLines, 15, yPos);
                    yPos += questionLines.length * lineHeight;

                    doc.setFont(undefined, 'normal');
                    const letters = ['A', 'B', 'C', 'D'];
                    (q.o || []).forEach((option, i) => {
                        if (yPos > pageHeight - marginBottom) {
                            doc.addPage();
                            yPos = 20;
                        }
                        const optionText = `${letters[i]}) ${option}`;
                        const optionLines = doc.splitTextToSize(optionText, 175);
                        doc.text(optionLines, 20, yPos);
                        yPos += optionLines.length * lineHeight;
                    });

                    yPos += 5;
                });

                // Cevap Anahtarı
                doc.addPage();
                yPos = 20;

                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(t('library.pdf.answerKey', 'CEVAP ANAHTARI'), 15, yPos);
                yPos += 10;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');

                testData.questions.forEach((q, index) => {
                    if (yPos > pageHeight - marginBottom) {
                        doc.addPage();
                        yPos = 20;
                    }

                    const answerIndex = (q.o || []).indexOf(q.a);
                    const answerLetter = ['A', 'B', 'C', 'D'][answerIndex] || '?';

                    doc.text(`${index + 1}. ${answerLetter}`, 15, yPos);
                    yPos += lineHeight;
                });

                const fileName = `${(testData.title || 'test')
                    .toLowerCase()
                    .replace(/[^a-z0-9]/gi, '_')}.pdf`;
                doc.save(fileName);

                Utils.showToast(t('library.pdf.downloaded', 'PDF indirildi!'), 'success');

                if (window.StorageManager) {
                    window.StorageManager.saveActivity({
                        type: 'test_exported',
                        data: {
                            title: testData.title,
                            format: 'pdf'
                        },
                        timestamp: Date.now()
                    });
                }
            } catch (error) {
                console.error('❌ PDF oluşturma hatası:', error);
                Utils.showToast(t('library.pdf.error', 'PDF oluşturulamadı!'), 'error');
            }
        },

        /**
         * Süresi dolmuş testleri temizle
         */
        cleanExpiredTests() {
            try {
                let cleaned = 0;

                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);

                    if (key && key.startsWith('testify_library_')) {
                        try {
                            const raw = localStorage.getItem(key);
                            if (!raw) continue;

                            const test = JSON.parse(raw);

                            if (test.expiresAt && Date.now() >= test.expiresAt) {
                                localStorage.removeItem(key);
                                cleaned++;
                                console.log('🗑️ Süresi dolmuş test temizlendi:', test.title);
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

        /**
         * Başlat
         */
        init() {
            console.log('📚 Library Manager başlatılıyor...');

            this.cleanExpiredTests();

            setInterval(() => {
                this.cleanExpiredTests();
            }, 10 * 60 * 1000);

            console.log('✅ Library Manager hazır!');
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        LibraryManager.init();
    });

    window.LibraryManager = LibraryManager;
})(window, document);
