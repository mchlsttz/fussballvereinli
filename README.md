# Gumb Fussball App

Eine Progressive Web App (PWA) für die Verwaltung von Fussball-Trainings und Spieler-Koordination.

## 🎯 Features

### User View
- Login mit Email und Passwort (keine Registrierung)
- Übersicht aller anstehenden Trainings
- Zu-/Absagen für Events
- Gäste anmelden (+Anzahl)
- Kommentare hinzufügen
- Utensilien-Verwaltung (Ball, Pumpe, Überzieher)
- Automatische Deadline: 13:00 Uhr am Event-Tag

### Admin View
- Events erstellen (Datum, Zeit, Ort)
- Spieler aktivieren/deaktivieren
- Übersicht aller definierten Utensilien

## 🚀 Setup-Anleitung

### 1. Voraussetzungen

- Node.js (Version 20 oder höher)
- Ein Supabase Account (kostenlos)
- Ein GitHub Account
- Ein Vercel Account (kostenlos)

### 2. Supabase Setup

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Gehe zu **SQL Editor** im Supabase Dashboard
3. Öffne die Datei `supabase/migrations/001_initial_setup.sql`
4. Kopiere den gesamten Inhalt und führe ihn im SQL Editor aus
5. Gehe zu **Settings > API** und notiere:
   - `Project URL` (z.B. https://xxxxx.supabase.co)
   - `anon public` Key

#### Admin-User erstellen

1. Gehe zu **Authentication > Users** in Supabase
2. Klicke auf "Add user" > "Create new user"
3. Gib deine Email und ein Passwort ein
4. Nach der Erstellung, gehe zu **Table Editor > users**
5. Füge einen neuen Eintrag hinzu:
   - `id`: (Die User-ID aus Authentication)
   - `email`: Deine Email
   - `nickname`: Dein Spitzname
   - `is_admin`: `true` ✓
   - `is_active`: `true` ✓

#### Weitere User hinzufügen

1. Wiederhole die Schritte für jeden Spieler
2. Setze `is_admin` auf `false` für normale Spieler
3. Jeder User benötigt einen eindeutigen Spitznamen

### 3. Lokale Entwicklung

1. **Repository klonen und abhängigkeiten installieren:**
```bash
cd gumb-app
npm install
```

2. **Umgebungsvariablen setzen:**
```bash
cp .env.example .env
```

Bearbeite `.env` und füge deine Supabase Credentials ein:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=dein_anon_key
```

3. **Development Server starten:**
```bash
npm run dev
```

Die App läuft jetzt auf `http://localhost:3000`

### 4. GitHub Setup

1. **Erstelle ein neues Repository auf GitHub:**
   - Gehe zu [github.com/new](https://github.com/new)
   - Name: `gumb-fussball-app` (oder ein anderer Name)
   - Mache es privat (empfohlen)

2. **Pushe den Code zu GitHub:**
```bash
cd gumb-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/gumb-fussball-app.git
git push -u origin main
```

3. **Secrets für GitHub Actions einrichten:**
   - Gehe zu deinem Repository > Settings > Secrets and variables > Actions
   - Klicke auf "New repository secret"
   - Füge folgende Secrets hinzu:
     - Name: `VITE_SUPABASE_URL`, Value: Deine Supabase URL
     - Name: `VITE_SUPABASE_ANON_KEY`, Value: Dein Supabase Anon Key

### 5. Vercel Deployment

1. **Gehe zu [vercel.com](https://vercel.com) und melde dich an**

2. **Klicke auf "Add New..." > "Project"**

3. **Importiere dein GitHub Repository:**
   - Wähle dein `gumb-fussball-app` Repository
   - Klicke auf "Import"

4. **Konfiguriere das Projekt:**
   - Framework Preset: `Vite` (wird automatisch erkannt)
   - Root Directory: `./` (leer lassen)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables hinzufügen:**
   - Klicke auf "Environment Variables"
   - Füge hinzu:
     - `VITE_SUPABASE_URL`: Deine Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Dein Supabase Anon Key

6. **Klicke auf "Deploy"**

Nach wenigen Minuten ist deine App live! Vercel gibt dir eine URL wie `https://gumb-fussball-app.vercel.app`

### 6. Automatisches Deployment

✅ **Bereits eingerichtet!**

- Jeder `git push` zu `main` triggert automatisch:
  1. GitHub Actions führt Build und Tests aus
  2. Vercel deployed die neue Version automatisch

## 📱 Progressive Web App (PWA)

Die App kann auf Mobile und Desktop als eigenständige App installiert werden:

### iOS (iPhone/iPad):
1. Öffne die App in Safari
2. Tippe auf das Teilen-Symbol
3. Wähle "Zum Home-Bildschirm"
4. Bestätige mit "Hinzufügen"

### Android:
1. Öffne die App in Chrome
2. Tippe auf die drei Punkte (⋮)
3. Wähle "App installieren" oder "Zum Startbildschirm hinzufügen"

### Desktop (Chrome/Edge):
1. Klicke auf das ⊕ Symbol in der Adressleiste
2. Oder: Menü > "Installieren..."

## 🔧 Wartung & Updates

### Neue Datenbank-Migration hinzufügen

1. Erstelle eine neue Datei in `supabase/migrations/` z.B. `002_add_winter_utensils.sql`
2. Schreibe dein SQL
3. Führe es manuell im Supabase SQL Editor aus
4. Committe die Datei zu Git für die Dokumentation

### User hinzufügen/entfernen

- Neue User müssen im Supabase Dashboard unter Authentication angelegt werden
- Danach in der `users` Tabelle mit Nickname eintragen
- Admin kann User über die Admin-View aktivieren/deaktivieren

### Backup

- Supabase macht automatisch Backups
- Zusätzlich: Nutze Supabase Database > Backups für manuelle Backups

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## 📝 Projekt-Struktur

```
gumb-app/
├── .github/
│   └── workflows/
│       └── build.yml          # GitHub Actions Workflow
├── public/                    # Statische Assets
├── src/
│   ├── components/           # React Komponenten
│   │   ├── AdminView.tsx     # Admin-Bereich
│   │   ├── EventCard.tsx     # Event-Karte
│   │   ├── EventsList.tsx    # Event-Liste
│   │   ├── Header.tsx        # App-Header
│   │   └── Login.tsx         # Login-Seite
│   ├── contexts/
│   │   └── AuthContext.tsx   # Auth-Context
│   ├── lib/
│   │   └── supabase.ts       # Supabase Client
│   ├── types/
│   │   └── database.ts       # TypeScript Types
│   ├── App.tsx               # Haupt-App
│   ├── main.tsx              # Entry Point
│   └── index.css             # Globale Styles
├── supabase/
│   └── migrations/           # SQL Migrations
├── .env.example              # Env Template
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind Config
├── vite.config.ts            # Vite Config
└── vercel.json               # Vercel Config
```

## 🐛 Troubleshooting

### App lädt nicht
- Überprüfe ob die Environment Variables korrekt gesetzt sind
- Schaue in die Browser Console (F12) für Fehler
- Überprüfe Supabase Row Level Security Policies

### Login funktioniert nicht
- Stelle sicher, dass der User in Supabase Auth angelegt ist
- Überprüfe, dass der User auch in der `users` Tabelle existiert
- Überprüfe, dass `is_active = true` ist

### Build-Fehler auf GitHub/Vercel
- Überprüfe ob alle Secrets gesetzt sind
- Schaue in die GitHub Actions Logs
- Stelle sicher, dass keine Syntax-Fehler im Code sind

## 🆘 Support

Bei Fragen oder Problemen:
1. Schaue zuerst in die Logs (GitHub Actions / Vercel)
2. Überprüfe die Supabase Logs
3. Erstelle ein Issue im Repository

## 📄 Lizenz

Private Projekt für den persönlichen Gebrauch.
