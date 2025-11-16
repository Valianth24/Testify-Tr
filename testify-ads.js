/**
 * TESTIFY ADS v1.2
 *
 * Masaüstü:
 *  - Üstte 2 banner:  ad-top-1, ad-top-2
 *  - Solda 1 dikey:   ad-left
 *  - Sağda 1 dikey:   ad-right
 *  - Altta 2 banner:  ad-bottom-1, ad-bottom-2
 *
 * Mobil:
 *  - Üst satır: 2 banner (üst)
 *  - Orta satır: sol reklam → dashboard içeriği → sağ reklam (alt alta)
 *  - Alt satır: 2 banner (alt)
 *
 * Not:
 *  - Sadece #dashboard section’ını sarar, navbar’a dokunmaz.
 *  - Eski .ad-banner vb. yapıları kullanmaz; kendi .tads-* sınıflarını kullanır.
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
          this.setupDashboardAds('#dashboard');
          console.log(
            '%c[TestifyAds] Yeni 6-slot reklam layoutu aktif.',
            'color:#bb86fc;'
          );
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
     * Dashboard bölümünü yeni reklamlara göre sar.
     * @param {string} selector - örn: "#dashboard"
     */
    setupDashboardAds(selector) {
      const section = document.querySelector(selector);
      if (!section) {
        console.warn('[TestifyAds] Hedef section bulunamadı:', selector);
        return;
      }

      if (section.dataset.tadsInitialized === '1') {
        // Zaten yapılmışsa tekrar elleme
        return;
      }
      section.dataset.tadsInitialized = '1';

      // Eski çocukları al (başlık, kartlar vs.)
      const oldChildren = Array.from(section.children);

      // === Ana layout ===
      const layout = document.createElement('div');
      layout.className = 'tads-layout tads-layout--dashboard';
      layout.dataset.tadsLayoutFor = 'dashboard';

      // Üst satır (2 yatay)
      const rowTop = document.createElement('div');
      rowTop.className = 'tads-row tads-row-top';

      // Orta satır (sol reklam – içerik – sağ reklam)
      const middle = document.createElement('div');
      middle.className = 'tads-middle';

      // Dashboard içeriği için wrapper
      const main = document.createElement('div');
      main.className = 'tads-main';

      oldChildren.forEach(child => main.appendChild(child));

      // Alt satır (2 yatay)
      const rowBottom = document.createElement('div');
      rowBottom.className = 'tads-row tads-row-bottom';

      // Reklam slotu oluşturucu
      const createSlot = (id, label, extraClass) => {
        const slot = document.createElement('div');
        slot.className = 'tads-slot ' + (extraClass || '');
        slot.id = id;
        slot.dataset.adSlot = id; // İleride AdSense için kullanılabilir

        const span = document.createElement('span');
        span.className = 'tads-slot-placeholder';
        span.textContent = label;
        slot.appendChild(span);

        return slot;
      };

      // 6 adet slot
      const adTop1 = createSlot('ad-top-1', 'Reklam Alanı Top-1');
      const adTop2 = createSlot('ad-top-2', 'Reklam Alanı Top-2');

      const adLeft = createSlot(
        'ad-left',
        'Reklam Alanı Left',
        'tads-slot--side'
      );
      const adRight = createSlot(
        'ad-right',
        'Reklam Alanı Right',
        'tads-slot--side'
      );

      const adBottom1 = createSlot(
        'ad-bottom-1',
        'Reklam Alanı Bottom-1'
      );
      const adBottom2 = createSlot(
        'ad-bottom-2',
        'Reklam Alanı Bottom-2'
      );

      // DOM ağacını kur
      rowTop.appendChild(adTop1);
      rowTop.appendChild(adTop2);

      middle.appendChild(adLeft);
      middle.appendChild(main);
      middle.appendChild(adRight);

      rowBottom.appendChild(adBottom1);
      rowBottom.appendChild(adBottom2);

      layout.appendChild(rowTop);
      layout.appendChild(middle);
      layout.appendChild(rowBottom);

      // Section içini temizle, yeni layout’u ekle
      section.innerHTML = '';
      section.appendChild(layout);

      // İleride başka script’ler (ör. adsense-manager.js) dinlesin diye event at
      try {
        const event = new CustomEvent('TestifyAds:ready', {
          detail: {
            section: selector,
            slots: {
              top1: adTop1,
              top2: adTop2,
              left: adLeft,
              right: adRight,
              bottom1: adBottom1,
              bottom2: adBottom2
            }
          }
        });
        document.dispatchEvent(event);
      } catch (e) {
        // Eski tarayıcı vs. olursa sessizce geç
      }
    },

    /**
     * Dışarıdan bir slotu doldurmak için yardımcı.
     * Örnek:
     *   TestifyAds.fillSlot('ad-top-1', el => {
     *       el.innerHTML = '...adsense script...';
     *   });
     */
    fillSlot(slotId, render) {
      const el = document.getElementById(slotId);
      if (!el) {
        console.warn('[TestifyAds] Slot bulunamadı:', slotId);
        return;
      }

      // Placeholder’ı temizle
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
