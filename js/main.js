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

function applyTranslations(lang) {
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

/* ---------- Scroll reveal animations ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll("[data-aos]");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-aos-delay");
        if (delay) entry.target.style.transitionDelay = delay + "ms";
        entry.target.classList.add("aos-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
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

/* ---------- Form submit (demo) ---------- */
function initForms() {
  document.querySelectorAll("form[data-ajax-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector(".form-success");
      if (success) {
        form.classList.add("hidden");
        success.classList.add("show");
      }
    });
  });
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
}

if (document.getElementById("header-placeholder")) {
  document.addEventListener("partials:ready", initAll);
} else {
  document.addEventListener("DOMContentLoaded", initAll);
}
