// chat-drag.js
(function () {
  'use strict';

  function initDraggableChatWidget() {
    const widget = document.getElementById('chatWidget');
    if (!widget) return;

    const header = widget.querySelector('.chat-header');
    if (!header) return;

    // 🔒 Native HTML5 drag & drop'u tamamen kapat
    header.setAttribute('draggable', 'false');
    widget.setAttribute('draggable', 'false');

    const preventNativeDrag = (e) => {
      e.preventDefault();
      return false;
    };

    header.addEventListener('dragstart', preventNativeDrag);
    widget.addEventListener('dragstart', preventNativeDrag);

    // 🔍 Header içindeki buton / link gibi etkileşimli elemanları tespit et
    function isInteractiveElement(el) {
      if (!el) return false;
      return !!el.closest(
        'button, a, input, textarea, select, [data-chat-no-drag], .chat-header-btn'
      );
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let widgetWidth = 0;
    let widgetHeight = 0;
    const margin = 8; // Kenarlardan minimum boşluk

    function getMinTop() {
      // Varsayılan olarak ekranın en üstünden biraz boşluk bırak
      let minTop = margin;

      // Üstteki site header'ı sabitse, onun ALTINDAN başlasın
      const appHeader = document.querySelector('.header');
      if (appHeader) {
        const rect = appHeader.getBoundingClientRect();
        const style = window.getComputedStyle(appHeader);
        if (style.position === 'fixed' || style.position === 'sticky') {
          minTop = Math.max(minTop, rect.bottom + margin);
        }
      }

      return minTop;
    }

    function startDrag(clientX, clientY) {
      isDragging = true;

      // CSS tarafında imleç + animasyon kontrolü için
      widget.classList.add('chat-widget--dragging');

      const rect = widget.getBoundingClientRect();
      startX = clientX;
      startY = clientY;
      startLeft = rect.left;
      startTop = rect.top;
      widgetWidth = rect.width;
      widgetHeight = rect.height;

      // Sağ/alt konumlandırmayı bırak, top/left'e geç
      widget.style.left = rect.left + 'px';
      widget.style.top = rect.top + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';

      // Mevcut transition değerini sakla, drag sırasında kapat
      widget.dataset.prevTransition = widget.style.transition || '';
      widget.style.transition = 'none';
    }

    function updatePosition(clientX, clientY) {
      if (!isDragging) return;

      const dx = clientX - startX;
      const dy = clientY - startY;

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const minLeft = margin;
      const maxLeft = viewportWidth - widgetWidth - margin;

      const minTop = getMinTop();
      const maxTop = viewportHeight - widgetHeight - margin;

      // Soldan/sağdan taşma engeli
      if (maxLeft < minLeft) {
        newLeft = minLeft;
      } else {
        newLeft = Math.min(Math.max(minLeft, newLeft), maxLeft);
      }

      // Yukarı/aşağı taşma engeli (header'ın üstüne çıkmıyor)
      if (maxTop < minTop) {
        newTop = minTop;
      } else {
        newTop = Math.min(Math.max(minTop, newTop), maxTop);
      }

      widget.style.left = newLeft + 'px';
      widget.style.top = newTop + 'px';
    }

    function finishDrag() {
      if (!isDragging) return;
      isDragging = false;

      widget.classList.remove('chat-widget--dragging');

      // Animasyonu eski haline getir
      if (widget.dataset.prevTransition !== undefined) {
        widget.style.transition = widget.dataset.prevTransition;
        delete widget.dataset.prevTransition;
      }
    }

    // Mouse olayları
    function onMouseDown(e) {
      if (e.button !== 0) return; // sadece sol tık

      // ❗ Header içindeki X, minimize vb. butonlara tıklarken drag BAŞLATMA
      if (isInteractiveElement(e.target)) {
        return; // normal click çalışsın
      }

      e.preventDefault(); // text seçimi + native drag'i kes
      startDrag(e.clientX, e.clientY);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
      e.preventDefault();
      updatePosition(e.clientX, e.clientY);
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      finishDrag();
    }

    // Dokunmatik olaylar
    function onTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];

      // ❗ Mobilde X'e bastığında drag başlamasın; yoksa click iptal olur
      if (isInteractiveElement(e.target)) {
        return; // close/minimize butonunun kendi click'i çalışsın
      }

      e.preventDefault();
      startDrag(t.clientX, t.clientY);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
      document.addEventListener('touchcancel', onTouchEnd);
    }

    function onTouchMove(e) {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      e.preventDefault();
      updatePosition(t.clientX, t.clientY);
    }

    function onTouchEnd() {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
      finishDrag();
    }

    header.addEventListener('mousedown', onMouseDown);
    header.addEventListener('touchstart', onTouchStart, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDraggableChatWidget);
  } else {
    initDraggableChatWidget();
  }
})();
