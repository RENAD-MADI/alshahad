/* ============================================================
   AL SHAHAD SAE COMMERCIAL — بكسل Meta (فيسبوك/انستقرام)
   ------------------------------------------------------------
   ★ ضع معرّف البكسل في PIXEL_ID بالأسفل ثم ارفع هذا الملف وحده.
     لا تعدّل أي شيء آخر. الملف لا يفعل شيئاً ما دام المعرّف فارغاً،
     فلا يبطئ الموقع ولا يرسل أي بيانات قبل ذلك.

   من أين تجيب المعرّف؟
   ────────────────────────────────────────────────────────────
   business.facebook.com ← مدير الأحداث ← مجموعات البيانات
   ← اسم مجموعة البيانات ← الرقم أسفل الاسم مباشرة
   الشكل: 15 أو 16 رقماً، مثال: 1234567890123456

   الأحداث التي يرسلها هذا الملف تلقائياً:
     PageView  → كل زيارة صفحة
     Lead      → إرسال نموذج عرض السعر أو التواصل
     Contact   → ضغط واتساب أو ضغط اتصال (مرة واحدة لكل زيارة)
   ============================================================ */

var META_PIXEL = {
  PIXEL_ID: "1822703042222350"   // بكسل "بحر الشهد" — مجموعة البيانات 27379938981660861
};

(function () {
  "use strict";

  var id = (META_PIXEL.PIXEL_ID || "").trim();
  if (!/^\d{15,16}$/.test(id)) {
    if (window.console && console.info) {
      console.info("[alshahad] بكسل Meta غير مفعّل — ضع المعرّف في js/meta-pixel.js");
    }
    return;
  }

  /* ————— كود Meta الأساسي ————— */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", id);
  fbq("track", "PageView");

  /* ————— ربط أحداث الموقع ببكسل Meta —————
     نلتقط نفس الأحداث التي يرسلها main.js إلى dataLayer،
     ونغلّف push بحيث لا نكسر أي غلاف سابق (ملف قوقل مثلاً). */
  var MAP = {
    quote_submit:   { name: "Lead",    content: "طلب عرض سعر" },
    contact_submit: { name: "Lead",    content: "نموذج تواصل" },
    whatsapp_click: { name: "Contact", content: "واتساب" },
    phone_click:    { name: "Contact", content: "اتصال" }
  };

  window.dataLayer = window.dataLayer || [];
  var fired = {};
  var prevPush = window.dataLayer.push.bind(window.dataLayer);

  window.dataLayer.push = function () {
    var out = prevPush.apply(null, arguments);
    for (var i = 0; i < arguments.length; i++) {
      var ev = arguments[i];
      if (!ev || typeof ev !== "object" || !ev.event) continue;

      var m = MAP[ev.event];
      if (!m) continue;

      // نقرات الاتصال والواتساب قد تتكرر — نحسبها مرة واحدة لكل زيارة
      var once = ev.event === "whatsapp_click" || ev.event === "phone_click";
      if (once && fired[ev.event]) continue;
      fired[ev.event] = true;

      fbq("track", m.name, {
        content_name: m.content,
        content_category: "المقاولات والعقار",
        currency: "SAR",
        value: 1.0
      });
    }
    return out;
  };
})();
