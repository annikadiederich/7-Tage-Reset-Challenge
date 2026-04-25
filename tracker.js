/**
 * Funnel tracker — fires the same event to PixelFlow, Meta Pixel (fbq) and GA4 (gtag).
 * Works whether or not those scripts are loaded; missing ones are silently skipped.
 *
 * Standard Meta events use fbq('track', name, params).
 * Everything else uses fbq('trackCustom', name, params).
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

    // 1) PixelFlow (server-side proxy → Meta CAPI / GA4)
    try {
      if (typeof w.pixelFlow === 'function') {
        w.pixelFlow('event', name, Object.assign({ eventID: eventId }, params));
      }
    } catch (_) {}

    // 2) Meta Pixel (browser)
    try {
      if (typeof w.fbq === 'function') {
        var fbqMethod = META_STANDARD[name] ? 'track' : 'trackCustom';
        w.fbq(fbqMethod, name, params, { eventID: eventId });
      }
    } catch (_) {}

    // 3) GA4 (gtag)
    try {
      if (typeof w.gtag === 'function') {
        w.gtag('event', name, params);
      }
    } catch (_) {}
  }

  w.track = track;
})(window);
