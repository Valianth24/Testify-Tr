// lazy-questions.js
(function () {
    'use strict';
    
    // Yükleme durumu yönetimi
    const state = {
        loading: false,
        callbacks: []
    };

    /**
     * sorular.js dosyasını DOM'a sonradan ekler (optimize edilmiş)
     */
    function injectQuestionsScript(callback) {
        // Zaten yüklüyse hemen callback çağır
        if (window.questionBank?.length) {
            callback?.();
            return;
        }

        // Callback'i kuyruğa ekle
        if (callback) state.callbacks.push(callback);

        // Zaten yükleme başlatıldıysa bekle
        if (state.loading) return;
        
        state.loading = true;

        const script = document.createElement('script');
        script.src = 'sorular.js';
        script.async = true;
        
        const handleLoad = () => {
            state.loading = false;
            
            // Tüm bekleyen callback'leri çalıştır
            const callbacks = state.callbacks.splice(0);
            callbacks.forEach(cb => cb());
            
            // Event dispatch et
            document.dispatchEvent(new Event('questionBankReady'));
            console.log('✅ sorular.js yüklendi (lazy)');
        };
        
        const handleError = () => {
            state.loading = false;
            state.callbacks.length = 0; // Callback kuyruğunu temizle
            console.error('❌ sorular.js yüklenemedi');
        };

        script.onload = handleLoad;
        script.onerror = handleError;
        
        document.head.appendChild(script);
    }

    /**
     * Sayfa boştayken arka planda soru bankasını yükle
     */
    function lazyWarmup() {
        injectQuestionsScript();
    }

    // requestIdleCallback ile optimize yükleme
    const scheduleWarmup = 'requestIdleCallback' in window
        ? () => requestIdleCallback(lazyWarmup, { timeout: 3000 })
        : () => {
            if (document.readyState === 'complete') {
                setTimeout(lazyWarmup, 1500);
            } else {
                window.addEventListener('load', () => setTimeout(lazyWarmup, 1500), { once: true });
            }
        };

    /**
     * QuizManager.startQuiz'i lazy-load için wrap et
     */
    function patchQuizManager() {
        if (!window.QuizManager?.startQuiz) return;

        const originalStartQuiz = QuizManager.startQuiz;
        
        QuizManager.startQuiz = function (mode) {
            // Soru bankası hazırsa direkt başlat
            if (window.questionBank?.length) {
                return originalStartQuiz.call(this, mode);
            }

            // Hazır değilse yükle ve başlat
            injectQuestionsScript(() => {
                originalStartQuiz.call(this, mode);
            });
        };

        console.log('🔧 QuizManager.startQuiz lazy-load ile wrap edildi');
    }

    // Başlangıç
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchQuizManager, { once: true });
    } else {
        patchQuizManager();
    }

    scheduleWarmup();
})();
