// ╔══════════════════════════════════════════╗
// ║  Family Location — Service Worker v1.6.0 ║
// ╚══════════════════════════════════════════╝
const CACHE = 'family-location-v2.0.3';
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
// Wakes up the SW when installed as PWA; tells any open tab to push GPS
self.addEventListener('periodicsync', e => {
  if (e.tag === 'location-update') {
    e.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        if (clients.length > 0) {
          clients.forEach(c => c.postMessage({ type: 'SW_REQUEST_LOCATION' }));
        }
      })
    );
  }
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'Family Tracker', body: '' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'Family Tracker', {
      body: data.body,
      icon: './icon.svg',
      badge: './icon.svg',
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
