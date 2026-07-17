(() => {
  "use strict";

  const STORAGE_KEY = "aloulouConsentV31";
  const I = window.AloulouI18n || {
    isEnglish: () => false,
    apply: () => {}
  };

  const modal = document.querySelector("#siteConsentModal");
  const termsCheckbox = document.querySelector("#consentTerms");
  const notificationsCheckbox = document.querySelector("#consentNotifications");
  const continueButton = document.querySelector("#consentContinue");
  const manageButtons = document.querySelectorAll("[data-consent-manage]");
  const status = document.querySelector("#consentStatus");

  if (!modal || !termsCheckbox || !continueButton) return;

  function readConsent() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function saveConsent(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      termsAccepted: Boolean(data.termsAccepted),
      notificationsRequested: Boolean(data.notificationsRequested),
      notificationsPermission: data.notificationsPermission || "default",
      acceptedAt: new Date().toISOString(),
      version: "2026-07-v1"
    }));
  }

  function setModalOpen(open) {
    modal.classList.toggle("is-open", open);
    modal.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("consent-lock", open);
    if (open) {
      window.setTimeout(() => termsCheckbox.focus(), 100);
    }
  }

  function updateContinueState() {
    continueButton.disabled = !termsCheckbox.checked;
    continueButton.setAttribute("aria-disabled", String(!termsCheckbox.checked));
  }

  function setStatus(arabic, english = arabic, type = "") {
    if (!status) return;
    status.textContent = I.isEnglish() ? english : arabic;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
    status.hidden = false;
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) {
      setStatus(
        "هذا المتصفح لا يدعم إشعارات الويب.",
        "This browser does not support web notifications.",
        "error"
      );
      return "unsupported";
    }

    if (Notification.permission === "granted") {
      setStatus(
        "الإشعارات مفعّلة بالفعل.",
        "Notifications are already enabled.",
        "success"
      );
      return "granted";
    }

    if (Notification.permission === "denied") {
      setStatus(
        "تم منع الإشعارات من إعدادات المتصفح. يمكن إعادة تفعيلها من إعدادات الموقع.",
        "Notifications are blocked in browser settings. You can enable them from the site's browser settings.",
        "error"
      );
      return "denied";
    }

    try {
      // OneSignal can replace this native request after the App ID is connected.
      if (window.OneSignalDeferred && window.AloulouOneSignalConfigured) {
        let result = "default";
        window.OneSignalDeferred.push(async function(OneSignal) {
          await OneSignal.Notifications.requestPermission();
          result = OneSignal.Notifications.permission ? "granted" : Notification.permission;
        });
        return result;
      }

      return await Notification.requestPermission();
    } catch (error) {
      console.warn("Notification permission request failed:", error);
      setStatus(
        "تعذر فتح طلب الإشعارات. يمكنك تفعيله لاحقًا من إدارة الموافقات.",
        "The notification request could not be opened. You can enable it later from consent settings.",
        "error"
      );
      return "error";
    }
  }

  function refreshModalFromStoredConsent() {
    const stored = readConsent();
    termsCheckbox.checked = Boolean(stored?.termsAccepted);
    notificationsCheckbox.checked =
      stored?.notificationsRequested === true ||
      Notification?.permission === "granted";
    updateContinueState();
    if (status) status.hidden = true;
  }

  async function handleContinue() {
    if (!termsCheckbox.checked) return;

    continueButton.disabled = true;
    const wantsNotifications = notificationsCheckbox.checked;
    let permission = "not-requested";

    // Close the consent layer first, then request the native prompt from the same click.
    setModalOpen(false);

    if (wantsNotifications) {
      permission = await requestNotificationPermission();
    }

    saveConsent({
      termsAccepted: true,
      notificationsRequested: wantsNotifications,
      notificationsPermission: permission
    });

    continueButton.disabled = false;
  }

  termsCheckbox.addEventListener("change", updateContinueState);
  continueButton.addEventListener("click", handleContinue);

  manageButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      refreshModalFromStoredConsent();
      setModalOpen(true);
    });
  });

  document.querySelectorAll("[data-consent-close]").forEach(button => {
    button.addEventListener("click", () => {
      const stored = readConsent();
      if (stored?.termsAccepted) setModalOpen(false);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && readConsent()?.termsAccepted) {
      setModalOpen(false);
    }
  });

  document.addEventListener("aloulou:languagechange", () => {
    I.apply(modal);
  });

  const stored = readConsent();
  if (!stored?.termsAccepted) {
    termsCheckbox.checked = false;
    notificationsCheckbox.checked = false;
    updateContinueState();
    setModalOpen(true);
  } else {
    setModalOpen(false);
  }

  window.AloulouConsent = {
    open: () => {
      refreshModalFromStoredConsent();
      setModalOpen(true);
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      termsCheckbox.checked = false;
      notificationsCheckbox.checked = false;
      updateContinueState();
      setModalOpen(true);
    },
    get: readConsent
  };
})();