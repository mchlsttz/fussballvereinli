# 🔧 Troubleshooting Guide

Häufige Probleme und ihre Lösungen.

---

## 🚫 Login funktioniert nicht

### Problem: "Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten"

**Mögliche Ursachen & Lösungen:**

1. **User existiert nicht in Authentication**
   - Gehe zu Supabase > Authentication > Users
   - Prüfe ob der User existiert
   - Falls nicht: User anlegen mit "Add user"

2. **User nicht in users Tabelle**
   - Gehe zu Supabase > Table Editor > users
   - Prüfe ob User-Eintrag existiert
   - Falls nicht: Row hinzufügen mit derselben ID wie in Authentication

3. **User ist deaktiviert**
   - Gehe zu Supabase > Table Editor > users
   - Prüfe ob `is_active = true`
   - Falls nicht: Wert auf `true` ändern

4. **Falsches Passwort**
   - User muss Passwort zurücksetzen
   - In Supabase > Authentication > Users
   - Klicke auf User > "Send password reset email"

5. **Environment Variables falsch**
   - Überprüfe `.env` (lokal) oder Vercel Environment Variables
   - Stelle sicher dass VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY korrekt sind

---

## 🔄 "Cannot find module" Fehler

### Problem: Module können nicht gefunden werden

**Lösung:**
```bash
# Lösche node_modules und reinstalliere
rm -rf node_modules package-lock.json
npm install
```

---

## 🏗️ Build schlägt fehl

### Problem: `npm run build` oder GitHub Actions schlagen fehl

**Lösung 1: TypeScript Fehler**
```bash
# Prüfe auf Syntax-Fehler
npm run lint

# Schaue detaillierte Fehler
npm run build
```

**Lösung 2: Environment Variables fehlen**
- GitHub: Überprüfe Repository Secrets
- Vercel: Überprüfe Project Settings > Environment Variables
- Lokal: Überprüfe `.env` Datei

**Lösung 3: Dependencies fehlen**
```bash
npm install
```

---

## 📱 PWA installiert sich nicht

### Problem: "App zum Homescreen hinzufügen" erscheint nicht

**iOS (Safari):**
- PWA muss über Safari geöffnet werden (nicht Chrome!)
- Teilen-Symbol > "Zum Home-Bildschirm"

**Android (Chrome):**
- App muss über HTTPS laufen (Vercel macht das automatisch)
- Chrome zeigt nach einigen Besuchen automatisch Installations-Prompt
- Oder: Menü (⋮) > "App installieren"

**Desktop:**
- Nur Chrome und Edge unterstützen PWA Installation
- Firefox unterstützt keine PWA Installation
- Klicke auf ⊕ Symbol in der Adressleiste

**Fehlende Icons:**
- PWA funktioniert auch ohne Icons
- Für eigene Icons: Siehe `public/ICONS_README.md`

---

## 🗄️ Datenbank Probleme

### Problem: "Row Level Security policy violation"

**Lösung:**
Die SQL Migration wurde nicht korrekt ausgeführt.

```sql
-- Prüfe in Supabase SQL Editor ob RLS aktiviert ist:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Sollte für alle Tabellen 'true' sein
```

Falls nicht: `supabase/migrations/001_initial_setup.sql` erneut ausführen.

### Problem: Daten werden nicht gespeichert

**Lösung:**
```sql
-- Prüfe ob Policies existieren:
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

Falls leer: SQL Migration erneut ausführen.

---

## ⏰ Deadline funktioniert nicht

### Problem: Responses können nach 13 Uhr noch geändert werden

**Grund:** Timezone-Unterschiede

**Temporäre Prüfung:**
```javascript
// In EventCard.tsx
console.log('Event Date:', event.event_date);
console.log('Current Date:', new Date().toISOString());
console.log('Deadline Date:', new Date(`${event.event_date}T13:00:00`));
console.log('Is Locked:', isResponseLocked);
```

**Lösung:** Überprüfe dass das Datum im richtigen Format gespeichert wird.

---

## 🔐 Admin-View nicht sichtbar

### Problem: Admin-Button wird nicht angezeigt

**Lösung:**
```sql
-- Prüfe in Supabase SQL Editor:
SELECT id, email, nickname, is_admin 
FROM public.users 
WHERE email = 'deine@email.com';

-- is_admin muss 'true' sein
```

Falls nicht:
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'deine@email.com';
```

---

## 🌐 Vercel Deployment schlägt fehl

### Problem: Build Error auf Vercel

**Lösung 1: Environment Variables**
1. Gehe zu Vercel Project > Settings > Environment Variables
2. Stelle sicher dass beide Variables gesetzt sind:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Klicke "Save"
4. Triggere neues Deployment: Git push oder "Redeploy" in Vercel

