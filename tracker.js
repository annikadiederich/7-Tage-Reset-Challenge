/**
 * Funnel tracker — fires the same event to PixelFlow and GA4 (gtag).
 *
 * PixelFlow handles BOTH Meta Pixel (browser fbq) AND Conversions API
 * (server-side) for the same call, with built-in deduplication via eventID.
 * That means we should NOT also call fbq directly — PixelFlow does it.
 *
 * Usage: window.track('Lead', { content_name: 'Foo', value: 0, currency: 'EUR' });
 * Optional userData (for CAPI matching): pass _userData on the params object.
 */
(function (w) {
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function track(name, params) {
    params = params || {};
    var eventId = params.eventID || uuid();

    // Separate userData (PII for CAPI matching) from customData (event data).
    var userData = params._userData || {};
    var customData = {};
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k) && k !== '_userData') {
        customData[k] = params[k];
      }
    }
    customData.eventID = eventId;

    // 1) PixelFlow — fires Meta Pixel (browser) + Conversions API (server),
    //    deduplicated automatically. The pfm.js queue accepts method calls
    //    before initialization; once loaded it processes them.
    try {
      var pf = w.pixelFlow;
      if (pf && typeof pf.trackEvent === 'function') {
        pf.trackEvent(name, customData, userData);
      } else if (typeof pf === 'function') {
        // Queue path — pfm.js will call window.pixelFlow.trackEvent(...)
        // with these args once it finishes loading.
        pf('trackEvent', name, customData, userData);
      }
    } catch (_) {}

    // 2) GA4 (gtag) — independent, server-to-server via Google.
    try {
      if (typeof w.gtag === 'function') {
        w.gtag('event', name, customData);
      }
    } catch (_) {}
  }

  w.track = track;
})(window);
