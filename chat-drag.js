/**
 * ═══════════════════════════════════════════════════════════════════════
 * TESTFY CHAT WIDGET - ADVANCED DRAG SYSTEM
 * Pointer Events API + Threshold-based Drag Detection
 * ═══════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  class DraggableChatWidget {
    constructor(widgetId) {
      this.widget = document.getElementById(widgetId);
      if (!this.widget) {
        console.warn(`⚠️ Chat widget bulunamadı: #${widgetId}`);
        return;
      }

      this.header = this.widget.querySelector('.chat-header');
      if (!this.header) {
        console.warn('⚠️ Chat header bulunamadı (.chat-header)');
        return;
      }

      // State management
      this.state = {
        isDragging: false,
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
        currentX: 0,
        currentY: 0,
        pointerId: null
      };

      // Configuration
      this.config = {
        margin: 8,
        dragThreshold: 5, // px - küçük hareketler = click, büyük = drag
        preventDefaultOnDrag: true
      };

      this.init();
    }

    init() {
      // Native HTML5 drag'i tamamen devre dışı
      this.header.setAttribute('draggable', 'false');
      this.widget.setAttribute('draggable', 'false');
      
      this.header.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });

      // Pointer Events API - tüm input türlerini yakalar
      this.header.addEventListener('pointerdown', this.handlePointerDown.bind(this));
      
      // Global listener'lar (lazy binding - sadece drag'de aktif)
      this.boundPointerMove = this.handlePointerMove.bind(this);
      this.boundPointerUp = this.handlePointerUp.bind(this);
      this.boundPointerCancel = this.handlePointerCancel.bind(this);

      console.log('✅ Testfy Chat Widget - Drag sistemi hazır');
    }

    /**
     * Etkileşimli elementleri tespit et - 4 katmanlı kontrol
     */
    isInteractiveElement(target) {
      if (!target) return false;

      // 1. DIRECT TAG CHECK (en hızlı)
      const interactiveTags = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
      if (interactiveTags.includes(target.tagName)) {
        return true;
      }

      // 2. ATTRIBUTE CHECK
      if (
        target.hasAttribute('data-no-drag') ||
        target.hasAttribute('data-chat-no-drag') ||
        target.hasAttribute('data-ai-close') ||
        target.hasAttribute('data-ai-minimize') ||
        target.hasAttribute('data-ai-expand') ||
        target.id === 'chatMinimizeBtn' ||
        target.id === 'chatCloseBtn' ||
        target.id === 'chatExpandBtn'
      ) {
        return true;
      }

      // 3. CLASS CHECK (regex ile tüm varyasyonlar)
      const classList = target.className;
      if (typeof classList === 'string') {
        const interactiveClasses = [
          'btn', 'button', 'close', 'minimize', 'maximize', 'expand',
          'chat-header-btn', 'header-action', 'chat-header-actions'
        ];
        
        const hasInteractiveClass = interactiveClasses.some(cls => 
          new RegExp(`\\b${cls}\\b`, 'i').test(classList)
        );
        
        if (hasInteractiveClass) return true;
      }

      // 4. CLOSEST CHECK (parent'larda ara - en kapsamlı)
      const closest = target.closest(
        'button, a, input, textarea, select, label, ' +
        '[data-no-drag], [data-chat-no-drag], ' +
        '[data-ai-close], [data-ai-minimize], [data-ai-expand], ' +
        '.btn, .button, .close-btn, .minimize-btn, .expand-btn, ' +
        '.chat-header-btn, .header-action, .chat-header-actions, ' +
        '#chatMinimizeBtn, #chatCloseBtn, #chatExpandBtn'
      );

      return !!closest;
    }

    /**
     * Viewport sınırlarını hesapla (dynamic header dikkate alınarak)
     */
    getConstraints() {
      const rect = this.widget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let minTop = this.config.margin;

      // Sticky/fixed header varsa onun altından başlat
      const appHeader = document.querySelector('.header, header, .site-header, .navbar');
      if (appHeader) {
        const headerRect = appHeader.getBoundingClientRect();
        const headerStyle = window.getComputedStyle(appHeader);
        
        if (headerStyle.position === 'fixed' || headerStyle.position === 'sticky') {
          minTop = Math.max(minTop, headerRect.bottom + this.config.margin);
        }
      }

      return {
        minLeft: this.config.margin,
        maxLeft: Math.max(this.config.margin, viewportWidth - rect.width - this.config.margin),
        minTop: minTop,
        maxTop: Math.max(minTop, viewportHeight - rect.height - this.config.margin),
        widgetWidth: rect.width,
        widgetHeight: rect.height
      };
    }

    /**
     * Pointer down - potansiyel drag başlangıcı
     */
    handlePointerDown(e) {
      // Sadece birincil pointer (sol tık / ilk parmak)
      if (!e.isPrimary) return;

      // ⚠️ KRİTİK: İnteraktif elemente tıklandıysa HEMEN çık
      if (this.isInteractiveElement(e.target)) {
        // preventDefault ÇAĞRILMAZ - buton normal çalışır
        return;
      }

      // Pointer'ı yakala
      try {
        this.header.setPointerCapture(e.pointerId);
      } catch (err) {
        // setPointerCapture bazı tarayıcılarda hata verebilir
      }

      this.state.pointerId = e.pointerId;
      this.state.startX = e.clientX;
      this.state.startY = e.clientY;
      this.state.currentX = e.clientX;
      this.state.currentY = e.clientY;

      const rect = this.widget.getBoundingClientRect();
      this.state.startLeft = rect.left;
      this.state.startTop = rect.top;

      // Pozisyonlandırmayı right/bottom'dan left/top'a çevir
      this.widget.style.left = rect.left + 'px';
      this.widget.style.top = rect.top + 'px';
      this.widget.style.right = 'auto';
      this.widget.style.bottom = 'auto';

      // Transition'ı kaldır (smooth drag için)
      this.state.prevTransition = this.widget.style.transition || '';
      this.widget.style.transition = 'none';

      // Global listener'ları ekle
      document.addEventListener('pointermove', this.boundPointerMove);
      document.addEventListener('pointerup', this.boundPointerUp);
      document.addEventListener('pointercancel', this.boundPointerCancel);

      // Henüz preventDefault ÇAĞRILMAZ - threshold kontrolü yapacağız
    }

    /**
     * Pointer move - threshold kontrolü ile akıllı drag
     */
    handlePointerMove(e) {
      if (this.state.pointerId !== e.pointerId) return;

      this.state.currentX = e.clientX;
      this.state.currentY = e.clientY;

      const dx = this.state.currentX - this.state.startX;
      const dy = this.state.currentY - this.state.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // THRESHOLD KONTROLÜ
      if (!this.state.isDragging) {
        if (distance < this.config.dragThreshold) {
          // Henüz yeterince hareket yok - bu bir click olabilir
          return;
        }

        // Threshold aşıldı - ŞIMDI drag başlıyor
        this.state.isDragging = true;
        this.widget.classList.add('chat-widget--dragging');
        this.header.classList.add('dragging');

        // ŞIMDI preventDefault çağır
        if (this.config.preventDefaultOnDrag) {
          e.preventDefault();
        }
      }

      // Drag devam ediyor
      if (this.state.isDragging) {
        e.preventDefault();

        const constraints = this.getConstraints();
        
        let newLeft = this.state.startLeft + dx;
        let newTop = this.state.startTop + dy;

        // Sınırlama uygula
        newLeft = Math.max(constraints.minLeft, Math.min(newLeft, constraints.maxLeft));
        newTop = Math.max(constraints.minTop, Math.min(newTop, constraints.maxTop));

        // Position güncelle
        this.widget.style.left = newLeft + 'px';
        this.widget.style.top = newTop + 'px';
      }
    }

    /**
     * Pointer up - drag bitişi
     */
    handlePointerUp(e) {
      if (this.state.pointerId !== e.pointerId) return;
      this.cleanup();
    }

    /**
     * Pointer cancel - drag iptal
     */
    handlePointerCancel(e) {
      if (this.state.pointerId !== e.pointerId) return;
      this.cleanup();
    }

    /**
     * Temizlik ve state reset
     */
    cleanup() {
      // Pointer capture'ı serbest bırak
      try {
        if (this.state.pointerId !== null) {
          this.header.releasePointerCapture(this.state.pointerId);
        }
      } catch (err) {
        // ignore
      }

      // Global listener'ları kaldır
      document.removeEventListener('pointermove', this.boundPointerMove);
      document.removeEventListener('pointerup', this.boundPointerUp);
      document.removeEventListener('pointercancel', this.boundPointerCancel);

      // UI state temizle
      if (this.state.isDragging) {
        this.widget.classList.remove('chat-widget--dragging');
        this.header.classList.remove('dragging');
      }

      // Transition'ı geri getir
      if (this.state.prevTransition !== undefined) {
        this.widget.style.transition = this.state.prevTransition;
      }

      // State reset
      this.state.isDragging = false;
      this.state.pointerId = null;
      this.state.startX = 0;
      this.state.startY = 0;
      this.state.currentX = 0;
      this.state.currentY = 0;
    }

    /**
     * Destroy - cleanup
     */
    destroy() {
      this.cleanup();
      this.header.removeEventListener('pointerdown', this.handlePointerDown);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  function init() {
    const chatWidget = new DraggableChatWidget('chatWidget');
    
    // Global scope'a expose et
    window.chatWidgetDragController = chatWidget;

    console.log('✅ Testfy Chat Drag System v2.0 - Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
