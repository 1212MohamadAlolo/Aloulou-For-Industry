(() => {
  "use strict";
  const STORAGE_KEY = "aloulouLanguage";
  const TEXT_EN = {
  "انتقل إلى المحتوى": "Skip to content",
  "علولو للصناعة — خبرة في الحلول الكهربائية والصناعية منذ عام 1995": "Aloulou for Industry — Electrical and industrial solutions since 1995",
  "تحميل تطبيق الأندرويد": "Install Android App",
  "التطبيق مثبت": "App Installed",
  "الصفحة الرئيسية": "Home",
  "المنتجات": "Products",
  "الحلول": "Solutions",
  "من نحن": "About Us",
  "تواصل معنا": "Contact Us",
  "سلة المشتريات": "Shopping Cart",
  "السلة": "Cart",
  "حلول كهربائية وصناعية": "Electrical & Industrial Solutions",
  "كل ما يحتاجه مشروعك،": "Everything your project needs,",
  "من المنتج إلى الحل.": "from product to solution.",
  "نوفّر منتجات وحلولًا كهربائية وصناعية للورش والمنشآت والمشاريع، مع عرض واضح للمواصفات وطلب سعر مباشر من فريق علولو للصناعة.": "We provide electrical and industrial products and solutions for workshops, facilities, and projects, with clear specifications and direct quotation requests.",
  "استكشف المنتجات": "Explore Products",
  "خبرة منذ عام 1995": "Experience since 1995",
  "طلب سعر سريع": "Fast Quotation",
  "تصميم مناسب للهاتف": "Mobile-Friendly Design",
  "منتجات وحلول كهربائية وصناعية بخبرة موثوقة وخدمة مباشرة": "Electrical and industrial products backed by trusted experience and direct service",
  "خبرة مستمرة": "Continuous Experience",
  "طلب عرض سعر": "Request a Quote",
  "منتجات معروضة": "Products Listed",
  "تصنيفات رئيسية": "Main Categories",
  "واجهة عربية كاملة": "Arabic and English Interface",
  "متجاوب مع الهاتف": "Mobile Responsive",
  "كتالوج المنتجات": "Product Catalog",
  "اكتشف المنتجات": "Discover Products",
  "ابحث ضمن المنتجات والتصنيفات، واطّلع على المواصفات الفنية، ثم أضف ما تحتاجه إلى طلب عرض السعر.": "Search products and categories, review technical specifications, then add the required items to your shopping cart.",
  "عرض الشبكة": "View Grid",
  "طباعة الكتالوج": "Print Catalog",
  "الكل": "All",
  "إنفرترات": "Inverters",
  "قواطع": "Breakers",
  "تحكم": "Control",
  "لوحات": "Panels",
  "حساسات": "Sensors",
  "طاقة": "Power",
  "لا توجد منتجات مطابقة": "No Matching Products",
  "جرّب كلمة بحث أو تصنيفًا آخر.": "Try another keyword or category.",
  "من المنتج إلى التطبيق": "From Product to Application",
  "حلول حسب احتياجك": "Solutions for Your Needs",
  "التحكم بالمحركات": "Motor Control",
  "عرض الإنفرترات وعناصر التحكم ضمن مسار واضح يساعد العميل على الوصول إلى المنتج المناسب.": "Browse inverters and control components through a clear path that helps customers find the right product.",
  "استكشف المنتجات ←": "Explore Products →",
  "تجهيز اللوحات": "Panel Assembly",
  "استقبال متطلبات المشروع والصور والملفات لتجهيز عرض سعر مخصص.": "Send project requirements, images, and files to receive a tailored quotation.",
  "افتح سلة المشتريات ←": "Open Shopping Cart →",
  "الحماية والتوزيع": "Protection & Distribution",
  "تنظيم القواطع وملحقات الحماية ضمن تصنيفات ومواصفات سهلة المقارنة.": "Browse breakers and protection accessories in categories with easy-to-compare specifications.",
  "منذ 1995": "Since 1995",
  "الجودة رقم 1 — The First": "Quality No. 1 — The First",
  "خبرة صناعية منذ عام 1995، والجودة دائمًا في المرتبة الأولى.": "Industrial experience since 1995, with quality always in first place.",
  "علولو للصناعة شركة عائلية تعمل في مجال المنتجات والحلول الكهربائية والصناعية، وتخدم احتياجات الورش والمنشآت والمشاريع من خلال الخبرة العملية، اختيار المنتجات المناسبة، والاستجابة المباشرة لمتطلبات العملاء.": "Aloulou for Industry is a family business specializing in electrical and industrial products and solutions. We serve workshops, facilities, and projects through practical experience, suitable product selection, and direct response to customer requirements.",
  "منذ انطلاقتنا عام 1995، كان مبدأنا واضحًا: تقديم جودة موثوقة وخدمة مسؤولة تجعل العميل شريكًا طويل الأمد. لذلك نعتمد شعارنا: الجودة رقم 1 — The First.": "Since our launch in 1995, our principle has been clear: reliable quality and responsible service that build long-term customer partnerships. This is why our slogan is: Quality No. 1 — The First.",
  "خبرة متواصلة في السوق منذ عام 1995": "Continuous market experience since 1995",
  "حلول ومستلزمات كهربائية وصناعية": "Electrical and industrial solutions and supplies",
  "خدمة مباشرة عبر فرعين داخل مدينة حلب": "Direct service through two branches in Aleppo",
  "التزام بالجودة، الموثوقية وخدمة ما بعد البيع": "Commitment to quality, reliability, and after-sales service",
  "تواصل مع الإدارة": "Contact Management",
  "تواصل مباشر": "Direct Contact",
  "تواصل مع قسم المبيعات في علولو للصناعة.": "Contact the Aloulou for Industry Sales Department.",
  "للاستفسار عن المنتجات، الكميات، تجهيز اللوحات أو طلب عرض سعر، تواصل مع قسم المبيعات مباشرة عبر الهاتف أو WhatsApp.": "For product inquiries, quantities, panel assembly, or quotations, contact the Sales Department directly by phone or WhatsApp.",
  "قسم المبيعات": "Sales Department",
  "الطلبات والاستفسارات": "Orders and Inquiries",
  "الفروع": "Branches",
  "الفرع الأول": "Branch One",
  "الفرع الثاني": "Branch Two",
  "حلب — الجميلية — شارع المحكمة العسكرية — جانب فلافل النزهة.": "Aleppo — Al-Jamiliyah — Military Court Street — next to Falafel Al-Nuzha.",
  "حلب — الأكرمية — جانب الفرن المحلي.": "Aleppo — Al-Akramiyah — next to the local bakery.",
  "البريد والوكلاء": "Email & Agents",
  "البريد الإلكتروني": "Email",
  "الوكلاء": "Agents",
  "قريبًا — Soon": "Coming Soon",
  "تواصل مع قسم المبيعات عبر WhatsApp": "Contact Sales via WhatsApp",
  "الاسم": "Name",
  "رقم الهاتف": "Phone Number",
  "نوع الطلب": "Request Type",
  "استفسار عن منتج": "Product Inquiry",
  "تجهيز لوحة": "Panel Assembly",
  "طلب جملة": "Wholesale Order",
  "تفاصيل الطلب": "Request Details",
  "إرسال الطلب إلى قسم المبيعات عبر WhatsApp": "Send Request to Sales via WhatsApp",
  "عند الإرسال ستُفتح محادثة WhatsApp مع رسالة الطلب جاهزة.": "WhatsApp will open with your prepared request message.",
  "العودة إلى المنتجات ↑": "Back to Products ↑",
  "علولو للصناعة — خبرة منذ 1995، والجودة دائمًا في المرتبة الأولى.": "Aloulou for Industry — Experience since 1995, with quality always first.",
  "تحتاج مساعدة باختيار المنتج؟": "Need help choosing a product?",
  "اسأل قسم المبيعات مباشرة": "Ask the Sales Department directly",
  "اطلب السعر عبر WhatsApp": "Request a Quote via WhatsApp",
  "تواصل مباشرة مع قسم المبيعات": "Contact the Sales Department directly",
  "الرئيسية ←": "Home →",
  "تفاصيل المنتج | علولو للصناعة": "Product Details | Aloulou for Industry",
  "طلب شراء": "Purchase Request",
  "قطعة محددة": "items selected",
  "إغلاق السلة": "Close cart",
  "تمت إضافة المنتج إلى السلة": "Product added to cart",
  "يمكنك متابعة اختيار المنتجات أو إتمام الطلب عبر WhatsApp.": "You can continue shopping or complete the order via WhatsApp.",
  "السلة فارغة": "Your cart is empty",
  "اختر المنتجات التي تحتاجها وحدد الكمية المطلوبة.": "Select the products you need and specify the required quantity.",
  "متابعة التسوق": "Continue Shopping",
  "إتمام الطلب عبر WhatsApp": "Complete Order via WhatsApp",
  "إنشاء فاتورة طلب ومتابعة الشراء": "Create an order invoice and continue",
  "إفراغ السلة": "Clear Cart",
  "تحديد الكمية": "Select Quantity",
  "أضف المنتج إلى السلة": "Add Product to Cart",
  "الكمية المطلوبة": "Required Quantity",
  "إنقاص الكمية": "Decrease quantity",
  "زيادة الكمية": "Increase quantity",
  "تأكيد وإضافة إلى السلة": "Confirm and Add to Cart",
  "تأكيد الطلب": "Confirm Order",
  "سيتم إنشاء فاتورة طلب PDF تحتوي على أسماء المنتجات والكميات، ثم متابعة الطلب مع قسم المبيعات عبر WhatsApp.": "A PDF order invoice containing product names and quantities will be created, then the order will continue with the Sales Department via WhatsApp.",
  "اسم العميل (اختياري)": "Customer Name (Optional)",
  "ملاحظات الطلب (اختياري)": "Order Notes (Optional)",
  "مهم:": "Important:",
  "على الهاتف ستظهر نافذة المشاركة لاختيار WhatsApp وإرفاق ملف PDF. على الكمبيوتر سيتم تنزيل الفاتورة وفتح محادثة قسم المبيعات مباشرة.": "On mobile, the share panel will appear so you can select WhatsApp and attach the PDF. On desktop, the invoice will download and the Sales Department conversation will open.",
  "إنشاء الفاتورة والمتابعة": "Create Invoice and Continue",
  "فاتورة PDF + فتح محادثة قسم المبيعات": "PDF invoice + open Sales conversation",
  "جارٍ تجهيز الفاتورة…": "Preparing the invoice…",
  "إغلاق": "Close",
  "حذف المنتج": "Remove product",
  "هل تريد إفراغ سلة المشتريات؟": "Do you want to clear the shopping cart?",
  "التفاصيل": "Details",
  "أضف للسلة +": "Add to Cart +",
  "إضافة إلى المفضلة": "Add to favorites",
  "إزالة من المفضلة": "Remove from favorites",
  "أُضيف إلى المفضلة": "Added to favorites",
  "أُزيل من المفضلة": "Removed from favorites",
  "تم فتح WhatsApp ورسالة الطلب جاهزة للإرسال.": "WhatsApp opened with the request message ready to send.",
  "تم تجهيز رسالة WhatsApp": "WhatsApp message prepared",
  "مسار الصفحة": "Breadcrumb",
  "الرئيسية": "Home",
  "صورة توضيحية للمنتج": "Illustrative product image",
  "العلامة التجارية": "Brand",
  "الموديل": "Model",
  "صورة منتج فعلية": "Actual product image",
  "بيانات منظمة": "Organized product data",
  "طلب سعر مباشر": "Direct quotation request",
  "عرض متجاوب": "Responsive display",
  "أضف إلى السلة": "Add to Cart",
  "نسخ اسم المنتج": "Copy Product Name",
  "تنبيه: يجب مراجعة الكتالوج الأصلي قبل اعتماد المواصفات فنيًا أو تجاريًا.": "Notice: Review the original catalog before approving specifications for technical or commercial use.",
  "المواصفات الفنية": "Technical Specifications",
  "الاستخدامات": "Applications",
  "منتجات أخرى": "Other Products",
  "قد يهمك أيضًا": "You May Also Like",
  "كل المنتجات ←": "All Products →",
  "تم نسخ اسم المنتج والموديل": "Product name and model copied",
  "تحتاج مساعدة بهذا المنتج؟": "Need help with this product?",
  "لا يوجد اتصال": "Offline",
  "لا يوجد اتصال بالإنترنت": "No Internet Connection",
  "أعد المحاولة بعد عودة الاتصال.": "Try again when the connection is restored.",
  "إعادة المحاولة": "Retry",
  "كتالوج منتجات علولو للصناعة": "Aloulou for Industry Product Catalog",
  "تحميل HTML": "Download HTML",
  "تحميل PDF": "Download PDF",
  "السعر:": "Price:",
  "للطلب والتواصل عبر WhatsApp - قسم المبيعات:": "Orders and WhatsApp contact — Sales Department:",
  "صفحة 1 من 2": "Page 1 of 2",
  "صفحة 2 من 2": "Page 2 of 2",
  "علولو للصناعة - الجودة رقم 1 The First": "Aloulou for Industry — Quality No. 1, The First",
  "منتجات وحلول كهربائية وصناعية - خبرة منذ 1995": "Electrical and industrial products and solutions — Experience since 1995",
  "علولو للصناعة": "Aloulou for Industry",
  "غير محدد": "Not specified",
  "حسب الطلب": "Made to Order",
  "متوفر": "Available",
  "كمية محدودة": "Limited Stock",
  "تغذية وطاقة": "Power & Supply",
  "لوحات كهربائية": "Electrical Panels",
  "تحكم وأتمتة": "Control & Automation",
  "قواطع وحماية": "Breakers & Protection",
  "علامة تجريبية": "Demo Brand",
  "تصنيع علولو – تجريبي": "Aloulou Manufacturing – Demo",
  "فولتاح دوبلر": "Voltage Doubler",
  "علبة ريفزيون للمصاعد": "Elevator Revision Box",
  "جسر توحيد 10A": "Bridge Rectifier 10A",
  "محول 365VA": "Transformer 365VA",
  "سيكوينسر المصاعد RST": "Elevator RST Signal Sequencer",
  "محول مصاعد 550VA": "Elevator Transformer 550VA",
  "لوحة تحكم إلكترونية صناعية": "Industrial Electronic Control Board",
  "إنفرتر صناعي A100": "Industrial Inverter A100",
  "قاطع حماية C63": "Protection Breaker C63",
  "كونتاكتور صناعي D25": "Industrial Contactor D25",
  "ريليه حماية P10": "Protection Relay P10",
  "لوحة تحكم X12": "Control Panel X12",
  "حساس اقتراب I18": "Proximity Sensor I18",
  "مزود طاقة 24V": "DIN Power Supply 24V",
  "زر إيقاف طوارئ R40": "Emergency Stop R40",
  "RTL": "EN",
  "←": "→",
  "علولو للصناعة، خبرة منذ عام 1995 في المنتجات والحلول الكهربائية والصناعية وخدمة المشاريع والورش والمنشآت.": "Aloulou for Industry has provided electrical and industrial products and solutions for projects, workshops, and facilities since 1995.",
  "كتالوج علولو للصناعة للمنتجات والحلول الكهربائية والصناعية، مع طلب عرض سعر وتواصل مباشر.": "Aloulou for Industry catalog of electrical and industrial products and solutions, with direct quotation requests and contact.",
  "تفاصيل المنتجات والمواصفات ضمن كتالوج علولو للصناعة للحلول الكهربائية والصناعية.": "Product details and specifications from the Aloulou for Industry electrical and industrial solutions catalog.",
  "كتالوج منتجات علولو للصناعة للطباعة والتحميل بمقاس A4.": "Aloulou for Industry A4 product catalog for printing and download.",
  "إغلاق القائمة": "Close menu"
};

  Object.assign(TEXT_EN, {
  "سيتم إنشاء فاتورة الطلب وتحميلها بصيغتين: ملف PDF وصورة PNG.": "The order invoice will be created and downloaded in two formats: PDF and PNG image.",
  "الخطوات:": "Steps:",
  "بعد تحميل الملفين ستظهر لك نافذة تأكيد، ومنها تضغط «إرسال عبر واتساب» للانتقال مباشرة إلى قسم المبيعات.": "After both files are downloaded, a confirmation window will appear. Press “Send via WhatsApp” to go directly to the Sales Department.",
  "تحميل PDF + صورة الفاتورة": "Download PDF + Invoice Image",
  "تم إنشاء الفاتورة": "Invoice Created",
  "تم تحميل ملفات الفاتورة": "Invoice Files Downloaded",
  "تم تحميل ملف PDF وصورة PNG على جهازك.": "The PDF invoice and PNG image were downloaded to your device.",
  "الخطوة التالية": "Next Step",
  "اضغط «إرسال عبر واتساب» لفتح محادثة قسم المبيعات مع تفاصيل طلبك. يمكنك إرفاق ملف PDF أو الصورة إذا رغبت.": "Press “Send via WhatsApp” to open the Sales Department conversation with your order details. You may attach the PDF or image if you wish.",
  "إرسال عبر واتساب": "Send via WhatsApp",
  "تحميل PDF مجددًا": "Download PDF Again",
  "تحميل الصورة مجددًا": "Download Image Again",
  "جارٍ تجهيز ملف PDF وصورة الفاتورة…": "Preparing PDF and invoice image…",
  "تم تجهيز ملف PDF وصورة الفاتورة.": "PDF and invoice image are ready."
});

  Object.assign(TEXT_EN, {"اضغط هنا لمعرفة السعر":"Click here to check the price"});
  const ATTR_EN = {
  "علولو للصناعة": "Aloulou for Industry",
  "علولو للصناعة - الصفحة الرئيسية": "Aloulou for Industry — Home",
  "تحميل وتثبيت تطبيق علولو للصناعة": "Install the Aloulou for Industry app",
  "التنقل الرئيسي": "Main navigation",
  "تبديل الوضع الداكن": "Toggle dark mode",
  "فتح القائمة": "Open menu",
  "عرض بصري لهوية علولو للصناعة": "Aloulou for Industry brand presentation",
  "شعار علولو للصناعة الرسمي": "Official Aloulou for Industry logo",
  "زر تجريبي": "Decorative button",
  "فلترة المنتجات": "Filter products",
  "أيقونة علولو للصناعة": "Aloulou for Industry icon",
  "تواصل سريع عبر واتساب": "Quick WhatsApp contact",
  "إخفاء الرسالة": "Hide message",
  "اطلب السعر عبر واتساب من قسم المبيعات": "Request a quote from Sales via WhatsApp",
  "ابحث بالاسم أو الموديل...": "Search by name or model...",
  "الاسم الكامل": "Full name",
  "اذكر المنتج، الكمية والمواصفات المطلوبة...": "Enter the product, quantity, and required specifications...",
  "المدينة، تفاصيل إضافية، موعد التواصل...": "City, additional details, preferred contact time...",
  "علولو للصناعة، خبرة منذ عام 1995 في المنتجات والحلول الكهربائية والصناعية وخدمة المشاريع والورش والمنشآت.": "Aloulou for Industry has provided electrical and industrial products and solutions for projects, workshops, and facilities since 1995.",
  "كتالوج علولو للصناعة للمنتجات والحلول الكهربائية والصناعية، مع طلب عرض سعر وتواصل مباشر.": "Aloulou for Industry catalog of electrical and industrial products and solutions, with direct quotation requests and contact.",
  "تفاصيل المنتجات والمواصفات ضمن كتالوج علولو للصناعة للحلول الكهربائية والصناعية.": "Product details and specifications from the Aloulou for Industry electrical and industrial solutions catalog.",
  "كتالوج منتجات علولو للصناعة للطباعة والتحميل بمقاس A4.": "Aloulou for Industry A4 product catalog for printing and download."
};
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();

  function queryLanguage() {
    try {
      const value = new URLSearchParams(location.search).get("lang");
      return value === "en" || value === "ar" ? value : null;
    } catch (_) { return null; }
  }

  let current = queryLanguage() || localStorage.getItem(STORAGE_KEY) || "ar";
  if (!["ar","en"].includes(current)) current = "ar";
  localStorage.setItem(STORAGE_KEY, current);

  function translateString(arabic) {
    return current === "en" ? (TEXT_EN[arabic] || arabic) : arabic;
  }

  function productField(product, field) {
    if (!product) return "";
    if (current !== "en") return product[field] ?? "";
    const englishField = field === "name" ? "nameEn" : `${field}En`;
    return product[englishField] ?? product[field] ?? "";
  }

  function preserveWhitespace(raw, replacement) {
    const lead = raw.match(/^\s*/)?.[0] || "";
    const trail = raw.match(/\s*$/)?.[0] || "";
    return lead + replacement + trail;
  }

  function translateNode(node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const original = originalText.get(node);
    const trimmed = original.trim();
    if (!trimmed) return;
    node.nodeValue = current === "en" && Object.prototype.hasOwnProperty.call(TEXT_EN, trimmed)
      ? preserveWhitespace(original, TEXT_EN[trimmed])
      : original;
  }

  function translateElementAttributes(element) {
    const attrs = ["aria-label","placeholder","title","alt","content"];
    let saved = originalAttrs.get(element);
    if (!saved) { saved = {}; originalAttrs.set(element, saved); }
    attrs.forEach(attr => {
      if (!element.hasAttribute(attr)) return;
      if (!(attr in saved)) saved[attr] = element.getAttribute(attr);
      const original = saved[attr];
      element.setAttribute(attr, current === "en" ? (ATTR_EN[original] || TEXT_EN[original] || original) : original);
    });
  }

  function apply(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName;
        return tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT"
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateNode);
    if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root);
    root.querySelectorAll?.("*").forEach(translateElementAttributes);
    updateDocument();
    updateButtons();
  }

  function updateDocument() {
    document.documentElement.lang = current;
    document.documentElement.dir = current === "en" ? "ltr" : "rtl";
    document.documentElement.dataset.language = current;
  }

  function updateButtons() {
    document.querySelectorAll("[data-language-toggle]").forEach(button => {
      button.textContent = current === "en" ? "AR" : "EN";
      button.setAttribute("aria-label", current === "en" ? "التبديل إلى اللغة العربية" : "Switch to English");
      button.setAttribute("title", current === "en" ? "العربية" : "English");
    });
  }

  function setLanguage(language) {
    const next = language === "en" ? "en" : "ar";
    if (next === current) return;
    current = next;
    localStorage.setItem(STORAGE_KEY, current);
    apply(document);
    document.dispatchEvent(new CustomEvent("aloulou:languagechange", {detail:{language:current}}));
  }

  function toggleLanguage() {
    setLanguage(current === "en" ? "ar" : "en");
  }

  window.AloulouI18n = {
    get language() { return current; },
    isEnglish: () => current === "en",
    t: translateString,
    product: productField,
    setLanguage,
    toggleLanguage,
    apply
  };

  updateDocument();
  apply(document);
  document.addEventListener("click", event => {
    if (event.target.closest("[data-language-toggle]")) toggleLanguage();
  });
})();
