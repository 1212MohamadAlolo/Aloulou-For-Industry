(() => {
  "use strict";
  const products = window.ALOULOU_PRODUCTS || [];
  const I = window.AloulouI18n || {
    language: "ar",
    isEnglish: () => false,
    t: value => value,
    product: (product, field) => product?.[field] ?? ""
  };
  const params = new URLSearchParams(location.search);
  const product = products.find(item => item.id === params.get("id")) || products[0];
  const root = document.querySelector("#productRoot");
  const toast = document.querySelector("#toast");
  let selectedVariantId = product?.variants?.[0]?.id || "";

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));
  }
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }
  function pf(field) {
    return I.product(product, field);
  }
  function statusClass(status) {
    return status === "available" ? "available" : status === "low" ? "low" : "order";
  }

  function render() {
    if (!root || !product) return;
    const variant = product.variants?.find(item => item.id === selectedVariantId) || null;
    const gallery = variant ? [variant.image] : (Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [product.image]);
    const name = pf("name");
    const category = pf("categoryLabel");
    const brand = pf("brand");
    const variantName = variant ? (I.isEnglish() ? variant.nameEn : variant.name) : "";
    const currentModel = variant?.model || product.model;
    const currentArticleNumber = variant?.articleNumber || product.articleNumber || "—";
    const description = variant ? (I.isEnglish() ? (variant.descriptionEn || variant.description) : variant.description) : pf("description");
    const status = pf("statusLabel");
    const imageNote = pf("imageNote") || I.t("صورة توضيحية للمنتج");
    const disclaimer = pf("disclaimer") || I.t("تنبيه: يجب مراجعة الكتالوج الأصلي قبل اعتماد المواصفات فنيًا أو تجاريًا.");
    const specs = variant ? (I.isEnglish() ? (variant.specsEn || variant.specs) : variant.specs) : (pf("specs") || product.specs || []);
    const usages = pf("usages") || product.usages || [];
    const related = products.filter(item => item.id !== product.id).slice(0, 3);
    const secondaryName = I.isEnglish() ? "" : product.nameEn;

    document.title = `${name} | ${I.isEnglish() ? "Aloulou for Industry" : "علولو للصناعة"}`;

    root.innerHTML = `
      <nav class="breadcrumbs" aria-label="${escapeHtml(I.t("مسار الصفحة"))}">
        <a href="index.html">${escapeHtml(I.t("الرئيسية"))}</a>
        <span>${I.isEnglish() ? "→" : "←"}</span>
        <a href="index.html#products">${escapeHtml(I.t("المنتجات"))}</a>
        <span>${I.isEnglish() ? "→" : "←"}</span>
        <b>${escapeHtml(name)}</b>
      </nav>

      <section class="product-detail">
        <div class="detail-gallery">
          <div class="detail-image">
            <img id="mainProductImage" src="${gallery[0]}" alt="${escapeHtml(name)}">
            <span class="status ${statusClass(product.status)}">${escapeHtml(status)}</span>
          </div>
          ${gallery.length > 1 ? `
            <div class="detail-thumbs">
              ${gallery.map((source, index) => `
                <button class="thumb-btn ${index === 0 ? "is-active" : ""}" type="button" data-src="${source}" aria-label="${I.isEnglish() ? `Product image ${index + 1}` : `صورة ${index + 1} للمنتج`}">
                  <img src="${source}" alt="">
                </button>`).join("")}
            </div>` : ""}
          <div class="image-note">${escapeHtml(imageNote)}</div>
        </div>

        <div class="detail-copy">
          <span class="eyebrow">${escapeHtml(category)}</span>
          <h1>${escapeHtml(name)}</h1>
          ${secondaryName ? `<p class="en-name">${escapeHtml(secondaryName)}</p>` : ""}
          <div class="detail-identifiers">
            <div class="detail-code"><span>${escapeHtml(I.t("العلامة التجارية"))}</span><strong>${escapeHtml(brand)}</strong></div>
            <div class="detail-code"><span>${escapeHtml(I.t("الموديل"))}</span><strong>${escapeHtml(I.t(currentModel))}</strong></div>
            <div class="detail-code"><span>${escapeHtml(I.isEnglish() ? "Article No." : "رقم الصنف")}</span><strong>${escapeHtml(currentArticleNumber)}</strong></div>
          </div>
          ${product.variants?.length ? `
            <label class="product-variant-selector" style="--variant-color:${escapeHtml(variant?.color || "#2d6a68")}">
              <span>${I.isEnglish() ? "Select type" : "اختر النوع"}</span>
              <select id="variantSelect">
                ${product.variants.map(item => `<option value="${escapeHtml(item.id)}" ${item.id === selectedVariantId ? "selected" : ""}>${escapeHtml(I.isEnglish() ? item.nameEn : item.name)}</option>`).join("")}
              </select>
            </label>` : ""}
          <p class="detail-description">${escapeHtml(description)}</p>
          <div class="detail-highlights">
            <span>✓ ${escapeHtml(I.t(product.realProduct ? "صورة منتج فعلية" : "بيانات منظمة"))}</span>
            <span>✓ ${escapeHtml(I.t("طلب سعر مباشر"))}</span>
            <span>✓ ${escapeHtml(I.t("عرض متجاوب"))}</span>
          </div>
          <div class="detail-actions">
            <button class="primary-btn" data-cart-add="${product.id}" ${variant ? `data-cart-variant="${escapeHtml(variant.id)}"` : ""} type="button">${escapeHtml(I.t("أضف إلى السلة"))} <span>+</span></button>
            <button class="secondary-btn" id="copyProduct" type="button">${escapeHtml(I.t("نسخ اسم المنتج"))}</button>
          </div>
          <p class="safety-note">${escapeHtml(disclaimer)}</p>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-head compact"><div><span class="eyebrow">Technical Data</span><h2>${escapeHtml(I.t("المواصفات الفنية"))}</h2></div></div>
        <div class="spec-table">
          ${specs.map(([key, value]) => `<div><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
        </div>
      </section>

      ${usages?.length ? `
        <section class="detail-section">
          <div class="section-head compact"><div><span class="eyebrow">Applications</span><h2>${escapeHtml(I.t("الاستخدامات"))}</h2></div></div>
          <ul class="usage-list">${usages.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>` : ""}

      <section class="detail-section related-section">
        <div class="section-head compact">
          <div><span class="eyebrow">${escapeHtml(I.t("منتجات أخرى"))}</span><h2>${escapeHtml(I.t("قد يهمك أيضًا"))}</h2></div>
          <a class="text-link" href="index.html#products">${escapeHtml(I.t("كل المنتجات ←"))}</a>
        </div>
        <div class="mini-products">
          ${related.map(item => {
            const relatedName = I.product(item, "name");
            return `<a href="product.html?id=${encodeURIComponent(item.id)}&v=31"><img src="${item.image}" alt=""><span><strong>${escapeHtml(relatedName)}</strong><small>${escapeHtml(I.t(item.model))}</small><small>${escapeHtml(item.articleNumber || "")}</small></span></a>`;
          }).join("")}
        </div>
      </section>`;

    document.querySelector("#copyProduct")?.addEventListener("click", () => {
      navigator.clipboard?.writeText(`${name}${variantName ? ` - ${variantName}` : ""} — ${I.t(currentModel)} — ${currentArticleNumber}`)
        .then(() => showToast(I.t("تم نسخ اسم المنتج والموديل")));
    });

    document.querySelector("#variantSelect")?.addEventListener("change", event => {
      selectedVariantId = event.target.value;
      render();
    });

    document.querySelectorAll(".thumb-btn").forEach(button => {
      button.addEventListener("click", () => {
        const mainImage = document.querySelector("#mainProductImage");
        if (mainImage) mainImage.src = button.dataset.src;
        document.querySelectorAll(".thumb-btn").forEach(item => item.classList.remove("is-active"));
        button.classList.add("is-active");
      });
    });
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

  document.querySelector("#themeToggle")?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  document.addEventListener("aloulou:languagechange", () => {
    render();
    setTheme(document.documentElement.dataset.theme || "light");
  });

  setTheme(localStorage.getItem("aloulouTheme") || "light");
  render();
})();
