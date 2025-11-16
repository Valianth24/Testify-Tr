/**
 * ═══════════════════════════════════════════════════════════════════════
 * TESTIFY ADS v2.0
 * Global reklam yönetimi (tüm sayfalar)
 *
 * Özellikler:
 * - HTML'de tanımlı .ad-slot ve .global-side-ad alanlarını otomatik bulur
 * - İçine placeholder "Reklam Alanı X" yazar (Adsense gelene kadar görüntü)
 * - Sekme (nav-tab) değişimlerinde "refresh" tetikler
 * - İstersen dışarıdan TestifyAds.fillSlot(...) ile belli bir alanı doldurursun
 * - İstersen adsense-manager.js içinde "testify:ads:refresh" event'ini yakalayıp
 *   gerçek Adsense reload işlemini orada yaparsın.
 * ═══════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  const TestifyAds = {
    _initialized: false,

    /**
     * Ana init
     */
    init() {
      if (this._initialized) return;
      this._initialized = true;

      const start = () => {
        try {
          this.setupPlaceholders();
          this.bindTabRefresh();
          console.log('%c[TestifyAds] Global reklam sistemi aktif.', 'color:#bb86fc;');
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
     * Sayfadaki tüm reklam alanlarını bulup placeholder ekler.
     * (Gerçek Adsense kodu geldiğinde bu placeholder'ları kaldırabilirsin.)
     */
    setupPlaceholders() {
      const slots = document.querySelectorAll('.ad-slot, .global-side-ad');
      if (!slots.length) {
        console.warn('[TestifyAds] Hiç reklam alanı bulunamadı.');
        return;
      }

      let counter = 1;
      slots.forEach((el) => {
        if (el.dataset.adsInitialized === '1') return;
        el.dataset.adsInitialized = '1';

        // Eğer içinde daha önce içerik yoksa placeholder ekle
        const hasContent = el.querySelector('.ad-placeholder') || el.children.length > 0;
        if (!hasContent) {
          const span = document.createElement('span');
          span.className = 'ad-placeholder';

          // data-ad-slot varsa label'da da gösterelim
          const slotName = el.getAttribute('data-ad-slot') || counter;
          span.textContent = 'Reklam Alanı ' + slotName;
          el.appendChild(span);
        }

        counter++;
      });
    },

    /**
     * Tüm slotlar için "refresh" tetikler.
     * Şu an sadece data-refresh-key güncelliyor + event fırlatıyor.
     * Gerçek Adsense reload'ı için adsense-manager.js içinde:
     *
     *  window.addEventListener('testify:ads:refresh', (ev) => {
     *    // burada adsbygoogle push vb. yapabilirsin
     *  });
     */
    refreshAll(reason = 'manual') {
      const now = Date.now().toString();
      const slots = document.querySelectorAll('.ad-slot, .global-side-ad');

      slots.forEach((el, i) => {
        el.dataset.refreshKey = now + '-' + i;
        // İleride burada gerçek Adsense yenileme kodu çalıştırılabilir.
      });

      // Dış sistemler için custom event
      try {
        const ev = new CustomEvent('testify:ads:refresh', {
          detail: { reason, timestamp: Date.now() }
        });
        window.dispatchEvent(ev);
      } catch (err) {
        console.warn('[TestifyAds] CustomEvent oluşturulamadı:', err);
      }

      console.log('[TestifyAds] Slotlar yenilendi. Sebep:', reason);
    },

    /**
     * nav-tab butonlarına tıklanınca reklamları yeniler.
     * (Sadece okur, mevcut tab logic'ine karışmaz.)
     */
    bindTabRefresh() {
      const tabs = document.querySelectorAll('.nav-tab');
      if (!tabs.length) return;

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          // Sekme değiştirildiğinde reklamları "yenile"
          this.refreshAll('tab-change');
        });
      });
    },

    /**
     * Dışarıdan belirli bir slotu doldurmak için yardımcı fonksiyon.
     *
     * Örnek:
     *   TestifyAds.fillSlot('top-1', (el) => {
     *       el.innerHTML = '<!-- adsense kodu buraya -->';
     *   });
     *
     *   TestifyAds.fillSlot('[data-ad-slot="side-left"]', '<b>Custom Banner</b>');
     */
    fillSlot(selectorOrEl, render) {
      let el = null;

      if (typeof selectorOrEl === 'string') {
        // Eğer string ID gibi ise (top-1) önce data-ad-slot ile dene
        if (!selectorOrEl.startsWith('#') && !selectorOrEl.startsWith('.')) {
          el = document.querySelector('[data-ad-slot="' + selectorOrEl + '"]');
        }

        // Bulamazsa normal selector olarak dene
        if (!el) {
          el = document.querySelector(selectorOrEl);
        }
      } else if (selectorOrEl && selectorOrEl.nodeType === 1) {
        el = selectorOrEl;
      }

      if (!el) {
        console.warn('[TestifyAds] Slot bulunamadı:', selectorOrEl);
        return;
      }

      // Placeholder dahil içeriği temizle
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
