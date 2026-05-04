# 📍 Family Location — v2.0.0

A Hebrew-first Progressive Web App for real-time family location tracking, built with Firebase Firestore and Leaflet.js. Install directly from the browser — no App Store needed.

**Live:** [dimitryu.github.io/location](https://dimitryu.github.io/location/)

---

## Features

### 🗺️ Live Map
- Real-time location of all family members on an interactive Leaflet map
- **Dark / light map tiles** — switches automatically with the app theme (CartoDB Voyager / Dark)
- **Animated pulse** on moving members (walking, cycling, driving)
- **Status badge** on each marker (home, school, work, driving, sleeping, do-not-disturb)
- **ETA chip** in member popup when member is en-route to a saved point of interest
- **Battery level** shown in popup (🔋%)
- Member selector — focus the map on one person or show all
- Add/edit/delete **Points of Interest** (named locations with configurable alert radius)
- Tap any point-of-interest marker to fly the map to it

### 🐾 Breadcrumb Trail
- Toggle your own movement trail directly on the map (last 60 GPS fixes)
- Dots fade from transparent → solid as they approach the current position
- Toggle on/off with the paw-print button on the map

### 🆘 SOS Button
- One-tap emergency alert sent to the entire group via Firestore
- Pulsing red animation while SOS is active
- All other members receive a banner notification and a red SOS marker on their map
- Tap again to cancel SOS

### 💬 Group Chat
- Real-time group text chat (Firebase Firestore, ordered by timestamp)
- Unread badge on the Chat nav tab
- Messages auto-scroll to latest
- SOS messages appear as a centered red bubble

### 🎭 Manual Status
- Set your visible status: 🏠 Home · 🏫 School · 💼 Work · 🚗 Driving · 😴 Sleeping · 🙏 Do Not Disturb
- Status emoji appears as an overlay badge on your map marker
- Status is saved to Firestore and visible to all group members in real time

### 👁️ Privacy Modes (3-state cycle)
- **Visible** — exact GPS shared with the group
- **Quiet** 🤫 — location shared at ~100 m precision only (no exact address)
- **Hidden** 🙈 — completely invisible to others; your marker is removed from all maps

### 📍 Geofencing & Arrival Alerts
- Automatic toast + device notification when you enter a Point of Interest radius
- Admin receives a Firestore notification when any member arrives at a point

### 📊 Daily Movement & 7-Day History
- Distance (km) and step count per member per day
- **Previous / Next day** navigation buttons on the Metrics tab
- Colour-coded daily route on the map (green = walking, yellow = cycling, red = driving, grey = still)
- Numbered stop markers with dwell time
- Location log table: address, activity type, start–end time, duration
- Reverse geocoding via Nominatim (OSM) with saved-point name matching

### 🚨 Speed Alert
- Automatic toast + admin Firestore notification when GPS speed exceeds 120 km/h

### 🔋 Battery Monitoring
- Battery percentage reported to Firestore on every location push and on battery level change
- Displayed in each member's map popup

### 📲 Install as PWA
- Full PWA: Web App Manifest, Service Worker, offline cache
- Chrome on Android: native install banner appears automatically
- iPhone: guided "Add to Home Screen" steps shown in-app
- **Periodic Background Sync** — when installed as a PWA and the tab is open in the background, the SW wakes the page to push GPS every minute

### 🔄 Auto-Update
- On every app open, silently fetches the latest `index.html` from GitHub
- If a newer `APP_VERSION` is found, triggers a Service Worker update and reloads the page

### 🌐 Multilingual
- Hebrew (RTL) · English · Russian
- Language preference saved to localStorage

### 👥 Group Management
- Create or join a group via a random 8-character invite code
- Multi-group support — switch between groups without logging out
- Admin can rename the group, remove members, and see all movement data
- Per-member tracking permissions (who can see whom)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Hosting | GitHub Pages |
| Auth | Firebase Authentication (email + Google) |
| Database | Firebase Firestore (compat SDK v9.23.0) |
| Map | Leaflet.js 1.9.4 + CartoDB tiles |
| PWA | Service Worker + Web App Manifest |
| Background sync | Periodic Background Sync API |
| Geocoding | Nominatim (OSM) reverse geocode |
| Font | Heebo (Google Fonts) |

---

## Project Structure

```
/
├── index.html        # Single-page app (all HTML + CSS + JS)
├── sw.js             # Service Worker (cache, background sync, push)
├── manifest.json     # PWA manifest
├── icon.svg          # App icon (SVG — scales to any size)
├── icon-48.png       # PWA icon 48×48
├── icon-192.png      # PWA icon 192×192 (install banner, splash)
└── icon-512.png      # PWA icon 512×512 (splash screen)
```

---

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password and Google
3. Enable **Firestore Database** in production mode
4. Copy your project config into the `FIREBASE_CONFIG` block at the top of `index.html`

**Firestore collections used:**

| Collection | Purpose |
|---|---|
| `users/{uid}` | Display name, groupId |
| `groups/{gid}` | Name, joinCode, members[], permissions, adminUid |
| `joinCodes/{code}` | Maps invite code → groupId |
| `locations/{uid}` | Current location, motion, status, battery, quiet/hidden flags |
| `groups/{gid}/points` | Points of Interest |
| `groups/{gid}/chat` | Chat messages |
| `groups/{gid}/sos` | Active SOS alerts |
| `metrics/{gid_uid_date}` | Daily distance + steps |
| `tracks/{gid_uid_date}` | Raw GPS track points |
| `adminNotifs` | Arrival and speed alerts for admin |

---

## Configuration

Edit these constants at the top of `index.html`:

```js
const APP_VERSION        = "2.0.0";
const LOCATION_UPDATE_MS = 30000;   // push interval in ms (default 30s)
const SPEED_ALERT_MS     = 33;      // alert threshold in m/s (default ≈120 km/h)
```

---

## Author

**dimitryu** · [github.com/dimitryu/location](https://github.com/dimitryu/location)
