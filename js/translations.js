/* ============================================================
   AL SHAHAD SAE COMMERCIAL — Translations (AR / EN)
   Shared / common strings. Page-specific strings are merged
   in from each page's own i18n file (window.PAGE_I18N).
   ============================================================ */

const COMMON_I18N = {
  ar: {
    brand: {
      name: "بحر الشهد",
      sub: "AL SHAHAD SAE COMMERCIAL"
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      contracting: "قطاع المقاولات",
      realestate: "القطاع العقاري",
      marketing: "التسويق العقاري",
      projects: "مشاريعنا",
      quote: "اطلب عرض سعر",
      contact: "تواصل معنا"
    },
    footer: {
      about: "شركة سعودية متخصصة في تقديم حلول متكاملة في قطاع المقاولات والخدمات العقارية، ترتكز على الجودة والاحترافية والاستدامة.",
      quicklinks: "روابط سريعة",
      sectors: "قطاعاتنا",
      contact: "تواصل معنا",
      address: "جدة، المملكة العربية السعودية",
      rights: "جميع الحقوق محفوظة",
      sector_contracting: "قطاع المقاولات",
      sector_realestate: "القطاع العقاري والتسويق العقاري",
      sector_projects: "مشاريعنا",
      sector_quote: "اطلب عرض سعر"
    },
    btn: {
      readmore: "اقرأ المزيد",
      explore_contracting: "اكتشف قطاع المقاولات",
      explore_realestate: "اكتشف الخدمات العقارية",
      request_quote: "اطلب عرض سعر",
      request_consult: "اطلب استشارة عقارية",
      contact_us: "تواصل معنا",
      view_projects: "عرض جميع المشاريع",
      send: "إرسال الطلب",
      send_message: "إرسال الرسالة",
      view_all: "عرض الكل"
    },
    misc: {
      scroll: "مرر للأسفل",
      whatsapp: "تواصل عبر واتساب"
    }
  },
  en: {
    brand: {
      name: "Al Shahad",
      sub: "AL SHAHAD SAE COMMERCIAL"
    },
    nav: {
      home: "Home",
      about: "About Us",
      contracting: "Contracting",
      realestate: "Real Estate",
      marketing: "Real Estate Marketing",
      projects: "Our Projects",
      quote: "Request a Quote",
      contact: "Contact Us"
    },
    footer: {
      about: "A Saudi company specialized in providing integrated solutions in the contracting and real estate services sector, built on quality, professionalism and sustainability.",
      quicklinks: "Quick Links",
      sectors: "Our Sectors",
      contact: "Contact Us",
      address: "Jeddah, Saudi Arabia",
      rights: "All rights reserved",
      sector_contracting: "Contracting Sector",
      sector_realestate: "Real Estate & Marketing",
      sector_projects: "Our Projects",
      sector_quote: "Request a Quote"
    },
    btn: {
      readmore: "Read More",
      explore_contracting: "Explore Contracting",
      explore_realestate: "Explore Real Estate Services",
      request_quote: "Request a Quote",
      request_consult: "Request Consultation",
      contact_us: "Contact Us",
      view_projects: "View All Projects",
      send: "Send Request",
      send_message: "Send Message",
      view_all: "View All"
    },
    misc: {
      scroll: "Scroll down",
      whatsapp: "Chat on WhatsApp"
    }
  }
};

/* Deep merge helper */
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/* Build the final translations object by merging COMMON + PAGE_I18N (set by each page) */
const TRANSLATIONS = (function () {
  const base = JSON.parse(JSON.stringify(COMMON_I18N));
  if (typeof PAGE_I18N !== "undefined") {
    deepMerge(base, PAGE_I18N);
  }
  return base;
})();
