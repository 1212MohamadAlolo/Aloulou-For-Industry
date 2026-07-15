(() => {
  "use strict";
  const I = window.AloulouI18n || {isEnglish:()=>false};
  const button = document.querySelector("#pwaInstallButton");
  const label = document.querySelector("#pwaInstallLabel");
  let deferredPrompt = null;

  const standalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;

  function installedText() {
    return I.isEnglish() ? "App Installed" : "التطبيق مثبت";
  }
  function installText() {
    return I.isEnglish() ? "Install Android App" : "تحميل تطبيق الأندرويد";
  }
  function setLabel(text) {
    if (label) label.textContent = text;
  }
  function refreshLabel() {
    setLabel(standalone() ? installedText() : installText());
  }

  function instructions() {
    if (location.protocol === "file:") {
      return I.isEnglish()
        ? "App installation works after publishing the website on GitHub Pages over HTTPS. Open the published link on your phone, then press the button again."
        : "تثبيت التطبيق يعمل بعد رفع الموقع على GitHub Pages وفتحه عبر HTTPS. افتح الرابط المنشور على الهاتف ثم اضغط الزر مرة أخرى.";
    }
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return I.isEnglish()
        ? "On iPhone: open the website in Safari, press Share, then select “Add to Home Screen”."
        : "على iPhone: افتح الموقع في Safari، اضغط زر المشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية».";
    }
    if (/Android/i.test(navigator.userAgent)) {
      return I.isEnglish()
        ? "Open Chrome's three-dot menu, then select “Install app” or “Add to Home screen”."
        : "من قائمة Chrome ذات النقاط الثلاث اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».";
    }
    return I.isEnglish()
      ? "Use the install icon next to the address bar in Chrome or Edge."
      : "استخدم رمز التثبيت الموجود بجانب شريط العنوان في Chrome أو Edge.";
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    button?.classList.add("is-ready");
  });

  button?.addEventListener("click", async () => {
    if (standalone()) {
      setLabel(installedText());
      alert(I.isEnglish()
        ? "The Aloulou for Industry app is already installed on this device."
        : "تطبيق علولو للصناعة مثبت بالفعل على هذا الجهاز.");
      return;
    }
    if (!deferredPrompt) {
      alert(instructions());
      return;
    }
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;
    button.classList.remove("is-ready");
    if (result.outcome === "accepted") setLabel(installedText());
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    setLabel(installedText());
    button?.classList.add("is-installed");
  });

  document.addEventListener("aloulou:languagechange", refreshLabel);

  if (standalone()) {
    setLabel(installedText());
    button?.classList.add("is-installed");
  } else {
    refreshLabel();
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      if (!sessionStorage.getItem("aloulou-sw-v30-reloaded")) {
        sessionStorage.setItem("aloulou-sw-v30-reloaded", "1");
        location.reload();
      }
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js?v=30.0.0", {scope:"./"})
        .then(registration => registration.update())
        .catch(error => console.warn("Service worker registration failed", error));
    });
  }
})();
