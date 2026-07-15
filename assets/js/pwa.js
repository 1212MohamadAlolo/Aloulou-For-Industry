(() => {
  "use strict";
  const button = document.querySelector("#pwaInstallButton");
  const label = document.querySelector("#pwaInstallLabel");
  let deferredPrompt = null;

  const standalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const setLabel = text => { if (label) label.textContent = text; };

  function instructions() {
    if (location.protocol === "file:") {
      return "تثبيت التطبيق يعمل بعد رفع الموقع على GitHub Pages وفتحه عبر HTTPS. افتح الرابط المنشور على الهاتف ثم اضغط الزر مرة أخرى.";
    }
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return "على iPhone: افتح الموقع في Safari، اضغط زر المشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية».";
    }
    if (/Android/i.test(navigator.userAgent)) {
      return "من قائمة Chrome ذات النقاط الثلاث اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».";
    }
    return "استخدم رمز التثبيت الموجود بجانب شريط العنوان في Chrome أو Edge.";
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    button?.classList.add("is-ready");
  });

  button?.addEventListener("click", async () => {
    if (standalone()) {
      setLabel("التطبيق مثبت");
      alert("تطبيق علولو للصناعة مثبت بالفعل على هذا الجهاز.");
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
    if (result.outcome === "accepted") setLabel("التطبيق مثبت");
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    setLabel("التطبيق مثبت");
    button?.classList.add("is-installed");
  });

  if (standalone()) {
    setLabel("التطبيق مثبت");
    button?.classList.add("is-installed");
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      if (!sessionStorage.getItem("aloulou-sw-v26-reloaded")) {
        sessionStorage.setItem("aloulou-sw-v26-reloaded", "1");
        location.reload();
      }
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js?v=26.0.0", { scope: "./" })
        .then(reg => reg.update())
        .catch(err => console.warn("Service worker registration failed", err));
    });
  }
})();