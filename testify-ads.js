/**
 * ═══════════════════════════════════════════════════════════════════════
 * TESTIFY ADS v1.0
 * Dashboard için 6-slot reklam yerleşimi (masaüstü + mobil)
 * 
 * Amaç:
 * - Dashboard içeriğini otomatik olarak "reklamlı layout" içine sarmak
 * - Masaüstünde: 6 slot (üst, alt, sol üst/alt, sağ üst/alt)
 * - Telefonda: 6 slot ama tam ekranı kaplamadan, banner gibi görünmesi
 * 
 * Not:
 * - HTML'de sadece #dashboard section'ı olsun yeter.
 * - Reklamla ilgili bütün markup ve JS bu dosyada toplu.
 * ═══════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const TestifyAds = {
        initialized: false,

        /**
         * Ana init
         */
        init() {
            if (this.initialized) return;
            this.initialized = true;

            const start = () => {
                try {
                    this.setupDashboardAds('#dashboard');
                    console.log('%c[TestifyAds] 6-slot reklam layoutu uygulandı.', 'color:#bb86fc;');
                } catch (err) {
                    console.error('[TestifyAds] init hatası:', err);
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', start);
            } else {
                start();
            }
        },

        /**
         * Dashboard bölümünü bulup 6-slot layout içine sarar
         * @param {string} selector - örn: "#dashboard"
         */
        setupDashboardAds(selector) {
            const section = document.querySelector(selector);
            if (!section) {
                console.warn('[TestifyAds] Hedef section bulunamadı:', selector);
                return;
            }

            if (section.dataset.adsInitialized === '1') {
                console.warn('[TestifyAds] Bu bölüm için reklam zaten kurulmuş:', selector);
                return;
            }
            section.dataset.adsInitialized = '1';

            // Mevcut çocukları çek
            const oldChildren = Array.from(section.children);

            // Yeni layout container
            const layout = document.createElement('div');
            layout.className = 'dashboard-layout-with-ads';
            layout.dataset.adsLayoutFor = 'dashboard';

            // Ana içerik wrapper'ı
            const main = document.createElement('main');
            main.className = 'dashboard-main';

            // Eski tüm çocukları main içine taşı
            oldChildren.forEach(child => {
                main.appendChild(child);
            });

            // Reklam slotu oluşturucu
            const createSlot = (classNames, label, id) => {
                const slot = document.createElement('div');
                slot.className = 'ad-slot ' + classNames;
                if (id) {
                    slot.id = id;
                    slot.dataset.adSlot = id;
                }

                // Placeholder (sonra gerçek reklam koduyla değiştireceksin)
                const span = document.createElement('span');
                span.className = 'ad-placeholder';
                span.textContent = label;
                slot.appendChild(span);

                return slot;
            };

            // 6 slot
            const adTop    = createSlot('ad-slot--top',                'Reklam Alanı 1 - Üst Banner',  'ad-top');
            const adLeft1  = createSlot('ad-slot--left ad-slot--left-1',   'Reklam Alanı 2 - Sol Üst',    'ad-left-1');
            const adLeft2  = createSlot('ad-slot--left ad-slot--left-2',   'Reklam Alanı 3 - Sol Alt',    'ad-left-2');
            const adRight1 = createSlot('ad-slot--right ad-slot--right-1', 'Reklam Alanı 4 - Sağ Üst',    'ad-right-1');
            const adRight2 = createSlot('ad-slot--right ad-slot--right-2', 'Reklam Alanı 5 - Sağ Alt',    'ad-right-2');
            const adBottom = createSlot('ad-slot--bottom',             'Reklam Alanı 6 - Alt Banner',  'ad-bottom');

            // Sıra önemli değil, CSS grid alanlarıyla yerleşiyor
            layout.appendChild(adTop);
            layout.appendChild(adLeft1);
            layout.appendChild(adLeft2);
            layout.appendChild(main);
            layout.appendChild(adRight1);
            layout.appendChild(adRight2);
            layout.appendChild(adBottom);

            // Section içini temizle, yeni layout'u ekle
            section.innerHTML = '';
            section.appendChild(layout);
        },

        /**
         * İleride kullanmak istersen:
         * Belirli bir slotu dışarıdan doldurmak için yardımcı.
         * Örn:
         *   TestifyAds.fillSlot('ad-top', el => {
         *       el.innerHTML = '...adsense kodu...';
         *   });
         */
        fillSlot(slotId, render) {
            const el = document.getElementById(slotId);
            if (!el) {
                console.warn('[TestifyAds] Slot bulunamadı:', slotId);
                return;
            }

            // İçini temizle (placeholder'ı kaldır)
            el.innerHTML = '';

            if (typeof render === 'function') {
                render(el);
            } else if (typeof render === 'string') {
                el.innerHTML = render;
            }
        }
    };

    // Global export
    window.TestifyAds = TestifyAds;

    // Otomatik başlat
    TestifyAds.init();
})();
