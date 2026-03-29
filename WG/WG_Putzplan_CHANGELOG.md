# WG Putzplan App — Versionsübersicht

## v4.4 (2026-03-29) ← AKTUELL
**Datei:** `WG_Putzplan_App_v4.4_2026-03-29.jsx`

### Neue Features:
- ✅ **Personen-Fairness-System (Kombination):**
  - Auto-Mindestpunktzahl: Zimmer-Gesamtpunkte ÷ Bewohner im Zimmer
  - Max. Differenz konfigurierbar (Standard: 30%)
  - Fortschrittsbalken pro Person pro Zimmer (Soll vs. Ist)
  - Farbcodiert: Grün (erreicht), Rot (unter Minimum)
- ✅ **3-fache Konsequenz bei Nicht-Erreichung:**
  - 💰 Strafkasse: €-Betrag pro fehlendem Punkt (Standard: 2€)
  - ⚠️ Warnung im Wochenbericht mit rotem Highlight
  - 📋 Nachholpflicht: Fehlende Punkte als Zusatz-Aufgaben nächste Woche
- ✅ **Fairness-Config im Admin (⭐ Bonus):**
  - Max. Differenz (%) einstellbar
  - € pro fehlendem Punkt einstellbar
  - Nachholpflicht ein/ausschaltbar (Toggle)
- ✅ **Fairness-Report im Leaderboard:**
  - Pro Zimmer: "Fair verteilt ✓" oder "Ungleich verteilt ⚠️"
  - Pro Person: Fortschrittsbalken mit Soll/Ist
  - Gesamtstrafe aus Fairness-Check

---

## v4.3 (2026-03-26)
**Datei:** `WG_Putzplan_App_v4.3_2026-03-26.jsx`

### Neue Features:
- ✅ **Deadline-Timer**: Sonntag 23:59, Countdown im Header + NavBar
  - Grün (>24h), Gelb (<24h), Rot (überfällig)
- ✅ **Erinnerungs-Badge**: Rotes Badge auf Putzplan-Tab mit Anzahl offener Aufgaben
- ✅ **Bestätigung/Ablehnung durch andere Bewohner**:
  - ✓ Bestätigen (grün) — markiert als verifiziert mit Name
  - ✗ Ablehnen (rot) — Eingabefeld für Grund, setzt Aufgabe zurück auf offen
  - Eigene Aufgaben können nicht selbst verifiziert werden
- ✅ **Wöchentlicher Status-Report** im Leaderboard:
  - Gesamt-Fortschrittsbalken mit Prozent
  - Deadline-Info mit Countdown
  - Pro Zimmer: zugewiesene Bereiche, Task-Status (Offen/Erledigt/Bestätigt/Abgelehnt/Verpasst)
  - Farbige Status-Icons pro Aufgabe
  - Strafkasse mit Gesamt-Summe
  - "🎉 Alle Aufgaben erledigt!" Banner bei 100%

### Alle Features (kumulativ):
- 3-Rollen-System (Inhaber/Verwalter/Bewohner) mit konfigurierbaren Rechten
- Fester Inhaber: Origami (PW: origami, PIN: 1234)
- Login pro Person mit Passwort + Master-PIN
- Putzplan mit Rotation + tägliche/wöchentliche Aufgaben (Custom Tasks)
- Punkte-System (⭐) + Leaderboard + Monatsgewinner 🏆 + Strafkasse
- Pflicht-Foto + Referenzfoto pro Aufgabe (aufklappbar)
- Anleitung/Tutorial pro Aufgabe (Text + Fotos + Video-Link)
- WG-Hausordnung (zweisprachig DE/VI)
- Verlauf mit CSV-Export + Google Sheets Anbindung
- Persistent Storage

---

## v4.2 (2026-03-26)
**Datei:** `WG_Putzplan_App_v4.2_2026-03-26.jsx`

### Features:
- ✅ 3-Rollen-System (Inhaber/Verwalter/Bewohner) mit konfigurierbaren Rechten
- ✅ Fester Inhaber: Origami (PW: origami, PIN: 1234)
- ✅ Login pro Person mit Passwort
- ✅ Master-PIN für kritische Aktionen (änderbar)
- ✅ Putzplan mit Rotation (3 Bereiche: Küche, Bad, Gemeinschaft)
- ✅ Tägliche + wöchentliche Aufgaben (Custom Tasks hinzufügbar)
- ✅ Punkte-System (⭐) mit konfigurierbaren Punkten pro Aufgabe
- ✅ Leaderboard mit Monatsgewinner 🏆
- ✅ Strafkasse (€ pro verpasste Aufgabe)
- ✅ Belohnungstext konfigurierbar
- ✅ Pflicht-Foto bei jeder Aufgabe (Kamera/Upload)
- ✅ Referenzfoto pro Aufgabe (aufklappbar im Putzplan)
- ✅ Anleitung/Tutorial pro Aufgabe (Text + Fotos + Video-Link)
  - Kurzansicht aufklappbar + Detail-Popup
- ✅ WG-Hausordnung (zweisprachig DE/VI)
- ✅ Verlauf mit CSV-Export
- ✅ Google Sheets Live-Anbindung
- ✅ Zweisprachig Deutsch / Vietnamesisch
- ✅ Persistent Storage (Daten bleiben erhalten)

### Fixes in v4.2:
- Fix: Tutorial-Editor Fokus-Verlust beim Tippen (inline JSX statt Komponente)
- Fix: `returnReact is not defined` Error

---

## v4.0 (2026-03-26)
- Vereinfachtes Login (kein Setup-Screen mehr)
- Origami als fester Inhaber

## v3.0 (2026-03-26)
- Punkte-System, Leaderboard, Strafkasse
- Pflicht-Foto, Custom Tasks, Referenzfotos

## v2.0 (2026-03-26)
- 3-Rollen-System mit konfigurierbaren Rechten
- Master-PIN Absicherung

## v1.0 (2026-03-26)
- Grundversion: Login, Putzplan, Hausordnung, Verlauf
- Google Sheets Anbindung
