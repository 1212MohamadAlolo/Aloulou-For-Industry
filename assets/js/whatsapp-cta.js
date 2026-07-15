(() => {
  "use strict";
  const I = window.AloulouI18n || {isEnglish:()=>false, t:value=>value};
  const root = document.querySelector("#floatingContact");
  const prompt = document.querySelector("#contactPrompt");
  const promptTitle = document.querySelector("#contactPromptTitle");
  const promptText = document.querySelector("#contactPromptText");
  const closeButton = document.querySelector("#promptClose");
  const link = document.querySelector("#floatingWhatsapp");
  const contactSection = document.querySelector("#contact");
  if (!root || !link) return;

  function currentProductName() {
    return document.querySelector("#productRoot h1")?.textContent?.trim() || "";
  }

  function updateContent() {
    const productName = currentProductName();
    if (productName) {
      if (promptTitle) promptTitle.textContent = I.isEnglish() ? "Need help with this product?" : "تحتاج مساعدة بهذا المنتج؟";
      if (promptText) {
        promptText.textContent = I.isEnglish()
          ? `Ask the Sales Department about ${productName}`
          : `اسأل قسم المبيعات عن ${productName}`;
      }
    } else {
      if (promptTitle) promptTitle.textContent = I.t("تحتاج مساعدة باختيار المنتج؟");
      if (promptText) promptText.textContent = I.t("اسأل قسم المبيعات مباشرة");
    }

    const message = productName
      ? (I.isEnglish()
          ? `Hello Sales Department, I would like to inquire about: ${productName}`
          : `مرحبًا قسم المبيعات، أريد الاستفسار عن المنتج: ${productName}`)
      : (I.isEnglish()
          ? "Hello Sales Department, I need help choosing the right product from Aloulou for Industry."
          : "مرحبًا قسم المبيعات، أحتاج مساعدة باختيار المنتج المناسب من منتجات علولو للصناعة.");

    link.href = `https://api.whatsapp.com/send?phone=963966248480&text=${encodeURIComponent(message)}`;
    link.setAttribute("aria-label", I.isEnglish()
      ? "Request a quote from the Sales Department via WhatsApp"
      : "اطلب السعر عبر واتساب من قسم المبيعات");
  }

  let hidden = false;
  function hidePrompt() {
    if (hidden) return;
    hidden = true;
    root.classList.add("prompt-hidden");
    window.setTimeout(() => prompt?.setAttribute("hidden", ""), 430);
  }

  updateContent();

  const promptSeen = sessionStorage.getItem("aloulouWhatsappPromptSeenV3") === "1";
  if (promptSeen) {
    hidden = true;
    root.classList.add("prompt-hidden");
    prompt?.setAttribute("hidden", "");
  } else {
    window.setTimeout(() => root.classList.add("is-visible"), 700);
    sessionStorage.setItem("aloulouWhatsappPromptSeenV3", "1");
    window.setTimeout(hidePrompt, 7200);
  }

  closeButton?.addEventListener("click", hidePrompt);
  link.removeAttribute("target");
  link.removeAttribute("rel");
  link.addEventListener("click", hidePrompt);

  document.addEventListener("aloulou:languagechange", () => {
    updateContent();
  });

  if (contactSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) hidePrompt();
    }, {threshold:0.18});
    observer.observe(contactSection);
  }
})();
