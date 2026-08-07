# Container

## Client

**Technologie:** Angular, Angular Material, Tailwind
**Pfad:** `apps/client`

Verantwortlich für:

- Seitennavigation
- Darstellung von Fixtures, Tabellen und Spieldetails
- Laden von API-Daten
- PWA-Verhalten

## API

**Technologie:** Node.js, Express, Mongoose
**Pfad:** `apps/api`

Verantwortlich für:

- Bereitstellung der HTTP-API
- Datenbankzugriff
- Validierung und Transformation der Daten

## Datenimport über seperate Admin-Anwendung

**Pfad:** anderes Projekt

Verantwortlich für:

- Abruf von Daten aus API-Football
- Rate-Limit-Steuerung
- Aktualisierung der Datenbank
- zeitgesteuerte Aktualisierungen (cron jobs)

## MongoDB Atlas

Verantwortlich für die persistente Speicherung von:

- Fußball-Partien / fixtures
- Wettbewerben / competitions
- Tabellen / standings
- Mannschaften / teams
- Spielereignissen / events
- Statistiken / fixture-statistics
- Spieler-Statistiken / players-statistics
- Aufstellungen / lineups

## Gemeinsame Libraries

**Pfade:** `lib/models`, `lib/shared`

Verantwortlich für:

- gemeinsame DTOs und Typen
- wiederverwendbare fachliche Hilfsfunktionen
- gemeinsame Konstanten
