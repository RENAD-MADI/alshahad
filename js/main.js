/* ============================================================
   AL SHAHAD SAE COMMERCIAL — Main behaviors
   ============================================================ */

/* ---------- Language engine ---------- */
function getPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

function getLang() {
  return localStorage.getItem("site-lang") || "ar";
}

/* صفحات الهبوط الإعلانية لا تحمّل translations.js — نتجاوز الترجمة بهدوء */
function hasTranslations() {
  return typeof TRANSLATIONS !== "undefined" && TRANSLATIONS;
}

function applyTranslations(lang) {
  if (!hasTranslations()) return;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ar;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const val = getPath(dict, el.getAttribute("data-i18n"));
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const val = getPath(dict, el.getAttribute("data-i18n-html"));
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const val = getPath(dict, el.getAttribute("data-i18n-placeholder"));
    if (val !== undefined) el.setAttribute("placeholder", val);
  });

  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const spec = el.getAttribute("data-i18n-attr"); // format: "attr:key"
    const [attr, key] = spec.split(":");
    const val = getPath(dict, key);
    if (val !== undefined) el.setAttribute(attr, val);
  });
}

function setLang(lang) {
  if (!hasTranslations()) return;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  localStorage.setItem("site-lang", lang);
  applyTranslations(lang);

  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

/* ---------- Header scroll effect ---------- */
function initHeaderScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };
  onScroll();
  window.addEventListener("scroll", onScroll);
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    nav.classList.toggle("open");
    document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      toggle.classList.remove("active");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Language switch buttons ---------- */
function initLangSwitch() {
  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });
}

/* ---------- Scroll reveal animations ----------
   المحتوى ظاهر افتراضياً في CSS. نخفيه هنا فقط بعد التأكد من قدرتنا
   على إظهاره مجدداً، مع فحص احتياطي بالتمرير لا يعتمد على المراقب —
   حتى لا يبقى أي قسم مخفياً إذا تعطّل IntersectionObserver.       */
function initScrollReveal() {
  const items = Array.prototype.slice.call(document.querySelectorAll("[data-aos]"));
  if (!items.length) return;

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // بلا حركة أصلاً: نترك المحتوى ظاهراً كما هو
  if (reduceMotion) return;

  document.documentElement.classList.add("aos-ready");

  const reveal = (el) => {
    if (el.classList.contains("aos-in")) return;
    const delay = el.getAttribute("data-aos-delay");
    if (delay) el.style.transitionDelay = delay + "ms";
    el.classList.add("aos-in");
  };

  // الفحص الأساسي: أي عنصر دخل الشاشة يظهر. لا يعتمد على أي API متقدم
  // (لا IntersectionObserver ولا requestAnimationFrame) لأن كليهما قد
  // يُعلَّق في بعض البيئات فيبقى المحتوى مخفياً.
  let pending = items.slice();
  let lastRun = 0;

  const sweep = () => {
    lastRun = Date.now();
    const h = window.innerHeight || document.documentElement.clientHeight || 800;
    pending = pending.filter((el) => {
      const r = el.getBoundingClientRect();
      const visible = r.top < h * 0.92 && r.bottom > 0;
      if (visible) { reveal(el); return false; }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };

  // خانق بسيط بالوقت بدل rAF
  let timer = null;
  const onScroll = () => {
    if (Date.now() - lastRun > 80) { sweep(); return; }
    if (timer) return;
    timer = setTimeout(() => { timer = null; sweep(); }, 80);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  sweep();                    // ما هو ظاهر عند التحميل
  setTimeout(sweep, 350);     // بعد استقرار التخطيط والخطوط
  setTimeout(sweep, 1200);

  // شبكة أمان أخيرة: لو بقي شيء مخفياً بلا سبب، نُظهره بدل تركه فارغاً
  setTimeout(() => {
    if (!pending.length) return;
    const h = window.innerHeight || document.documentElement.clientHeight || 800;
    const stuck = pending.some((el) => {
      const r = el.getBoundingClientRect();
      return r.top < h && r.bottom > 0;
    });
    if (stuck) items.forEach(reveal);
  }, 3000);
}

/* ---------- Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const animate = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => observer.observe(el));
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      item.parentElement.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

/* ---------- Marquee duplication for seamless loop ---------- */
function initMarquee() {
  document.querySelectorAll(".marquee-track").forEach(track => {
    track.innerHTML += track.innerHTML;
  });
}

/* ---------- Project filter ---------- */
function initFilters() {
  const bar = document.querySelector(".filter-bar");
  if (!bar) return;
  const items = document.querySelectorAll(".gallery-item");
  bar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      bar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      items.forEach(item => {
        const cat = item.getAttribute("data-category");
        item.classList.toggle("hide", filter !== "all" && cat !== filter);
      });
    });
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lightbox) return;
  document.querySelectorAll(".gallery-item img, .project-card img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      lightboxImg.src = img.getAttribute("src");
      lightboxImg.alt = img.getAttribute("alt") || "";
      lightbox.classList.add("open");
    });
  });
  const close = () => lightbox.classList.remove("open");
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Radio cards (forms) ---------- */
function initRadioCards() {
  document.querySelectorAll(".radio-card").forEach(card => {
    const input = card.querySelector("input");
    if (!input) return;
    const sync = () => {
      card.parentElement.querySelectorAll(".radio-card").forEach(c => c.classList.remove("checked"));
      if (input.checked) card.classList.add("checked");
    };
    input.addEventListener("change", () => {
      card.parentElement.querySelectorAll(".radio-card input").forEach(i => {
        i.closest(".radio-card").classList.remove("checked");
      });
      card.classList.add("checked");
    });
    sync();
  });
}

