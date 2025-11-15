/**
 * ═══════════════════════════════════════════════════════════════════════
 * TESTFY CHAT WIDGET - SAFE DRAG SYSTEM v3.0
 * ═══════════════════════════════════════════════════════════════════════
 * Sorunlar:
 * - Widget ekranda görünmüyor ✅ FIX
 * - Butonlar çalışmıyor ✅ FIX
 * - Position değerleri bozuluyor ✅ FIX
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

      // State
      this.state = {
        isDragging: false,
        hasMoved: false,  // Widget hareket ettirildi mi?
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
        pointerId: null
      };

      // Config
      this.config = {
        margin: 8,
        dragThreshold: 5 // px - bu mesafeden az = click, çok = drag
      };

      this.init();
    }

    init() {
      // Native drag'i kapat
      this.header.setAttribute('draggable', 'false');
      this.widget.setAttribute('draggable', 'false');
      
      this.header.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });

      // Pointer events
      this.header.addEventListener('pointerdown', this.handlePointerDown.bind(this));
      
      this.boundPointerMove = this.handlePointerMove.bind(this);
      this.boundPointerUp = this.handlePointerUp.bind(this);
      this.boundPointerCancel = this.handlePointerCancel.bind(this);

      // Widget'ın başlangıç pozisyonunu kontrol et
      this.checkInitialPosition();

      console.log('✅ Testfy Chat Drag v3.0 - Widget pozisyonu güvende');
    }

    /**
     * Widget'ın başlangıç pozisyonunu kontrol et ve düzelt
     */
    checkInitialPosition() {
      const computed = window.getComputedStyle(this.widget);
      const hasInlinePosition = this.widget.style.left || this.widget.style.top;

      // Eğer inline style varsa VE widget hareket ettirilmemişse, temizle
      if (hasInlinePosition && !this.state.hasMoved) {
        console.log('🔧 Widget pozisyonu temizleniyor (inline style kaldırılıyor)');
        this.widget.style.left = '';
        this.widget.style.top = '';
        this.widget.style.right = '';
        this.widget.style.bottom = '';
      }

      // Widget'ın ekranda görünür olduğundan emin ol
      const rect = this.widget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('⚠️ Widget boyutu 0, CSS sorun olabilir');
      }

      if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
        console.warn('⚠️ Widget ekran dışında! Pozisyon sıfırlanıyor...');
        this.resetPosition();
      }
    }

    /**
     * Widget'ı varsayılan pozisyona döndür
     */
    resetPosition() {
      this.widget.style.left = '';
      this.widget.style.top = '';
      this.widget.style.right = '1.5rem';
      this.widget.style.bottom = '5rem';
      this.state.hasMoved = false;
    }

    /**
     * İnteraktif element kontrolü - 4 katmanlı
     */
    isInteractiveElement(target) {
      if (!target) return false;

      // 1. Tag kontrolü
      const interactiveTags = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
      if (interactiveTags.includes(target.tagName)) {
        return true;
      }

      // 2. ID kontrolü (direkt buton ID'leri)
      if (target.id === 'chatMinimizeBtn' || 
          target.id === 'chatCloseBtn' || 
          target.id === 'chatExpandBtn') {
        return true;
      }

      // 3. Attribute kontrolü
      if (target.hasAttribute('data-no-drag') ||
          target.hasAttribute('data-chat-no-drag')) {
        return true;
      }

      // 4. Class kontrolü
      const classList = target.className;
      if (typeof classList === 'string') {
        if (/\b(btn|button|chat-header-btn|close|minimize|expand)\b/i.test(classList)) {
          return true;
        }
      }

      // 5. Closest kontrolü (parent'larda ara)
      const closest = target.closest(
        'button, a, input, textarea, select, label, ' +
        '.chat-header-btn, .chat-header-actions, ' +
        '#chatMinimizeBtn, #chatCloseBtn, #chatExpandBtn'
      );

      return !!closest;
    }

    /**
     * Viewport constraints
     */
    getConstraints() {
      const rect = this.widget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let minTop = this.config.margin;

      // Header check
      const appHeader = document.querySelector('.header');
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
        maxTop: Math.max(minTop, viewportHeight - rect.height - this.config.margin)
      };
    }

    /**
     * Pointer down handler
     */
    handlePointerDown(e) {
      if (!e.isPrimary) return;

      // ⚠️ KRİTİK: İnteraktif element kontrolü
      if (this.isInteractiveElement(e.target)) {
        // HİÇBİR ŞEY YAPMA - buton normal çalışsın
        return;
      }

      // Pointer capture
      try {
        this.header.setPointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }

      // State başlat
      this.state.pointerId = e.pointerId;
      this.state.startX = e.clientX;
      this.state.startY = e.clientY;
      this.state.isDragging = false; // Henüz drag başlamadı

      // Mevcut pozisyonu al
      const rect = this.widget.getBoundingClientRect();
      this.state.startLeft = rect.left;
      this.state.startTop = rect.top;

      // Transition'ı kaldır
      this.state.prevTransition = this.widget.style.transition || '';
      this.widget.style.transition = 'none';

      // Global listeners
      document.addEventListener('pointermove', this.boundPointerMove);
      document.addEventListener('pointerup', this.boundPointerUp);
      document.addEventListener('pointercancel', this.boundPointerCancel);

      // ⚠️ ÖNEMLİ: Henüz position değiştirme
    }

    /**
     * Pointer move handler - threshold kontrolü ile
     */
    handlePointerMove(e) {
      if (this.state.pointerId !== e.pointerId) return;

      const dx = e.clientX - this.state.startX;
      const dy = e.clientY - this.state.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Threshold kontrolü
      if (!this.state.isDragging) {
        if (distance < this.config.dragThreshold) {
          // Henüz yeterince hareket yok
          return;
        }

        // ✅ Threshold aşıldı - ŞIMDI drag başlıyor
        this.state.isDragging = true;
        this.state.hasMoved = true;
        
        // UI state
        this.widget.classList.add('chat-widget--dragging');
        this.header.classList.add('dragging');

        // ✅ ŞIMDI position'u left/top'a çevir
        this.widget.style.left = this.state.startLeft + 'px';
        this.widget.style.top = this.state.startTop + 'px';
        this.widget.style.right = 'auto';
        this.widget.style.bottom = 'auto';
      }

      // Drag devam ediyor
      if (this.state.isDragging) {
        e.preventDefault();

        const constraints = this.getConstraints();
        
        let newLeft = this.state.startLeft + dx;
        let newTop = this.state.startTop + dy;

        // Constraints
        newLeft = Math.max(constraints.minLeft, Math.min(newLeft, constraints.maxLeft));
        newTop = Math.max(constraints.minTop, Math.min(newTop, constraints.maxTop));

        // Position güncelle
        this.widget.style.left = newLeft + 'px';
        this.widget.style.top = newTop + 'px';
      }
    }

    /**
     * Pointer up handler
     */
    handlePointerUp(e) {
      if (this.state.pointerId !== e.pointerId) return;
      this.cleanup();
    }

    /**
     * Pointer cancel handler
     */
    handlePointerCancel(e) {
      if (this.state.pointerId !== e.pointerId) return;
      this.cleanup();
    }

    /**
     * Cleanup
     */
    cleanup() {
      // Pointer capture release
      try {
        if (this.state.pointerId !== null) {
          this.header.releasePointerCapture(this.state.pointerId);
        }
      } catch (err) {
        // ignore
      }

      // Listeners kaldır
      document.removeEventListener('pointermove', this.boundPointerMove);
      document.removeEventListener('pointerup', this.boundPointerUp);
      document.removeEventListener('pointercancel', this.boundPointerCancel);

      // UI state temizle
      if (this.state.isDragging) {
        this.widget.classList.remove('chat-widget--dragging');
        this.header.classList.remove('dragging');
      }

      // Transition geri getir
      if (this.state.prevTransition !== undefined) {
        this.widget.style.transition = this.state.prevTransition;
      }

      // State reset
      this.state.isDragging = false;
      this.state.pointerId = null;
    }

    /**
     * Destroy
     */
    destroy() {
      this.cleanup();
      this.header.removeEventListener('pointerdown', this.handlePointerDown);
      this.resetPosition();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  function init() {
    // Küçük bir gecikme ile başlat (DOM tam yüklensin)
    setTimeout(() => {
      const chatWidget = new DraggableChatWidget('chatWidget');
      window.chatWidgetDragController = chatWidget;

      // Debug bilgisi
      const widget = document.getElementById('chatWidget');
      if (widget) {
        const rect = widget.getBoundingClientRect();
        console.log('📍 Widget Pozisyonu:', {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        });
      }

      console.log('✅ Testfy Chat Drag v3.0 - Safe & Tested');
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
