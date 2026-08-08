# Container

## Client

**Technologie:** Angular, Angular Material, Tailwind
**Pfad:** `apps/client`

Verantwortlich für:

- Darstellung und Interaktion der Benutzeroberfläche
- Bezieht Anwendungsdaten über die nachfolgend beschriebene HTTP-API

## API

**Technologie:** Node.js, Express, Mongoose
**Pfad:** `apps/api`

Verantwortlich für:

- Bereitstellung der HTTP-Schnittstelle für den Client
- Lesen der für die Anwendung benötigten Daten aus MongoDB

## Admin-Anwendung

**Pfad:** seperates NX-Projekt

Verantwortlich für:

- Abruf externer Fußballdaten von API-Football
- Verarbeitung und Normalisierung der importierten Daten
- Steuerung und Einhaltung von API-Rate-Limits
- Aktualisierung und Pflege der MongoDB-Datenbank
- zeitgesteuerte Aktualisierungen (cron jobs)

## MongoDB Atlas

Verantwortlich für die persistente Speicherung von:

- Fußball-Partien / fixtures
- Spielereignissen / events
- Statistiken / fixture-statistics
- Spieler-Statistiken / players-statistics
- Aufstellungen / lineups
- Wettbewerben / competitions
- Wettbewerb-Spieler-Statistiken / competition-top-scorers
- Tabellen / standings
- Mannschaften / teams
- Trainer / team-coaches

## Gemeinsame Libraries

**Pfade:** `lib/models`, `lib/shared`

Verantwortlich für:

- gemeinsame DTOs und Typen
- wiederverwendbare fachliche Hilfsfunktionen
- gemeinsame Konstanten
