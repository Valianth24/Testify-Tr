/**
 * YKS TEST FLOW SYSTEM v2.0
 * ========================
 * Gelişmiş kart tabanlı navigasyon sistemi
 * Ders → Konu → Test Türü → Teste Başla akışı
 * 
 * Bağımlılıklar:
 * - yks-question-pool.js (soru havuzu)
 * - quiz-manager.js (test motoru)
 * - library.js (kütüphane yönetimi)
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // YAPILANDIRMA VE SABİTLER
    // ═══════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        STORAGE_KEY: 'testify.yksTestFlow.state',
        DEFAULT_QUESTION_COUNT: 10,
        QUESTION_COUNT_OPTIONS: [5, 10, 15, 20, 25, 30],
        TIME_PER_QUESTION: 90, // saniye
        ANIMATION_DURATION: 300
    };

    // Alan tanımları
    const FIELDS = {
        tyt: {
            id: 'tyt',
            label: 'TYT',
            fullLabel: 'Temel Yeterlilik Testi',
            icon: 'ph-book-open',
            color: '#3b82f6',
            description: 'Tüm adaylar için zorunlu temel yeterlilik sınavı'
        },
        sayisal: {
            id: 'sayisal',
            label: 'Sayısal',
            fullLabel: 'AYT Sayısal',
            icon: 'ph-function',
            color: '#8b5cf6',
            description: 'Matematik, Fizik, Kimya, Biyoloji ağırlıklı'
        },
        ea: {
            id: 'ea',
            label: 'Eşit Ağırlık',
            fullLabel: 'AYT Eşit Ağırlık',
            icon: 'ph-scales',
            color: '#10b981',
            description: 'Matematik ve Edebiyat dengeli'
        },
        sozel: {
            id: 'sozel',
            label: 'Sözel',
            fullLabel: 'AYT Sözel',
            icon: 'ph-book',
            color: '#f59e0b',
            description: 'Türkçe, Tarih, Coğrafya, Felsefe ağırlıklı'
        },
        dil: {
            id: 'dil',
            label: 'Yabancı Dil',
            fullLabel: 'YDT',
            icon: 'ph-translate',
            color: '#ef4444',
            description: 'Yabancı dil yeterlilik sınavı'
        }
    };

    // Ders tanımları (alan bazlı)
    const SUBJECTS = {
        tyt: [
            { id: 'turkce', label: 'Türkçe', icon: 'ph-text-aa', color: '#ef4444' },
            { id: 'matematik', label: 'Matematik', icon: 'ph-calculator', color: '#3b82f6' },
            { id: 'geometri', label: 'Geometri', icon: 'ph-triangle', color: '#8b5cf6' },
            { id: 'fizik', label: 'Fizik', icon: 'ph-atom', color: '#10b981' },
            { id: 'kimya', label: 'Kimya', icon: 'ph-flask', color: '#f59e0b' },
            { id: 'biyoloji', label: 'Biyoloji', icon: 'ph-dna', color: '#ec4899' },
            { id: 'tarih', label: 'Tarih', icon: 'ph-scroll', color: '#6366f1' },
            { id: 'cografya', label: 'Coğrafya', icon: 'ph-globe', color: '#14b8a6' },
            { id: 'felsefe', label: 'Felsefe', icon: 'ph-brain', color: '#a855f7' },
            { id: 'din', label: 'Din Kültürü', icon: 'ph-hand-praying', color: '#78716c' }
        ],
        sayisal: [
            { id: 'matematik', label: 'Matematik', icon: 'ph-calculator', color: '#3b82f6' },
            { id: 'geometri', label: 'Geometri', icon: 'ph-triangle', color: '#8b5cf6' },
            { id: 'fizik', label: 'Fizik', icon: 'ph-atom', color: '#10b981' },
            { id: 'kimya', label: 'Kimya', icon: 'ph-flask', color: '#f59e0b' },
            { id: 'biyoloji', label: 'Biyoloji', icon: 'ph-dna', color: '#ec4899' }
        ],
        ea: [
            { id: 'matematik', label: 'Matematik', icon: 'ph-calculator', color: '#3b82f6' },
            { id: 'geometri', label: 'Geometri', icon: 'ph-triangle', color: '#8b5cf6' },
            { id: 'turkce', label: 'Türkçe', icon: 'ph-text-aa', color: '#ef4444' },
            { id: 'edebiyat', label: 'Edebiyat', icon: 'ph-book-open-text', color: '#f97316' },
            { id: 'tarih', label: 'Tarih', icon: 'ph-scroll', color: '#6366f1' },
            { id: 'cografya', label: 'Coğrafya', icon: 'ph-globe', color: '#14b8a6' }
        ],
        sozel: [
            { id: 'turkce', label: 'Türkçe', icon: 'ph-text-aa', color: '#ef4444' },
            { id: 'edebiyat', label: 'Edebiyat', icon: 'ph-book-open-text', color: '#f97316' },
            { id: 'tarih', label: 'Tarih', icon: 'ph-scroll', color: '#6366f1' },
            { id: 'cografya', label: 'Coğrafya', icon: 'ph-globe', color: '#14b8a6' },
            { id: 'felsefe', label: 'Felsefe', icon: 'ph-brain', color: '#a855f7' },
            { id: 'din', label: 'Din Kültürü', icon: 'ph-hand-praying', color: '#78716c' }
        ],
        dil: [
            { id: 'ingilizce', label: 'İngilizce', icon: 'ph-flag', color: '#3b82f6' },
            { id: 'almanca', label: 'Almanca', icon: 'ph-flag', color: '#facc15' },
            { id: 'fransizca', label: 'Fransızca', icon: 'ph-flag', color: '#ef4444' }
        ]
    };

    // Konu tanımları (ders bazlı)
    const TOPICS = {
        // TYT TÜRKÇE
        turkce: {
            tyt: [
                { id: 'sozcukte-anlam', label: 'Sözcükte Anlam', questionCount: 45 },
                { id: 'cumlede-anlam', label: 'Cümlede Anlam', questionCount: 52 },
                { id: 'paragraf', label: 'Paragraf', questionCount: 78 },
                { id: 'dil-bilgisi', label: 'Dil Bilgisi', questionCount: 40 },
                { id: 'yazim-kurallari', label: 'Yazım Kuralları', questionCount: 35 },
                { id: 'noktalama', label: 'Noktalama İşaretleri', questionCount: 28 },
                { id: 'ses-bilgisi', label: 'Ses Bilgisi', questionCount: 22 },
                { id: 'cumle-turleri', label: 'Cümle Türleri', questionCount: 38 },
                { id: 'anlatim-bozukluklari', label: 'Anlatım Bozuklukları', questionCount: 44 }
            ],
            ayt: [
                { id: 'edebiyat-akimlari', label: 'Edebiyat Akımları', questionCount: 30 },
                { id: 'siir-bilgisi', label: 'Şiir Bilgisi', questionCount: 45 },
                { id: 'roman-hikaye', label: 'Roman ve Hikaye', questionCount: 40 }
            ]
        },
        // TYT MATEMATİK
        matematik: {
            tyt: [
                { id: 'temel-kavramlar', label: 'Temel Kavramlar', questionCount: 35 },
                { id: 'sayilar', label: 'Sayılar', questionCount: 60 },
                { id: 'bolme-bolunebilme', label: 'Bölme ve Bölünebilme', questionCount: 42 },
                { id: 'ebob-ekok', label: 'EBOB - EKOK', questionCount: 38 },
                { id: 'rasyonel-sayilar', label: 'Rasyonel Sayılar', questionCount: 28 },
                { id: 'basit-esitsizlikler', label: 'Basit Eşitsizlikler', questionCount: 32 },
                { id: 'mutlak-deger', label: 'Mutlak Değer', questionCount: 45 },
                { id: 'uslu-sayilar', label: 'Üslü Sayılar', questionCount: 40 },
                { id: 'koklu-sayilar', label: 'Köklü Sayılar', questionCount: 36 },
                { id: 'carpanlara-ayirma', label: 'Çarpanlara Ayırma', questionCount: 48 },
                { id: 'oran-oranti', label: 'Oran - Orantı', questionCount: 55 },
                { id: 'problemler', label: 'Problemler', questionCount: 85 },
                { id: 'kumeler', label: 'Kümeler', questionCount: 42 },
                { id: 'fonksiyonlar', label: 'Fonksiyonlar', questionCount: 52 },
                { id: 'polinomlar', label: 'Polinomlar', questionCount: 38 },
                { id: 'permutasyon', label: 'Permütasyon', questionCount: 30 },
                { id: 'kombinasyon', label: 'Kombinasyon', questionCount: 28 },
                { id: 'olasilik', label: 'Olasılık', questionCount: 45 },
                { id: 'istatistik', label: 'İstatistik', questionCount: 32 }
            ],
            ayt: [
                { id: 'limit', label: 'Limit', questionCount: 40 },
                { id: 'turev', label: 'Türev', questionCount: 65 },
                { id: 'integral', label: 'İntegral', questionCount: 58 },
                { id: 'logaritma', label: 'Logaritma', questionCount: 35 },
                { id: 'diziler', label: 'Diziler', questionCount: 42 },
                { id: 'seriler', label: 'Seriler', questionCount: 28 },
                { id: 'kompleks-sayilar', label: 'Kompleks Sayılar', questionCount: 30 },
                { id: 'matris', label: 'Matris', questionCount: 25 },
                { id: 'determinant', label: 'Determinant', questionCount: 22 }
            ]
        },
        // GEOMETRİ
        geometri: {
            tyt: [
                { id: 'temel-kavramlar', label: 'Temel Kavramlar', questionCount: 25 },
                { id: 'acilar', label: 'Açılar', questionCount: 35 },
                { id: 'ucgenler', label: 'Üçgenler', questionCount: 68 },
                { id: 'ucgende-acilar', label: 'Üçgende Açılar', questionCount: 42 },
                { id: 'ucgende-alan', label: 'Üçgende Alan', questionCount: 48 },
                { id: 'ucgende-benzerlik', label: 'Üçgende Benzerlik', questionCount: 38 },
                { id: 'dortgenler', label: 'Dörtgenler', questionCount: 55 },
                { id: 'cokgenler', label: 'Çokgenler', questionCount: 30 },
                { id: 'cember', label: 'Çember', questionCount: 62 },
                { id: 'daire', label: 'Daire', questionCount: 35 }
            ],
            ayt: [
                { id: 'analitik-geometri', label: 'Analitik Geometri', questionCount: 55 },
                { id: 'dogrunun-analitigi', label: 'Doğrunun Analitiği', questionCount: 42 },
                { id: 'cemberin-analitigi', label: 'Çemberin Analitiği', questionCount: 38 },
                { id: 'konikler', label: 'Konikler', questionCount: 30 },
                { id: 'kati-cisimler', label: 'Katı Cisimler', questionCount: 45 },
                { id: 'uzay-geometri', label: 'Uzay Geometri', questionCount: 28 }
            ]
        },
        // FİZİK
        fizik: {
            tyt: [
                { id: 'fizige-giris', label: 'Fiziğe Giriş', questionCount: 20 },
                { id: 'madde-ozkutle', label: 'Madde ve Özkütle', questionCount: 28 },
                { id: 'basinc', label: 'Basınç', questionCount: 35 },
                { id: 'isi-sicaklik', label: 'Isı ve Sıcaklık', questionCount: 42 },
                { id: 'hareket', label: 'Hareket', questionCount: 48 },
                { id: 'kuvvet', label: 'Kuvvet', questionCount: 45 },
                { id: 'is-enerji', label: 'İş ve Enerji', questionCount: 38 },
                { id: 'elektrik', label: 'Elektrik', questionCount: 52 },
                { id: 'dalgalar', label: 'Dalgalar', questionCount: 30 },
                { id: 'optik', label: 'Optik', questionCount: 35 }
            ],
            ayt: [
                { id: 'vektorler', label: 'Vektörler', questionCount: 32 },
                { id: 'kuvvet-hareket', label: 'Kuvvet ve Hareket', questionCount: 55 },
                { id: 'elektrik-manyetizma', label: 'Elektrik ve Manyetizma', questionCount: 62 },
                { id: 'modern-fizik', label: 'Modern Fizik', questionCount: 40 },
                { id: 'atom-fizigi', label: 'Atom Fiziği', questionCount: 28 }
            ]
        },
        // KİMYA
        kimya: {
            tyt: [
                { id: 'kimya-bilimi', label: 'Kimya Bilimi', questionCount: 18 },
                { id: 'atom-yapisi', label: 'Atom Yapısı', questionCount: 35 },
                { id: 'periyodik-tablo', label: 'Periyodik Tablo', questionCount: 40 },
                { id: 'kimyasal-baglar', label: 'Kimyasal Bağlar', questionCount: 45 },
                { id: 'mol-kavrami', label: 'Mol Kavramı', questionCount: 38 },
                { id: 'asitler-bazlar', label: 'Asitler ve Bazlar', questionCount: 42 },
                { id: 'karisimlar', label: 'Karışımlar', questionCount: 32 },
                { id: 'kimyasal-tepkimeler', label: 'Kimyasal Tepkimeler', questionCount: 48 }
            ],
            ayt: [
                { id: 'gazlar', label: 'Gazlar', questionCount: 45 },
                { id: 'cozeltiler', label: 'Çözeltiler', questionCount: 52 },
                { id: 'kimyasal-denge', label: 'Kimyasal Denge', questionCount: 48 },
                { id: 'elektrokimya', label: 'Elektrokimya', questionCount: 38 },
                { id: 'organik-kimya', label: 'Organik Kimya', questionCount: 55 }
            ]
        },
        // BİYOLOJİ
        biyoloji: {
            tyt: [
                { id: 'canlilar-alemi', label: 'Canlılar Alemi', questionCount: 30 },
                { id: 'hucre', label: 'Hücre', questionCount: 48 },
                { id: 'canlilik', label: 'Canlılık', questionCount: 25 },
                { id: 'sindirim-sistemi', label: 'Sindirim Sistemi', questionCount: 35 },
                { id: 'dolasim-sistemi', label: 'Dolaşım Sistemi', questionCount: 38 },
                { id: 'solunum-sistemi', label: 'Solunum Sistemi', questionCount: 32 },
                { id: 'bosaltim-sistemi', label: 'Boşaltım Sistemi', questionCount: 28 },
                { id: 'ekosistem', label: 'Ekosistem', questionCount: 35 }
            ],
            ayt: [
                { id: 'hucre-bolunmesi', label: 'Hücre Bölünmesi', questionCount: 42 },
                { id: 'kalitim', label: 'Kalıtım', questionCount: 55 },
                { id: 'genetik-muhendisligi', label: 'Genetik Mühendisliği', questionCount: 35 },
                { id: 'evrim', label: 'Evrim', questionCount: 30 },
                { id: 'bitki-biyolojisi', label: 'Bitki Biyolojisi', questionCount: 38 }
            ]
        },
        // TARİH
        tarih: {
            tyt: [
                { id: 'tarih-bilimi', label: 'Tarih Bilimi', questionCount: 15 },
                { id: 'ilk-caglar', label: 'İlk Çağ Uygarlıkları', questionCount: 28 },
                { id: 'islam-tarihi', label: 'İslam Tarihi', questionCount: 35 },
                { id: 'turk-islam-devletleri', label: 'Türk-İslam Devletleri', questionCount: 42 },
                { id: 'osmanli-kurulusu', label: 'Osmanlı Kuruluş Dönemi', questionCount: 38 },
                { id: 'osmanli-yukselme', label: 'Osmanlı Yükselme Dönemi', questionCount: 45 },
                { id: 'yakin-cag', label: 'Yakın Çağ', questionCount: 40 },
                { id: 'kurtulus-savasi', label: 'Kurtuluş Savaşı', questionCount: 55 },
                { id: 'ataturk-inkilaplari', label: 'Atatürk İnkılapları', questionCount: 48 }
            ],
            ayt: [
                { id: 'dunya-tarihi', label: 'Dünya Tarihi', questionCount: 45 },
                { id: 'cagdas-turk-tarihi', label: 'Çağdaş Türk Tarihi', questionCount: 52 },
                { id: 'osmanli-gerileme', label: 'Osmanlı Gerileme Dönemi', questionCount: 40 }
            ]
        },
        // COĞRAFYA
        cografya: {
            tyt: [
                { id: 'dogal-sistemler', label: 'Doğal Sistemler', questionCount: 42 },
                { id: 'iklim-bilgisi', label: 'İklim Bilgisi', questionCount: 48 },
                { id: 'turkiye-fiziki', label: 'Türkiye Fiziki Coğrafyası', questionCount: 55 },
                { id: 'nufus', label: 'Nüfus', questionCount: 35 },
                { id: 'yerlesme', label: 'Yerleşme', questionCount: 28 },
                { id: 'ekonomik-faaliyetler', label: 'Ekonomik Faaliyetler', questionCount: 45 },
                { id: 'harita-bilgisi', label: 'Harita Bilgisi', questionCount: 32 }
            ],
            ayt: [
                { id: 'beserı-sistemler', label: 'Beşeri Sistemler', questionCount: 40 },
                { id: 'bolgesel-cografya', label: 'Bölgesel Coğrafya', questionCount: 45 },
                { id: 'cevre-ve-toplum', label: 'Çevre ve Toplum', questionCount: 35 }
            ]
        },
        // FELSEFE
        felsefe: {
            tyt: [
                { id: 'felsefe-nedir', label: 'Felsefe Nedir?', questionCount: 20 },
                { id: 'bilgi-felsefesi', label: 'Bilgi Felsefesi', questionCount: 35 },
                { id: 'varlik-felsefesi', label: 'Varlık Felsefesi', questionCount: 30 },
                { id: 'ahlak-felsefesi', label: 'Ahlak Felsefesi', questionCount: 38 },
                { id: 'sanat-felsefesi', label: 'Sanat Felsefesi', questionCount: 25 },
                { id: 'din-felsefesi', label: 'Din Felsefesi', questionCount: 28 },
                { id: 'siyaset-felsefesi', label: 'Siyaset Felsefesi', questionCount: 32 }
            ],
            ayt: [
                { id: 'mantik', label: 'Mantık', questionCount: 40 },
                { id: 'psikoloji', label: 'Psikoloji', questionCount: 45 },
                { id: 'sosyoloji', label: 'Sosyoloji', questionCount: 42 }
            ]
        },
        // DİN KÜLTÜRÜ
        din: {
            tyt: [
                { id: 'inanc', label: 'İnanç', questionCount: 35 },
                { id: 'ibadet', label: 'İbadet', questionCount: 38 },
                { id: 'ahlak', label: 'Ahlak', questionCount: 32 },
                { id: 'hz-muhammed', label: 'Hz. Muhammed\'in Hayatı', questionCount: 45 },
                { id: 'kuran', label: 'Kur\'an-ı Kerim', questionCount: 40 },
                { id: 'din-kultur', label: 'Din ve Kültür', questionCount: 28 }
            ]
        },
        // EDEBİYAT
        edebiyat: {
            ayt: [
                { id: 'edebi-turler', label: 'Edebi Türler', questionCount: 40 },
                { id: 'donemler', label: 'Edebiyat Dönemleri', questionCount: 55 },
                { id: 'siir-turleri', label: 'Şiir Türleri', questionCount: 35 },
                { id: 'sairler-yazarlar', label: 'Şairler ve Yazarlar', questionCount: 48 },
                { id: 'metin-tahlili', label: 'Metin Tahlili', questionCount: 42 }
            ]
        },
        // İNGİLİZCE
        ingilizce: {
            ydt: [
                { id: 'grammar', label: 'Grammar', questionCount: 60 },
                { id: 'vocabulary', label: 'Vocabulary', questionCount: 55 },
                { id: 'reading', label: 'Reading Comprehension', questionCount: 65 },
                { id: 'cloze-test', label: 'Cloze Test', questionCount: 40 },
                { id: 'translation', label: 'Translation', questionCount: 35 },
                { id: 'dialogue', label: 'Dialogue Completion', questionCount: 32 }
            ]
        }
    };

    // Test türleri
    const TEST_TYPES = [
        {
            id: 'practice',
            label: 'Pratik Modu',
            icon: 'ph-book-open',
            color: '#10b981',
            description: 'Süre sınırı yok, anında geri bildirim',
            features: ['Zaman baskısı yok', 'Anlık doğru/yanlış', 'Açıklamalar gösterilir']
        },
        {
            id: 'exam',
            label: 'Sınav Modu',
            icon: 'ph-timer',
            color: '#ef4444',
            description: 'Gerçek sınav deneyimi',
            features: ['Süre sınırlı', 'Sonuçlar en sonda', 'Gerçekçi sınav ortamı']
        },
        {
            id: 'quick',
            label: 'Hızlı Test',
            icon: 'ph-lightning',
            color: '#f59e0b',
            description: '5 soruluk mini test',
            features: ['5 soru', 'Hızlı geri bildirim', 'Kısa mola arası için ideal']
        },
        {
            id: 'marathon',
            label: 'Maraton',
            icon: 'ph-flag-checkered',
            color: '#8b5cf6',
            description: 'Tüm konulardan karışık uzun test',
            features: ['30+ soru', 'Karışık konular', 'Dayanıklılık testi']
        }
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // STATE YÖNETİMİ
    // ═══════════════════════════════════════════════════════════════════════════

    const YKSTestFlow = {
        // Akış durumu
        state: {
            currentView: 'main', // 'main' | 'field' | 'subject' | 'topic' | 'config' | 'ready'
            selectedField: null,
            selectedSubject: null,
            selectedTopics: [],
            selectedTestType: null,
            questionCount: CONFIG.DEFAULT_QUESTION_COUNT,
            examLevel: 'tyt', // 'tyt' | 'ayt' | 'ydt'
            history: [] // Geri gitme için
        },

        // Container referansı
        container: null,

        /**
         * Başlatma
         */
        init(containerEl) {
            this.container = containerEl || document.getElementById('yksTestFlowContainer');
            
            if (!this.container) {
                console.warn('[YKSTestFlow] Container bulunamadı');
                return;
            }

            // State'i yükle
            this.loadState();

            // Ana görünümü render et
            this.render();

            console.log('[YKSTestFlow] Başlatıldı');
        },

        /**
         * State kaydet/yükle
         */
        saveState() {
            try {
                const stateToSave = {
                    selectedField: this.state.selectedField,
                    questionCount: this.state.questionCount,
                    examLevel: this.state.examLevel
                };
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(stateToSave));
            } catch (e) {
                console.warn('[YKSTestFlow] State kaydedilemedi:', e);
            }
        },

        loadState() {
            try {
                const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    this.state.questionCount = parsed.questionCount || CONFIG.DEFAULT_QUESTION_COUNT;
                    this.state.examLevel = parsed.examLevel || 'tyt';
                }
            } catch (e) {
                console.warn('[YKSTestFlow] State yüklenemedi:', e);
            }
        },

        /**
         * Görünüm geçişi
         */
        navigateTo(view, data = {}) {
            // History'e ekle
            this.state.history.push({
                view: this.state.currentView,
                field: this.state.selectedField,
                subject: this.state.selectedSubject,
                topics: [...this.state.selectedTopics],
                testType: this.state.selectedTestType
            });

            // State güncelle
            this.state.currentView = view;
            Object.assign(this.state, data);

            // Render
            this.render();

            // Yukarı kaydır
            if (this.container) {
                this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        /**
         * Geri git
         */
        goBack() {
            if (this.state.history.length === 0) {
                this.resetToMain();
                return;
            }

            const previous = this.state.history.pop();
            this.state.currentView = previous.view;
            this.state.selectedField = previous.field;
            this.state.selectedSubject = previous.subject;
            this.state.selectedTopics = previous.topics;
            this.state.selectedTestType = previous.testType;

            this.render();
        },

        /**
         * Ana menüye dön
         */
        resetToMain() {
            this.state = {
                currentView: 'main',
                selectedField: null,
                selectedSubject: null,
                selectedTopics: [],
                selectedTestType: null,
                questionCount: this.state.questionCount,
                examLevel: 'tyt',
                history: []
            };
            this.render();
        },

        // ═══════════════════════════════════════════════════════════════════════
        // RENDER METOTLARI
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Ana render
         */
        render() {
            if (!this.container) return;

            const views = {
                'main': () => this.renderMainView(),
                'field': () => this.renderFieldView(),
                'subject': () => this.renderSubjectView(),
                'topic': () => this.renderTopicView(),
                'config': () => this.renderConfigView(),
                'ready': () => this.renderReadyView()
            };

            const renderFn = views[this.state.currentView] || views['main'];
            this.container.innerHTML = renderFn();

            // Event listener'ları bağla
            this.attachEventListeners();

            // Animasyon
            this.container.classList.add('animate-fadeInUp');
            setTimeout(() => {
                this.container.classList.remove('animate-fadeInUp');
            }, CONFIG.ANIMATION_DURATION);
        },

        /**
         * Header (geri butonu + başlık)
         */
        renderHeader(title, subtitle = '', showBack = true) {
            return `
                <div class="yks-flow-header">
                    ${showBack ? `
                        <button type="button" class="yks-back-btn" data-action="back">
                            <i class="ph ph-arrow-left"></i>
                            <span>Geri</span>
                        </button>
                    ` : ''}
                    <div class="yks-flow-title">
                        <h2>${title}</h2>
                        ${subtitle ? `<p>${subtitle}</p>` : ''}
                    </div>
                    <button type="button" class="yks-home-btn" data-action="home" title="Ana Menü">
                        <i class="ph ph-house"></i>
                    </button>
                </div>
            `;
        },

        /**
         * Breadcrumb
         */
        renderBreadcrumb() {
            const items = ['YKS Soru Çöz'];
            
            if (this.state.selectedField) {
                items.push(FIELDS[this.state.selectedField]?.label || this.state.selectedField);
            }
            if (this.state.selectedSubject) {
                const subjects = SUBJECTS[this.state.selectedField] || [];
                const subject = subjects.find(s => s.id === this.state.selectedSubject);
                items.push(subject?.label || this.state.selectedSubject);
            }
            if (this.state.selectedTopics.length > 0) {
                items.push(`${this.state.selectedTopics.length} konu seçili`);
            }

            return `
                <nav class="yks-breadcrumb">
                    ${items.map((item, i) => `
                        <span class="breadcrumb-item ${i === items.length - 1 ? 'active' : ''}">
                            ${i > 0 ? '<i class="ph ph-caret-right"></i>' : ''}
                            ${item}
                        </span>
                    `).join('')}
                </nav>
            `;
        },

        /**
         * ANA MENÜ - Alan seçimi
         */
        renderMainView() {
            return `
                <div class="yks-flow-container">
                    ${this.renderHeader('YKS Soru Çöz', 'Hangi alanda çalışmak istiyorsun?', false)}
                    
                    <div class="yks-section-grid">
                        ${Object.entries(FIELDS).map(([key, field]) => `
                            <button class="yks-section-card" data-action="select-field" data-field="${key}">
                                <div class="card-icon" style="background: ${field.color}20; color: ${field.color}">
                                    <i class="ph ${field.icon}"></i>
                                </div>
                                <div class="card-title">${field.label}</div>
                                <div class="card-sub">${field.description}</div>
                            </button>
                        `).join('')}
                        
                        <!-- Kütüphane kartı -->
                        <button class="yks-section-card yks-card-library" data-action="open-library">
                            <div class="card-icon" style="background: #6366f120; color: #6366f1">
                                <i class="ph ph-books"></i>
                            </div>
                            <div class="card-title">Kütüphanem</div>
                            <div class="card-sub">Kayıtlı testlerini çöz</div>
                        </button>

                        <!-- Karışık test kartı -->
                        <button class="yks-section-card yks-card-mixed" data-action="quick-mixed">
                            <div class="card-icon" style="background: #ec489920; color: #ec4899">
                                <i class="ph ph-shuffle"></i>
                            </div>
                            <div class="card-title">Karışık Test</div>
                            <div class="card-sub">Tüm alanlardan rastgele</div>
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * ALAN DETAY - TYT/AYT seçimi
         */
        renderFieldView() {
            const field = FIELDS[this.state.selectedField];
            if (!field) return this.renderMainView();

            const showTYT = this.state.selectedField !== 'dil';
            const showAYT = this.state.selectedField !== 'tyt';
            const showYDT = this.state.selectedField === 'dil';

            return `
                <div class="yks-flow-container">
                    ${this.renderHeader(field.fullLabel, 'Sınav türünü seç')}
                    ${this.renderBreadcrumb()}
                    
                    <div class="yks-section-grid yks-grid-2">
                        ${showTYT ? `
                            <button class="yks-section-card ${this.state.examLevel === 'tyt' ? 'selected' : ''}" 
                                    data-action="select-level" data-level="tyt">
                                <div class="card-icon" style="background: #3b82f620; color: #3b82f6">
                                    <i class="ph ph-book-open"></i>
                                </div>
                                <div class="card-title">TYT</div>
                                <div class="card-sub">Temel Yeterlilik Testi</div>
                            </button>
                        ` : ''}
                        
                        ${showAYT ? `
                            <button class="yks-section-card ${this.state.examLevel === 'ayt' ? 'selected' : ''}" 
                                    data-action="select-level" data-level="ayt">
                                <div class="card-icon" style="background: #8b5cf620; color: #8b5cf6">
                                    <i class="ph ph-graduation-cap"></i>
                                </div>
                                <div class="card-title">AYT</div>
                                <div class="card-sub">Alan Yeterlilik Testi</div>
                            </button>
                        ` : ''}

                        ${showYDT ? `
                            <button class="yks-section-card ${this.state.examLevel === 'ydt' ? 'selected' : ''}" 
                                    data-action="select-level" data-level="ydt">
                                <div class="card-icon" style="background: #ef444420; color: #ef4444">
                                    <i class="ph ph-translate"></i>
                                </div>
                                <div class="card-title">YDT</div>
                                <div class="card-sub">Yabancı Dil Testi</div>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        },

        /**
         * DERS SEÇİMİ
         */
        renderSubjectView() {
            const field = FIELDS[this.state.selectedField];
            const subjects = SUBJECTS[this.state.selectedField] || [];

            if (!field || subjects.length === 0) return this.renderMainView();

            return `
                <div class="yks-flow-container">
                    ${this.renderHeader('Ders Seç', `${field.label} - ${this.state.examLevel.toUpperCase()}`)}
                    ${this.renderBreadcrumb()}
                    
                    <div class="yks-section-grid yks-grid-3">
                        ${subjects.map(subject => `
                            <button class="yks-section-card" data-action="select-subject" data-subject="${subject.id}">
                                <div class="card-icon" style="background: ${subject.color}20; color: ${subject.color}">
                                    <i class="ph ${subject.icon}"></i>
                                </div>
                                <div class="card-title">${subject.label}</div>
                                <div class="card-sub">${this.getSubjectQuestionCount(subject.id)} soru</div>
                            </button>
                        `).join('')}
                        
                        <!-- Karışık ders -->
                        <button class="yks-section-card yks-card-all" data-action="select-subject" data-subject="all">
                            <div class="card-icon" style="background: #6366f120; color: #6366f1">
                                <i class="ph ph-shuffle"></i>
                            </div>
                            <div class="card-title">Tüm Dersler</div>
                            <div class="card-sub">Karışık soru havuzu</div>
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * KONU SEÇİMİ
         */
        renderTopicView() {
            const subjects = SUBJECTS[this.state.selectedField] || [];
            const subject = subjects.find(s => s.id === this.state.selectedSubject);
            
            // Tüm dersler seçildiyse direkt config'e git
            if (this.state.selectedSubject === 'all') {
                return this.renderConfigView();
            }

            const topicData = TOPICS[this.state.selectedSubject];
            const examLevel = this.state.examLevel === 'ydt' ? 'ydt' : this.state.examLevel;
            const topics = topicData?.[examLevel] || topicData?.tyt || [];

            if (topics.length === 0) {
                return this.renderConfigView();
            }

            const allSelected = this.state.selectedTopics.length === topics.length;

            return `
                <div class="yks-flow-container">
                    ${this.renderHeader('Konu Seç', `${subject?.label || 'Ders'} - Çalışmak istediğin konuları işaretle`)}
                    ${this.renderBreadcrumb()}
                    
                    <div class="yks-topic-controls">
                        <button type="button" class="btn btn-secondary btn-sm" data-action="toggle-all-topics">
                            <i class="ph ${allSelected ? 'ph-x' : 'ph-checks'}"></i>
                            ${allSelected ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                        </button>
                        <span class="topic-count">${this.state.selectedTopics.length} / ${topics.length} konu seçili</span>
                    </div>
                    
                    <div class="yks-topic-grid">
                        ${topics.map(topic => {
                            const isSelected = this.state.selectedTopics.includes(topic.id);
                            return `
                                <label class="yks-topic-card ${isSelected ? 'selected' : ''}" data-topic="${topic.id}">
                                    <input type="checkbox" 
                                           ${isSelected ? 'checked' : ''} 
                                           data-action="toggle-topic" 
                                           data-topic="${topic.id}">
                                    <div class="topic-content">
                                        <div class="topic-check">
                                            <i class="ph ${isSelected ? 'ph-check-circle-fill' : 'ph-circle'}"></i>
                                        </div>
                                        <div class="topic-info">
                                            <div class="topic-label">${topic.label}</div>
                                            <div class="topic-meta">${topic.questionCount} soru</div>
                                        </div>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="yks-flow-actions">
                        <button type="button" class="btn btn-primary btn-large" 
                                data-action="continue-to-config"
                                ${this.state.selectedTopics.length === 0 ? 'disabled' : ''}>
                            <span>Devam Et</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * TEST YAPILANDIRMA
         */
        renderConfigView() {
            return `
                <div class="yks-flow-container">
                    ${this.renderHeader('Test Ayarları', 'Test türünü ve soru sayısını belirle')}
                    ${this.renderBreadcrumb()}
                    
                    <div class="yks-config-section">
                        <h3><i class="ph ph-game-controller"></i> Test Türü</h3>
                        <div class="yks-section-grid yks-grid-2">
                            ${TEST_TYPES.map(type => `
                                <button class="yks-section-card yks-test-type-card ${this.state.selectedTestType === type.id ? 'selected' : ''}" 
                                        data-action="select-test-type" data-type="${type.id}">
                                    <div class="card-icon" style="background: ${type.color}20; color: ${type.color}">
                                        <i class="ph ${type.icon}"></i>
                                    </div>
                                    <div class="card-title">${type.label}</div>
                                    <div class="card-sub">${type.description}</div>
                                    <ul class="type-features">
                                        ${type.features.map(f => `<li><i class="ph ph-check"></i> ${f}</li>`).join('')}
                                    </ul>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="yks-config-section">
                        <h3><i class="ph ph-hash"></i> Soru Sayısı</h3>
                        <div class="yks-question-count-selector">
                            ${CONFIG.QUESTION_COUNT_OPTIONS.map(count => `
                                <button type="button" 
                                        class="count-btn ${this.state.questionCount === count ? 'selected' : ''}"
                                        data-action="set-question-count" 
                                        data-count="${count}">
                                    ${count}
                                </button>
                            `).join('')}
                        </div>
                        <p class="config-hint">
                            <i class="ph ph-info"></i>
                            Tahmini süre: ~${Math.round(this.state.questionCount * CONFIG.TIME_PER_QUESTION / 60)} dakika
                        </p>
                    </div>
                    
                    <div class="yks-flow-actions">
                        <button type="button" class="btn btn-primary btn-large" 
                                data-action="continue-to-ready"
                                ${!this.state.selectedTestType ? 'disabled' : ''}>
                            <span>Teste Hazırlan</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * TEST BAŞLAMA EKRANI
         */
        renderReadyView() {
            const field = FIELDS[this.state.selectedField];
            const subjects = SUBJECTS[this.state.selectedField] || [];
            const subject = subjects.find(s => s.id === this.state.selectedSubject);
            const testType = TEST_TYPES.find(t => t.id === this.state.selectedTestType);
            
            const topicCount = this.state.selectedTopics.length || 'Tümü';
            const estimatedTime = Math.round(this.state.questionCount * CONFIG.TIME_PER_QUESTION / 60);

            return `
                <div class="yks-flow-container">
                    ${this.renderHeader('Teste Hazır mısın?', '')}
                    
                    <div class="yks-ready-card">
                        <div class="ready-icon" style="background: ${testType?.color || '#3b82f6'}20; color: ${testType?.color || '#3b82f6'}">
                            <i class="ph ${testType?.icon || 'ph-play'}"></i>
                        </div>
                        
                        <h2 class="ready-title">${field?.label || 'YKS'} ${this.state.examLevel.toUpperCase()} Testi</h2>
                        
                        <div class="ready-details">
                            <div class="detail-item">
                                <i class="ph ph-book-open"></i>
                                <span><strong>Ders:</strong> ${subject?.label || 'Karışık'}</span>
                            </div>
                            <div class="detail-item">
                                <i class="ph ph-list-bullets"></i>
                                <span><strong>Konu:</strong> ${topicCount} konu</span>
                            </div>
                            <div class="detail-item">
                                <i class="ph ph-hash"></i>
                                <span><strong>Soru:</strong> ${this.state.questionCount} soru</span>
                            </div>
                            <div class="detail-item">
                                <i class="ph ph-timer"></i>
                                <span><strong>Süre:</strong> ~${estimatedTime} dakika</span>
                            </div>
                            <div class="detail-item">
                                <i class="ph ${testType?.icon || 'ph-game-controller'}"></i>
                                <span><strong>Mod:</strong> ${testType?.label || 'Pratik'}</span>
                            </div>
                        </div>
                        
                        <div class="ready-tips">
                            <h4><i class="ph ph-lightbulb"></i> İpuçları</h4>
                            <ul>
                                <li>Soruları dikkatlice oku</li>
                                <li>Emin olmadığın soruları işaretle</li>
                                <li>Zaman yönetimine dikkat et</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="yks-flow-actions yks-ready-actions">
                        <button type="button" class="btn btn-secondary btn-large" data-action="back">
                            <i class="ph ph-arrow-left"></i>
                            <span>Ayarları Değiştir</span>
                        </button>
                        <button type="button" class="btn btn-primary btn-large btn-start" data-action="start-test">
                            <i class="ph ph-play-fill"></i>
                            <span>Teste Başla</span>
                        </button>
                    </div>
                </div>
            `;
        },

        // ═══════════════════════════════════════════════════════════════════════
        // YARDIMCI METOTLAR
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Ders soru sayısını hesapla
         */
        getSubjectQuestionCount(subjectId) {
            const topicData = TOPICS[subjectId];
            if (!topicData) return 0;

            let total = 0;
            Object.values(topicData).forEach(topics => {
                topics.forEach(t => {
                    total += t.questionCount || 0;
                });
            });
            return total;
        },

        /**
         * Event listener'ları bağla
         */
        attachEventListeners() {
            if (!this.container) return;

            // Tüm aksiyonları dinle
            this.container.addEventListener('click', (e) => {
                const actionEl = e.target.closest('[data-action]');
                if (!actionEl) return;

                const action = actionEl.dataset.action;
                this.handleAction(action, actionEl.dataset);
            });

            // Checkbox değişikliklerini dinle
            this.container.addEventListener('change', (e) => {
                if (e.target.matches('[data-action="toggle-topic"]')) {
                    const topicId = e.target.dataset.topic;
                    this.toggleTopic(topicId, e.target.checked);
                }
            });
        },

        /**
         * Aksiyon işleyici
         */
        handleAction(action, data) {
            const actions = {
                'back': () => this.goBack(),
                'home': () => this.resetToMain(),
                'select-field': () => {
                    this.state.selectedField = data.field;
                    // TYT için direkt ders seçimine git, diğerleri için level seçimi
                    if (data.field === 'tyt') {
                        this.state.examLevel = 'tyt';
                        this.navigateTo('subject');
                    } else {
                        this.navigateTo('field');
                    }
                },
                'select-level': () => {
                    this.state.examLevel = data.level;
                    this.navigateTo('subject');
                },
                'select-subject': () => {
                    this.state.selectedSubject = data.subject;
                    this.state.selectedTopics = [];
                    
                    if (data.subject === 'all') {
                        this.navigateTo('config');
                    } else {
                        this.navigateTo('topic');
                    }
                },
                'toggle-all-topics': () => {
                    const topicData = TOPICS[this.state.selectedSubject];
                    const examLevel = this.state.examLevel === 'ydt' ? 'ydt' : this.state.examLevel;
                    const topics = topicData?.[examLevel] || topicData?.tyt || [];
                    
                    if (this.state.selectedTopics.length === topics.length) {
                        this.state.selectedTopics = [];
                    } else {
                        this.state.selectedTopics = topics.map(t => t.id);
                    }
                    this.render();
                },
                'continue-to-config': () => {
                    if (this.state.selectedTopics.length > 0 || this.state.selectedSubject === 'all') {
                        this.navigateTo('config');
                    }
                },
                'select-test-type': () => {
                    this.state.selectedTestType = data.type;
                    
                    // Hızlı test için soru sayısını ayarla
                    if (data.type === 'quick') {
                        this.state.questionCount = 5;
                    } else if (data.type === 'marathon') {
                        this.state.questionCount = 30;
                    }
                    
                    this.render();
                },
                'set-question-count': () => {
                    this.state.questionCount = parseInt(data.count, 10);
                    this.render();
                },
                'continue-to-ready': () => {
                    if (this.state.selectedTestType) {
                        this.navigateTo('ready');
                    }
                },
                'start-test': () => this.startTest(),
                'open-library': () => this.openLibrary(),
                'quick-mixed': () => this.startQuickMixedTest()
            };

            const handler = actions[action];
            if (handler) {
                handler();
            } else {
                console.warn('[YKSTestFlow] Bilinmeyen aksiyon:', action);
            }
        },

        /**
         * Konu toggle
         */
        toggleTopic(topicId, isChecked) {
            if (isChecked) {
                if (!this.state.selectedTopics.includes(topicId)) {
                    this.state.selectedTopics.push(topicId);
                }
            } else {
                this.state.selectedTopics = this.state.selectedTopics.filter(t => t !== topicId);
            }
            
            // UI'ı güncelle (card'ın selected class'ı)
            const card = this.container.querySelector(`[data-topic="${topicId}"]`);
            if (card) {
                card.classList.toggle('selected', isChecked);
                const icon = card.querySelector('.topic-check i');
                if (icon) {
                    icon.className = `ph ${isChecked ? 'ph-check-circle-fill' : 'ph-circle'}`;
                }
            }

            // Buton durumunu güncelle
            const continueBtn = this.container.querySelector('[data-action="continue-to-config"]');
            if (continueBtn) {
                continueBtn.disabled = this.state.selectedTopics.length === 0;
            }

            // Sayaç güncelle
            const counter = this.container.querySelector('.topic-count');
            if (counter) {
                const topicData = TOPICS[this.state.selectedSubject];
                const examLevel = this.state.examLevel === 'ydt' ? 'ydt' : this.state.examLevel;
                const topics = topicData?.[examLevel] || topicData?.tyt || [];
                counter.textContent = `${this.state.selectedTopics.length} / ${topics.length} konu seçili`;
            }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // TEST BAŞLATMA
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Testi başlat
         */
        startTest() {
            // Soruları hazırla
            const questions = this.prepareQuestions();

            if (!questions || questions.length === 0) {
                if (window.Utils && typeof Utils.showToast === 'function') {
                    Utils.showToast('Bu seçimler için yeterli soru bulunamadı.', 'warning');
                }
                return;
            }

            // Test verisi oluştur
            const testData = this.buildTestData(questions);

            // QuizManager ile başlat
            this.launchQuiz(testData);

            // State'i kaydet
            this.saveState();
        },

        /**
         * Soruları hazırla
         */
        prepareQuestions() {
            const api = window.YKSQuestionPoolAPI;
            
            // API yoksa fallback kullan
            if (!api) {
                console.warn('[YKSTestFlow] YKSQuestionPoolAPI bulunamadı, örnek sorular kullanılacak');
                return this.generateFallbackQuestions();
            }

            let questions = [];
            const count = this.state.questionCount;

            // Tüm dersler seçildiyse
            if (this.state.selectedSubject === 'all') {
                if (typeof api.getLevelTestQuestionsPerSubject === 'function') {
                    questions = api.getLevelTestQuestionsPerSubject(
                        this.state.selectedField, 
                        Math.ceil(count / 5)
                    );
                } else if (typeof api.getLevelTestQuestions === 'function') {
                    questions = api.getLevelTestQuestions(this.state.selectedField, count);
                }
            } else {
                // Belirli ders + konular
                if (typeof api.getQuestionsByTopics === 'function') {
                    questions = api.getQuestionsByTopics(
                        this.state.selectedSubject,
                        this.state.selectedTopics,
                        count
                    );
                } else if (typeof api.getQuestionsBySubject === 'function') {
                    questions = api.getQuestionsBySubject(this.state.selectedSubject, count);
                }
            }

            // Yeterli soru yoksa fallback
            if (!questions || questions.length < Math.min(5, count)) {
                const fallback = this.generateFallbackQuestions();
                questions = [...(questions || []), ...fallback].slice(0, count);
            }

            // Karıştır
            return this.shuffleArray(questions).slice(0, count);
        },

        /**
         * Fallback sorular (API yoksa)
         */
        generateFallbackQuestions() {
            const questions = [];
            const count = this.state.questionCount;
            const subject = this.state.selectedSubject || 'matematik';

            for (let i = 0; i < count; i++) {
                questions.push({
                    id: `fallback_${subject}_${i + 1}`,
                    text: `${subject.charAt(0).toUpperCase() + subject.slice(1)} örnek soru ${i + 1}`,
                    choices: ['A şıkkı', 'B şıkkı', 'C şıkkı', 'D şıkkı', 'E şıkkı'],
                    correctIndex: Math.floor(Math.random() * 5),
                    explanation: 'Bu bir örnek sorudur. Gerçek sorular yks-question-pool.js dosyasından yüklenecektir.',
                    difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
                    subject: subject,
                    field: this.state.selectedField || 'tyt'
                });
            }

            return questions;
        },

        /**
         * Test verisi oluştur
         */
        buildTestData(questions) {
            const field = FIELDS[this.state.selectedField];
            const subjects = SUBJECTS[this.state.selectedField] || [];
            const subject = subjects.find(s => s.id === this.state.selectedSubject);
            const testType = TEST_TYPES.find(t => t.id === this.state.selectedTestType);
            const now = Date.now();

            const title = this.state.selectedSubject === 'all'
                ? `${field?.label || 'YKS'} ${this.state.examLevel.toUpperCase()} Karışık Test`
                : `${subject?.label || 'Test'} - ${this.state.examLevel.toUpperCase()}`;

            return {
                id: `yks_${this.state.selectedField}_${now}`,
                title: title,
                description: `${this.state.questionCount} soru • ${testType?.label || 'Pratik'} modu`,
                source: 'yks-test-flow',
                mode: this.state.selectedTestType || 'practice',
                field: this.state.selectedField,
                subject: this.state.selectedSubject,
                examLevel: this.state.examLevel,
                topics: this.state.selectedTopics,
                createdAt: now,
                timeLimit: testType?.id === 'exam' 
                    ? this.state.questionCount * CONFIG.TIME_PER_QUESTION 
                    : null,
                questions: questions.map((q, index) => ({
                    id: q.id || `q_${index + 1}`,
                    q: q.text || q.q || '',
                    o: q.choices || q.options || q.o || [],
                    a: this.getCorrectAnswer(q),
                    explanation: q.explanation || '',
                    difficulty: q.difficulty || 'medium',
                    subject: q.subject || this.state.selectedSubject,
                    topic: q.topic || null
                }))
            };
        },

        /**
         * Doğru cevabı al
         */
        getCorrectAnswer(question) {
            if (typeof question.correctIndex === 'number') {
                const choices = question.choices || question.options || question.o || [];
                return choices[question.correctIndex] || '';
            }
            if (question.a) return question.a;
            if (question.answer) return question.answer;
            return '';
        },

        /**
         * Quiz'i başlat
         */
        launchQuiz(testData) {
            // localStorage'a kaydet
            try {
                localStorage.setItem('testify_generated_test', JSON.stringify(testData));
                localStorage.setItem('testify_current_test', JSON.stringify(testData));
            } catch (e) {
                console.warn('[YKSTestFlow] Test kaydedilemedi:', e);
            }

            // Test sekmesine geç
            const testTab = document.querySelector('[data-tab="test"]');
            if (testTab) {
                testTab.click();
            }

            // QuizManager'ı başlat
            setTimeout(() => {
                if (window.QuizManager) {
                    if (typeof QuizManager.start === 'function') {
                        QuizManager.start({
                            questions: testData.questions,
                            mode: testData.mode,
                            testTitle: testData.title,
                            testDescription: testData.description,
                            timeLimit: testData.timeLimit,
                            meta: {
                                source: 'yks-test-flow',
                                field: testData.field,
                                subject: testData.subject,
                                examLevel: testData.examLevel
                            }
                        });
                    } else if (typeof QuizManager.startQuiz === 'function') {
                        QuizManager.startQuiz('ai');
                    }
                } else {
                    console.error('[YKSTestFlow] QuizManager bulunamadı');
                    if (window.Utils && typeof Utils.showToast === 'function') {
                        Utils.showToast('Quiz sistemi yüklenemedi. Sayfayı yenileyin.', 'error');
                    }
                }
            }, 300);
        },

        /**
         * Kütüphaneyi aç
         */
        openLibrary() {
            if (window.LibraryManager && typeof LibraryManager.openAndLoad === 'function') {
                LibraryManager.openAndLoad();
            } else if (window.App && typeof App.switchTab === 'function') {
                App.switchTab('library');
            } else {
                const libTab = document.querySelector('[data-tab="library"]');
                if (libTab) libTab.click();
            }
        },

        /**
         * Hızlı karışık test
         */
        startQuickMixedTest() {
            this.state.selectedField = 'tyt';
            this.state.examLevel = 'tyt';
            this.state.selectedSubject = 'all';
            this.state.selectedTopics = [];
            this.state.selectedTestType = 'practice';
            this.state.questionCount = 10;
            
            this.startTest();
        },

        /**
         * Array karıştır
         */
        shuffleArray(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // EXPORT & INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    // Global export
    window.YKSTestFlow = YKSTestFlow;

    // Eski YKSFlow API uyumluluğu
    window.YKSFlow = window.YKSFlow || {};
    window.YKSFlow.startQuickLevelTest = function(field, subject) {
        YKSTestFlow.state.selectedField = field || 'tyt';
        YKSTestFlow.state.selectedSubject = subject || 'all';
        YKSTestFlow.state.selectedTestType = 'practice';
        YKSTestFlow.state.questionCount = 10;
        YKSTestFlow.startTest();
    };

    console.log('[YKSTestFlow] Modül yüklendi');

})();
