(() => {
  const products = window.ALOULOU_PRODUCTS || [];
  const STORAGE_KEY = "aloulouCart";
  const LEGACY_KEY = "aloulouQuote";
  const WHATSAPP_NUMBER = "963966248480";
  const I = window.AloulouI18n || {
    language: "ar",
    isEnglish: () => false,
    t: value => value,
    product: (product, field) => product?.[field] ?? "",
    apply: () => {}
  };
  const state = { cart: loadCart(), pendingProductId: null, lastInvoice: null };
  const pf = (product, field) => I.product(product, field);

  function loadCart() {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (current && typeof current === "object" && !Array.isArray(current)) return current;
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      if (Array.isArray(legacy) && legacy.length) {
        const migrated = Object.fromEntries(legacy.map(id => [id, 1]));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch (_) {}
    return {};
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    updateCartUI();
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: getItems() }));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  function getProduct(id) { return products.find(p => p.id === id); }
  function getQuantity(id) { return Number(state.cart[id] || 0); }
  function getItems() {
    return Object.entries(state.cart)
      .map(([id, quantity]) => ({ product: getProduct(id), quantity: Number(quantity) }))
      .filter(item => item.product && item.quantity > 0);
  }
  function totalQuantity() { return getItems().reduce((sum, item) => sum + item.quantity, 0); }

  function injectUI() {
    if (document.querySelector("#cartDrawer")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <aside class="cart-drawer" id="cartDrawer" aria-hidden="true" aria-label="سلة المشتريات">
        <div class="cart-backdrop" data-cart-close></div>
        <div class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
          <div class="cart-head">
            <div><span>طلب شراء</span><h2 id="cartTitle">سلة المشتريات</h2><p><b data-cart-count>0</b> قطعة محددة</p></div>
            <button class="icon-btn" data-cart-close type="button" aria-label="إغلاق السلة">×</button>
          </div>
          <div class="cart-feedback" id="cartFeedback" hidden>
            <strong>تمت إضافة المنتج إلى السلة</strong>
            <span>يمكنك متابعة اختيار المنتجات أو إتمام الطلب عبر WhatsApp.</span>
          </div>
          <div class="cart-items" id="cartItems"></div>
          <div class="cart-empty" id="cartEmpty">
            <span class="cart-empty-icon">🛒</span>
            <strong>السلة فارغة</strong>
            <p>اختر المنتجات التي تحتاجها وحدد الكمية المطلوبة.</p>
          </div>
          <div class="cart-actions">
            <button class="secondary-btn full" data-cart-close type="button">متابعة التسوق</button>
            <button class="cart-checkout-btn" id="cartCheckout" type="button">
              <span>إتمام الطلب عبر WhatsApp</span>
              <small>إنشاء فاتورة طلب ومتابعة الشراء</small>
            </button>
            <button class="cart-clear" id="cartClear" type="button">إفراغ السلة</button>
          </div>
        </div>
      </aside>

      <div class="cart-modal" id="quantityModal" aria-hidden="true">
        <div class="cart-modal-backdrop" data-quantity-close></div>
        <div class="cart-modal-card" role="dialog" aria-modal="true" aria-labelledby="quantityTitle">
          <button class="cart-modal-close" data-quantity-close type="button" aria-label="إغلاق">×</button>
          <span class="eyebrow">تحديد الكمية</span>
          <h2 id="quantityTitle">أضف المنتج إلى السلة</h2>
          <div class="quantity-product" id="quantityProduct"></div>
          <div class="quantity-stepper" aria-label="الكمية المطلوبة">
            <button type="button" data-qty-minus aria-label="إنقاص الكمية">−</button>
            <input id="quantityInput" type="number" min="1" max="999" value="1" inputmode="numeric">
            <button type="button" data-qty-plus aria-label="زيادة الكمية">+</button>
          </div>
          <button class="primary-btn full" id="quantityConfirm" type="button">تأكيد وإضافة إلى السلة</button>
        </div>
      </div>

      <div class="cart-modal" id="checkoutModal" aria-hidden="true">
        <div class="cart-modal-backdrop" data-checkout-close></div>
        <div class="cart-modal-card checkout-card" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
          <button class="cart-modal-close" data-checkout-close type="button" aria-label="إغلاق">×</button>
          <span class="eyebrow">تأكيد الطلب</span>
          <h2 id="checkoutTitle">إتمام الطلب عبر WhatsApp</h2>
          <p class="checkout-intro">سيتم إنشاء فاتورة الطلب وتحميلها بصيغتين: ملف PDF وصورة PNG.</p>
          <label class="checkout-field">اسم العميل (اختياري)<input id="checkoutName" type="text" autocomplete="name" placeholder="الاسم الكامل"></label>
          <label class="checkout-field">ملاحظات الطلب (اختياري)<textarea id="checkoutNotes" rows="3" placeholder="المدينة، تفاصيل إضافية، موعد التواصل..."></textarea></label>
          <div class="checkout-warning">
            <strong>الخطوات:</strong>
            <span>بعد تحميل الملفين ستظهر لك نافذة تأكيد، ومنها تضغط «إرسال عبر واتساب» للانتقال مباشرة إلى قسم المبيعات.</span>
          </div>
          <button class="cart-checkout-btn" id="checkoutConfirm" type="button">
            <span>إنشاء الفاتورة والمتابعة</span>
            <small>تحميل PDF + صورة الفاتورة</small>
          </button>
          <div class="checkout-progress" id="checkoutProgress" hidden>جارٍ تجهيز الفاتورة…</div>
        </div>
      </div>

      <div class="cart-modal" id="invoiceReadyModal" aria-hidden="true">
        <div class="cart-modal-backdrop" data-invoice-ready-close></div>
        <div class="cart-modal-card invoice-ready-card" role="dialog" aria-modal="true" aria-labelledby="invoiceReadyTitle">
          <button class="cart-modal-close" data-invoice-ready-close type="button" aria-label="إغلاق">×</button>
          <div class="invoice-ready-icon" aria-hidden="true">✓</div>
          <span class="eyebrow" id="invoiceReadyEyebrow">تم إنشاء الفاتورة</span>
          <h2 id="invoiceReadyTitle">تم تحميل ملفات الفاتورة</h2>
          <p class="invoice-ready-text" id="invoiceReadyText">تم تحميل ملف PDF وصورة PNG على جهازك.</p>

          <div class="invoice-ready-files">
            <div><span class="invoice-file-badge">PDF</span><b id="invoiceReadyPdfName">—</b></div>
            <div><span class="invoice-file-badge image">PNG</span><b id="invoiceReadyImageName">—</b></div>
          </div>
          <p class="invoice-download-note" id="invoiceReadyDownloadNote">إذا منع المتصفح أحد التحميلين، استخدم أزرار إعادة التحميل في الأسفل.</p>

          <div class="invoice-next-step">
            <strong id="invoiceReadyStepTitle">الخطوة التالية</strong>
            <span id="invoiceReadyStepText">اضغط «إرسال عبر واتساب» لفتح محادثة قسم المبيعات مع تفاصيل طلبك. يمكنك إرفاق ملف PDF أو الصورة إذا رغبت.</span>
          </div>

          <button class="invoice-whatsapp-btn" id="invoiceReadyWhatsapp" type="button">
            <span aria-hidden="true">◉</span>
            <b id="invoiceReadyWhatsappLabel">إرسال عبر واتساب</b>
          </button>

          <div class="invoice-download-again">
            <button class="secondary-btn" id="invoiceDownloadPdfAgain" type="button">تحميل PDF مجددًا</button>
            <button class="secondary-btn" id="invoiceDownloadImageAgain" type="button">تحميل الصورة مجددًا</button>
          </div>

          <button class="invoice-ready-close-link" data-invoice-ready-close type="button">إغلاق</button>
        </div>
      </div>
    `);
    I.apply(document.body);
  }

  function updateCartUI() {
    const items = getItems();
    document.querySelectorAll("[data-cart-count]").forEach(element => element.textContent = totalQuantity());
    const list = document.querySelector("#cartItems");
    const empty = document.querySelector("#cartEmpty");
    const checkoutButton = document.querySelector("#cartCheckout");
    if (!list || !empty || !checkoutButton) return;

    empty.hidden = items.length > 0;
    checkoutButton.disabled = items.length === 0;
    list.innerHTML = items.map(({product, quantity}) => {
      const name = pf(product, "name");
      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${escapeHtml(name)}">
          <div class="cart-item-copy">
            <strong>${escapeHtml(name)}</strong>
            <small>${escapeHtml(I.t(product.model))}</small>
            <div class="cart-item-quantity">
              <button type="button" data-cart-minus="${product.id}" aria-label="${escapeHtml(I.t("إنقاص الكمية"))}">−</button>
              <b>${quantity}</b>
              <button type="button" data-cart-plus="${product.id}" aria-label="${escapeHtml(I.t("زيادة الكمية"))}">+</button>
            </div>
          </div>
          <button class="cart-remove" type="button" data-cart-remove="${product.id}" aria-label="${escapeHtml(I.t("حذف المنتج"))}">×</button>
        </article>`;
    }).join("");
  }

  function setModalOpen(modal, open) {
    modal?.classList.toggle("is-open", open);
    modal?.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", Boolean(document.querySelector(".cart-modal.is-open, .cart-drawer.is-open")));
  }

  function openCart(showFeedback = false) {
    const drawer = document.querySelector("#cartDrawer");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const feedback = document.querySelector("#cartFeedback");
    if (feedback) {
      feedback.hidden = !showFeedback;
      clearTimeout(openCart.feedbackTimer);
      if (showFeedback) openCart.feedbackTimer = setTimeout(() => feedback.hidden = true, 5200);
    }
  }
  function closeCart() {
    const drawer = document.querySelector("#cartDrawer");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.toggle("no-scroll", Boolean(document.querySelector(".cart-modal.is-open")));
  }

  function openQuantity(id) {
    const product = getProduct(id);
    if (!product) return;
    state.pendingProductId = id;
    const current = getQuantity(id) || 1;
    const name = pf(product, "name");
    document.querySelector("#quantityProduct").innerHTML = `<img src="${product.image}" alt=""><div><strong>${escapeHtml(name)}</strong><small>${escapeHtml(I.t(product.model))}</small></div>`;
    document.querySelector("#quantityInput").value = current;
    setModalOpen(document.querySelector("#quantityModal"), true);
    setTimeout(() => document.querySelector("#quantityInput")?.select(), 80);
  }

  function confirmQuantity() {
    const id = state.pendingProductId;
    if (!id) return;
    const input = document.querySelector("#quantityInput");
    const quantity = Math.max(1, Math.min(999, Number.parseInt(input.value, 10) || 1));
    state.cart[id] = quantity;
    saveCart();
    setModalOpen(document.querySelector("#quantityModal"), false);
    openCart(true);
  }

  function updateQuantity(id, delta) {
    const next = Math.max(0, getQuantity(id) + delta);
    if (next === 0) delete state.cart[id]; else state.cart[id] = next;
    saveCart();
  }

  function createOrderMeta() {
    const now = new Date();
    const pad = number => String(number).padStart(2, "0");
    return {
      number: `ALO-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`,
      date: new Intl.DateTimeFormat(I.isEnglish() ? "en-GB" : "ar-SY", {dateStyle:"medium", timeStyle:"short"}).format(now)
    };
  }

  function createInvoiceHtml(items, meta, customer) {
    const english = I.isEnglish();
    const lang = english ? "en" : "ar";
    const dir = english ? "ltr" : "rtl";
    const rows = items.map(({product, quantity}, index) => {
      const name = pf(product, "name");
      const secondary = english ? "" : (product.nameEn || "");
      return `<tr><td>${index + 1}</td><td><div class="prod"><b>${escapeHtml(name)}</b>${secondary ? `<small>${escapeHtml(secondary)}</small>` : ""}<small>${escapeHtml(I.t(product.model || "غير محدد"))}</small></div></td><td>${quantity}</td></tr>`;
    }).join("");

    const labels = english ? {
      title: "Purchase Order Invoice",
      pageTitle: "Purchase Order",
      order: "Order No.",
      date: "Date",
      customer: "Customer",
      notes: "Notes",
      unspecified: "Not specified",
      none: "None",
      product: "Product",
      quantity: "Quantity",
      notice: "This document is a preliminary purchase request, not a final financial invoice. Price, availability, and delivery are confirmed directly with the Aloulou for Industry Sales Department via WhatsApp.",
      footer: "Aloulou for Industry — Experience since 1995",
      sales: "Sales Department"
    } : {
      title: "فاتورة طلب شراء",
      pageTitle: "فاتورة طلب",
      order: "رقم الطلب",
      date: "التاريخ",
      customer: "العميل",
      notes: "ملاحظات",
      unspecified: "غير محدد",
      none: "لا توجد",
      product: "المنتج",
      quantity: "الكمية",
      notice: "هذه الوثيقة طلب شراء أولي وليست فاتورة مالية نهائية. يتم تأكيد السعر والتوفر والتوصيل مباشرة عبر WhatsApp مع قسم المبيعات في علولو للصناعة.",
      footer: "علولو للصناعة — خبرة منذ 1995",
      sales: "قسم المبيعات"
    };

    const textAlign = english ? "left" : "right";
    const noteBorder = english ? "border-left" : "border-right";
    return `<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${labels.pageTitle} ${meta.number}</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:Inter,Cairo,Tahoma,Arial,sans-serif;color:#172826;margin:0;background:#fff}.brandbar{height:8px;background:#1f4f4d;margin-bottom:15px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #2d6a68;padding-bottom:12px}.brand{display:grid;text-align:left;direction:ltr}.brand strong{font-size:25px;color:#2d6a68;letter-spacing:.04em}.brand small{font-size:11px;color:#c98b5c;font-weight:700;letter-spacing:.18em}h1{font-size:22px;margin:0;color:#1f4f4d}.meta{font-size:12px;line-height:1.8;color:#667773}.customer{margin:16px 0;padding:12px 14px;border:1px solid #dbe7e3;border-radius:12px;background:#f7faf9;font-size:13px}.customer b{color:#2d6a68}table{width:100%;border-collapse:collapse;page-break-inside:auto}thead{display:table-header-group}tr{page-break-inside:avoid}th{background:#2d6a68;color:#fff;padding:10px;font-size:12px}td{border:1px solid #dbe7e3;padding:10px;font-size:12px;text-align:center}.prod{display:grid;gap:2px;text-align:${textAlign}}.prod b{font-size:13px}.prod small{color:#667773;font-size:10px}.note{margin-top:16px;padding:12px;${noteBorder}:4px solid #c98b5c;background:#f7ece3;font-size:12px}footer{margin-top:18px;padding-top:12px;border-top:1px solid #dbe7e3;display:flex;justify-content:space-between;font-size:11px;color:#667773}.wa{color:#2d6a68;font-weight:700}</style></head><body><div class="brandbar"></div><header><div><h1>${labels.title}</h1><div class="meta">${labels.order}: ${meta.number}<br>${labels.date}: ${meta.date}</div></div><div class="brand"><strong>ALOLOU</strong><small>FOR INDUSTRY</small></div></header><section class="customer"><b>${labels.customer}:</b> ${escapeHtml(customer.name || labels.unspecified)}<br><b>${labels.notes}:</b> ${escapeHtml(customer.notes || labels.none)}</section><table><thead><tr><th>#</th><th>${labels.product}</th><th>${labels.quantity}</th></tr></thead><tbody>${rows}</tbody></table><div class="note">${labels.notice}</div><footer><span>${labels.footer}</span><span class="wa">WhatsApp: +963 966248480 — ${labels.sales}</span></footer></body></html>`;
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  async function createInvoiceCanvases(items, meta, customer) {
    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch (_) {}
    }
    const english = I.isEnglish();
    const labels = english ? {
      title:"PURCHASE ORDER INVOICE", order:"Order No.", date:"Date", details:"Order Details",
      customer:"Customer", notes:"Notes", none:"None", unspecified:"Not specified",
      quantity:"Quantity", model:"Model", product:"Product Name",
      notice:"Preliminary request — price, availability, and delivery are confirmed via WhatsApp before approval.",
      sales:"Sales Department: +963 966248480", footer:"ALOLOU FOR INDUSTRY — QUALITY NO. 1",
      page:"Page"
    } : {
      title:"فاتورة طلب شراء", order:"رقم الطلب", date:"التاريخ", details:"بيانات الطلب",
      customer:"العميل", notes:"ملاحظات", none:"لا توجد", unspecified:"غير محدد",
      quantity:"العدد", model:"الموديل", product:"اسم المنتج",
      notice:"طلب أولي — يتم تأكيد السعر والتوفر والتوصيل عبر WhatsApp قبل اعتماد الطلب.",
      sales:"قسم المبيعات: +963 966248480", footer:"علولو للصناعة — الجودة رقم 1",
      page:"الصفحة"
    };
    const perPage = 8;
    const pages = [];
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const canvas = document.createElement("canvas");
      canvas.width = 1240;
      canvas.height = 1754;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported by this browser");

      const align = english ? "left" : "right";
      const far = english ? 75 : 1165;
      const fontFamily = english ? "Inter, Arial, sans-serif" : "Cairo, Arial, sans-serif";

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1f4f4d";
      ctx.fillRect(0, 0, canvas.width, 24);

      ctx.fillStyle = "#2d6a68";
      ctx.textAlign = "left";
      ctx.direction = "ltr";
      ctx.font = `800 54px ${fontFamily}`;
      ctx.fillText("ALOLOU", 75, 104);
      ctx.fillStyle = "#c98b5c";
      ctx.font = `700 18px ${fontFamily}`;
      ctx.fillText("FOR INDUSTRY", 78, 139);

      ctx.direction = english ? "ltr" : "rtl";
      ctx.textAlign = align;
      ctx.fillStyle = "#1f4f4d";
      ctx.font = `700 38px ${fontFamily}`;
      ctx.fillText(labels.title, far, 92);
      ctx.fillStyle = "#667773";
      ctx.font = `500 20px ${fontFamily}`;
      ctx.fillText(`${labels.order}: ${meta.number}`, far, 132);
      ctx.fillText(`${labels.date}: ${meta.date}`, far, 166);
      ctx.fillStyle = "#c98b5c";
      ctx.fillRect(70, 205, 1100, 5);

      ctx.fillStyle = "#f7faf9";
      drawRoundedRect(ctx, 70, 235, 1100, 112, 18);
      ctx.fill();
      ctx.fillStyle = "#2d6a68";
      ctx.font = `700 22px ${fontFamily}`;
      ctx.fillText(labels.details, english ? 110 : 1130, 275);
      ctx.fillStyle = "#172826";
      ctx.font = `500 19px ${fontFamily}`;
      ctx.fillText(`${labels.customer}: ${customer.name || labels.unspecified}`, english ? 110 : 1130, 310);
      ctx.fillStyle = "#667773";
      ctx.font = `500 17px ${fontFamily}`;
      const note = customer.notes ? `${labels.notes}: ${customer.notes}` : `${labels.notes}: ${labels.none}`;
      ctx.fillText(note.slice(0, 90), english ? 650 : 650, 310);

      let y = 385;
      ctx.fillStyle = "#2d6a68";
      drawRoundedRect(ctx, 70, y, 1100, 66, 15);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 21px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.fillText(labels.quantity, 205, y + 42);
      ctx.fillText(labels.model, 450, y + 42);
      ctx.fillText(labels.product, 840, y + 42);
      ctx.fillText("#", 1125, y + 42);
      y += 78;

      const chunk = items.slice(pageIndex * perPage, pageIndex * perPage + perPage);
      const rowHeight = 126;
      for (let index = 0; index < chunk.length; index++) {
        const {product, quantity} = chunk[index];
        ctx.fillStyle = index % 2 ? "#ffffff" : "#f7faf9";
        ctx.strokeStyle = "#dbe7e3";
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, 70, y, 1100, rowHeight - 10, 16);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "#1f4f4d";
        ctx.font = `800 27px ${fontFamily}`;
        ctx.fillText(String(quantity), 205, y + 70);

        ctx.fillStyle = "#667773";
        ctx.font = `600 18px ${fontFamily}`;
        ctx.fillText(String(I.t(product.model || "غير محدد")).slice(0, 28), 450, y + 68);

        ctx.textAlign = english ? "left" : "right";
        ctx.direction = english ? "ltr" : "rtl";
        ctx.fillStyle = "#172826";
        ctx.font = `700 25px ${fontFamily}`;
        ctx.fillText(String(pf(product, "name")).slice(0, 46), english ? 650 : 1040, y + 49);
        ctx.fillStyle = "#2d6a68";
        ctx.font = `600 16px ${fontFamily}`;
        ctx.fillText(String(pf(product, "categoryLabel") || "").slice(0, 38), english ? 650 : 1040, y + 82);

        ctx.textAlign = "center";
        ctx.fillStyle = "#c98b5c";
        ctx.font = `800 21px ${fontFamily}`;
        ctx.fillText(String(pageIndex * perPage + index + 1), 1125, y + 70);
        y += rowHeight;
      }

      ctx.direction = english ? "ltr" : "rtl";
      ctx.textAlign = english ? "left" : "right";
      ctx.fillStyle = "#f7ece3";
      drawRoundedRect(ctx, 70, 1510, 1100, 95, 16);
      ctx.fill();
      ctx.fillStyle = "#7a4e2d";
      ctx.font = `600 17px ${fontFamily}`;
      ctx.fillText(labels.notice, english ? 110 : 1130, 1550);
      ctx.fillStyle = "#1f4f4d";
      ctx.font = `700 18px ${fontFamily}`;
      ctx.fillText(labels.sales, english ? 110 : 1130, 1582);

      ctx.fillStyle = "#2d6a68";
      ctx.fillRect(0, 1698, canvas.width, 56);
      ctx.fillStyle = "#ffffff";
      ctx.font = `600 17px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.fillText(`${labels.footer} — ${labels.page} ${pageIndex + 1} / ${totalPages}`, 620, 1734);
      pages.push(canvas);
    }
    return pages;
  }

  function dataUrlToBytes(dataUrl) {
    const binary = atob(dataUrl.split(",")[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    return bytes;
  }

  function buildPdfFromCanvases(canvases) {
    const enc = new TextEncoder();
    const chunks = [];
    const offsets = [0];
    let length = 0;
    const push = data => { const bytes = typeof data === "string" ? enc.encode(data) : data; chunks.push(bytes); length += bytes.length; };
    push("%PDF-1.4\n%âãÏÓ\n");
    const totalObjects = 2 + canvases.length * 3;
    const pageRefs = canvases.map((_,i)=>`${3+i*3} 0 R`).join(" ");
    const addObject = (num, bodyParts) => {
      offsets[num] = length;
      push(`${num} 0 obj\n`);
      for (const part of bodyParts) push(part);
      push("\nendobj\n");
    };
    addObject(1,["<< /Type /Catalog /Pages 2 0 R >>"]);
    addObject(2,[`<< /Type /Pages /Count ${canvases.length} /Kids [${pageRefs}] >>`]);
    canvases.forEach((canvas,i)=>{
      const pageObj=3+i*3, imageObj=4+i*3, contentObj=5+i*3;
      const jpg=dataUrlToBytes(canvas.toDataURL("image/jpeg",.9));
      const stream=`q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ`;
      addObject(pageObj,[`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`]);
      addObject(imageObj,[`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`,jpg,"\nendstream"]);
      addObject(contentObj,[`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}\nendstream`]);
    });
    const xrefStart=length;
    push(`xref\n0 ${totalObjects+1}\n0000000000 65535 f \n`);
    for(let i=1;i<=totalObjects;i++) push(`${String(offsets[i]).padStart(10,"0")} 00000 n \n`);
    push(`trailer\n<< /Size ${totalObjects+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
    const out=new Uint8Array(length); let pos=0;
    chunks.forEach(c=>{out.set(c,pos);pos+=c.length;});
    return new Blob([out],{type:"application/pdf"});
  }

  function downloadBlob(blob, filename) {
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }

  function canvasToPngBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error(I.isEnglish() ? "Unable to create the invoice image." : "تعذر إنشاء صورة الفاتورة."));
      }, "image/png");
    });
  }

  function combineInvoiceCanvases(canvases) {
    if (!canvases.length) throw new Error(I.isEnglish() ? "No invoice pages were generated." : "لم يتم إنشاء صفحات للفاتورة.");
    if (canvases.length === 1) return canvases[0];

    const gap = 26;
    const width = Math.max(...canvases.map(canvas => canvas.width));
    const height = canvases.reduce((sum, canvas) => sum + canvas.height, 0) + gap * (canvases.length - 1);
    const combined = document.createElement("canvas");
    combined.width = width;
    combined.height = height;
    const context = combined.getContext("2d");
    if (!context) throw new Error(I.isEnglish() ? "Canvas is not supported by this browser." : "المتصفح لا يدعم إنشاء صورة الفاتورة.");

    context.fillStyle = "#edf3f1";
    context.fillRect(0, 0, width, height);
    let y = 0;
    canvases.forEach((canvas, index) => {
      const x = Math.round((width - canvas.width) / 2);
      context.drawImage(canvas, x, y);
      y += canvas.height;
      if (index < canvases.length - 1) y += gap;
    });
    return combined;
  }

  function openInvoiceReadyModal(invoice) {
    state.lastInvoice = invoice;
    const english = I.isEnglish();
    const modal = document.querySelector("#invoiceReadyModal");
    if (!modal) return;

    document.querySelector("#invoiceReadyEyebrow").textContent =
      english ? "Invoice Created" : "تم إنشاء الفاتورة";
    document.querySelector("#invoiceReadyTitle").textContent =
      english ? "Invoice Files Downloaded" : "تم تحميل ملفات الفاتورة";
    document.querySelector("#invoiceReadyText").textContent =
      english
        ? "The PDF invoice and PNG image were downloaded to your device."
        : "تم تحميل ملف PDF وصورة PNG على جهازك.";
    document.querySelector("#invoiceReadyDownloadNote").textContent =
      english
        ? "If the browser blocks one of the downloads, use the download-again buttons below."
        : "إذا منع المتصفح أحد التحميلين، استخدم أزرار إعادة التحميل في الأسفل.";
    document.querySelector("#invoiceReadyStepTitle").textContent =
      english ? "Next Step" : "الخطوة التالية";
    document.querySelector("#invoiceReadyStepText").textContent =
      english
        ? "Press “Send via WhatsApp” to open the Sales Department conversation with your order details. You may attach the PDF or image if you wish."
        : "اضغط «إرسال عبر واتساب» لفتح محادثة قسم المبيعات مع تفاصيل طلبك. يمكنك إرفاق ملف PDF أو الصورة إذا رغبت.";
    document.querySelector("#invoiceReadyWhatsappLabel").textContent =
      english ? "Send via WhatsApp" : "إرسال عبر واتساب";
    document.querySelector("#invoiceDownloadPdfAgain").textContent =
      english ? "Download PDF Again" : "تحميل PDF مجددًا";
    document.querySelector("#invoiceDownloadImageAgain").textContent =
      english ? "Download Image Again" : "تحميل الصورة مجددًا";
    document.querySelector(".invoice-ready-close-link").textContent =
      english ? "Close" : "إغلاق";
    document.querySelector("#invoiceReadyPdfName").textContent = invoice.pdfName;
    document.querySelector("#invoiceReadyImageName").textContent = invoice.imageName;

    setModalOpen(modal, true);
  }

  function crc32(bytes) {
    let crc = 0 ^ -1;
    for (let i = 0; i < bytes.length; i++) {
      crc ^= bytes[i];
      for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
    return (crc ^ -1) >>> 0;
  }

  function writeUint16(view, offset, value) { view.setUint16(offset, value, true); }
  function writeUint32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }

  async function buildZipBlob(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const file of files) {
      const nameBytes = encoder.encode(file.name);
      const data = file.data instanceof Uint8Array ? file.data : new Uint8Array(await file.data.arrayBuffer());
      const checksum = crc32(data);
      const local = new Uint8Array(30 + nameBytes.length + data.length);
      const lv = new DataView(local.buffer);
      writeUint32(lv, 0, 0x04034b50);
      writeUint16(lv, 4, 20);
      writeUint16(lv, 6, 0x0800);
      writeUint16(lv, 8, 0);
      writeUint16(lv, 10, 0);
      writeUint16(lv, 12, 0);
      writeUint32(lv, 14, checksum);
      writeUint32(lv, 18, data.length);
      writeUint32(lv, 22, data.length);
      writeUint16(lv, 26, nameBytes.length);
      writeUint16(lv, 28, 0);
      local.set(nameBytes, 30);
      local.set(data, 30 + nameBytes.length);
      localParts.push(local);

      const central = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(central.buffer);
      writeUint32(cv, 0, 0x02014b50);
      writeUint16(cv, 4, 20);
      writeUint16(cv, 6, 20);
      writeUint16(cv, 8, 0x0800);
      writeUint16(cv, 10, 0);
      writeUint16(cv, 12, 0);
      writeUint16(cv, 14, 0);
      writeUint32(cv, 16, checksum);
      writeUint32(cv, 20, data.length);
      writeUint32(cv, 24, data.length);
      writeUint16(cv, 28, nameBytes.length);
      writeUint16(cv, 30, 0);
      writeUint16(cv, 32, 0);
      writeUint16(cv, 34, 0);
      writeUint16(cv, 36, 0);
      writeUint32(cv, 38, 0);
      writeUint32(cv, 42, offset);
      central.set(nameBytes, 46);
      centralParts.push(central);
      offset += local.length;
    }

    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    writeUint32(ev, 0, 0x06054b50);
    writeUint16(ev, 4, 0);
    writeUint16(ev, 6, 0);
    writeUint16(ev, 8, files.length);
    writeUint16(ev, 10, files.length);
    writeUint32(ev, 12, centralSize);
    writeUint32(ev, 16, offset);
    writeUint16(ev, 20, 0);
    return new Blob([...localParts, ...centralParts, end], {type:"application/zip"});
  }

  function buildWhatsAppText(items, meta, customer) {
    if (I.isEnglish()) {
      const lines = items.map((item, index) => `${index + 1}. ${pf(item.product, "name")} — Quantity: ${item.quantity}`);
      return `Hello Sales Department, I am sending purchase order ${meta.number}.\n${customer.name ? `Name: ${customer.name}\n` : ""}${lines.join("\n")}\n${customer.notes ? `Notes: ${customer.notes}\n` : ""}The order invoice was generated from the Aloulou for Industry website.`;
    }
    const lines = items.map((item, index) => `${index + 1}. ${item.product.name} — الكمية: ${item.quantity}`);
    return `مرحبًا قسم المبيعات، أرسل طلب الشراء رقم ${meta.number}.\n${customer.name ? `الاسم: ${customer.name}\n` : ""}${lines.join("\n")}\n${customer.notes ? `ملاحظات: ${customer.notes}\n` : ""}تم إنشاء ملف فاتورة الطلب من موقع علولو للصناعة.`;
  }

  function isLikelyMobileDevice() {
    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean") {
      return navigator.userAgentData.mobile;
    }
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || "")) {
      return true;
    }
    const coarsePointer = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
    const shortSide = Math.min(window.screen?.width || innerWidth, window.screen?.height || innerHeight);
    return coarsePointer && shortSide <= 900;
  }

  function openWhatsappPlaceholder() {
    const popup = window.open("about:blank", "_blank");
    if (!popup) return null;
    try {
      popup.opener = null;
      popup.document.title = I.isEnglish() ? "Opening WhatsApp…" : "فتح WhatsApp…";
      popup.document.documentElement.lang = I.isEnglish() ? "en" : "ar";
      popup.document.documentElement.dir = I.isEnglish() ? "ltr" : "rtl";
      const title = I.isEnglish() ? "Preparing the invoice…" : "جارٍ تجهيز الفاتورة…";
      const text = I.isEnglish() ? "The WhatsApp conversation will open shortly." : "سيتم فتح محادثة WhatsApp بعد لحظات.";
      popup.document.body.innerHTML = `<div style="font-family:Inter,Arial,Tahoma,sans-serif;display:grid;place-items:center;min-height:90vh;text-align:center;color:#1f4f4d"><div><strong style="font-size:22px">${title}</strong><p>${text}</p></div></div>`;
    } catch (_) {}
    return popup;
  }


  async function checkout() {
    const items = getItems();
    if (!items.length) return;

    const button = document.querySelector("#checkoutConfirm");
    const progress = document.querySelector("#checkoutProgress");
    progress.classList.remove("is-error");
    button.disabled = true;
    progress.hidden = false;
    progress.textContent = I.isEnglish() ? "Preparing PDF and image…" : "جارٍ تجهيز ملف PDF وصورة الفاتورة…";

    try {
      const customer = {
        name: document.querySelector("#checkoutName").value.trim(),
        notes: document.querySelector("#checkoutNotes").value.trim()
      };
      const meta = createOrderMeta();
      const message = buildWhatsAppText(items, meta, customer);
      const whatsappUrl =
        `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

      const html = createInvoiceHtml(items, meta, customer);
      const htmlBlob = new Blob([html], {type:"text/html;charset=utf-8"});
      const canvases = await createInvoiceCanvases(items, meta, customer);
      const pdfBlob = buildPdfFromCanvases(canvases);
      const imageCanvas = combineInvoiceCanvases(canvases);
      const imageBlob = await canvasToPngBlob(imageCanvas);

      const pdfName = `Aloulou_Order_${meta.number}.pdf`;
      const imageName = `Aloulou_Order_${meta.number}.png`;
      const htmlName = `Aloulou_Order_${meta.number}.html`;

      // Start both downloads. A short delay improves reliability on mobile browsers.
      downloadBlob(pdfBlob, pdfName);
      window.setTimeout(() => downloadBlob(imageBlob, imageName), 420);

      const invoice = {
        meta,
        customer,
        items,
        htmlBlob,
        pdfBlob,
        imageBlob,
        pdfName,
        imageName,
        htmlName,
        whatsappUrl,
        message
      };

      window.AloulouLastInvoice = invoice;
      state.lastInvoice = invoice;

      progress.textContent = I.isEnglish()
        ? "PDF and image are ready."
        : "تم تجهيز ملف PDF وصورة الفاتورة.";

      window.setTimeout(() => {
        setModalOpen(document.querySelector("#checkoutModal"), false);
        openInvoiceReadyModal(invoice);
        progress.hidden = true;
        progress.classList.remove("is-error");
      }, 650);
    } catch (error) {
      console.error("Invoice generation failed:", error);
      progress.classList.add("is-error");
      progress.hidden = false;
      progress.textContent = I.isEnglish()
        ? `Unable to create the invoice: ${error?.message || "Unknown error"}`
        : `تعذر إنشاء الفاتورة: ${error?.message || "خطأ غير معروف"}`;
    } finally {
      button.disabled = false;
    }
  }

  function bindEvents() {
    document.addEventListener("click", event => {
      const add=event.target.closest("[data-cart-add]"); if(add){openQuantity(add.dataset.cartAdd);return;}
      if(event.target.closest("[data-cart-open]")){openCart(false);return;}
      if(event.target.closest("[data-cart-close]")){closeCart();return;}
      if(event.target.closest("[data-quantity-close]")){setModalOpen(document.querySelector("#quantityModal"),false);return;}
      if(event.target.closest("[data-checkout-close]")){setModalOpen(document.querySelector("#checkoutModal"),false);return;}
      if(event.target.closest("[data-invoice-ready-close]")){setModalOpen(document.querySelector("#invoiceReadyModal"),false);return;}
      const plus=event.target.closest("[data-cart-plus]"); if(plus){updateQuantity(plus.dataset.cartPlus,1);return;}
      const minus=event.target.closest("[data-cart-minus]"); if(minus){updateQuantity(minus.dataset.cartMinus,-1);return;}
      const remove=event.target.closest("[data-cart-remove]"); if(remove){delete state.cart[remove.dataset.cartRemove];saveCart();return;}
      if(event.target.closest("[data-qty-plus]")){const i=document.querySelector("#quantityInput");i.value=Math.min(999,(parseInt(i.value)||1)+1);return;}
      if(event.target.closest("[data-qty-minus]")){const i=document.querySelector("#quantityInput");i.value=Math.max(1,(parseInt(i.value)||1)-1);return;}
    });
    document.querySelector("#quantityConfirm").addEventListener("click",confirmQuantity);
    document.querySelector("#quantityInput").addEventListener("keydown",e=>{if(e.key==="Enter")confirmQuantity();});
    document.querySelector("#cartClear").addEventListener("click",()=>{if(confirm(I.isEnglish() ? "Do you want to clear the shopping cart?" : "هل تريد إفراغ سلة المشتريات؟")){state.cart={};saveCart();}});
    document.querySelector("#cartCheckout").addEventListener("click",()=>{
      closeCart();
      setModalOpen(document.querySelector("#checkoutModal"),true);
    });
    document.querySelector("#checkoutConfirm").addEventListener("click",checkout);

    document.querySelector("#invoiceReadyWhatsapp").addEventListener("click", () => {
      const invoice = state.lastInvoice;
      if (!invoice?.whatsappUrl) return;
      window.location.assign(invoice.whatsappUrl);
    });

    document.querySelector("#invoiceDownloadPdfAgain").addEventListener("click", () => {
      const invoice = state.lastInvoice;
      if (invoice?.pdfBlob) downloadBlob(invoice.pdfBlob, invoice.pdfName);
    });

    document.querySelector("#invoiceDownloadImageAgain").addEventListener("click", () => {
      const invoice = state.lastInvoice;
      if (invoice?.imageBlob) downloadBlob(invoice.imageBlob, invoice.imageName);
    });

    document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();document.querySelectorAll(".cart-modal.is-open").forEach(m=>setModalOpen(m,false));}});
  }

  injectUI();
  bindEvents();
  updateCartUI();

  document.addEventListener("aloulou:languagechange", () => {
    I.apply(document.body);
    updateCartUI();
    if (state.pendingProductId && document.querySelector("#quantityModal")?.classList.contains("is-open")) {
      openQuantity(state.pendingProductId);
    }
    if (state.lastInvoice && document.querySelector("#invoiceReadyModal")?.classList.contains("is-open")) {
      openInvoiceReadyModal(state.lastInvoice);
    }
  });

  window.AloulouCart={getQuantity,getItems,openCart,openQuantity,add:(id,qty=1)=>{state.cart[id]=Math.max(1,qty);saveCart();}};
})();
