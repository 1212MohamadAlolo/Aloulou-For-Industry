(() => {
  const products = window.ALOULOU_PRODUCTS || [];
  const cartApi = window.AloulouCart;
  const state = { category: "all", query: "" };
  const grid = document.querySelector("#productsGrid");
  const empty = document.querySelector("#emptyState");
  const toast = document.querySelector("#toast");
  let favorites = JSON.parse(localStorage.getItem("aloulouFavorites") || "[]");

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }
  function statusClass(status) { return status === "available" ? "available" : status === "low" ? "low" : "order"; }
  function productCard(p) {
    const fav = favorites.includes(p.id);
    const quantity = cartApi?.getQuantity(p.id) || 0;
    return `<article class="product-card">
      <div class="product-media"><a href="product.html?id=${encodeURIComponent(p.id)}&v=26"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"></a><button class="favorite-btn ${fav ? "is-active" : ""}" data-favorite="${p.id}" type="button" aria-label="${fav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}">♡</button><span class="status ${statusClass(p.status)}">${escapeHtml(p.statusLabel)}</span></div>
      <div class="product-body"><div class="product-meta"><span>${escapeHtml(p.categoryLabel)}</span><small>${escapeHtml(p.model)}</small></div><h3><a href="product.html?id=${encodeURIComponent(p.id)}&v=26">${escapeHtml(p.name)}</a></h3><p>${escapeHtml(p.short)}</p><div class="product-brand">${escapeHtml(p.brand)}</div><div class="product-actions"><a class="details-btn" href="product.html?id=${encodeURIComponent(p.id)}&v=26">التفاصيل</a><button class="add-quote-btn ${quantity ? "is-added" : ""}" data-cart-add="${p.id}" type="button">${quantity ? `في السلة: ${quantity}` : "أضف للسلة +"}</button></div></div>
    </article>`;
  }
  function renderProducts() {
    const q = state.query.trim().toLowerCase();
    const filtered = products.filter(p => (state.category === "all" || p.category === state.category) && (!q || [p.name,p.nameEn,p.model,p.brand,p.categoryLabel,p.short,p.description,...(p.searchTerms || [])].join(" ").toLowerCase().includes(q)));
    grid.innerHTML = filtered.map(productCard).join("");
    empty.hidden = filtered.length > 0;
  }
  function saveFavorites() { localStorage.setItem("aloulouFavorites", JSON.stringify(favorites)); renderProducts(); }
  function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem("aloulouTheme", theme); document.querySelector("#themeToggle").textContent = theme === "dark" ? "☀" : "☾"; }

  document.addEventListener("click", event => {
    const fav = event.target.closest("[data-favorite]");
    if (fav) { const id = fav.dataset.favorite; favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites,id]; saveFavorites(); showToast(favorites.includes(id) ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة"); }
    const filterLink = event.target.closest("[data-filter]");
    if (filterLink) { state.category = filterLink.dataset.filter; document.querySelectorAll("#categoryFilters button").forEach(b => b.classList.toggle("is-active", b.dataset.category === state.category)); renderProducts(); }
    const scroll = event.target.closest("[data-scroll]"); if (scroll) document.querySelector(scroll.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
  });
  document.querySelector("#productSearch").addEventListener("input", e => { state.query = e.target.value; renderProducts(); });
  document.querySelector("#categoryFilters").addEventListener("click", e => { const btn=e.target.closest("button[data-category]"); if(!btn)return; state.category=btn.dataset.category; document.querySelectorAll("#categoryFilters button").forEach(b=>b.classList.toggle("is-active",b===btn)); renderProducts(); });
  document.querySelector("#contactForm").addEventListener("submit", e => { e.preventDefault(); const data=new FormData(e.currentTarget); const text=`مرحبًا قسم المبيعات، أنا ${data.get("name")}، رقم الهاتف: ${data.get("phone")}\nنوع الطلب: ${data.get("type")}\nالتفاصيل: ${data.get("message")}`; const whatsappUrl=`https://api.whatsapp.com/send?phone=963966248480&text=${encodeURIComponent(text)}`; window.location.assign(whatsappUrl); document.querySelector("#formNote").textContent="تم فتح WhatsApp ورسالة الطلب جاهزة للإرسال."; showToast("تم تجهيز رسالة WhatsApp"); });
  document.querySelector("#themeToggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  const menuBtn = document.querySelector("#menuToggle");
  const mainNav = document.querySelector("#mainNav");
  const setPageMode = mode => document.documentElement.classList.toggle("catalog-entry-mode", mode === "catalog");

  menuBtn.addEventListener("click", () => {
    const open = mainNav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll("[data-page-mode]").forEach(link => {
    link.addEventListener("click", () => {
      setPageMode(link.dataset.pageMode === "catalog" ? "catalog" : "full");
      mainNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.toLowerCase();
    const full = ["#top", "#home", "#solutions", "#about"].includes(hash);
    setPageMode(full ? "full" : "catalog");
  });
  document.querySelector("#year").textContent = new Date().getFullYear();
  document.addEventListener("cart:changed", renderProducts);
  setTheme(localStorage.getItem("aloulouTheme") || "light");
  renderProducts();

  document.querySelector("#printCatalog")?.addEventListener("click", () => window.open("catalog.html?print=1", "_blank", "noopener"));
  if (!window.location.hash) {
    requestAnimationFrame(() => {
      const productsSection = document.querySelector("#products");
      const header = document.querySelector(".site-header");
      if (productsSection) {
        const offset = (header?.offsetHeight || 0) + 12;
        window.scrollTo({ top: Math.max(0, productsSection.offsetTop - offset), behavior: "auto" });
      }
    });
  }
})();
