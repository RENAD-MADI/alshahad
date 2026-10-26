/* ============================================================
   AL SHAHAD SAE COMMERCIAL — التتبع والقياس
   ------------------------------------------------------------
   ★ هذا هو الملف الوحيد الذي تعدّله لتفعيل القياس.
     ضع المعرّفات في CONFIG بالأسفل ثم ارفع الملف. لا تعدّل شيئاً آخر.

   ملاحظة مهمة عن الحسابين:
   ────────────────────────────────────────────────────────────
   الإحالات الناجحة تُرسَل إلى حساب الإعلانات 733-756-3913 (AW-18413497262)
   لأنه صاحب الحملة. حساب المدير 450-765-8235 لم يعد يُحمَّل على الموقع:
   لا يستقبل إحالات ولا يدير حملات، وتحميله كان يضيف مكتبة قوقل كاملة
   تبطئ الموقع على الجوال (١٥ سبتمبر ٢٠٢٦).

   من أين تجيب كل معرّف؟
   ────────────────────────────────────────────────────────────
   GA4_ID  : analytics.google.com ← الإدارة ← تدفقات البيانات
   ADS_ID  : ads.google.com ← الأدوات ← إدارة بيانات إعلانات Google
             ← علامة التتبّع من Google ← إدارة
   LABELS  : الأهداف ← الإحالات الناجحة ← افتح الإجراء ← إدارة
             ← "عرض المقتطف عن الحدث" ← خذ ما بعد الشرطة المائلة في send_to
   ============================================================ */

var CONFIG = {
  GA4_ID: "G-B8V8RNMN7M",       // معرّف Google Analytics 4
  ADS_ID: "AW-18413497262",     // حساب الإعلانات — إليه تُرسَل الإحالات الناجحة
  LABELS: {
    quote_submit:   "v2TYCN_Xk-scEK7XnsxE",  // إرسال نموذج عملاء محتملين (أساسي)
    contact_submit: "v2TYCN_Xk-scEK7XnsxE",  // نفس الإجراء — نموذج تواصل
    whatsapp_click: "OT0fCJaxp-scEK7XnsxE",  // ضغط واتساب  (هدف: جهة اتصال)
    phone_click:    "GIjLCJmxp-scEK7XnsxE"   // ضغط اتصال   (هدف: جهة اتصال)
  }
};

(function () {
  "use strict";

  var isSet = function (v) { return v && v.indexOf("X") === -1; };
  var useGA4 = isSet(CONFIG.GA4_ID);
  var useAds = isSet(CONFIG.ADS_ID);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // لا نحمّل أي شيء من قوقل قبل وضع المعرّفات — الموقع يظل سريعاً.
  if (!useGA4 && !useAds) {
    if (window.console && console.info) {
      console.info("[alshahad] القياس غير مفعّل بعد — ضع المعرّفات في js/analytics.js");
    }
    return;
  }

  var primary = useGA4 ? CONFIG.GA4_ID : CONFIG.ADS_ID;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(primary);
  document.head.appendChild(s);

  gtag("js", new Date());
  if (useGA4) gtag("config", CONFIG.GA4_ID, { send_page_view: true });
  if (useAds) gtag("config", CONFIG.ADS_ID);

  /* ————— ربط أحداث الموقع بإحالات Google Ads الناجحة ————— */
  if (useAds) {
    var fired = {};
    var origPush = window.dataLayer.push.bind(window.dataLayer);

    window.dataLayer.push = function () {
      var out = origPush.apply(null, arguments);
      for (var i = 0; i < arguments.length; i++) {
        var ev = arguments[i];
        if (!ev || typeof ev !== "object" || !ev.event) continue;

        var label = CONFIG.LABELS[ev.event];
        if (!label) continue;

        // نقرات الاتصال والواتساب قد تتكرر — نحسبها مرة واحدة لكل زيارة
        var once = ev.event === "whatsapp_click" || ev.event === "phone_click";
        if (once && fired[ev.event]) continue;
        fired[ev.event] = true;

        gtag("event", "conversion", {
          send_to: CONFIG.ADS_ID + "/" + label,
          value: 1.0,
          currency: "SAR"
        });
      }
      return out;
    };
  }
})();