/* ---------- Analytics / conversion helper ---------- */
window.dataLayer = window.dataLayer || [];
function track(eventName, params) {
  const payload = Object.assign({ event: eventName }, params || {});
  window.dataLayer.push(payload);
  if (typeof gtag === "function") gtag("event", eventName, params || {});
}

/* ---------- Form submit (real) ---------- */
function initForms() {
  document.querySelectorAll("form[data-ajax-form]").forEach(form => {
    const btn = form.querySelector('button[type="submit"]');
    const btnLabel = btn ? btn.innerHTML : "";
    let errorBox = form.querySelector(".form-error");
    if (!errorBox) {
      errorBox = document.createElement("div");
      errorBox.className = "form-error";
      form.appendChild(errorBox);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.classList.remove("show");

      if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>جارٍ الإرسال…</span>';
      }

      const data = new FormData(form);
      data.append("form_type", form.getAttribute("data-form-type") || "contact");
      data.append("page_url", location.href);

      try {
        const res = await fetch("/send.php", {
          method: "POST",
          body: data,
          headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        const out = await res.json().catch(() => ({ ok: false }));
        if (!res.ok || !out.ok) throw new Error(out.message || "تعذّر الإرسال");

        track(form.getAttribute("data-form-type") === "quote" ? "quote_submit" : "contact_submit", {
          form_type: form.getAttribute("data-form-type") || "contact"
        });

        const success = form.parentElement.querySelector(".form-success");
        if (success) {
          form.classList.add("hidden");
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (err) {
        errorBox.textContent =
          "تعذّر إرسال الطلب. يُرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب على 0550783385.";
        errorBox.classList.add("show");
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; }
      }
    });
  });
}

/* ---------- Click tracking (WhatsApp / phone) ---------- */
function initClickTracking() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track], a[href^='tel:'], a[href*='wa.me']");
    if (!el) return;
    const kind = el.getAttribute("data-track") ||
      (el.getAttribute("href").startsWith("tel:") ? "call" : "whatsapp");
    track(kind === "call" ? "phone_click" : "whatsapp_click", {
      link_url: el.getAttribute("href") || "",
      page: document.body.getAttribute("data-page") || ""
    });
  });
}

/* ---------- Current year in footer ---------- */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Icon injection ---------- */
function initIcons() {
  document.querySelectorAll("[data-icon]").forEach(el => {
    const name = el.getAttribute("data-icon");
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
}

/* ---------- Init everything ---------- */
function initAll() {
  initIcons();
  initHeaderScroll();
  initMobileNav();
  initLangSwitch();
  setLang(getLang());
  initScrollReveal();
  initCounters();
  initFAQ();
  initMarquee();
  initFilters();
  initLightbox();
  initBackToTop();
  initRadioCards();
  initForms();
  initClickTracking();
  initYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
