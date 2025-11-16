/**
 * TESTIFY ADS v3
 * Global 6-slot yerleşimi:
 *  - PC:  üstte 2 (alt alta), altta 2 (alt alta), solda 1, sağda 1
 *  - Mobil: üstte 3, altta 3, yan reklam yok
 *
 * HTML tarafında sadece:
 *   <link rel="stylesheet" href="testify-ads.css">
 *   <script src="testify-ads.js" defer></script>
 * olması yeterli.
 */

(function () {
    'use strict';

    const TestifyAds = {
        initialized: false,

        init() {
            if (this.initialized) return;
            this.initialized = true;

            const start = () => {
                try {
                    this.setup();
                    console.log('%c[TestifyAds] Global reklam layout yüklendi.', 'color:#bb86fc;');
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

        setup() {
            const header = document.querySelector('.header');
            const mainContainer = document.querySelector('.main-container');

            if (!header || !mainContainer) {
                console.warn('[TestifyAds] .header veya .main-container bulunamadı, reklam eklenemedi.');
                return;
            }

            // Aynı sayfada iki kez kurulum olmasın
            if (document.body.dataset.tfyAdsInitialized === '1') return;
            document.body.dataset.tfyAdsInitialized = '1';

            // ── ÜSTTEKİ REKLAMLAR (2 PC, 3 MOBİL) ────────────────────
            const topRow = document.createElement('div');
            topRow.className = 'tfy-ad-row tfy-ad-row--top';

            topRow.appendChild(this.createSlot('tfy-ad-top-1', 'Reklam Alanı Top-1'));
            topRow.appendChild(this.createSlot('tfy-ad-top-2', 'Reklam Alanı Top-2'));
            topRow.appendChild(
                this.createSlot(
                    'tfy-ad-top-3',
                    'Reklam Alanı Top-3 (Mobil)',
                    'tfy-ad-slot--mobile-extra'
                )
            );

            // Header’ın hemen altına yerleştir
            header.insertAdjacentElement('afterend', topRow);

            // ── ALTAKİ REKLAMLAR (2 PC, 3 MOBİL) ─────────────────────
            const bottomRow = document.createElement('div');
            bottomRow.className = 'tfy-ad-row tfy-ad-row--bottom';

            bottomRow.appendChild(this.createSlot('tfy-ad-bottom-1', 'Reklam Alanı Bottom-1'));
            bottomRow.appendChild(this.createSlot('tfy-ad-bottom-2', 'Reklam Alanı Bottom-2'));
            bottomRow.appendChild(
                this.createSlot(
                    'tfy-ad-bottom-3',
                    'Reklam Alanı Bottom-3 (Mobil)',
                    'tfy-ad-slot--mobile-extra'
                )
            );

            // Ana içeriğin hemen altına
            mainContainer.insertAdjacentElement('afterend', bottomRow);

            // ── YAN REKLAMLAR (solda 1, sağda 1) ─────────────────────
            this.injectSideAd(
                'tfy-ad-left',
                'tfy-side-ad tfy-side-ad--left',
                'Reklam Alanı Sol'
            );
            this.injectSideAd(
                'tfy-ad-right',
                'tfy-side-ad tfy-side-ad--right',
                'Reklam Alanı Sağ'
            );
        },

        /**
         * Ortak slot oluşturucu
         * @param {string} id
         * @param {string} label
         * @param {string} [extraClass]
         */
        createSlot(id, label, extraClass) {
            const slot = document.createElement('div');
            slot.className = 'tfy-ad-slot' + (extraClass ? ' ' + extraClass : '');
            slot.id = id;
            slot.dataset.adSlot = id; // İstersen adsense-manager buradan yakalayabilir

            const span = document.createElement('span');
            span.className = 'tfy-ad-placeholder';
            span.textContent = label;
            slot.appendChild(span);

            return slot;
        },

        /**
         * Sabit yan kolon için yardımcı
         */
        injectSideAd(id, className, label) {
            const el = document.createElement('aside');
            el.id = id;
            el.className = className;
            el.dataset.adSlot = id;

            const span = document.createElement('span');
            span.className = 'tfy-ad-placeholder';
            span.textContent = label;
            el.appendChild(span);

            document.body.appendChild(el);
        },

        /**
         * Dışarıdan slot doldurmak istersen:
         *   TestifyAds.fillSlot('tfy-ad-top-1', el => { el.innerHTML = '...adsense kodu...'; });
         */
        fillSlot(slotId, render) {
            const el = document.getElementById(slotId);
            if (!el) {
                console.warn('[TestifyAds] Slot bulunamadı:', slotId);
                return;
            }

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
    TestifyAds.init();
})();
