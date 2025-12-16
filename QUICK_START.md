# ⚽ Gumb Fussball App - Quick Start

## 🎯 Was ist das?

Eine vollständige **Progressive Web App (PWA)** für deine Fussballgruppe mit:
- ✅ Event-Verwaltung (Trainings planen)
- ✅ Zusagen/Absagen mit Gästen
- ✅ Utensilien-Koordination (Ball, Pumpe, etc.)
- ✅ Admin-Bereich für Verwaltung
- ✅ Mobile & Desktop optimiert
- ✅ Offline-fähig
- ✅ Komplett kostenlos!

---

## 📚 Dokumentation

| Datei | Beschreibung |
|-------|--------------|
| **README.md** | Vollständige Projekt-Dokumentation |
| **SETUP_GUIDE.md** | Schritt-für-Schritt Setup (START HIER!) |
| **DEPLOYMENT_CHECKLIST.md** | Checkliste für Deployment |
| **TROUBLESHOOTING.md** | Problemlösungen & FAQ |
| **FUTURE_FEATURES.md** | Ideen für zukünftige Features |

---

## 🚀 In 3 Schritten zur fertigen App:

### 1️⃣ Supabase Setup (15 Min)
1. Account auf [supabase.com](https://supabase.com) erstellen
2. Neues Projekt anlegen
3. SQL Migration ausführen
4. Admin-User anlegen

📖 **Details:** Siehe `SETUP_GUIDE.md` Schritt 2-4

### 2️⃣ GitHub & Vercel (10 Min)
1. Code zu GitHub pushen
2. Secrets hinzufügen
3. Mit Vercel verbinden
4. Deployen!

📖 **Details:** Siehe `SETUP_GUIDE.md` Schritt 7-8

### 3️⃣ Testen & Verwenden (5 Min)
1. URL öffnen
2. Einloggen
3. Erstes Event erstellen
4. Team einladen

📖 **Details:** Siehe `SETUP_GUIDE.md` Schritt 9-10

---

## 📁 Wichtige Dateien

```
gumb-app/
├── README.md                    ← Projekt-Übersicht
├── SETUP_GUIDE.md              ← START HIER für Setup
├── DEPLOYMENT_CHECKLIST.md     ← Alles erledigt?
├── TROUBLESHOOTING.md          ← Probleme? Lösungen hier
├── FUTURE_FEATURES.md          ← Feature-Ideen
│
├── supabase/
│   └── migrations/
│       └── 001_initial_setup.sql  ← Datenbank-Setup
│
├── src/
│   ├── components/             ← React Komponenten
│   ├── contexts/               ← Auth Context
│   ├── lib/                    ← Supabase Client
│   └── types/                  ← TypeScript Typen
│
├── .github/
│   └── workflows/
│       └── build.yml           ← GitHub Actions
│
├── package.json                ← Dependencies
├── vite.config.ts              ← Build Config
├── tailwind.config.js          ← Styling Config
└── vercel.json                 ← Deployment Config
```

---

## 💻 Technologie-Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Build:** Vite
- **PWA:** vite-plugin-pwa

**Alles kostenlos!** ✨

---

## ⚡ Schnellstart für Entwickler

```bash
# 1. Dependencies installieren
npm install

# 2. Environment Variables setzen
cp .env.example .env
# Dann .env mit deinen Supabase Credentials bearbeiten

# 3. Dev Server starten
npm run dev

# 4. Im Browser öffnen
# http://localhost:3000
```

---

## 📱 Als App installieren

### iPhone/iPad (Safari):
Teilen → "Zum Home-Bildschirm"

### Android (Chrome):
Menü → "App installieren"

### Desktop (Chrome/Edge):
⊕ Symbol in Adressleiste

---

## 🎓 Empfohlener Ablauf

Wenn du **keine Programmierkenntnisse** hast:

1. ✅ Lies **SETUP_GUIDE.md** komplett durch
2. ✅ Folge jedem Schritt genau
3. ✅ Nutze **DEPLOYMENT_CHECKLIST.md** zum Abhaken
4. ✅ Bei Problemen: **TROUBLESHOOTING.md**
5. ✅ Fragen? Erstelle ein GitHub Issue

**Geschätzte Zeit:** 30-45 Minuten bis zur fertigen App

---

## 🆘 Hilfe benötigt?

1. **Schaue in TROUBLESHOOTING.md** für häufige Probleme
2. **Überprüfe die Checkliste** in DEPLOYMENT_CHECKLIST.md
3. **Erstelle ein GitHub Issue** mit:
   - Beschreibung des Problems
   - Screenshots
   - Fehlermeldungen aus der Console (F12)

---

## 🎉 Nach dem Setup

### Für Admins:
- Events erstellen unter "Admin" → "Neues Event"
- Spieler aktivieren/deaktivieren
- Utensilien verwalten

### Für Spieler:
- Zu Events zusagen/absagen
- Gäste hinzufügen
- Utensilien auswählen (Ball, Pumpe, etc.)
- Kommentare schreiben

### Automatisch:
- Vergangene Events werden ausgeblendet
- Deadline um 13 Uhr am Event-Tag
- Jeder Git Push deployed automatisch

---

## 🔐 Sicherheit

- ✅ Row Level Security (RLS) aktiviert
- ✅ Keine Registrierung möglich (nur Admin kann User anlegen)
- ✅ Passwort-Login über Supabase Auth
- ✅ HTTPS durch Vercel
- ✅ Environment Variables für Secrets

---

## 💡 Tipps

1. **Teste zuerst lokal** bevor du deployed
2. **Mache regelmäßig Backups** (Git Commits)
3. **Dokumentiere Änderungen** in Commit Messages
4. **Nutze Branches** für größere Features
5. **Schaue in die Logs** bei Problemen (Console, Supabase, Vercel)

---

## 📞 Support & Community

- **Fragen:** GitHub Issues
- **Bugs:** GitHub Issues (Label: `bug`)
- **Features:** FUTURE_FEATURES.md für Ideen
- **Updates:** `git pull` für neue Versionen

---

## ✨ Features auf einen Blick

### User View:
- 📅 Event-Liste (nur zukünftige)
- ✅ Zusagen/Absagen
- 👥 Gäste hinzufügen
- 💬 Kommentare
- ⚽ Utensilien auswählen
- 👤 Profil anzeigen

### Admin View:
- ➕ Events erstellen
- 🗓️ Datum, Zeit, Ort festlegen
- 👥 Spieler aktivieren/deaktivieren
- 🔧 Utensilien anzeigen

### Automatisch:
- ⏰ Deadline um 13 Uhr
- 🚫 Vergangene Events ausblenden
- 📊 Teilnehmerzahl berechnen
- 📱 PWA-Installation möglich
- 🔄 Auto-Deploy bei Git Push

---

## 🏁 Los geht's!

**Nächster Schritt:** Öffne `SETUP_GUIDE.md` und starte mit Schritt 1!

Viel Erfolg! ⚽🎉
