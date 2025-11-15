// chat-bridge.v11.js
// TESTFY FLOATING CHAT WIDGET - v11
// TestifyAI (Ultimate Teacher) ile entegre sohbet köprüsü

(function (window, document) {
  'use strict';

  const ChatBridge = {
    ai: null,
    widget: null,
    wrapper: null,
    header: null,
    toggleBtn: null,
    minimizeBtn: null,
    closeBtn: null,
    input: null,
    sendBtn: null,
    chat: null,
    aiReady: false,

    dragState: {
      active: false,
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0,
      pointerId: null
    },

    init() {
      this.widget = document.getElementById('chatWidget');
      this.wrapper = document.querySelector('.chat-widget-wrapper');
      this.header = this.widget ? this.widget.querySelector('.chat-header') : null;
      this.toggleBtn = document.getElementById('chatToggleBtn');
      this.minimizeBtn = document.getElementById('chatMinimizeBtn');
      this.closeBtn = document.getElementById('chatCloseBtn');
      this.input = document.getElementById('aiInput');
      this.sendBtn = document.getElementById('aiSendBtn');
      this.chat = document.getElementById('aiChat');

      if (!this.widget || !this.input || !this.sendBtn || !this.chat) {
        console.warn('[ChatBridge] Gerekli DOM elemanları bulunamadı');
        return;
      }

      this.ai = window.TestifyAI || null;
      window.ChatBridge = this; // debug için

      this.bindUI();
      this.setupDrag();
      this.ensureAIReady();
    },

    // ──────────────────────────────────────────────
    // UI EVENTLERİ
    // ──────────────────────────────────────────────
    bindUI() {
      const self = this;

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', function () {
          self.toggleWidget();
        });
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', function () {
          self.closeWidget();
        });
      }

      if (this.minimizeBtn) {
        this.minimizeBtn.addEventListener('click', function () {
          self.toggleMinimize();
        });
      }

      this.sendBtn.addEventListener('click', function () {
        self.handleSend();
      });

      this.input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          self.handleSend();
        }
      });
    },

    // ──────────────────────────────────────────────
    // SÜRÜKLE-BIRAK (DRAG) – SADECE HEADER'DAN
    // ──────────────────────────────────────────────
    setupDrag() {
      if (!this.header || !this.widget) return;

      const state = this.dragState;
      const header = this.header;
      const widget = this.widget;
      const self = this;

      header.style.cursor = 'move';

      header.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return; // sadece sol tık
        if (e.target.closest('.chat-header-btn')) return; // butonlara tıklamayı engelleme

        const rect = widget.getBoundingClientRect();
        state.active = true;
        state.pointerId = e.pointerId;
        state.offsetX = e.clientX - rect.left;
        state.offsetY = e.clientY - rect.top;
        state.width = rect.width;
        state.height = rect.height;

        header.setPointerCapture(e.pointerId);
      });

      header.addEventListener('pointermove', function (e) {
        if (!state.active || state.pointerId !== e.pointerId) return;

        let left = e.clientX - state.offsetX;
        let top = e.clientY - state.offsetY;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 8;

        if (left < margin) left = margin;
        if (top < margin) top = margin;
        if (left + state.width + margin > vw) {
          left = vw - state.width - margin;
        }
        if (top + state.height + margin > vh) {
          top = vh - state.height - margin;
        }

        widget.style.left = left + 'px';
        widget.style.top = top + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
      });

      const stopDrag = function (e) {
        if (!state.active || (e && state.pointerId !== e.pointerId)) return;
        state.active = false;
        try {
          if (header.hasPointerCapture(state.pointerId)) {
            header.releasePointerCapture(state.pointerId);
          }
        } catch (_) {}
        state.pointerId = null;
      };

      header.addEventListener('pointerup', stopDrag);
      header.addEventListener('pointercancel', stopDrag);
    },

    // ──────────────────────────────────────────────
    // AI MODÜLÜ KONTROLÜ
    // ──────────────────────────────────────────────
    ensureAIReady() {
      if (!this.ai) {
        this.showSystemError(
          '❌ Sistem Hatası\n\n' +
          'Master Teacher AI modülü yüklenemedi (TestifyAI bulunamadı).\n' +
          'Lütfen "testify-core.js" ve "testify-ai.js" dosyalarının sayfada yüklü olduğundan emin olun.'
        );
        return;
      }

      if (
        typeof this.ai.addMessage !== 'function' ||
        typeof this.ai.generateTestFromAI !== 'function'
      ) {
        this.showSystemError(
          '❌ Sistem Hatası\n\n' +
          'Master Teacher AI modülü eksik veya hatalı.\n' +
          'TestifyAI.addMessage ve TestifyAI.generateTestFromAI fonksiyonlarının tanımlı olduğundan emin olun.'
        );
        return;
      }

      this.aiReady = true;

      // Başlangıç karşılama mesajı
      if (typeof this.ai.systemCheck === 'function') {
        try {
          const info = this.ai.systemCheck();
          const engine =
            (info && (info.engine || info.model || info.engineVersion)) ||
            'Master Teacher AI';

          this.ai.addMessage(
            'Merhaba, ben Testfy Master Teacher. 🎓\n\n' +
            'Senin için sınav formatında, açıklamalı ve pedagojik sorular hazırlayabilirim.\n' +
            'Model: ' + engine + '\n\n' +
            'Ne tür bir test istiyorsun?\n' +
            'Örnek: "Programlama temelleri vize için 20 soru hazırla"',
            'ai'
          );
        } catch (e) {
          console.warn('[ChatBridge] systemCheck hata:', e);
          this.ai.addMessage(
            'Merhaba, ben Testfy Master Teacher. 🎓\n\n' +
            'Bana "Şu ders için şu kadar soru" şeklinde yaz, senin için tam açıklamalı bir test oluşturayım.\n' +
            'Örnek: "İşletim sistemleri 1. vize için 15 soru"',
            'ai'
          );
        }
      } else {
        this.ai.addMessage(
          'Merhaba, ben Testfy Master Teacher. 🎓\n\n' +
          'Bana istediğin testi doğal cümleyle yaz;\n' +
          'örneğin: "Programlama temelleri 1. ders için vizeye yönelik 20 soru hazırla".',
          'ai'
        );
      }
    },

    // ──────────────────────────────────────────────
    // SİSTEM HATASI / MESAJLAR
    // ──────────────────────────────────────────────
    showSystemError(message) {
      console.error('[ChatBridge] ' + message);
      this.aiReady = false;

      if (this.input) this.input.disabled = true;
      if (this.sendBtn) this.sendBtn.disabled = true;

      this.appendSystemMessage(message);
    },

    appendSystemMessage(text) {
      if (!this.chat) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'ai-message ai-message--ai';

      const bubble = document.createElement('div');
      bubble.className = 'message-bubble message-bubble--ai';

      const body = document.createElement('div');
      body.className = 'message-content';
      body.innerHTML = this.escapeHTML(text).replace(/\n/g, '<br>');

      bubble.appendChild(body);
      wrapper.appendChild(bubble);
      this.chat.appendChild(wrapper);
      this.chat.scrollTop = this.chat.scrollHeight;
    },

    escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    // ──────────────────────────────────────────────
    // WIDGET AÇ / KAPA / MİNİMİZE
    // ──────────────────────────────────────────────
    toggleWidget() {
      if (!this.widget) return;
      const isOpen = this.widget.classList.contains('chat-widget--open');

      if (isOpen) {
        this.widget.classList.remove('chat-widget--open');
        this.widget.setAttribute('aria-hidden', 'true');
      } else {
        this.widget.classList.add('chat-widget--open');
        this.widget.classList.remove('chat-widget--minimized');
        this.widget.setAttribute('aria-hidden', 'false');
      }
    },

    closeWidget() {
      if (!this.widget || !this.toggleBtn) return;
      this.widget.classList.remove('chat-widget--open');
      this.widget.setAttribute('aria-hidden', 'true');
      this.toggleBtn.classList.remove('chat-toggle-btn--hidden');
    },

    toggleMinimize() {
      if (!this.widget) return;
      this.widget.classList.toggle('chat-widget--minimized');
    },

    // ──────────────────────────────────────────────
    // MESAJ GÖNDERME
    // ──────────────────────────────────────────────
    handleSend() {
      if (!this.input) return;
      const text = this.input.value.trim();
      if (!text) return;

      this.addUserMessage(text);
      this.input.value = '';
      this.routeToAI(text);
    },

    addUserMessage(text) {
      if (this.ai && typeof this.ai.addMessage === 'function') {
        this.ai.addMessage(text, 'user');
        return;
      }

      // Fallback (normalde buraya düşmez)
      if (!this.chat) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'ai-message ai-message--user';

      const bubble = document.createElement('div');
      bubble.className = 'message-bubble message-bubble--user';

      const body = document.createElement('div');
      body.className = 'message-content';
      body.innerHTML = this.escapeHTML(text).replace(/\n/g, '<br>');

      bubble.appendChild(body);
      wrapper.appendChild(bubble);
      this.chat.appendChild(wrapper);
      this.chat.scrollTop = this.chat.scrollHeight;
    },

    // ──────────────────────────────────────────────
    // KOMUTLAR & AI YÖNLENDİRME
    // ──────────────────────────────────────────────
    routeToAI(text) {
      if (!this.aiReady) {
        this.appendSystemMessage(
          'Sistem hazır görünmüyor. Lütfen sayfayı yenileyip tekrar deneyin.'
        );
        return;
      }

      if (text.startsWith('/')) {
        const handled = this.handleCommand(text);
        if (!handled && this.ai && typeof this.ai.addMessage === 'function') {
          this.ai.addMessage(
            'Kullanılabilir komutlar:\n' +
            '/sil     → Sohbeti temizle\n' +
            '/sistem  → Sistem bilgisini göster (varsa)\n' +
            '/arşiv   → Oluşturulan test arşivini göster (varsa)\n' +
            '/yardım  → Bu yardım mesajını göster',
            'ai'
          );
        }
        return;
      }

      if (!this.ai || typeof this.ai.generateTestFromAI !== 'function') {
        this.showSystemError(
          '❌ Sistem Hatası\n\n' +
          'Test oluşturma fonksiyonu bulunamadı (TestifyAI.generateTestFromAI).\n' +
          'Lütfen testify-ai entegrasyonunu kontrol edin.'
        );
        return;
      }

      try {
        // Asıl büyü burada: Ultimate Teacher AI devreye giriyor
        this.ai.generateTestFromAI(text);
      } catch (e) {
        console.error('[ChatBridge] generateTestFromAI hatası:', e);
        this.appendSystemMessage(
          '❌ Test oluşturulurken bir hata oluştu.\n\n' +
          'Hata: ' + (e.message || e.toString())
        );
      }
    },

    handleCommand(text) {
      const cmd = text.split(/\s+/)[0].toLowerCase();

      // /sil → sohbet temizle
      if (cmd === '/sil' || cmd === '/clear') {
        if (this.ai && typeof this.ai.clearChat === 'function') {
          this.ai.clearChat();
        } else if (this.chat) {
          this.chat.innerHTML = '';
        }
        return true;
      }

      // /sistem → systemCheck (varsa)
      if (cmd === '/sistem' || cmd === '/system') {
        if (this.ai && typeof this.ai.systemCheck === 'function') {
          try {
            const info = this.ai.systemCheck();
            const pretty = this.escapeHTML(
              JSON.stringify(info, null, 2)
            ).replace(/\n/g, '<br>');
            this.ai.addMessage(
              'Sistem Bilgisi:\n\n' +
              '<pre style="font-size:0.75rem; white-space:pre-wrap;">' +
              pretty +
              '</pre>',
              'ai'
            );
          } catch (e) {
            this.ai.addMessage(
              'Sistem bilgisi alınamadı: ' + (e.message || e.toString()),
              'ai'
            );
          }
        } else {
          this.appendSystemMessage(
            'Sistem bilgisi özelliği bu sürümde tanımlı değil.'
          );
        }
        return true;
      }

      // /arşiv → getArchive (varsa)
      if (cmd === '/arşiv' || cmd === '/arsiv' || cmd === '/archive') {
        if (this.ai && typeof this.ai.getArchive === 'function') {
          try {
            const list = this.ai.getArchive() || [];
            if (!list.length) {
              this.ai.addMessage(
                'Henüz kayıtlı bir test arşivi yok.',
                'ai'
              );
            } else {
              const lines = list.slice(0, 20).map((item, idx) => {
                const date = item.timestamp
                  ? new Date(item.timestamp).toLocaleString('tr-TR')
                  : '';
                const title = item.title || 'İsimsiz test';
                const count =
                  typeof item.questionCount === 'number'
                    ? item.questionCount
                    : '?';
                const diff = item.difficulty || 'belirsiz';
                return (
                  `${idx + 1}. ${title} (${count} soru, ${diff})` +
                  (date ? ` - ${date}` : '')
                );
              });

              this.ai.addMessage(
                '📚 Son oluşturulan testler:\n\n' +
                lines.join('\n'),
                'ai'
              );
            }
          } catch (e) {
            this.ai.addMessage(
              'Arşiv okunamadı: ' + (e.message || e.toString()),
              'ai'
            );
          }
        } else {
          this.appendSystemMessage(
            'Arşiv özelliği bu sürümde tanımlı değil.'
          );
        }
        return true;
      }

      // /yardım
      if (cmd === '/yardım' || cmd === '/help') {
        if (this.ai && typeof this.ai.addMessage === 'function') {
          this.ai.addMessage(
            'Testfy Master Teacher komutları:\n\n' +
            '• Sıradan bir yazı → Senin için test isteği kabul edilir\n' +
            '   Örnek: "Programlama temelleri vize için 20 soru hazırla"\n\n' +
            '• /sil    → Sohbet geçmişini temizler\n' +
            '• /sistem → Sistem durumunu gösterir (varsa)\n' +
            '• /arşiv  → Son oluşturulan testlerin özetini gösterir (varsa)\n',
            'ai'
          );
        }
        return true;
      }

      return false;
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    ChatBridge.init();
  });

})(window, document);