**Lösung 2: Build Command**
- Prüfe dass Build Command = `npm run build`
- Output Directory = `dist`

**Lösung 3: Node Version**
```json
// In package.json hinzufügen:
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

## 📊 Events werden nicht angezeigt

### Problem: Event-Liste bleibt leer

**Checkliste:**

1. **Event existiert in Datenbank?**
   ```sql
   SELECT * FROM public.events ORDER BY event_date DESC;
   ```

2. **Event-Datum ist in der Zukunft?**
   - Events mit vergangenem Datum werden nicht angezeigt
   - Erstelle ein Event mit morgigem Datum zum Testen

3. **RLS Policy lässt Lesen zu?**
   ```sql
   -- Prüfe:
   SELECT * FROM pg_policies 
   WHERE tablename = 'events' AND cmd = 'SELECT';
   ```

4. **Console Errors?**
   - Drücke F12 im Browser
   - Schaue in die Console
   - Suche nach roten Fehlermeldungen

---

## 📲 Utensilien können nicht ausgewählt werden

### Problem: Klick auf Utensil macht nichts

**Lösung:**
User muss erst eine Zusage gemacht haben!
- Utensilien können nur von Teilnehmern ausgewählt werden
- Erst ✓ Zusage klicken, dann Utensilien auswählen

---

## 🔄 Automatisches Deployment funktioniert nicht

### Problem: Git push triggert keinen Deploy

**GitHub Actions:**
1. Gehe zu GitHub Repository > Actions
2. Prüfe ob Workflow läuft
3. Falls fehlgeschlagen: Schaue in die Logs

**Vercel:**
1. Gehe zu Vercel Project > Deployments
2. Prüfe ob neues Deployment getriggert wurde
3. Falls nicht: 
   - Gehe zu Settings > Git
   - Prüfe ob "Production Branch" = `main`

---

## 🐌 App lädt langsam

### Mögliche Ursachen:

1. **Viele User/Events**
   - Normal, Supabase Free Tier hat Limits
   - Erwäge Upgrade wenn nötig

2. **Schlechte Internetverbindung**
   - PWA cached Daten für Offline-Nutzung

3. **Supabase Region zu weit weg**
   - Beim Projekt-Erstellen nächste Region wählen
   - Für Schweiz: "Central EU (Frankfurt)" wählen

---

## 🆘 Nichts funktioniert mehr

### Harter Reset:

```bash
# Lokal:
rm -rf node_modules package-lock.json
npm install
npm run build

# Wenn das funktioniert:
git add .
git commit -m "Fix dependencies"
git push
```

### Datenbank Reset (ACHTUNG: Löscht alle Daten!):

```sql
-- In Supabase SQL Editor:
DROP TABLE IF EXISTS public.utensil_assignments CASCADE;
DROP TABLE IF EXISTS public.event_responses CASCADE;
DROP TABLE IF EXISTS public.utensils CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Dann 001_initial_setup.sql erneut ausführen
```

---

## 📞 Support

Wenn nichts hilft:

1. **Console Logs prüfen:**
   - Browser: F12 > Console
   - Supabase: Logs & Reports
   - Vercel: Deployment Logs
   - GitHub: Actions Logs

2. **Issue erstellen:**
   - Gehe zu GitHub Repository
   - Issues > New Issue
   - Beschreibe das Problem
   - Füge Screenshots und Fehlermeldungen hinzu

3. **Error Messages:**
   Kopiere immer die genaue Fehlermeldung!

---

## 🔍 Debug Tipps

### Browser Console nutzen:

```javascript
// F12 drücken, dann in Console eingeben:

// Prüfe ob Supabase verbunden ist:
console.log(import.meta.env.VITE_SUPABASE_URL);

// Prüfe aktuellen User:
console.log(await supabase.auth.getUser());

// Prüfe Events:
console.log(await supabase.from('events').select('*'));
```

### Network Tab nutzen:

1. F12 > Network
2. Führe Aktion aus (z.B. Login)
3. Schaue nach roten (Failed) Requests
4. Klicke auf Request für Details

---

## ✅ Präventive Maßnahmen

1. **Regelmäßige Backups:**
   - Supabase macht automatisch Backups
   - Zusätzlich: Database > Backups > Download

2. **Code-Commits:**
   - Commite oft mit beschreibenden Messages
   - Nutze Branches für größere Änderungen

3. **Monitoring:**
   - Schaue regelmäßig in Supabase Logs
   - Prüfe Vercel Analytics
   - Beobachte GitHub Actions

4. **Updates:**
   ```bash
   # Regelmäßig Dependencies aktualisieren:
   npm update
   npm audit fix
   ```
