
document.addEventListener("DOMContentLoaded", () => {
  // Quarto's TOC also uses nav and .nav-link. Only touch the top navbar.
  const navbar = document.querySelector("#quarto-header .navbar");
  if (!navbar) return;

  const pages = [
    { file: "index.html", en: "Home", ja: "ホーム" },
    { file: "research.html", en: "Research", ja: "研究紹介" },
    {
      file: "publications.html",
      en: "Publications & Achievements",
      ja: "研究業績"
    },
    { file: "more.html", en: "More", ja: "その他" },
    { file: "link.html", en: "Links", ja: "リンク" }
  ];

  // Quarto generates this ID from the configured menu text, "English".
  const toggle = navbar.querySelector("#nav-menu-english");
  const menu = toggle?.parentElement.querySelector(".dropdown-menu");
  if (!menu) return;

  // Quarto resolves these links relative to the site root, including subpaths.
  const [englishLink, japaneseLink] = menu.querySelectorAll("a.dropdown-item");
  const siteRoot = new URL("./", englishLink.href);
  const currentPath = window.location.pathname.slice(siteRoot.pathname.length);
  const isJapanese = currentPath.startsWith("ja/");
  const language = isJapanese ? "ja" : "en";
  const pagePath = isJapanese ? currentPath.slice(3) : currentPath;
  const file = pages.some(page => page.file === pagePath)
    ? pagePath
    : "index.html";

  // Quarto removes trailing index.html from links when served over HTTP.
  const normalizePath = pathname => pathname.replace(/\/index\.html$/, "/");

  // Update the main navigation.
  navbar.querySelectorAll(".navbar-nav > .nav-item > a.nav-link:not(.dropdown-toggle)").forEach(link => {
    const url = new URL(link.href);
    if (url.origin !== siteRoot.origin) return;

    const page = pages.find(page =>
      normalizePath(url.pathname) === normalizePath(new URL(page.file, siteRoot).pathname)
    );

    if (!page) return;

    link.querySelector(".menu-text").textContent = page[language];
    link.href = new URL(`${isJapanese ? "ja/" : ""}${page.file}`, siteRoot).href;
  });

  const brand = navbar.querySelector("a.navbar-brand");
  if (brand) {
    brand.href = new URL(isJapanese ? "ja/index.html" : "index.html", siteRoot).href;
  }

  // Keep Quarto's icons, dropdown markup and Bootstrap event handlers intact.
  toggle.querySelector(".menu-text").textContent = isJapanese ? "日本語" : "English";
  englishLink.href = new URL(file, siteRoot).href;
  japaneseLink.href = new URL(`ja/${file}`, siteRoot).href;
});
