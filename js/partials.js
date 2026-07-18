/* ============================================================
   AL SHAHAD SAE COMMERCIAL — Header & Footer partials
   ============================================================ */

function buildHeader(activePage) {
  const links = [
    { page: "home", href: "index.html", key: "nav.home" },
    { page: "about", href: "about.html", key: "nav.about" },
    { page: "contracting", href: "contracting.html", key: "nav.contracting" },
    { page: "realestate", href: "real-estate.html", key: "nav.realestate" },
    { page: "projects", href: "projects.html", key: "nav.projects" },
    { page: "contact", href: "contact.html", key: "nav.contact" }
  ];

  const navHtml = links.map(l =>
    `<a href="${l.href}" data-i18n="${l.key}" class="${activePage === l.page ? "active" : ""}"></a>`
  ).join("");

  return `
  <header id="site-header">
    <div class="container header-inner">
      <a href="index.html" class="brand">
        <img src="imoges/logo.jpeg" alt="Al Shahad SAE Commercial">
        <span class="brand-text">
          <span class="name-ar" data-i18n="brand.name"></span>
          <span class="name-en" data-i18n="brand.sub"></span>
        </span>
      </a>
      <nav class="main-nav" id="main-nav">
        ${navHtml}
        <div class="mobile-extras">
          <div class="lang-switch">
            <button data-lang="ar">AR</button>
            <button data-lang="en">EN</button>
          </div>
          <a href="quote.html" class="btn btn-primary btn-sm" data-i18n="nav.quote"></a>
        </div>
      </nav>
      <div class="header-actions">
        <div class="lang-switch">
          <button data-lang="ar">AR</button>
          <button data-lang="en">EN</button>
        </div>
        <a href="quote.html" class="btn btn-primary btn-sm" data-i18n="nav.quote"></a>
        <button class="nav-toggle" id="nav-toggle" aria-label="menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function buildFooter() {
  return `
  <footer id="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand">
            <img src="imoges/logo.jpeg" alt="Al Shahad SAE Commercial">
            <span class="brand-text">
              <span class="name-ar" data-i18n="brand.name"></span>
              <span class="name-en" data-i18n="brand.sub"></span>
            </span>
          </a>
          <p data-i18n="footer.about"></p>
          <div class="social-row">
            <a href="https://wa.me/966548720537" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${ICONS.whatsapp}</a>
            <a href="https://www.instagram.com/al_shahad_sae/?hl=ar" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${ICONS.instagram}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer.quicklinks"></h4>
          <div class="footer-links">
            <a href="index.html" data-i18n="nav.home"></a>
            <a href="about.html" data-i18n="nav.about"></a>
            <a href="contact.html" data-i18n="nav.contact"></a>
            <a href="quote.html" data-i18n="nav.quote"></a>
          </div>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer.sectors"></h4>
          <div class="footer-links">
            <a href="contracting.html" data-i18n="footer.sector_contracting"></a>
            <a href="real-estate.html" data-i18n="footer.sector_realestate"></a>
            <a href="projects.html" data-i18n="footer.sector_projects"></a>
            <a href="quote.html" data-i18n="footer.sector_quote"></a>
          </div>
        </div>
        <div class="footer-col">
          <h4 data-i18n="footer.contact"></h4>
          <ul class="footer-contact">
            <li><span class="ic">${ICONS.phone}</span><span>
              <a href="tel:0555881098" style="display:block">0555881098</a>
              <a href="tel:0550783385" style="display:block">0550783385</a>
            </span></li>
            <li><span class="ic">${ICONS.mail}</span><a href="mailto:Alshahad.ezz@gmail.com">Alshahad.ezz@gmail.com</a></li>
            <li><span class="ic">${ICONS.pin}</span><span data-i18n="footer.address"></span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="copyright">&copy; <span id="year"></span> <span data-i18n="brand.sub"></span> — <span data-i18n="footer.rights"></span></div>
      </div>
    </div>
  </footer>

  <div class="float-btns">
    <a href="https://wa.me/966550783385" target="_blank" rel="noopener noreferrer" class="float-btn whatsapp" aria-label="WhatsApp">${ICONS.whatsapp}</a>
    <button class="float-btn totop" id="to-top" aria-label="Back to top">${ICONS.arrowUp}</button>
  </div>

  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" id="lightbox-close">&times;</button>
    <img src="" alt="" id="lightbox-img">
  </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header-placeholder");
  const footerEl = document.getElementById("footer-placeholder");
  const page = document.body.getAttribute("data-page") || "home";
  if (headerEl) headerEl.outerHTML = buildHeader(page);
  if (footerEl) footerEl.outerHTML = buildFooter();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.dispatchEvent(new Event("partials:ready"));
});
