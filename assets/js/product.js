(() => {
  const products = window.ALOULOU_PRODUCTS || [];
  const params = new URLSearchParams(location.search);
  const product = products.find(p => p.id === params.get("id")) || products[0];
  const root = document.querySelector("#productRoot");
  const toast = document.querySelector("#toast");
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const showToast = msg => { toast.textContent=msg;toast.classList.add("is-visible");setTimeout(()=>toast.classList.remove("is-visible"),2200); };
  document.title = `${product.name} | علولو للصناعة`;
  root.innerHTML = `<nav class="breadcrumbs" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><span>←</span><a href="index.html#products">المنتجات</a><span>←</span><b>${escapeHtml(product.name)}</b></nav>
  <section class="product-detail">
    <div class="detail-gallery"><div class="detail-image"><img src="${product.image}" alt="${escapeHtml(product.name)}"><span class="status ${product.status}">${escapeHtml(product.statusLabel)}</span></div><div class="image-note">صورة توضيحية مؤقتة — ستُستبدل بصورة المنتج الحقيقية</div></div>
    <div class="detail-copy"><span class="eyebrow">${escapeHtml(product.categoryLabel)}</span><h1>${escapeHtml(product.name)}</h1><p class="en-name">${escapeHtml(product.nameEn)}</p><div class="detail-code"><span>الموديل</span><strong>${escapeHtml(product.model)}</strong></div><p class="detail-description">${escapeHtml(product.description)}</p><div class="detail-highlights"><span>✓ بيانات منظمة</span><span>✓ طلب سعر مباشر</span><span>✓ ملف مواصفات لاحقًا</span></div><div class="detail-actions"><button class="primary-btn" id="addQuote" type="button">أضف إلى طلب السعر <span>+</span></button><button class="secondary-btn" id="copyProduct" type="button">نسخ اسم المنتج</button></div><p class="safety-note">تنبيه: هذه النسخة استكشافية، ولا يجوز اعتماد المواصفات قبل مراجعة الكتالوج الأصلي.</p></div>
  </section>
  <section class="detail-section"><div class="section-head compact"><div><span class="eyebrow">Technical Data</span><h2>المواصفات الفنية</h2></div></div><div class="spec-table">${product.specs.map(([k,v])=>`<div><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong></div>`).join("")}</div></section>
  <section class="detail-section related-section"><div class="section-head compact"><div><span class="eyebrow">منتجات أخرى</span><h2>قد يهمك أيضًا</h2></div><a class="text-link" href="index.html#products">كل المنتجات ←</a></div><div class="mini-products">${products.filter(p=>p.id!==product.id).slice(0,3).map(p=>`<a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${p.image}" alt=""><span><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.model)}</small></span></a>`).join("")}</div></section>`;
  document.querySelector("#addQuote").addEventListener("click",()=>{let quote=JSON.parse(localStorage.getItem("aloulouQuote")||"[]");if(!quote.includes(product.id)){quote.push(product.id);localStorage.setItem("aloulouQuote",JSON.stringify(quote));showToast("أُضيف المنتج إلى طلب السعر");}else showToast("المنتج موجود ضمن الطلب");});
  document.querySelector("#copyProduct").addEventListener("click",()=>navigator.clipboard?.writeText(`${product.name} — ${product.model}`).then(()=>showToast("تم نسخ اسم المنتج والموديل")));
  const setTheme=t=>{document.documentElement.dataset.theme=t;localStorage.setItem("aloulouTheme",t);document.querySelector("#themeToggle").textContent=t==="dark"?"☀":"☾";};
  document.querySelector("#themeToggle").addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));setTheme(localStorage.getItem("aloulouTheme")||"light");
})();
