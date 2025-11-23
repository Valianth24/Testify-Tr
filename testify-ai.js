/**
 * ═══════════════════════════════════════════════════════════════════════
 * TESTIFY AI - PROFESSIONAL EDUCATION SYSTEM (BACKEND VERSION)
 * Advanced AI-Powered Educational Content Generator
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * "Eğitim, hayatın hazırlığı değil, hayatın ta kendisidir." - John Dewey
 * 
 * MODEL: GPT-5-nano (OpenAI, backend üzerinden)
 * QUALITY: Professional Academic Standard
 * METHOD: Research-Based Pedagogy + Advanced Prompt Engineering
 * 
 * NOT:
 *  - Bu dosya artık DOĞRUDAN OpenAI'a gitmiyor.
 *  - Sadece kendi backend'ine (örn. /api/testify/generate-test) istek atıyor.
 *  - API key kesinlikle frontend içinde kullanılmıyor.
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

const TestifyAI = {
    version: '12.0.1-PROFESSIONAL-BACKEND',
    name: 'Testify AI - Professional Education System',

    /**
     * ═══════════════════════════════════════════════════════════════════
     * CONFIGURATION
     * (Frontend’de API key TUTMAMAYA çalış; backend kullandığın için
     *  burası artık sadece geriye dönük uyumluluk için duruyor.)
     * ═══════════════════════════════════════════════════════════════════
     */
    config: {
        apiKey: null,
        
        setApiKey(key) {
            // Artık backend tarafında kullanılmalı.
            // Burada saklansa bile OpenAI'a direkt istek gitmiyor.
            this.apiKey = key;
            if (window.TESTIFY_CONFIG) {
                window.TESTIFY_CONFIG.API_KEY = key;
            }
        },
        
        getApiKey() {
            return this.apiKey || window.TESTIFY_CONFIG?.API_KEY || '';
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * STATE MANAGEMENT
     * ═══════════════════════════════════════════════════════════════════
     */
    state: {
        isGenerating: false,
        lastRequest: 0,
        currentTest: null
    },

    /**
     * ═══════════════════════════════════════════════════════════════════
     * UI STATE (Aç / Kapa / Küçült)
     * ═══════════════════════════════════════════════════════════════════
     */
    ui: {
        isOpen: true,
        isMinimized: false,
        panel: null,
        toggleBtn: null,
        closeBtn: null,
        minimizeBtn: null,
        expandBtn: null
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * EDUCATIONAL FRAMEWORK - Research-Based Pedagogy
     * ═══════════════════════════════════════════════════════════════════
     */
    educationalFramework: {
        bloomTaxonomy: {
            remember: {
                level: 1,
                verbs: ['tanımla', 'listele', 'hatırla', 'tanı'],
                cognitiveLoad: 'low',
                scaffolding: 'direct instruction + mnemonic devices'
            },
            understand: {
                level: 2,
                verbs: ['açıkla', 'özetle', 'sınıflandır', 'karşılaştır'],
                cognitiveLoad: 'medium',
                scaffolding: 'analogies + visual representations'
            },
            apply: {
                level: 3,
                verbs: ['uygula', 'çöz', 'kullan', 'hesapla'],
                cognitiveLoad: 'medium-high',
                scaffolding: 'worked examples + guided practice'
            },
            analyze: {
                level: 4,
                verbs: ['ayır', 'incele', 'karşılaştır', 'organize et'],
                cognitiveLoad: 'high',
                scaffolding: 'graphic organizers + case studies'
            },
            evaluate: {
                level: 5,
                verbs: ['değerlendir', 'eleştir', 'savun', 'karar ver'],
                cognitiveLoad: 'very-high',
                scaffolding: 'criteria sheets + metacognitive prompts'
            },
            create: {
                level: 6,
                verbs: ['tasarla', 'oluştur', 'planla', 'üret'],
                cognitiveLoad: 'extreme',
                scaffolding: 'project-based learning + synthesis tasks'
            }
        },
        
        cognitiveLoadOptimization: {
            intrinsicLoad: 'Konunun doğal karmaşıklığı',
            extraneousLoad: 'Minimize edilmeli',
            germaneLoad: 'Maksimize edilmeli',
            strategies: [
                'worked examples effect',
                'split-attention minimization',
                'modality effect utilization',
                'redundancy elimination'
            ]
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * REQUEST MANAGEMENT
     * ═══════════════════════════════════════════════════════════════════
     */
    requestManager: {
        lastRequestTime: 0,
        minInterval: 1000,
        
        async waitIfNeeded() {
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            
            if (timeSinceLastRequest < this.minInterval) {
                const waitTime = this.minInterval - timeSinceLastRequest;
                console.log(`⏳ Rate limiting: ${waitTime}ms bekleniyor...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            
            this.lastRequestTime = Date.now();
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * UTILITY FUNCTIONS
     * ═══════════════════════════════════════════════════════════════════
     */
    estimateTokens(text) {
        return Math.ceil(text.length / 3.5);
    },
    
    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
    
    renderContent(raw) {
        const safe = this.escapeHTML(raw);
        return safe.replace(/\n/g, '<br>');
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * CHAT INTERFACE
     * ═══════════════════════════════════════════════════════════════════
     */
    addMessage(content, role = 'ai') {
        const chat = document.getElementById('aiChat');
        if (!chat) {
            console.error('aiChat container not found');
            return;
        }
        
        const isUser = role === 'user' || role === 'human';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'ai-message ' + (isUser ? 'ai-message--user' : 'ai-message--ai');
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble message-bubble--' + (isUser ? 'user' : 'ai');
        
        const body = document.createElement('div');
        body.className = 'message-content';
        body.innerHTML = this.renderContent(content);
        
        bubble.appendChild(body);
        wrapper.appendChild(bubble);
        chat.appendChild(wrapper);
        
        chat.scrollTop = chat.scrollHeight;
    },
    
    clearChat() {
        const chat = document.getElementById('aiChat');
        if (chat) chat.innerHTML = '';
    },
    
    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.style.display = 'flex';
    },
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.style.display = 'none';
    },
    
    highlightTestTab() {
        const testTab = document.querySelector('[data-tab="test"]');
        if (testTab) {
            testTab.classList.add('highlight-pulse');
            setTimeout(() => testTab.classList.remove('highlight-pulse'), 3000);
        }
    },

    /**
     * ═══════════════════════════════════════════════════════════════════
     * PANEL UI KONTROLLERİ (Aç / Kapa / Küçült)
     * ═══════════════════════════════════════════════════════════════════
     */

    initUI() {
        try {
            // Panel
            const panel = document.querySelector(
                '[data-ai-panel], #aiPanel, #aiAssistantPanel, #aiChatPanel'
            );
            this.ui.panel = panel;

            // Butonlar
            const toggleBtn = document.querySelector(
                '[data-ai-toggle], #aiToggleBtn, #openAiPanelBtn'
            );
            const closeBtn = document.querySelector(
                '[data-ai-close], #aiCloseBtn'
            );
            const minimizeBtn = document.querySelector(
                '[data-ai-minimize], #aiMinimizeBtn'
            );
            const expandBtn = document.querySelector(
                '[data-ai-expand], #aiExpandBtn'
            );

            this.ui.toggleBtn = toggleBtn;
            this.ui.closeBtn = closeBtn;
            this.ui.minimizeBtn = minimizeBtn;
            this.ui.expandBtn = expandBtn;

            if (!panel) {
                console.warn('⚠️ AI panel bulunamadı (data-ai-panel / #aiPanel / #aiAssistantPanel / #aiChatPanel)');
            } else {
                // Başlangıçta açık
                panel.classList.add('ai-panel--open');
                panel.classList.remove('ai-panel--closed');
                panel.classList.remove('ai-panel--minimized');
                this.ui.isOpen = true;
                this.ui.isMinimized = false;
            }

            // Eventler
            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.togglePanel();
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closePanel();
                });
            }

            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMinimize();
                });
            }

            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.expandPanel();
                });
            }

            console.log('✅ TestifyAI UI kontrolleri hazır (aç/kapa/küçült)');

        } catch (error) {
            console.error('❌ TestifyAI UI init hatası:', error);
        }
    },

    openPanel() {
        const panel = this.ui.panel;
        if (!panel) return;

        panel.classList.add('ai-panel--open');
        panel.classList.remove('ai-panel--closed');
        panel.classList.remove('ai-panel--minimized');

        this.ui.isOpen = true;
        this.ui.isMinimized = false;
    },

    closePanel() {
        const panel = this.ui.panel;
        if (!panel) return;

        panel.classList.remove('ai-panel--open');
        panel.classList.add('ai-panel--closed');
        panel.classList.remove('ai-panel--minimized');

        this.ui.isOpen = false;
        this.ui.isMinimized = false;
    },

    togglePanel() {
        if (this.ui.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    },

    toggleMinimize() {
        const panel = this.ui.panel;
        if (!panel) return;

        this.ui.isMinimized = !this.ui.isMinimized;

        if (this.ui.isMinimized) {
            panel.classList.add('ai-panel--minimized');
            panel.classList.add('ai-panel--open');   // görünür ama küçük
            panel.classList.remove('ai-panel--closed');
            this.ui.isOpen = true;
        } else {
            panel.classList.remove('ai-panel--minimized');
            panel.classList.add('ai-panel--open');
            panel.classList.remove('ai-panel--closed');
            this.ui.isOpen = true;
        }
    },

    expandPanel() {
        const panel = this.ui.panel;
        if (!panel) return;

        panel.classList.remove('ai-panel--minimized');
        panel.classList.add('ai-panel--open');
        panel.classList.remove('ai-panel--closed');

        this.ui.isMinimized = false;
        this.ui.isOpen = true;
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * ADVANCED PROMPT SYSTEM
     * ═══════════════════════════════════════════════════════════════════
     */
    buildPrompt(params) {
        const exam = params.examInfo;
        const subject = params.subject;
        const topics = params.topics;
        const difficulty = params.difficulty;
        const questionCount = params.questionCount;
        
        const systemPrompt = `Sen profesyonel bir eğitim içeriği üreticisisin. Görevin, öğrencilere gerçekten öğreten, kaliteli sınav soruları oluşturmak.

EĞİTİMSEL İLKELER:
1. Bilgi Şemaları Oluştur: Önceki bilgiyi varsayma, temellerden inşa et
2. Aşamalı Karmaşıklık: Basit başla, doğal olarak zorlaş
3. Derin Anlayış: Ezberleme başarısızlıktır, kavramayı hedefle
4. Hata Öğretimidir: Yanlış cevaplar öğretim fırsatıdır
5. Gerçek Dünya Bağlantısı: Soyut kavramları somut örneklerle destekle

SINAV BAĞLAMI:
- Sınav: ${exam.name}
- Konu: ${subject}
- Konular: ${topics.join(', ') || 'kapsamlı'}
- Zorluk: ${difficulty}
- Soru Sayısı: ${questionCount}
- Şık Sayısı: 5 (A, B, C, D, E)
- Bloom Seviyeleri: ${exam.bloomPreference.join(' → ')}

KRİTİK KURAL - DOĞRU CEVAP DAĞILIMI:
⚠️ DOĞRU CEVAP HER ZAMAN A OLMAMALI!
- Doğru cevapları A, B, C, D, E arasında RASTGELE dağıt
- Her soru için doğru cevabı farklı şıklara yerleştir
- Örnek dağılım: Soru 1→C, Soru 2→A, Soru 3→E, Soru 4→B, Soru 5→D
- Bu öğrencilerin şık desenlerini ezberlemesini önler

SORU YAPISI:

PHASE 1 - TEMEL (İlk ${Math.ceil(questionCount * 0.3)} soru):
- Bloom: Remember → Understand
- Yük: Düşük-Orta
- Açıklama: 500-700 kelime
- Odak: Tanımlar, temel kavramlar, basit uygulamalar

PHASE 2 - UYGULAMA (Orta ${Math.ceil(questionCount * 0.4)} soru):
- Bloom: Apply → Analyze
- Yük: Orta-Yüksek
- Açıklama: 600-800 kelime
- Odak: Problem çözme, analiz, çoklu adımlar

PHASE 3 - USTALIK (Son ${Math.ceil(questionCount * 0.3)} soru):
- Bloom: Evaluate → Create
- Yük: Çok Yüksek
- Açıklama: 700-900 kelime
- Odak: Sentez, değerlendirme, yaratıcı çözümler

5 ŞIKLI SORU FORMATI:
Her soru için:
- 1 doğru cevap (A, B, C, D veya E - RASTGELE)
- 4 çeldirici (yanlış seçenekler)

Çeldirici tasarımı:
- Çeldirici 1: Yaygın kavram hatası
- Çeldirici 2: Prosedür/hesaplama hatası
- Çeldirici 3: Kısmi doğru ama eksik
- Çeldirici 4: Bilgi eksikliği/karıştırma

AÇIKLAMA YAPISI:
Her soru için detaylı açıklama şunları içermeli:

**🎯 KAVRAM TEMELİ:** (150-200 kelime)
- Ana kavram nedir?
- Neden önemli?
- Günlük hayattan örnek

**📊 ADIM ADIM ÇÖZÜM:** (200-300 kelime)
1. Problem analizi
2. Çözüm yöntemi seçimi
3. Adım adım uygulama
4. Doğrulama

**💡 UZMAN DÜŞÜNCESİ:** (150-200 kelime)
- Uzmanlar nasıl yaklaşır?
- Başlangıç seviyesi hatalar nelerdir?
- İpuçları ve stratejiler

**❌ YANLIŞ CEVAP ANALİZİ:** (200-250 kelime)
Her yanlış seçenek için (4 çeldirici):
- Hangi kavram hatası bu seçeneğe götürür?
- Ne sıklıkta yapılır?
- Nasıl önlenir?

**✅ DOĞRU CEVAP AÇIKLAMASI:** (100-150 kelime)
- Neden bu seçenek doğru?
- Diğerlerinden farkı ne?
- Hangi bilgi/mantık bunu doğru yapıyor?

**🔄 PRATİK ÖNERİLERİ:** (100-150 kelime)
- Benzer problemler
- Çalışma stratejileri
- İleri seviye bağlantılar

KALİTE STANDARTLARI:
✓ %100 bilimsel doğruluk
✓ Bloom taksonomisi ilerlemesi
✓ Her soru 5 şıklı (A, B, C, D, E)
✓ Doğru cevaplar RASTGELE dağıtılmış
✓ Her çeldirici belirli bir hatayı temsil eder
✓ Açıklamalar öğretici, sadece bilgilendirici değil
✓ Türkçe karakter kullanımı doğru (ı,ş,ğ,ü,ö,ç,İ)
✓ Profesyonel ama erişilebilir dil

ÇIKTI FORMATI:
Sadece geçerli JSON döndür, markdown veya yorum yok:

{
  "title": "Açıklayıcı başlık",
  "description": "Pedagojik yaklaşım açıklaması (200+ kelime)",
  "metadata": {
    "examType": "${params.examType}",
    "examName": "${exam.name}",
    "subject": "${subject}",
    "topics": ${JSON.stringify(topics)},
    "difficulty": "${difficulty}",
    "questionCount": ${questionCount},
    "optionCount": 5,
    "pedagogicalFramework": "Testify AI Professional v12.0",
    "bloomProgression": "${exam.bloomPreference.join(' → ')}",
    "qualityTarget": "Profesyonel Akademik Standart",
    "model": "gpt-5-nano",
    "answerDistribution": "Randomized (A, B, C, D, E)"
  },
  "questions": [
    {
      "id": "q1",
      "phase": "foundation|application|mastery",
      "bloomLevel": "remember|understand|apply|analyze|evaluate|create",
      "cognitiveLoad": "low|medium|high|very-high",
      "q": "Soru metni - açık, net, profesyonel",
      "o": [
        "A) Seçenek 1",
        "B) Seçenek 2",
        "C) Seçenek 3",
        "D) Seçenek 4",
        "E) Seçenek 5"
      ],
      "a": "C",
      "explanation": "Kapsamlı öğretici içerik (500-900 kelime, markdown formatlı)",
      "difficulty": "${difficulty}",
      "estimatedTime": ${exam.questionTime},
      "topics": ["${subject}"],
      "prerequisites": ["kavram1", "kavram2"],
      "learningObjectives": ["hedef1", "hedef2"],
      "commonErrors": [
        {
          "option": "A",
          "error": "Spesifik hata açıklaması",
          "frequency": "15%",
          "rootCause": "Temel yanlış anlama",
          "remediation": "Çalışma stratejisi"
        },
        {
          "option": "B",
          "error": "Farklı hata türü",
          "frequency": "25%",
          "rootCause": "Prosedür hatası",
          "remediation": "Dikkat edilmesi gerekenler"
        },
        {
          "option": "D",
          "error": "Başka bir yaygın hata",
          "frequency": "20%",
          "rootCause": "Bilgi eksikliği",
          "remediation": "Ek çalışma konusu"
        },
        {
          "option": "E",
          "error": "Dördüncü çeldirici",
          "frequency": "10%",
          "rootCause": "Karıştırma",
          "remediation": "Ayırt etme stratejisi"
        }
      ]
    }
  ]
}

ÖNEMLİ HATIRLATMALAR:
1. Her soru MUTLAKA 5 şıklı olmalı (A, B, C, D, E)
2. Doğru cevap ("a" alanı) A, B, C, D veya E olabilir - RASTGELE dağıt
3. Soru 1 → örn. C doğru, Soru 2 → örn. A doğru, Soru 3 → örn. E doğru...
4. Asla tüm sorularda A doğru cevap olmasın
5. commonErrors dizisinde 4 çeldirici analizi olmalı (doğru cevap hariç diğer 4 şık)`;

        const userPrompt = `${subject} konusunda ${questionCount} adet profesyonel sınav sorusu oluştur.

KULLANICI TALEBİ: ${params.originalRequest}

GEREKSINIMLER:
- ${questionCount} soru
- Her soru 5 şıklı (A, B, C, D, E)
- Doğru cevaplar RASTGELE dağıtılmalı
- Zorluk: ${difficulty}
- Sınav: ${exam.name}
- Konu: ${subject}
- Konular: ${topics.length > 0 ? topics.join(', ') : 'kapsamlı'}
- Türkçe (doğru karakterler: ı,ş,ğ,ü,ö,ç,İ)

DOĞRU CEVAP DAĞILIMI:
⚠️ ÇOK ÖNEMLİ: Her soruda doğru cevap farklı şıkta olsun!
Örnek: Soru 1→B, Soru 2→D, Soru 3→A, Soru 4→E, Soru 5→C...

PEDAGOJIK HEDEFLER:
1. Temel (${Math.ceil(questionCount * 0.3)} soru): 500-700 kelime/soru
2. Uygulama (${Math.ceil(questionCount * 0.4)} soru): 600-800 kelime/soru
3. Ustalık (${Math.ceil(questionCount * 0.3)} soru): 700-900 kelime/soru

Sadece geçerli JSON döndür.`;

        return { systemPrompt, userPrompt };
    },

    /**
     * ═══════════════════════════════════════════════════════════════════
     * ANSWER LABEL REWRITER (tek soru için)
     * ═══════════════════════════════════════════════════════════════════
     */
    relabelQuestionOptions(question, newCorrectLetter) {
        if (!question || !Array.isArray(question.o) || question.o.length === 0) return;

        const letterRegex = /^\s*([A-E])\)\s*(.*)$/i;

        // Eski şıkları parse et
        const parsed = question.o.map((opt, index) => {
            const str = String(opt);
            const match = str.match(letterRegex);
            if (match) {
                return {
                    oldLabel: match[1].toUpperCase(),
                    text: match[2].trim()
                };
            }
            // Her ihtimale karşı label yoksa fallback
            const fallbackLabel = String.fromCharCode(65 + index); // A,B,C...
            return {
                oldLabel: fallbackLabel,
                text: str.trim()
            };
        });

        // Bu soruda kullanılacak harfler (normalde 5 şık)
        const letters = ['A', 'B', 'C', 'D', 'E'].slice(0, parsed.length);
        const targetLetter = letters.includes((newCorrectLetter || '').toUpperCase())
            ? (newCorrectLetter || '').toUpperCase()
            : letters[0];

        const oldCorrectLetter = (question.a || '').toString().trim().toUpperCase();
        let correctIndex = parsed.findIndex(p => p.oldLabel === oldCorrectLetter);
        if (correctIndex === -1) correctIndex = 0; // garanti olsun

        const labelMap = {}; // oldLabel → newLabel

        // Doğru şıkkı yeni harfe ata
        parsed[correctIndex].newLabel = targetLetter;
        labelMap[parsed[correctIndex].oldLabel] = targetLetter;

        // Diğer şıklar için kalan harfleri karıştır
        const remainingLetters = letters.filter(l => l !== targetLetter);
        this.shuffleArray(remainingLetters);

        let rIdx = 0;
        parsed.forEach((p, idx) => {
            if (idx === correctIndex) return;
            const newLabel = remainingLetters[rIdx] || remainingLetters[remainingLetters.length - 1] || letters[0];
            rIdx++;
            p.newLabel = newLabel;
            labelMap[p.oldLabel] = newLabel;
        });

        // Aynı sırayı koruyarak şıkları yeniden yaz
        question.o = parsed.map(p => `${p.newLabel}) ${p.text}`);
        question.a = targetLetter;

        // commonErrors içindeki option harflerini de güncelle
        if (Array.isArray(question.commonErrors)) {
            question.commonErrors = question.commonErrors.map(err => {
                if (!err || !err.option) return err;
                const old = String(err.option).trim().toUpperCase();
                if (labelMap[old]) {
                    return { ...err, option: labelMap[old] };
                }
                return err;
            });
        }
    },

    /**
     * ═══════════════════════════════════════════════════════════════════
     * ANSWER DISTRIBUTION BALANCER (tüm test için)
     * ═══════════════════════════════════════════════════════════════════
     */
    rebalanceAnswerDistribution(testData) {
        if (!testData || !Array.isArray(testData.questions) || testData.questions.length === 0) return;

        const questions = testData.questions;
        const total = questions.length;
        const letters = ['A', 'B', 'C', 'D', 'E'];

        // Her harf için hedef soru sayısı (mümkün olduğunca eşit)
        const base = Math.floor(total / letters.length);
        let remainder = total % letters.length;

        const targetCounts = {};
        letters.forEach(l => { targetCounts[l] = base; });

        // Arta kalan soruları sırayla A,B,C... üzerine birer tane dağıt
        let idx = 0;
        while (remainder > 0) {
            const letter = letters[idx % letters.length];
            targetCounts[letter]++;
            remainder--;
            idx++;
        }

        // Hedef dağılıma göre bir havuz oluştur
        const pool = [];
        letters.forEach(letter => {
            for (let i = 0; i < targetCounts[letter]; i++) {
                pool.push(letter);
            }
        });

        // Havuzu karıştır (rastgele ama hedeflere sadık)
        this.shuffleArray(pool);

        // Her soruya pool'dan bir harf ver ve şıkları yeniden etiketle
        questions.forEach((q, i) => {
            const newLetter = pool[i] || letters[i % letters.length];
            this.relabelQuestionOptions(q, newLetter);
        });

        // Son dağılımı hesapla ve metadata’ya yaz
        const finalCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
        questions.forEach(q => {
            const ans = (q.a || '').toString().toUpperCase();
            if (finalCounts.hasOwnProperty(ans)) {
                finalCounts[ans]++;
            }
        });

        testData.metadata = testData.metadata || {};
        testData.metadata.answerDistributionDetail = finalCounts;
        testData.metadata.answerDistribution = 'Balanced randomized (A–E)';
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * API CALL WITH RETRY (ARTIK BACKEND ÜZERİNDEN)
     * ═══════════════════════════════════════════════════════════════════
     *
     * Backend kontratı:
     * 1) OpenAI proxy gibi davranıp CHAT COMPLETION döndürebilir
     *    (choices[0].message.content içinde JSON string).
     * veya
     * 2) Direkt şu formatta dönebilir:
     *    {
     *      "success": true,
     *      "testData": { ... Test JSON ... },
     *      "usage": { "total_tokens": 1234 },
     *      "model": "gpt-5-nano"
     *    }
     */
    async callAPIWithRetry(payload, retryCount = 0) {
        const maxRetries = 3;
        const timeouts = [90000, 120000, 180000];
        const currentTimeout = timeouts[retryCount] || timeouts[timeouts.length - 1];
        
        try {
            console.log(`🌐 Backend isteği (deneme ${retryCount + 1}/${maxRetries + 1})`);
            console.log(`⏱️ Zaman aşımı: ${currentTimeout / 1000}s`);
            
            await this.requestManager.waitIfNeeded();
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), currentTimeout);

            // Backend URL:
            //  - Aynı domainde ise: /api/testify/generate-test
            //  - Farklı domainde ise: window.TESTIFY_BACKEND_URL + '/api/testify/generate-test'
            const baseUrlRaw = window.TESTIFY_BACKEND_URL || '';
            const baseUrl = baseUrlRaw.endsWith('/')
                ? baseUrlRaw.slice(0, -1)
                : baseUrlRaw;
            const url = `${baseUrl}/api/testify/generate-test`.replace(/^\/\//, '/');

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    systemPrompt: payload.systemPrompt,
                    userPrompt: payload.userPrompt,
                    params: payload.params || {},
                    client: "Testify-Web",
                    clientVersion: this.version,
                    model: "gpt-5-nano",
                    response_format: "json_testify_v12"
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                let errorData = null;

                try {
                    errorData = await response.json();
                    if (errorData && (errorData.error || errorData.message)) {
                        errorMessage = errorData.error?.message || errorData.error || errorData.message || errorMessage;
                    }
                } catch (_) {
                    // ignore parse error
                }
                
                if ((response.status === 429 || response.status === 500 || response.status === 503) && retryCount < maxRetries) {
                    const waitTime = Math.pow(2, retryCount) * 2000;
                    console.log(`⏳ Sunucu meşgul. ${waitTime/1000}s bekleniyor...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return this.callAPIWithRetry(payload, retryCount + 1);
                }
                
                throw new Error(errorMessage);
            }
            
            const result = await response.json();

            if (result && result.success === false) {
                throw new Error(result.message || result.error || 'Sunucu isteği başarısız oldu.');
            }
            
            return result;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                if (retryCount < maxRetries) {
                    console.log(`⏱️ Zaman aşımı. Tekrar deneniyor...`);
                    return this.callAPIWithRetry(payload, retryCount + 1);
                }
                throw new Error(`İstek zaman aşımına uğradı. Lütfen daha az soru sayısı deneyin.`);
            }
            
            if (retryCount < maxRetries && (error.message || '').toLowerCase().includes('network')) {
                console.log(`🔄 Ağ hatası. Tekrar deneniyor...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.callAPIWithRetry(payload, retryCount + 1);
            }
            
            throw error;
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * MAIN GENERATION METHOD
     * ═══════════════════════════════════════════════════════════════════
     */
    async generateTestFromAI(userRequest, options = {}) {
        if (this.state.isGenerating) {
            this.addMessage(
                "⏳ **Profesyonel içerik hazırlanıyor...**\n\n" +
                "Testify AI sistemi şu anda çalışıyor.\n" +
                "Lütfen bekleyin, yüksek kaliteli eğitim içeriği oluşturuluyor.",
                'ai'
            );
            return;
        }
        
        this.state.isGenerating = true;
        this.state.lastRequest = Date.now();
        this.showTypingIndicator();
        
        console.log('═'.repeat(80));
        console.log('🎓 TESTIFY AI v12.0 PROFESSIONAL (Backend + GPT-5-nano)');
        console.log('Model: GPT-5-nano (backend üzerinden)');
        console.log('═'.repeat(80));
        
        try {
            const params = window.TestifyAI_Final?.parseRequest(userRequest, options) || {
                subject: 'Genel',
                questionCount: 10,
                difficulty: 'orta',
                topics: [],
                originalRequest: userRequest,
                examType: 'generic',
                examInfo: {
                    name: 'Genel Test',
                    questionTime: 90,
                    optionCount: 5,
                    bloomPreference: ['understand', 'apply', 'analyze'],
                    osymStandards: false
                }
            };
            
            console.log(`\n📚 Konu: ${params.subject}`);
            console.log(`🎯 Sınav: ${params.examInfo.name}`);
            console.log(`💪 Zorluk: ${params.difficulty}`);
            console.log(`📊 Soru Sayısı: ${params.questionCount}`);
            console.log(`🔢 Şık Sayısı: 5 (A, B, C, D, E)`);
            console.log(`🎲 Doğru Cevap: Rastgele (ve dengeli) dağıtılıyor`);
            
            const { systemPrompt, userPrompt } = this.buildPrompt(params);
            
            const systemTokens = this.estimateTokens(systemPrompt);
            const userTokens = this.estimateTokens(userPrompt);
            const totalInputTokens = systemTokens + userTokens;
            
            console.log(`\n📏 Prompt: ~${totalInputTokens} token`);
            console.log(`🤖 Backend API çağrısı başlatılıyor...`);
            
            const startTime = Date.now();
            const apiResult = await this.callAPIWithRetry({ systemPrompt, userPrompt, params });
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            
            let usage = {};
            let testData = null;

            // 1) Backend direkt testData döndürdüyse
            if (apiResult && apiResult.testData) {
                testData = apiResult.testData;
                usage = apiResult.usage || {};
            }
            // 2) Backend "data.testData" şeklinde döndürdüyse
            else if (apiResult && apiResult.data && apiResult.data.testData) {
                testData = apiResult.data.testData;
                usage = apiResult.data.usage || apiResult.usage || {};
            }
            // 3) Backend, OpenAI chat completions proxy'si ise
            else {
                const data = apiResult;
                usage = data.usage || {};
                
                let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) 
                    ? data.choices[0].message.content 
                    : '';

                content = content
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                
                testData = JSON.parse(content);
            }
            
            console.log(`\n✅ İçerik oluşturuldu!`);
            console.log(`⏱️ Süre: ${duration}s`);
            console.log(`📊 Tokenler: ${usage.total_tokens || 'N/A'}`);
            
            // 🔀 Doğru cevap dağılımını dengeli + rastgele hale getir
            this.rebalanceAnswerDistribution(testData);
            
            // Doğru cevap dağılımını kontrol et ve logla (yeni dağılım)
            if (testData.questions && testData.questions.length > 0) {
                const answerDistribution = {};
                testData.questions.forEach(q => {
                    const answer = (q.a || '').toString().toUpperCase();
                    answerDistribution[answer] = (answerDistribution[answer] || 0) + 1;
                });
                console.log('\n📊 Doğru Cevap Dağılımı (dengelenmiş):');
                Object.entries(answerDistribution).forEach(([key, val]) => {
                    console.log(`   ${key}: ${val} soru`);
                });

                testData.metadata = testData.metadata || {};
                testData.metadata.answerDistributionDetail = answerDistribution;
                testData.metadata.answerDistribution = 'Balanced randomized (A–E)';
            }
            
            testData.metadata = testData.metadata || {};
            testData.metadata.generatedWith = `Testify AI v${this.version}`;
            testData.metadata.model = apiResult.model || testData.metadata.model || 'gpt-5-nano';
            testData.metadata.generationTime = `${duration}s`;
            testData.metadata.tokens = usage.total_tokens;
            testData.metadata.timestamp = new Date().toISOString();
            testData.metadata.optionCount = 5;
            
            this.state.currentTest = testData;
            this.saveGeneratedTest(testData);
            
            this.hideTypingIndicator();
            
            const questionCount = testData.questions?.length || 0;
            
            this.addMessage(
                `## ✨ Profesyonel Eğitim İçeriği Hazır!\n\n` +
                `### 🎓 ${testData.title}\n\n` +
                `${testData.description}\n\n` +
                `${'━'.repeat(60)}\n\n` +
                `**📊 İçerik Özellikleri**\n\n` +
                `• **Sınav:** ${testData.metadata.examName || 'Kapsamlı Test'}\n` +
                `• **Konu:** ${testData.metadata.subject || 'Belirtilmedi'}\n` +
                `• **Soru Sayısı:** ${questionCount}\n` +
                `• **Şık Sayısı:** 5 (A, B, C, D, E)\n` +
                `• **Zorluk:** ${testData.metadata.difficulty || 'Karışık'}\n` +
                `• **Doğru Cevaplar:** Dengeli ve rastgele dağıtılmış\n\n` +
                `**⚙️ Teknik Detaylar**\n\n` +
                `• Model: ${testData.metadata.model}\n` +
                `• Süre: ${testData.metadata.generationTime}\n` +
                `• Tokenler: ${testData.metadata.tokens || 'N/A'}\n\n` +
                `${'━'.repeat(60)}\n\n` +
                `### 🎯 Şimdi Ne Yapmalısın?\n\n` +
                `1. **"📝 Test Çöz"** sekmesine git\n` +
                `2. Testi dikkatlice çöz\n` +
                `3. **Açıklamaları mutlaka oku** (en değerli kısım!)\n` +
                `4. Yanlış cevaplardan öğren\n` +
                `5. Pratik yaparak pekiştir\n\n` +
                `🌟 **Başarılar!** Testify ile profesyonel eğitim.`,
                'ai'
            );
            
            this.highlightTestTab();
            
            console.log(`\n${'═'.repeat(80)}`);
            console.log('✅ PROFESYONEL EĞİTİM İÇERİĞİ OLUŞTURULDU (Backend)');
            console.log(`${'═'.repeat(80)}\n`);
            
            return testData;
            
        } catch (error) {
            console.error(`\n${'═'.repeat(80)}`);
            console.error('❌ İÇERİK OLUŞTURMA HATASI (Backend)');
            console.error(`${'═'.repeat(80)}`);
            console.error(`Hata: ${error.message}`);
            console.error(`${'═'.repeat(80)}\n`);
            
            this.hideTypingIndicator();
            
            let userMessage = `## ❌ İçerik Oluşturulamadı\n\n**Hata:** ${error.message}\n\n`;
            
            if (error.message.includes('Zaman aşımı')) {
                userMessage += `**Çözüm:**\n` +
                    `• Daha az soru sayısı deneyin\n` +
                    `• Konuyu daha spesifik yapın\n` +
                    `• Sistem otomatik tekrar deneyecek`;
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                userMessage += `**Çözüm:**\n` +
                    `• Bir süre bekleyip tekrar deneyin\n` +
                    `• Sunucu yoğunluğu azalınca deneyin`;
            } else {
                userMessage += `**Çözüm:**\n` +
                    `• Lütfen tekrar deneyin\n` +
                    `• Farklı parametreler deneyin\n` +
                    `• Sorun devam ederse geliştiriciye iletin`;
            }
            
            this.addMessage(userMessage, 'ai');
            
            throw error;
            
        } finally {
            this.state.isGenerating = false;
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * SAVE GENERATED TEST (24 saat + doğru key’ler)
     * ═══════════════════════════════════════════════════════════════════
     */
    saveGeneratedTest(testData) {
        try {
            // 24 saatlik geçerlilik
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            testData.expiresAt = expiresAt;

            // Yeni anahtar (QuizManager buradan okuyor)
            localStorage.setItem('testify_generated_test', JSON.stringify(testData));

            // Geriye dönük uyumluluk için eski anahtar
            localStorage.setItem('testify_current_test', JSON.stringify(testData));

            console.log('✓ Test kaydedildi (AI, 24 saat geçerli)');
        } catch (error) {
            console.error('❌ Test kaydedilemedi:', error);
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * LOAD SAVED TEST
     * ═══════════════════════════════════════════════════════════════════
     */
    loadSavedTest() {
        try {
            const saved = localStorage.getItem('testify_current_test');
            if (saved) {
                this.state.currentTest = JSON.parse(saved);
                return this.state.currentTest;
            }
        } catch (error) {
            console.error('❌ Test yüklenemedi:', error);
        }
        return null;
    },

    /**
     * ═══════════════════════════════════════════════════════════════════
     * PUBLIC INIT
     * ═══════════════════════════════════════════════════════════════════
     */
    init() {
        console.log('🚀 TestifyAI.init() çağrıldı');
        this.initUI();
        this.loadSavedTest();
    }
};

// Export globally
window.TestifyAI = TestifyAI;

// Eski inline fonksiyon isimlerine destek (varsa)
window.openAiPanel = () => window.TestifyAI && TestifyAI.openPanel();
window.closeAiPanel = () => window.TestifyAI && TestifyAI.closePanel();
window.toggleAiPanel = () => window.TestifyAI && TestifyAI.togglePanel();
window.minimizeAiPanel = () => window.TestifyAI && TestifyAI.toggleMinimize();

/**
 * ═══════════════════════════════════════════════════════════════════════
 * INITIALIZATION LOGS
 * ═══════════════════════════════════════════════════════════════════════
 */
console.log('\n' + '═'.repeat(80));
console.log('🎓 TESTIFY AI v12.0.1 PROFESSIONAL (Backend + GPT-5-nano)');
console.log('═'.repeat(80));
console.log('\n📚 Model: GPT-5-nano (backend üzerinden)');
console.log('🎯 Quality: Professional Academic Standard');
console.log('🔬 Framework: Research-Based Pedagogy');
console.log('🔢 Format: 5 Options (A, B, C, D, E)');
console.log('🎲 Answers: Balanced randomized distribution\n');
console.log('━'.repeat(80));
console.log('✨ Testify AI hazır (UI + Test üretimi, backend ile)!');
console.log('━'.repeat(80) + '\n');
