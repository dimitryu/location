# 📍 Family Tracker — הוראות הגדרה

## שלב 1 — צור פרויקט Firebase

1. פתח [console.firebase.google.com](https://console.firebase.google.com)
2. לחץ **Add project** → תן שם → המשך
3. בפרויקט: **Build → Authentication**
   - לחץ **Get started**
   - הפעל **Email/Password** ✓
   - הפעל **Google** ✓
4. **Build → Firestore Database**
   - לחץ **Create database**
   - בחר **Start in test mode** (נתקשה בהמשך)
   - בחר אזור קרוב (eur3 / us-central1)

---

## שלב 2 — העתק את ה-Config

1. לחץ על ⚙️ ← **Project Settings**
2. גלול ל**Your apps** → לחץ **</>** (Web)
3. תן שם לאפליקציה ← **Register**
4. העתק את כל ה-`firebaseConfig`

---

## שלב 3 — הדבק ב-index.html

פתח `index.html` וחפש:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  ...
};
```

החלף בערכים שלך. לדוגמה:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAbc123...",
  authDomain:        "my-family.firebaseapp.com",
  projectId:         "my-family",
  storageBucket:     "my-family.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc"
};
```

---

## שלב 4 — Firestore Security Rules

Firebase Console → Firestore → **Rules** → הדבק:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth != null;
    }

    // Locations: user writes own, members read
    match /locations/{uid} {
      allow write: if request.auth.uid == uid;
      allow read: if request.auth != null;
    }

    // Join codes: anyone authenticated can read
    match /joinCodes/{code} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }

    // Groups: members can read, admin can write
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        resource.data.members.hasAny([request.auth.uid]);

      match /points/{pointId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

לחץ **Publish**.

---

## שלב 5 — העלה לאינטרנט (GitHub Pages)

```bash
# 1. צור repo ב-GitHub
# 2. העלה את כל הקבצים:
git init
git add .
git commit -m "Family Tracker v1.0.0"
git remote add origin https://github.com/USERNAME/family-tracker.git
git push -u origin main

# 3. GitHub → Settings → Pages → Source: main / root
# האתר זמין ב: https://USERNAME.github.io/family-tracker/
```

---

## מבנה הנתונים ב-Firestore

```
users/{uid}
  name, email, groupId, createdAt

locations/{uid}
  uid, groupId, lat, lng, name, hidden, ts

groups/{groupId}
  name, adminUid, members[], joinCode, permissions{}, createdAt

groups/{groupId}/points/{pointId}
  name, lat, lng, radius, createdBy, createdAt

joinCodes/{code}
  groupId, createdAt
```

---

## תכונות האפליקציה

| תכונה | פרטים |
|---|---|
| 🔐 כניסה | Email/Password + Google |
| 👨‍👩‍👧‍👦 קבוצות | קוד הצטרפות 8 תווים |
| 📍 מעקב | עדכון כל 30 שניות |
| 🗺️ מפה | Leaflet + OpenStreetMap |
| 🙈 פרטיות | מצב "מוסתר" לכל משתמש |
| 👁️ הרשאות | מי רואה את מי (toggle) |
| 📌 נקודות | שמירה על מפה + שם |
| 🔔 התראות | הגעה לנקודה (geofence) |
| 🌍 שפות | עברית, אנגלית, רוסית |
| 🌙 ערכות | בהיר / כהה |
| 📱 PWA | ניתן להתקנה על כל מכשיר |

---

## מגבלות ידועות (iOS)

ב-iOS Safari, מעקב ברקע **מוגבל** ב-PWA.
לפתרון: הוסף לדף הבית (Add to Home Screen) ← האפליקציה תמשיך לרוץ כל עוד פתוחה.

---

פותח בעזרת Claude · v1.0.0
