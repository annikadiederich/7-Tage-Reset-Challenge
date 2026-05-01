/**
 * Funnel tracker — fires custom events to PixelFlow + GA4.
 *
 * Standard Meta events (Lead, Purchase, ...) are NOT routed through here —
 * they are handled by PixelFlow URL Triggers (configured in PixelFlow
 * dashboard) which fire browser fbq + CAPI with shared eventID dedup.
 *
 * For GA4 on standard events, call gtag('event', name, params) directly
 * in the page where the event happens.
 *
 * Manual usage:    window.track('purchase_challenge', { value: 29.9, currency: 'EUR' });
 * Click tracking:  <a data-track="cta_click" data-track-params='{"cta_id":"topbar_checkout"}'>...</a>
 *                  Optional userData (for CAPI matching): pass _userData on the params object.
 */
(function (w, d) {
  function track(name, params) {
    params = params || {};

    var userData = params._userData || {};
    var customData = {};
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k) && k !== '_userData') {
        customData[k] = params[k];
      }
    }

    // PixelFlow — fires fbq trackCustom (browser) + CAPI (server) with
    // automatic eventID deduplication for custom events.
    try {
      var pf = w.pixelFlow;
      if (pf && typeof pf.trackEvent === 'function') {
        pf.trackEvent(name, customData, userData);
      } else if (typeof pf === 'function') {
        pf('trackEvent', name, customData, userData);
      }
    } catch (_) {}

    // GA4
    try {
      if (typeof w.gtag === 'function') {
        w.gtag('event', name, customData);
      }
    } catch (_) {}
  }

  // Auto-bind clicks on [data-track] elements (delegated for dynamic content).
  function onClick(e) {
    var el = e.target && e.target.closest && e.target.closest('[data-track]');
    if (!el) return;

    var name = el.getAttribute('data-track');
    if (!name) return;

    var params = {};
    var raw = el.getAttribute('data-track-params');
    if (raw) {
      try { params = JSON.parse(raw); } catch (_) {}
    }

    if (el.tagName === 'A' && el.href && !params.click_url) {
      params.click_url = el.href;
    }
    if (!params.click_text) {
      var text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) params.click_text = text.slice(0, 80);
    }
    if (!params.page) {
      var path = (w.location && w.location.pathname) || '';
      params.page = path.replace(/\.html$/, '').replace(/^\/+/, '') || 'index';
    }

    track(name, params);
  }

  if (d && d.addEventListener) {
    d.addEventListener('click', onClick, true);
  }

  w.track = track;
})(window, document);
