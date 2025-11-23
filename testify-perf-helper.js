/*!
 * Testify Performance Helper
 * Tasarımı bozmadan Lighthouse metriklerini iyileştiren mikro optimizasyonlar
 * - CLS düşürme (özellikle reklam alanları + resimler)
 * - Lazy-load medya (fold altındaki img'ler)
 */

;(function () {
    'use strict';

    const Perf = {
        initialized: false,

        init() {
            if (this.initialized) return;
            this.initialized = true;

            // DOM hazır olduğunda çalış
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                this.onReady();
            } else {
                document.addEventListener('DOMContentLoaded', () => this.onReady(), { once: true });
            }

            // Tam yükleme bittiğinde ekstra ölçüm/log
            window.addEventListener('load', () => this.onLoad(), { once: true });
        },

        onReady() {
            try {
                this.injectAdCss();
                this.enableLazyMedia();
            } catch (err) {
                console.warn('[TestifyPerf] onReady error:', err);
            }
        },

        onLoad() {
            try {
                this.markLoad();
            } catch (err) {
                console.warn('[TestifyPerf] onLoad error:', err);
            }
        },

        /**
         * Reklam alanlarına sabit yükseklik ver → CLS düşer
         * Tasarım bozulmasın diye genel, yumuşak değerler kullanıyoruz
         */
        injectAdCss() {
            const css = `
/* Google AdSense ve genel reklam slotları için min yükseklik */
ins.adsbygoogle,
.ad-slot,
.ad-container {
    display: block;
    min-height: 120px;
}

/* Masaüstü dikey reklam / sidebar alanları için daha yüksek alan */
@media (min-width: 768px) {
    .ad-slot--vertical,
    .ad-sidebar,
    .ad-left,
    .ad-right {
        min-height: 600px;
    }
}
`;

            const style = document.createElement('style');
            style.id = 'testify-perf-ads';
            style.textContent = css;
            document.head.appendChild(style);

            console.log('[TestifyPerf] Ad alanı CLS koruması eklendi');
        },

        /**
         * Resimleri lazy-load yap + yükseklik fallback → network + CLS iyileştirir
         */
        enableLazyMedia() {
            const viewportHeight = window.innerHeight || 800;

            const lazyHandleImg = (img) => {
                if (!img || img.nodeType !== 1) return;

                // Browser zaten loading özelliğini ayarlamışsa dokunma
                if (img.loading) return;

                // İlk yüklemede viewport'un biraz altındaysa lazy yap
                const rect = img.getBoundingClientRect();
                if (rect.top > viewportHeight * 1.2) {
                    img.loading = 'lazy';
                }

                // Genişlik / yükseklik yoksa CLS için min-height fallback
                const hasDim =
                    img.hasAttribute('width') ||
                    img.hasAttribute('height') ||
                    img.style.height ||
                    img.style.minHeight;

                if (!hasDim) {
                    const fallback = img.naturalHeight || 120; // aşırı düşük olmasın
                    img.style.minHeight = fallback + 'px';
                }
            };

            // Sayfadaki mevcut tüm img'leri ele al
            document.querySelectorAll('img').forEach(lazyHandleImg);

            // Sonradan eklenen img'leri de yakala (ör: AI içerik, dinamik alanlar, reklam)
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType !== 1) return;

                        if (node.tagName === 'IMG') {
                            lazyHandleImg(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('img').forEach(lazyHandleImg);
                        }
                    });
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

            console.log('[TestifyPerf] Lazy-load + img CLS koruması aktif');
        },

        /**
         * Basit performans işareti (debug için)
         */
        markLoad() {
            if (!('performance' in window) || !('now' in performance)) return;
            const now = Math.round(performance.now());
            performance.mark && performance.mark('testify-perf-after-load');
            console.log('[TestifyPerf] Tam yükleme süresi ~', now, 'ms');
        }
    };

    Perf.init();
    window.TestifyPerf = Perf;
})();
