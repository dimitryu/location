// ╔══════════════════════════════════════════╗
// ║  Family Location — Service Worker v2.1.0 ║
// ╚══════════════════════════════════════════╝
const CACHE = 'family-location-v2.1.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Firebase, tiles, GitHub raw — network first
  if (url.includes('firestore') || url.includes('firebase') ||
      url.includes('openstreetmap') || url.includes('raw.githubusercontent')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // App assets — cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// ── Periodic Background Sync ──
// On Android PWA: wakes SW periodically, tells open tabs to push GPS.
// If no tabs are open: shows a silent notification to keep the app alive.
self.addEventListener('periodicsync', e => {
  if (e.tag === 'location-update') {
    e.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        if (clients.length > 0) {
          // App is open — ask it to push location
          clients.forEach(c => c.postMessage({ type: 'SW_REQUEST_LOCATION' }));
        } else {
          // App is closed — show a low-priority notification to keep tracking alive.
          // User can tap to open the app and resume GPS.
          self.registration.showNotification('📍 Family Location', {
            body: 'לחץ לפתיחת האפליקציה לעדכון מיקום',
            icon: './icon.svg',
            badge: './i