(() => {
  "use strict";
  const products = window.ALOULOU_PRODUCTS || [];
  const cartApi = window.AloulouCart;
  const I = window.AloulouI18n || {
    language: "ar",
    isEnglish: () => false,
    t: value => value,
    product: (product, field) => product?.[field] ?? ""
  };
  const state = { category: "all", query: "" };
  const grid = document.querySelector("#productsGrid");
  const empty = document.querySelector("#emptyState");
  const toast = document.querySelector("#toast");
  let favorites = JSON.parse(localStorage.getItem("aloulouFavorites") || "[]");

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  }
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }
  function statusClass(status) {
    return status === "available" ? "available" : status === "low" ? "low" : "order";
  }
  function pf(product, field) {
    return I.product(product, field);
  }
  function productCard(product) {
    const favorite = favorites.includes(product.id);
    const quantity = cartApi?.getQuantity(product.id) || 0;
    const name = pf(product, "name");
    const status = pf(product, "statusLabel");
    const category = pf(product, "categoryLabel");
    const short = pf(product, "short");
    const brand = pf(product, "brand");
    const cartLabel = quantity
      ? (I.isEnglish() ? `In Cart: ${quantity}` : `في السلة: ${quantity}`)
      : I.t("أضف للسلة +");
    return `<article class="product-card">
      <div class="product-media">
        <a href="product.html?id=${encodeURIComponent(product.id)}&v=30">
          <img src="${product.image}" alt="${escapeHtml(name)}" loading="lazy">
        </a>
        <button class="favorite-btn ${favorite ? "is-active" : ""}" data-favorite="${product.id}" type="button" aria-label="${escapeHtml(I.t(favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"))}">♡</button>
        <span class="status ${statusClass(product.status)}">${escapeHtml(status)}</span>
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${escapeHtml(category)}</span><small>${escapeHtml(I.t(product.model))}</small></div>
        <h3><a href="product.html?id=${encodeURIComponent(product.id)}&v=30">${escapeHtml(name)}</a></h3>
        <p>${escapeHtml(short)}</p>
        <div class="product-brand">${escapeHtml(brand)}</div>
        <div class="product-actions">
          <a class="details-btn" href="product.html?id=${encodeURIComponent(product.id)}&v=30">${escapeHtml(I.t("التفاصيل"))}</a>
          <button class="add-quote-btn ${quantity ? "is-added" : ""}" data-cart-add="${product.id}" type="button">${escapeHtml(cartLabel)}</button>
        </div>
      </div>
    </article>`;
  }
  function renderProducts() {
    if (!grid) return;
    const query = state.query.trim().toLowerCase();
    const filtered = products.filter(product => {
      const categoryMatch = state.category === "all" || product.category === state.category;
      const searchable = [
        product.name, product.nameEn, product.model, product.brand, product.brandEn,
        product.categoryLabel, product.categoryLabelEn, product.short, product.shortEn,
        product.description, product.descriptionEn, ...(product.searchTerms || [])
      ].filter(Boolean).join(" ").toLowerCase();
      return categoryMatch && (!query || searchable.includes(query));
    });
    grid.innerHTML = filtered.map(productCard).join("");
    if (empty) empty.hidden = filtered.length > 0;
  }
  function saveFavorites() {
    localStorage.setItem("aloulouFavorites", JSON.stringify(favorites));
    renderProducts();
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("aloulouTheme", theme);
    const button = document.querySelector("#themeToggle");
    if (button) {
      button.textContent = theme === "dark" ? "☀" : "☾";
      button.setAttribute("aria-label", I.isEnglish() ? "Toggle color theme" : "تبديل الوضع الداكن");
    }
  }

  document.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      const id = favoriteButton.dataset.favorite;
      favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
      saveFavorites();
      showToast(I.t(favorites.includes(id) ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة"));
    }

    const filterLink = event.target.closest("[data-filter]");
    if (filterLink) {
      state.category = filterLink.dataset.filter;
      document.querySelectorAll("#categoryFilters button").forEach(button => {
        button.classList.toggle("is-active", button.dataset.category === state.category);
      });
      renderProducts();
    }

    const scrollButton = event.target.closest("[data-scroll]");
    if (scrollButton) {
      document.querySelector(scrollButton.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
    }
  });

  document.querySelector("#productSearch")?.addEventListener("input", event => {
    state.query = event.target.value;
    renderProducts();
  });

  document.querySelector("#categoryFilters")?.addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    document.querySelectorAll("#categoryFilters button").forEach(item => item.classList.toggle("is-active", item === button));
    renderProducts();
  });

  document.querySelector("#contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = I.isEnglish()
      ? `Hello Sales Department, my name is ${data.get("name")}. Phone: ${data.get("phone")}\nRequest type: ${data.get("type")}\nDetails: ${data.get("message")}`
      : `مرحبًا قسم المبيعات، أنا ${data.get("name")}، رقم الهاتف: ${data.get("phone")}\nنوع الطلب: ${data.get("type")}\nالتفاصيل: ${data.get("message")}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=963966248480&text=${encodeURIComponent(message)}`;
    window.location.assign(whatsappUrl);
    const note = document.querySelector("#formNote");
    if (note) note.textContent = I.t("تم فتح WhatsApp ورسالة الطلب جاهزة للإرسال.");
    showToast(I.t("تم تجهيز رسالة WhatsApp"));
  });

  document.querySelector("#themeToggle")?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  const menuButton = document.querySelector("#menuToggle");
  const mainNav = document.querySelector("#mainNav");
  const setPageMode = mode => document.documentElement.classList.toggle("catalog-entry-mode", mode === "catalog");

  menuButton?.addEventListener("click", () => {
    const open = mainNav?.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(Boolean(open)));
  });

  document.querySelectorAll("[data-page-mode]").forEach(link => {
    link.addEventListener("click", () => {
      setPageMode(link.dataset.pageMode === "catalog" ? "catalog" : "full");
      mainNav?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.toLowerCase();
    const full = ["#top", "#home", "#solutions", "#about"].includes(hash);
    setPageMode(full ? "full" : "catalog");
  });

  document.querySelector("#year") && (document.querySelector("#year").textContent = new Date().getFullYear());

  document.addEventListener("cart:changed", renderProducts);
  document.addEventListener("aloulou:languagechange", () => {
    renderProducts();
    setTheme(document.documentElement.dataset.theme || "light");
  });

  setTheme(localStorage.getItem("aloulouTheme") || "light");
  renderProducts();

  document.querySelector("#printCatalog")?.addEventListener("click", () => {
    const language = I.isEnglish() ? "en" : "ar";
    window.open(`catalog.html?print=1&lang=${language}`, "_blank", "noopener");
  });

  if (!window.location.hash) {
    requestAnimationFrame(() => {
      const productsSection = document.querySelector("#products");
      const header = document.querySelector(".site-header");
      if (productsSection) {
        const offset = (header?.offsetHeight || 0) + 12;
        window.scrollTo({top:Math.max(0, productsSection.offsetTop - offset), behavior:"auto"});
      }
    });
  }
})();
