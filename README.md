# 📍 Family Location — v2.0.0

<div dir="rtl">

## עברית

### יכולות

#### 🗺️ מפה חיה
- מיקום כל בני המשפחה בזמן אמת על מפה אינטראקטיבית
- **ערכת צבעים כהה / בהירה** — האריחים (tiles) מתחלפים אוטומטית עם ערכת הצבעים (CartoDB Voyager / Dark)
- **פעימה מונפשת** על חברים בתנועה (הליכה, אופניים, נסיעה)
- **תג סטטוס** על כל סמן (בבית, בבית-ספר, בעבודה, בדרכים, ישן/ה, אל-תפריע)
- **שבב ETA** בחלונית של חבר/ה כשהם בדרך לנקודת עניין שמורה
- **אחוז סוללה** מוצג בחלונית (🔋%)
- בורר חברים — מיקוד המפה על אדם אחד או הצגת כולם
- הוספה/עריכה/מחיקה של **נקודות עניין** עם רדיוס התראה מותאם

#### 🐾 מסלול breadcrumb
- הדלקת/כיבוי מסלול התנועה שלך ישירות על המפה (60 נקודות GPS אחרונות)
- הנקודות מתפוגגות מחיוורות ← מוצקות ככל שמתקרבות לנקודה הנוכחית
- לחצן כפת-הדוב על המפה לחילוף מצב

#### 🆘 כפתור SOS
- לחיצה אחת שולחת התראת חירום לכל הקבוצה דרך Firestore
- אנימציה פועמת אדומה בזמן שה-SOS פעיל
- כל שאר החברים מקבלים הודעת באנר וסמן SOS אדום על המפה שלהם
- לחיצה נוספת מבטלת את ה-SOS

#### 💬 צ׳אט קבוצתי
- שיחת טקסט קבוצתית בזמן אמת (Firebase Firestore, ממוין לפי זמן)
- תג הודעות שלא נקראו על לשונית הצ׳אט
- גלילה אוטומטית להודעה האחרונה
- הודעות SOS מופיעות כבועה אדומה ממורכזת

#### 🎭 סטטוס ידני
- הגדרת סטטוס: 🏠 בבית · 🏫 בבי"ס · 💼 בעבודה · 🚗 בדרכים · 😴 ישן/ה · 🙏 אל תפריע
- אמוג'י הסטטוס מופיע כתג-שכבה על הסמן שלך במפה
- הסטטוס נשמר ב-Firestore וגלוי לכל בני הקבוצה בזמן אמת

#### 👁️ שלושה מצבי פרטיות (מחזור)
- **גלוי** — GPS מדויק משותף עם הקבוצה
- **שקט** 🤫 — מיקום משותף ברמת דיוק של ~100 מ' בלבד (ללא כתובת מדויקת)
- **מוסתר** 🙈 — בלתי נראה לחלוטין לאחרים; הסמן שלך מוסר מכל המפות

#### 📍 גיאו-גדר והתראות הגעה
- Toast + התראת מכשיר אוטומטיים עם כניסה לרדיוס של נקודת עניין
- המנהל מקבל התראת Firestore כשחבר/ת קבוצה מגיע/ה לנקודה

#### 📊 תנועה יומית והיסטוריה של 7 ימים
- מרחק (ק"מ) וספירת צעדים לכל חבר לכל יום
- **כפתורי ניווט יום קודם / יום הבא** בלשונית התנועה
- מסלול יומי צבעוני על המפה (ירוק = הליכה, צהוב = אופניים, אדום = נסיעה, אפור = עמידה)
- סמנים ממוספרים לעצירות עם זמן שהייה
- טבלת לוג מיקומים: כתובת, סוג פעילות, שעת התחלה–סיום, משך
- גיאו-קידוד הפוך דרך Nominatim (OSM) עם התאמה לשמות נקודות שמורות

#### 🚨 התראת מהירות
- Toast + התראת Firestore למנהל כאשר מהירות ה-GPS עולה על 120 קמ"ש

#### 🔋 ניטור סוללה
- אחוז הסוללה מדווח ל-Firestore בכל דחיפת מיקום ובכל שינוי רמת סוללה
- מוצג בחלונית של כל חבר במפה

#### 📲 התקנה כ-PWA
- PWA מלא: Web App Manifest, Service Worker, מטמון אופליין
- Chrome ב-Android: באנר התקנה מקורי מופיע אוטומטית
- iPhone: הדרכה צעד-אחר-צעד להוספה למסך הבית
- **Periodic Background Sync** — כשמותקן כ-PWA והלשונית פתוחה ברקע, ה-SW מעיר את הדף ודוחף GPS כל דקה

#### 🔄 עדכון אוטומטי
- בכל פתיחת האפליקציה שולף בשקט את ה-`index.html` האחרון מ-GitHub
- אם נמצאת גרסה חדשה יותר — מפעיל עדכון Service Worker וטוען מחדש

#### 🌐 רב-לשוני
- עברית (RTL) · אנגלית · רוסית
- העדפת שפה נשמרת ב-localStorage

#### 👥 ניהול קבוצה
- יצירה או הצטרפות לקבוצה באמצעות קוד הזמנה אקראי בן 8 תווים
- תמיכה בריבוי קבוצות — מעבר בין קבוצות ללא התנתקות
- המנהל יכול לשנות שם קבוצה, להסיר חברים ולראות את כל נתוני התנועה
- הרשאות מעקב לפי חבר (מי רשאי לראות את מיקום מי)

---

### מחסנית טכנולוגית

| שכבה | טכנולוגיה |
|---|---|
| אירוח | GitHub Pages |
| אימות | Firebase Authentication (אימייל + Google) |
| מסד נתונים | Firebase Firestore (compat SDK v9.23.0) |
| מפה | Leaflet.js 1.9.4 + CartoDB tiles |
| PWA | Service Worker + Web App Manifest |
| סנכרון רקע | Periodic Background Sync API |
| גיאו-קידוד | Nominatim (OSM) reverse geocode |
| פונט | Heebo (Google Fonts) |

---

### קונפיגורציה

ערוך את הקבועים הבאים בראש `index.html`:

```js
const APP_VERSION        = "2.0.0";
const LOCATION_UPDATE_MS = 30000;   // תדירות דחיפת מיקום באלפיות שנייה (ברירת מחדל 30 שנ')
const SPEED_ALERT_MS     = 33;      // סף התראת מהירות במ"ש (ברירת מחדל ≈120 קמ"ש)
```

---

</div>

---



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
