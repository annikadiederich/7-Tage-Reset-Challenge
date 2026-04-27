/**
 * Funnel tracker — fires events to PixelFlow and GA4 (gtag).
 *
 * PixelFlow handles BOTH browser fbq AND Conversions API (with eventID dedup),
 * for standard events (Lead, Purchase, ...) AND custom events. We therefore
 * NEVER call fbq directly here — that would create a duplicate browser event.
 *
 * Usage: window.track('Lead', { content_name: 'Foo' });
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

    var userData = params._userData || {};
    var customData = {};
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k) && k !== '_userData') {
        customData[k] = params[k];
      }
    }
    customData.eventID = eventId;

    // PixelFlow — fires browser fbq + CAPI with shared eventID dedup.
    try {
      var pf = w.pixelFlow;
      if (pf && typeof pf.trackEvent === 'function') {
        pf.trackEvent(name, customData, userData);
      } else if (typeof pf === 'function') {
        // Queue path — pfm.js processes once loaded.
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
