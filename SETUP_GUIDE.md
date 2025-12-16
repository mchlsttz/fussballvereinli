# 🚀 Schritt-für-Schritt Setup Guide

Diese Anleitung führt dich durch die komplette Einrichtung der Gumb Fussball App.

## ✅ Checkliste

- [ ] Node.js installiert
- [ ] Supabase Account erstellt
- [ ] Datenbank aufgesetzt
- [ ] Admin-User angelegt
- [ ] GitHub Repository erstellt
- [ ] Vercel Account erstellt
- [ ] App deployed

---

## Schritt 1: Node.js installieren

### Windows:
1. Gehe zu [nodejs.org](https://nodejs.org)
2. Lade die LTS Version herunter
3. Führe den Installer aus

### Mac:
```bash
brew install node
```

### Verifizieren:
```bash
node --version  # sollte v20.x.x oder höher sein
npm --version   # sollte 10.x.x oder höher sein
```

---

## Schritt 2: Supabase Projekt erstellen

### 2.1 Account erstellen
1. Gehe zu [supabase.com](https://supabase.com)
2. Klicke auf "Start your project"
3. Melde dich mit GitHub an (empfohlen)

### 2.2 Neues Projekt erstellen
1. Klicke auf "New Project"
2. Wähle deine Organisation
3. Projekt-Einstellungen:
   - **Name**: `gumb-fussball-app`
   - **Database Password**: Wähle ein starkes Passwort (WICHTIG: Notiere es!)
   - **Region**: `Central EU (Frankfurt)` (wähle die nächstgelegene)
   - **Pricing Plan**: `Free` (0$/Monat)
4. Klicke auf "Create new project"
5. Warte 2-3 Minuten bis das Projekt bereit ist

### 2.3 API Credentials notieren
1. Gehe zu **Settings** (⚙️ unten links) > **API**
2. Notiere folgende Werte (brauchst du später):
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOi... (sehr langer String)
   ```

---

## Schritt 3: Datenbank aufsetzen

### 3.1 SQL Migration ausführen
1. Öffne **SQL Editor** in Supabase (links im Menü)
2. Klicke auf "New query"
3. Öffne die Datei `supabase/migrations/001_initial_setup.sql` aus deinem Projekt
4. Kopiere den **gesamten Inhalt** (ca. 250 Zeilen)
5. Füge ihn im SQL Editor ein
6. Klicke auf **RUN** (oder Ctrl+Enter)
7. Warte bis "Success. No rows returned" erscheint

### 3.2 Verifizieren
1. Gehe zu **Table Editor** (links im Menü)
2. Du solltest folgende Tabellen sehen:
   - `users`
   - `events`
   - `utensils`
   - `event_responses`
   - `utensil_assignments`

---

## Schritt 4: Admin-User anlegen

### 4.1 User in Authentication erstellen
1. Gehe zu **Authentication** > **Users**
2. Klicke auf **Add user** > **Create new user**
3. Fülle aus:
   - **Email**: deine@email.com
   - **Password**: wähle ein Passwort
   - **Auto Confirm User**: ✓ (aktivieren!)
4. Klicke auf **Create user**
5. **WICHTIG**: Kopiere die User ID (z.B. `d6c5e3f4-...`)

### 4.2 User-Profil in Datenbank erstellen
1. Gehe zu **Table Editor** > **users**
2. Klicke auf **Insert** > **Insert row**
3. Fülle aus:
   ```
   id:        [Die User ID von oben einfügen]
   email:     deine@email.com
   nickname:  Dein Spitzname (z.B. "Max")
   is_admin:  true ✓
   is_active: true ✓
   ```
4. Klicke auf **Save**

### 4.3 Test
1. Gehe wieder zu **Table Editor** > **users**
2. Du solltest deinen User sehen mit grünen Häkchen bei `is_admin` und `is_active`

---

## Schritt 5: Weitere Spieler anlegen

Wiederhole für jeden Spieler:

1. **Authentication** > **Users** > **Add user**
2. **Table Editor** > **users** > **Insert row**
   ```
   id:        [User ID aus Authentication]
   email:     spieler@email.com
   nickname:  Spitzname (z.B. "Tom")
   is_admin:  false ✗
   is_active: true ✓
   ```

**Tipp**: Für Tests kannst du zunächst nur 2-3 User anlegen.

---

## Schritt 6: Projekt lokal klonen

### 6.1 Projektordner öffnen
```bash
cd gumb-app
```

### 6.2 Dependencies installieren
```bash
npm install
```
Dauert ca. 1-2 Minuten.

### 6.3 Environment Variables setzen
```bash
cp .env.example .env
```

Bearbeite `.env` mit einem Text-Editor:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
(Deine Werte aus Schritt 2.3 einfügen)

### 6.4 Development Server starten
```bash
npm run dev
```

Öffne im Browser: `http://localhost:3000`

### 6.5 Ersten Login testen
1. Gehe zu `http://localhost:3000`
2. Gib deine Admin-Email und Passwort ein
3. Klicke auf "Anmelden"
4. Du solltest die Event-Liste sehen (noch leer)

---

## Schritt 7: GitHub Repository erstellen

### 7.1 Neues Repository auf GitHub
1. Gehe zu [github.com/new](https://github.com/new)
2. Einstellungen:
   - **Repository name**: `gumb-fussball-app`
   - **Description**: "Fussball Vereins-App"
   - **Private**: ✓ (empfohlen)
3. Klicke auf **Create repository**

### 7.2 Code zu GitHub pushen
```bash
# Im Projekt-Ordner (gumb-app)
git init
git add .
git commit -m "Initial commit - Gumb Fussball App"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/gumb-fussball-app.git
git push -u origin main
```

Ersetze `DEIN-USERNAME` mit deinem GitHub Username.

### 7.3 Secrets für GitHub Actions
1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **Settings** (oben rechts)
3. Gehe zu **Secrets and variables** > **Actions**
4. Klicke auf **New repository secret**

Füge **zwei Secrets** hinzu:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://xxxxxxxxxxxxx.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOi...` (dein langer Key)

---

## Schritt 8: Vercel Deployment

### 8.1 Vercel Account
1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf "Sign Up"
3. Wähle "Continue with GitHub"
4. Autorisiere Vercel

### 8.2 Neues Projekt
1. Klicke auf **Add New...** > **Project**
2. Unter "Import Git Repository":
   - Suche `gumb-fussball-app`
   - Klicke auf **Import**

### 8.3 Projekt konfigurieren
**Framework Preset**: Vite (wird automatisch erkannt)

**Environment Variables** hinzufügen:
Klicke auf **Environment Variables** und füge hinzu:

```
VITE_SUPABASE_URL          https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY     eyJhbGciOi...
```

### 8.4 Deployen
1. Klicke auf **Deploy**
2. Warte ca. 2-3 Minuten
3. 🎉 Deine App ist live!

Vercel gibt dir eine URL wie:
```
https://gumb-fussball-app.vercel.app
```

---

## Schritt 9: Erstes Event erstellen

### 9.1 In der App einloggen
1. Öffne deine Vercel URL
2. Logge dich mit deinem Admin-Account ein

### 9.2 Event erstellen
1. Klicke oben auf **Admin**
2. Unter "Events verwalten" klicke auf **+ Neues Event**
3. Fülle aus:
   ```
   Datum:      [Nächster Trainingstag]
   Ort:        Sportplatz Gummerwald
   Start-Zeit: 19:00
   End-Zeit:   21:00
   ```
4. Klicke auf **Event erstellen**

### 9.3 Test: Event zusagen
1. Klicke oben auf **Events**
2. Du siehst dein neues Event
3. Klicke auf **✓ Zusage**
4. Optional: Gäste hinzufügen
5. Klicke auf **Bestätigen**
6. Wähle Utensilien aus (z.B. Ball)

---

## Schritt 10: PWA Installation (Optional)

### iPhone/iPad:
1. Öffne die App in **Safari**
2. Tippe auf das **Teilen-Symbol** (Kasten mit Pfeil)
3. Scrolle runter und wähle **"Zum Home-Bildschirm"**
4. Tippe auf **"Hinzufügen"**

### Android:
1. Öffne die App in **Chrome**
2. Tippe auf die **drei Punkte** (⋮) oben rechts
3. Wähle **"App installieren"**

### Desktop:
1. Öffne die App in Chrome/Edge
2. Klicke auf das **⊕ Symbol** in der Adressleiste
3. Oder: Menü > **"Installieren..."**

---

## 🎉 Fertig!

Deine App ist jetzt:
- ✅ Live im Internet
- ✅ Als PWA installierbar
- ✅ Automatisch deployed bei jedem Git Push
- ✅ Kostenlos gehostet

### Nächste Schritte:

1. **Spieler informieren**: Teile die URL mit deinem Team
2. **Login-Daten verteilen**: Jeder Spieler bekommt seine Email + Passwort
3. **Erstes Training**: Erstelle Events und teste die Zusagen/Absagen

### Bei Änderungen:

```bash
# Code bearbeiten
# Dann:
git add .
git commit -m "Beschreibung der Änderung"
git push
```

→ Vercel deployed automatisch die neue Version!

---

## ❓ Häufige Probleme

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### "Environment variable not found"
Überprüfe ob `.env` Datei existiert und korrekt ausgefüllt ist.

### Login funktioniert nicht
1. Überprüfe ob User in Supabase Auth existiert
2. Überprüfe ob User in `users` Tabelle mit `is_active = true` existiert
3. Überprüfe Supabase Credentials in `.env`

### Build schlägt fehl
```bash
npm run build
```
Schaue welche Fehler angezeigt werden.

---

## 📞 Support

Bei Fragen: Erstelle ein Issue im GitHub Repository mit:
- Beschreibung des Problems
- Screenshots (wenn möglich)
- Fehlermeldungen aus der Console (F12)
