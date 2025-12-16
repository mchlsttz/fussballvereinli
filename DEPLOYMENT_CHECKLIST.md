# 📋 Deployment Checkliste

Nutze diese Checkliste um sicherzustellen, dass alles korrekt eingerichtet ist.

## Phase 1: Vorbereitung

- [ ] Node.js ist installiert (v20+)
- [ ] Git ist installiert
- [ ] GitHub Account vorhanden
- [ ] Vercel Account vorhanden
- [ ] Supabase Account vorhanden

## Phase 2: Supabase Setup

- [ ] Supabase Projekt erstellt
- [ ] Database Password notiert
- [ ] Project URL notiert
- [ ] Anon Key notiert
- [ ] SQL Migration (001_initial_setup.sql) ausgeführt
- [ ] Alle 5 Tabellen sind sichtbar im Table Editor
- [ ] Admin-User in Authentication angelegt
- [ ] Admin-User in users Tabelle mit is_admin=true
- [ ] Admin-User mit is_active=true
- [ ] Mindestens 2-3 weitere Test-User angelegt

## Phase 3: Lokale Entwicklung

- [ ] Projekt-Ordner geöffnet
- [ ] `npm install` ausgeführt
- [ ] `.env` Datei erstellt (aus .env.example)
- [ ] Supabase URL in .env eingetragen
- [ ] Supabase Anon Key in .env eingetragen
- [ ] `npm run dev` funktioniert
- [ ] App öffnet sich auf localhost:3000
- [ ] Login mit Admin-Account funktioniert
- [ ] Leere Event-Liste wird angezeigt
- [ ] Admin-Button ist sichtbar
- [ ] Admin-View ist erreichbar

## Phase 4: GitHub

- [ ] GitHub Repository erstellt (privat empfohlen)
- [ ] Repository-URL notiert
- [ ] `git init` ausgeführt
- [ ] `git add .` ausgeführt
- [ ] `git commit -m "Initial commit"` ausgeführt
- [ ] `git remote add origin [URL]` ausgeführt
- [ ] `git push -u origin main` erfolgreich
- [ ] Code ist auf GitHub sichtbar
- [ ] GitHub Secret: VITE_SUPABASE_URL hinzugefügt
- [ ] GitHub Secret: VITE_SUPABASE_ANON_KEY hinzugefügt
- [ ] GitHub Actions läuft automatisch durch (Check unter Actions Tab)

## Phase 5: Vercel Deployment

- [ ] Vercel Account mit GitHub verbunden
- [ ] Neues Projekt erstellt
- [ ] GitHub Repository verknüpft
- [ ] Framework: Vite erkannt
- [ ] Environment Variable: VITE_SUPABASE_URL hinzugefügt
- [ ] Environment Variable: VITE_SUPABASE_ANON_KEY hinzugefügt
- [ ] Erstes Deployment erfolgreich
- [ ] Vercel URL funktioniert
- [ ] Login auf Vercel URL funktioniert

## Phase 6: Funktionstest

- [ ] Event erstellen funktioniert (Admin-View)
- [ ] Event wird in Event-Liste angezeigt
- [ ] Zusage funktioniert
- [ ] Gäste hinzufügen funktioniert
- [ ] Kommentar hinzufügen funktioniert
- [ ] Utensilien auswählen funktioniert
- [ ] Absage funktioniert
- [ ] Anderer User kann sich einloggen
- [ ] Nicht-Admin sieht keinen Admin-Button
- [ ] User aktivieren/deaktivieren funktioniert (Admin)
- [ ] Deaktivierter User kann sich nicht einloggen

## Phase 7: PWA Test (Optional)

- [ ] PWA Icons im public/ Ordner
- [ ] App kann auf iOS installiert werden
- [ ] App kann auf Android installiert werden
- [ ] App kann auf Desktop installiert werden
- [ ] Installierte App öffnet sich ohne Browser-UI
- [ ] Offline-Funktionalität getestet (basic caching)

## Phase 8: Automatisierung Test

- [ ] Code-Änderung gemacht (z.B. Text angepasst)
- [ ] `git add .` + `git commit` + `git push`
- [ ] GitHub Actions läuft automatisch
- [ ] Vercel deployed automatisch
- [ ] Änderung ist nach 2-3 Minuten live sichtbar

## Phase 9: Team Onboarding

- [ ] URL an Team verteilt
- [ ] Login-Daten an alle Spieler verteilt
- [ ] Anleitung für PWA-Installation verschickt
- [ ] Erstes Test-Training angelegt
- [ ] Team gebeten zu testen

## Finale Überprüfung

- [ ] Alle User können sich einloggen
- [ ] Alle User können Events sehen
- [ ] Alle User können zusagen/absagen
- [ ] Admin kann Events erstellen
- [ ] Admin kann User verwalten
- [ ] Deadline um 13 Uhr wird eingehalten
- [ ] Vergangene Events werden nicht angezeigt
- [ ] Keine Fehler in der Browser-Console (F12)

## Backup-Plan

- [ ] Supabase Database Password sicher aufbewahrt
- [ ] GitHub Repository Backup
- [ ] Environment Variables dokumentiert
- [ ] Admin-Zugangsdaten sicher gespeichert

---

## 🎉 Bereit für den Live-Betrieb!

Wenn alle Checkboxen ✅ sind, ist deine App produktionsreif!

### Nächste Schritte:
1. Regelmäßig Events erstellen
2. Team-Feedback sammeln
3. Bei Bedarf Anpassungen machen
4. Weitere Features planen (z.B. Winter/Sommer Utensilien)

### Bei Problemen:
- Schaue in TROUBLESHOOTING.md
- Überprüfe Supabase Logs
- Überprüfe GitHub Actions Logs
- Überprüfe Vercel Deployment Logs
