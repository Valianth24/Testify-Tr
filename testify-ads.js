/**
 * TESTIFY ADS v3.2
 * Global 6-slot yerleşimi
 *  - PC:  üstte 2, altta 2, solda 1, sağda 1
 *  - Mobil: üstte 3, altta 3 (yan reklam yok)
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

      // Aynı sayfada iki kez kurma
      if (document.body.dataset.tfyAdsInitialized === '1') return;
      document.body.dataset.tfyAdsInitialized = '1';

      // Eski layout izlerini temizle
      this.cleanupLegacyAds();

      /* ── ÜST REKLAMLAR ───────────────────────────── */

      const topRow = document.createElement('div');
      topRow.className = 'global-ad-row global-ad-row--top tfy-ad-row tfy-ad-row--top';

      topRow.appendChild(this.createSlot('tfy-ad-top-1', 'Reklam Alanı Top-1'));
      topRow.appendChild(this.createSlot('tfy-ad-top-2', 'Reklam Alanı Top-2'));
      topRow.appendChild(
        this.createSlot(
          'tfy-ad-top-3',
          'Reklam Alanı Top-3 (Mobil)',
          'ad-slot--mobile-only tfy-ad-slot--mobile-extra'
        )
      );

      header.insertAdjacentElement('afterend', topRow);

      /* ── ALT REKLAMLAR ───────────────────────────── */

      const bottomRow = document.createElement('div');
      bottomRow.className = 'global-ad-row global-ad-row--bottom tfy-ad-row tfy-ad-row--bottom';

      bottomRow.appendChild(this.createSlot('tfy-ad-bottom-1', 'Reklam Alanı Bottom-1'));
      bottomRow.appendChild(this.createSlot('tfy-ad-bottom-2', 'Reklam Alanı Bottom-2'));
      bottomRow.appendChild(
        this.createSlot(
          'tfy-ad-bottom-3',
          'Reklam Alanı Bottom-3 (Mobil)',
          'ad-slot--mobile-only tfy-ad-slot--mobile-extra'
        )
      );

      mainContainer.insertAdjacentElement('afterend', bottomRow);

      /* ── YAN REKLAMLAR ───────────────────────────── */

      this.injectSideAd(
        'tfy-ad-left',
        'global-side-ad--left tfy-side-ad--left',
        'Reklam Alanı Sol'
      );
      this.injectSideAd(
        'tfy-ad-right',
        'global-side-ad--right tfy-side-ad--right',
        'Reklam Alanı Sağ'
      );
    },

    /**
     * Eski dashboard layout ve eski global satırları temizler
     */
    cleanupLegacyAds() {
      const dashboard = document.getElementById('dashboard');

      if (dashboard) {
        const legacyLayout = dashboard.querySelector('.dashboard-layout-with-ads');
        if (legacyLayout) {
          const legacyMain = legacyLayout.querySelector('.dashboard-main');
          const nodes = legacyMain
            ? Array.from(legacyMain.childNodes)
            : Array.from(legacyLayout.childNodes);

          dashboard.innerHTML = '';
          nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
            dashboard.appendChild(node);
          });
        }

        dashboard
          .querySelectorAll('.ad-slot, .ad-banner, .ad-container, .global-ad-row, .tfy-ad-row')
          .forEach(el => el.remove());
      }

      document
        .querySelectorAll('.global-ad-row, .ad-banner, .ad-container')
        .forEach(el => el.remove());
    },

    /**
     * Ortak slot oluşturucu
     */
    createSlot(id, label, extraClass) {
      const slot = document.createElement('div');
      slot.className = 'ad-slot tfy-ad-slot' + (extraClass ? ' ' + extraClass : '');
      slot.id = id;
      slot.dataset.adSlot = id;

      const span = document.createElement('span');
      span.className = 'ad-placeholder tfy-ad-placeholder';
      span.textContent = label;
      slot.appendChild(span);

      return slot;
    },

    /**
     * Yan reklam alanı ekler
     */
    injectSideAd(id, extraClass, label) {
      const el = document.createElement('aside');
      el.id = id;
      el.className = 'global-side-ad tfy-side-ad ' + (extraClass || '');
      el.dataset.adSlot = id;

      const span = document.createElement('span');
      span.className = 'ad-placeholder tfy-ad-placeholder';
      span.textContent = label;
      el.appendChild(span);

      document.body.appendChild(el);
    },

    /**
     * İleride adsense-manager ile slot doldurmak için helper
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

  window.TestifyAds = TestifyAds;
  TestifyAds.init();
})();
