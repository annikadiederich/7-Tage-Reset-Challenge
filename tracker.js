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
 * Usage: window.track('purchase_challenge', { value: 29.9, currency: 'EUR' });
 * Optional userData (for CAPI matching): pass _userData on the params object.
 */
(function (w) {
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

  w.track = track;
})(window);
