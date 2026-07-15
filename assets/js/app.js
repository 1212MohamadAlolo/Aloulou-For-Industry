(() => {
  const products = window.ALOULOU_PRODUCTS || [];
  const state = { category: "all", query: "" };
  const grid = document.querySelector("#productsGrid");
  const empty = document.querySelector("#emptyState");
  const toast = document.querySelector("#toast");
  const quoteDrawer = document.querySelector("#quoteDrawer");
  const quoteItems = document.querySelector("#quoteItems");
  const quoteEmpty = document.querySelector("#quoteEmpty");
  const quoteCount = document.querySelector("#quoteCount");
  let quote = JSON.parse(localStorage.getItem("aloulouQuote") || "[]");
  let favorites = JSON.parse(localStorage.getItem("aloulouFavorites") || "[]");

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  }
  function showToast(message) {
    toast.textContent = message; toast.classList.add("is-visible");
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }
  function statusClass(status) { return status === "available" ? "available" : status === "low" ? "low" : "order"; }
  function productCard(p) {
    const fav = favorites.includes(p.id);
    return `<article class="product-card">
      <div class="product-media"><a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"></a><button class="favorite-btn ${fav ? "is-active" : ""}" data-favorite="${p.id}" type="button" aria-label="${fav ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}">♡</button><span class="status ${statusClass(p.status)}">${escapeHtml(p.statusLabel)}</span></div>
      <div class="product-body"><div class="product-meta"><span>${escapeHtml(p.categoryLabel)}</span><small>${escapeHtml(p.model)}</small></div><h3><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h3><p>${escapeHtml(p.short)}</p><div class="product-brand">${escapeHtml(p.brand)}</div><div class="product-actions"><a class="details-btn" href="product.html?id=${encodeURIComponent(p.id)}">التفاصيل</a><button class="add-quote-btn ${quote.includes(p.id) ? "is-added" : ""}" data-add-quote="${p.id}" type="button">${quote.includes(p.id) ? "تمت الإضافة ✓" : "أضف للطلب +"}</button></div></div>
    </article>`;
  }
  function renderProducts() {
    const q = state.query.trim().toLowerCase();
    const filtered = products.filter(p => (state.category === "all" || p.category === state.category) && (!q || [p.name,p.nameEn,p.model,p.brand,p.categoryLabel,p.short,p.description,...(p.searchTerms || [])].join(" ").toLowerCase().includes(q)));
    grid.innerHTML = filtered.map(productCard).join("");
    empty.hidden = filtered.length > 0;
  }
  function saveQuote() { localStorage.setItem("aloulouQuote", JSON.stringify(quote)); renderQuote(); renderProducts(); }
  function saveFavorites() { localStorage.setItem("aloulouFavorites", JSON.stringify(favorites)); renderProducts(); }
  function renderQuote() {
    const chosen = quote.map(id => products.find(p => p.id === id)).filter(Boolean);
    quoteCount.textContent = chosen.length;
    quoteEmpty.hidden = chosen.length > 0;
    quoteItems.innerHTML = chosen.map(p => `<div class="quote-item"><img src="${p.image}" alt=""><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.model)}</small></div><button data-remove-quote="${p.id}" type="button" aria-label="إزالة">×</button></div>`).join("");
  }
  function openQuote() { quoteDrawer.classList.add("is-open"); quoteDrawer.setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll"); }
  function closeQuote() { quoteDrawer.classList.remove("is-open"); quoteDrawer.setAttribute("aria-hidden","true"); document.body.classList.remove("no-scroll"); }
  function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem("aloulouTheme", theme); document.querySelector("#themeToggle").textContent = theme === "dark" ? "☀" : "☾"; }

  document.addEventListener("click", event => {
    const add = event.target.closest("[data-add-quote]");
    if (add) { const id = add.dataset.addQuote; if (!quote.includes(id)) { quote.push(id); saveQuote(); showToast("أُضيف المنتج إلى طلب السعر"); } else { openQuote(); } }
    const remove = event.target.closest("[data-remove-quote]");
    if (remove) { quote = quote.filter(id => id !== remove.dataset.removeQuote); saveQuote(); }
    const fav = event.target.closest("[data-favorite]");
    if (fav) { const id = fav.dataset.favorite; favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites,id]; saveFavorites(); showToast(favorites.includes(id) ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة"); }
    if (event.target.closest("[data-open-quote]")) openQuote();
    if (event.target.closest("[data-close-quote]")) closeQuote();
    const filterLink = event.target.closest("[data-filter]");
    if (filterLink) { state.category = filterLink.dataset.filter; document.querySelectorAll("#categoryFilters button").forEach(b => b.classList.toggle("is-active", b.dataset.category === state.category)); renderProducts(); }
    const scroll = event.target.closest("[data-scroll]"); if (scroll) document.querySelector(scroll.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
  });
  document.querySelector("#productSearch").addEventListener("input", e => { state.query = e.target.value; renderProducts(); });
  document.querySelector("#categoryFilters").addEventListener("click", e => { const btn=e.target.closest("button[data-category]"); if(!btn)return; state.category=btn.dataset.category; document.querySelectorAll("#categoryFilters button").forEach(b=>b.classList.toggle("is-active",b===btn)); renderProducts(); });
  document.querySelector("#quoteOpen").addEventListener("click", openQuote);
  document.querySelector("#clearQuote").addEventListener("click", () => { quote=[]; saveQuote(); showToast("تم إفراغ طلب السعر"); });
  document.querySelector("#createQuoteMessage").addEventListener("click", () => { if(!quote.length){showToast("أضف منتجًا واحدًا على الأقل"); return;} const lines=quote.map(id=>products.find(p=>p.id===id)).filter(Boolean).map((p,i)=>`${i+1}. ${p.name} — ${p.model}`); navigator.clipboard?.writeText(`مرحبًا، أريد عرض سعر للمنتجات التالية:\n${lines.join("\n")}\nالكمية المطلوبة: ...\nالمدينة: ...`).then(()=>showToast("تم نسخ رسالة الطلب التجريبية")); });
  document.querySelector("#contactForm").addEventListener("submit", e => { e.preventDefault(); const data=new FormData(e.currentTarget); const text=`مرحبًا أستاذ فخر الدين، أنا ${data.get("name")}، رقم الهاتف: ${data.get("phone")}\nنوع الطلب: ${data.get("type")}\nالتفاصيل: ${data.get("message")}`; const whatsappUrl=`https://wa.me/963966248480?text=${encodeURIComponent(text)}`; window.open(whatsappUrl, "_blank", "noopener"); document.querySelector("#formNote").textContent="تم فتح WhatsApp ورسالة الطلب جاهزة للإرسال."; showToast("تم تجهيز رسالة WhatsApp"); });
  document.querySelector("#themeToggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  const menuBtn=document.querySelector("#menuToggle"); menuBtn.addEventListener("click",()=>{const open=document.querySelector("#mainNav").classList.toggle("is-open");menuBtn.setAttribute("aria-expanded",String(open));});
  document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{document.querySelector("#mainNav").classList.remove("is-open");menuBtn.setAttribute("aria-expanded","false");}));
  document.querySelector("#year").textContent = new Date().getFullYear();
  document.addEventListener("keydown", e => { if(e.key === "Escape") closeQuote(); });
  setTheme(localStorage.getItem("aloulouTheme") || "light"); renderProducts(); renderQuote();

  const printCatalogButton = document.querySelector("#printCatalog");
  printCatalogButton?.addEventListener("click", () => window.open("catalog.html?print=1", "_blank", "noopener"));

  // Default landing position: open directly at the products catalog when no section was requested.
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
