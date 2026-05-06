// ╔══════════════════════════════════════════╗
// ║  Family Location — Service Worker v2.5.8 ║
// ╚══════════════════════════════════════════╝
const CACHE = 'family-location-v2.5.8';
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
  if (url.includes('firestore') || url.includes('firebase') ||
      url.includes('openstreetmap') || url.includes('raw.githubusercontent')) {
    e.respondWith(fetch(e.request).catch(async () => { const c = await caches.match(e.request); return c || Response.error(); }));
    return;
  }
  if (e.request.method !== 'GET') return; // only cache GET
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

// Auth context sent by app after login
let swContext = null;

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SET_CONTEXT') {
    swContext = e.data;
  }
});

// Poll Firestore REST API for unseen SOS notifications (when app is closed)
async function checkForSOS() {
  if (!swContext) return;
  const uid = swContext.uid;
  const token = swContext.token;
  const groupIds = swContext.groupIds;
  const projectId = swContext.projectId;
  if (!uid || !token || !groupIds || !groupIds.length) return;

  let seenIds = [];
  try {
    const cache = await caches.open(CACHE);
    const r = await cache.match('/__sos_seen__');
    if (r) { seenIds = await r.json(); }
  } catch (e2) {}

  const newSeenIds = seenIds.slice();

  for (let g = 0; g < groupIds.length; g++) {
    const gid = groupIds[g];
    try {
      const parent = 'projects/' + projectId + '/databases/(default)/documents/groups/' + gid;
      const url = 'https://firestore.googleapis.com/v1/' + parent + ':runQuery';
      const bodyObj = {
        structuredQuery: {
          from: [{ collectionId: 'memberNotifs' }],
          where: {
            compositeFilter: {
              op: 'AND',
              filters: [
                { fieldFilter: { field: { fieldPath: 'toUid' }, op: 'EQUAL', value: { stringValue: uid } } },
                { fieldFilter: { field: { fieldPath: 'type'  }, op: 'EQUAL', value: { stringValue: 'sos' } } },
                { fieldFilter: { field: { fieldPath: 'seen'  }, op: 'EQUAL', value: { booleanValue: false } } }
              ]
            }
          },
          limit: 10
        }
      };

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj)
      });
      if (!resp.ok) { continue; }

      const results = await resp.json();
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.document) { continue; }
        const parts = result.document.name.split('/');
        const docId = parts[parts.length - 1];
        if (seenIds.indexOf(docId) >= 0) { continue; }

        const f = result.document.fields;
        const tsVal = f.ts && f.ts.timestampValue;
        if (tsVal && (Date.now() - new Date(tsVal).getTime() > 300000)) { continue; }

        const memberName = (f.memberName && f.memberName.stringValue) || '?';
        newSeenIds.push(docId);

        await self.registration.showNotification('\u{1F6A8} SOS!', {
          body: memberName + ' ' + '\u{05E6}\u{05E8}\u{05D9}\u{05DA}/\u{05D4} \u{05E2}\u{05D6}\u{05E8}\u{05D4}!',
          icon: './icon.svg',
          badge: './icon.svg',
          tag: 'sos-sw-' + docId,
          vibrate: [600,150,600,150,600,150,600,150,600,150,600],
          requireInteraction: true,
          silent: false
        });
      }
    } catch (e3) {}
  }

  if (newSeenIds.length !== seenIds.length) {
    try {
      const cache = await caches.open(CACHE);
      const trimmed = newSeenIds.slice(-50);
      await cache.put('/__sos_seen__', new Response(JSON.stringify(trimmed), {
        headers: { 'Content-Type': 'application/json' }
      }));
    } catch (e4) {}
  }
}

// Periodic Background Sync — GPS + SOS check
self.addEventListener('periodicsync', e => {
  if (e.tag === 'location-update') {
    e.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
        if (clients.length > 0) {
          clients.forEach(function(c) { c.postMessage({ type: 'SW_REQUEST_LOCATION' }); });
        } else {
          return checkForSOS().then(function() {
            return self.registration.showNotification('\u{1F4CD} Family Location', {
              body: '\u{05DC}\u{05D7}\u{05E5} \u{05DC}\u{05E4}\u{05EA}\u{05D9}\u{05D7}\u{05EA} \u{05D4}\u{05D0}\u{05E4}\u{05DC}\u{05D9}\u{05E7}\u{05E6}\u{05D9}\u{05D4} \u{05DC}\u{05E2}\u{05D3}\u{05DB}\u{05D5}\u{05DF} \u{05DE}\u{05D9}\u{05E7}\u{05D5}\u{05DD}',
              icon: './icon.svg',
              badge: './icon.svg',
              tag: 'bg-location-reminder',
              silent: true,
              requireInteraction: false
            }).catch(function() {});
          });
        }
      })
    );
  }
});

// Background Sync (one-shot) — GPS update + SOS check
self.addEventListener('sync', e => {
  if (e.tag === 'location-sync') {
    e.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
        clients.forEach(function(c) { c.postMessage({ type: 'SW_REQUEST_LOCATION' }); });
      })
    );
  }
  if (e.tag === 'sos-check') {
    e.waitUntil(checkForSOS());
  }
});

// Push Notifications (FCM / VAPID)
self.addEventListener('push', e => {
  let title   = 'Family Location';
  let body    = '';
  let tag     = 'family-notif';
  let vibrate = [200, 100, 200];

  if (e.data) {
    try {
      const data = e.data.json();
      title   = data.title   || title;
      body    = data.body    || body;
      tag     = data.tag     || tag;
      vibrate = data.vibrate || vibrate;
    } catch (ignored) {
      body = e.data.text() || body;
    }
  }

  if (tag && tag.indexOf('sos') === 0) {
    vibrate = [600,150,600,150,600,150,600,150,600,150,600];
  }

  e.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon:  './icon.svg',
      badge: './icon.svg',
      tag:   tag,
      vibrate: vibrate,
      requireInteraction: (tag && tag.indexOf('sos') === 0)
    })
  );
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      for (let i = 0; i < clients.length; i++) {
        if ('focus' in clients[i]) { return clients[i].focus(); }
      }
      return self.clients.openWindow('./');
    })
  );
});
