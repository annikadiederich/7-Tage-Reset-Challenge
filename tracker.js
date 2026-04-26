/**
 * Funnel tracker — fires events to PixelFlow (browser pixel + CAPI) and GA4.
 *
 * PixelFlow's trackEvent auto-fires fbq trackCustom for custom event names,
 * but does NOT fire fbq for Meta standard events (Lead, Purchase, etc.).
 * For standard events we therefore fire fbq directly here, and rely on
 * shared eventID deduplication between browser pixel and PixelFlow CAPI.
 *
 * Usage: window.track('Lead', { content_name: 'Foo' });
 * Optional userData (for CAPI matching): pass _userData on the params object.
 */
(function (w) {
  var META_STANDARD = {
    Purchase: 1, Lead: 1, CompleteRegistration: 1, AddToCart: 1,
    InitiateCheckout: 1, ViewContent: 1, Search: 1, AddPaymentInfo: 1,
    Contact: 1, Subscribe: 1
  };

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

    // 1) Browser pixel — only for standard events. Custom events are fired
    //    by PixelFlow's trackEvent automatically; firing manually would dupe.
    try {
      if (META_STANDARD[name] && typeof w.fbq === 'function') {
        w.fbq('track', name, params, { eventID: eventId });
      }
    } catch (_) {}

    // 2) PixelFlow — fires CAPI (and fbq trackCustom for custom names).
    try {
      var pf = w.pixelFlow;
      if (pf && typeof pf.trackEvent === 'function') {
        pf.trackEvent(name, customData, userData);
      } else if (typeof pf === 'function') {
        pf('trackEvent', name, customData, userData);
      }
    } catch (_) {}

    // 3) GA4
    try {
      if (typeof w.gtag === 'function') {
        w.gtag('event', name, customData);
      }
    } catch (_) {}
  }

  w.track = track;
})(window);
