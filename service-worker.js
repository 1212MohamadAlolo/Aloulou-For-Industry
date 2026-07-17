const CACHE_NAME = "aloulou-pwa-v34-product-ux-1";
const CORE = [
  "./", "./index.html", "./product.html", "./terms.html", "./privacy.html", "./offline.html", "./site.webmanifest",
  "./assets/css/styles.css?v=35.0.0", "./assets/js/i18n.js?v=35.0.0", "./assets/js/consent.js?v=35.0.0", "./assets/js/products.js?v=35.0.0",
  "./assets/js/cart.js?v=35.0.0", "./assets/js/app.js?v=35.0.0",
  "./assets/js/product.js?v=35.0.0", "./assets/js/whatsapp-cta.js?v=35.0.0",
  "./assets/js/pwa.js?v=35.0.0", "./assets/images/brand/aloulou-logo-full.webp",
  "./assets/images/brand/icon-192.png", "./assets/images/brand/icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); return res;
    }).catch(async () => (await caches.match(req)) || (await caches.match("./offline.html"))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && res.ok) { const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); }
    return res;
  })));
});