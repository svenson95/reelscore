# System Context

## reelscore

reelscore stellt Fußballspiele, Wettbewerbe, Tabellen und Live-Daten dar
und bereitet diese für Nutzer auf.

## Externe Systeme

### API-Football

Liefert alle benötigten Daten: Fixtures, Wettbewerbsdaten, Mannschaftsdaten, Tabellen und Spieler-Statistiken.

### MongoDB Atlas

Speichert importierte und aufbereitete Fußballdaten.

### GitHub Actions

Führt die automatisierten Tests im CI-Prozess aus, bevor Client oder API gebaut und deployed werden.

## Systemgrenze

Zur reelscore-Systemgrenze gehören:

- Angular Client
- Node.js/Express API
- gemeinsame Datenmodelle und Shared Libraries
- E2E-Tests für Client und API

Nicht Bestandteil dieses Projekts ist die zeitgesteuerte Aktualisierung und der Import externer Fußballdaten. Diese Aufgaben werden von der separaten reelscore Admin-Anwendung übernommen.
