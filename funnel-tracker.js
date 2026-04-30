/* ==============================================
   FUNNEL TRACKER — In jede HTML-Seite einbauen
   <script src="/funnel-tracker.js"></script>
   ============================================== */

(function () {
  'use strict';

  // ── Konfiguration ──────────────────────────────
  const ENDPOINT = '/api/track';

  // Seiten-Namen aus URL ermitteln
  const pageName = (function () {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '') || 'index';
    return file;
  })();

  // Session-ID (bleibt pro Browser-Session gleich)
  function getSessionId() {
    let id = sessionStorage.getItem('_fid');
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('_fid', id);
    }
    return id;
  }

  const sessionId = getSessionId();
  const pageStart = Date.now();

  // ── Event senden ───────────────────────────────
  function send(type, extra) {
    const payload = Object.assign({
      type,
      page: pageName,
      sessionId,
      timestamp: Date.now(),
      referrer: document.referrer || '',
      ua: navigator.userAgent,
    }, extra || {});

    // fetch mit keepalive für exit-events
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(function () {});
    } catch (e) {}
  }

  // ── Page View ──────────────────────────────────
  send('page_view');

  // ── Scroll-Tiefe ───────────────────────────────
  var maxScroll = 0;
  var scrollTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var pct = Math.round(
        (window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)) * 100
      );
      if (pct > maxScroll + 15) {
        maxScroll = pct;
        send('scroll', { percent: pct });
      }
    }, 300);
  }, { passive: true });

  // ── Exit / Verlassen ───────────────────────────
  window.addEventListener('beforeunload', function () {
    send('exit', {
      timeOnPage: Math.round((Date.now() - pageStart) / 1000),
      scrollDepth: maxScroll,
    });
  });

  // ── Quiz-Tracking API (global verfügbar) ───────
  // Aufruf: FunnelTracker.quizAnswer(questionId, questionText, answer)
  window.FunnelTracker = {
    quizAnswer: function (questionId, questionText, answer) {
      send('quiz_answer', {
        questionId: questionId,
        questionText: questionText,
        answer: answer,
      });
    },
    conversion: function (product, value) {
      send('conversion', { product: product, value: value });
    },
    customEvent: function (name, data) {
      send('custom', Object.assign({ name: name }, data || {}));
    },
  };

})();
