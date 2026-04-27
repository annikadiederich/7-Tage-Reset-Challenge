/**
 * Funnel tracker — fires Meta browser pixel directly for standard events,
 * and uses PixelFlow for CAPI (server-side) deduplication via shared eventID.
 *
 * For Meta STANDARD events (Lead, Purchase, ...): we fire fbq('track', ...)
 * ourselves with an eventID, and pass the same eventID to PixelFlow via
 * pf.trackEvent's customData. PixelFlow must be configured CAPI-only for
 * standard events (no browser pixel re-fire) so the browser sees exactly 1
 * fbq call, deduped against PixelFlow's CAPI by the shared eventID.
 *
 * For CUSTOM events: only pf.trackEvent is called. PixelFlow handles
 * fbq trackCustom in the browser + CAPI server-side automatically.
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

    var isStandard = !!META_STANDARD[name];

    // 1) Browser pixel for standard events — fire directly with eventID.
    //    PixelFlow must be configured CAPI-only for these events.
    if (isStandard) {
      try {
        if (typeof w.fbq === 'function') {
          w.fbq('track', name, params, { eventID: eventId });
        }
      } catch (_) {}
    }

    // 2) PixelFlow — for CAPI (standard events) and fbq trackCustom + CAPI (custom).
    //    Pass eventID via customData so PixelFlow's CAPI request dedupes with ours.
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
