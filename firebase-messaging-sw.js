// Firebase Messaging Service Worker — handles FCM push when app is closed
// This file MUST be named firebase-messaging-sw.js and served from root

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBi1RUxou3oFhsVVilN0CulCBSPobbZMao",
  authDomain:        "location-56469.firebaseapp.com",
  projectId:         "location-56469",
  storageBucket:     "location-56469.firebasestorage.app",
  messagingSenderId: "892628974888",
  appId:             "1:892628974888:web:c33b8b031f3272fce5e41d"
});

const messaging = firebase.messaging();

// Handle background FCM messages (app closed or in background tab)
messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  const title   = n.title   || 'Family Location';
  const body    = n.body    || '';
  const tag     = (payload.data && payload.data.tag) || 'fcm-notif';
  const isSOS   = tag.startsWith('sos');

  return self.registration.showNotification(title, {
    body,
    icon:  './icon.svg',
    badge: './icon.svg',
    tag,
    vibrate: isSOS
      ? [600,150,600,150,600,150,600,150,600,150,600]
      : [200,100,200],
    requireInteraction: isSOS,
    silent: false
  });
});

// Notification click — open/focus the PWA
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if ('focus' in c) return c.focus();
      }
      return self.clients.openWindow('./');
    })
  );
});
