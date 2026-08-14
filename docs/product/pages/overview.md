# Overview Page

Die Overview Page ist die zentrale Einstiegsseite von reelscore. Sie bietet eine Übersicht über die Spiele des ausgewählten Tages sowie relevante Tabellenstände und ermöglicht die schnelle Navigation zu Wettbewerben und Spielen.

## Header

### Button: App-Logo

Das App-Logo dient als Navigation zur Overview Page.

Ein Klick auf das Logo führt unabhängig von der aktuell geöffneten Seite zurück zur Overview Page.

### Select: Wettbewerbs-Selector

Über die Wettbewerbs-Auswahl können die verfügbaren Wettbewerbe ausgewählt werden.

Die Auswahl eines Wettbewerbs führt zur Competition Page des jeweiligen Wettbewerbs.

## Content: Top-Bar

Die Top Bar dient zur Auswahl des angezeigten Datums sowie zum Filtern, Suchen und Anzeigen des Aktualisierungsstatus.

### Button: Date-Picker

Der Date Picker zeigt das aktuell ausgewählte Datum an.

Initial ist der aktuelle Tag ausgewählt. Über den Date Picker kann ein beliebiges anderes Datum ausgewählt werden.

### Toggle-Select: Weekday-Toggle-Bar

Die Weekday Toggle Bar zeigt die Wochentage von Montag bis Sonntag der aktuell ausgewählten Woche.

Der ausgewählte Tag wird hervorgehoben.

Über Pfeil-Buttons links und rechts kann zur vorherigen beziehungsweise nächsten Woche gewechselt werden.

### Action-Buttons

#### Readonly Button: Reload Indicator

Der Reload Indicator zeigt dem Nutzer an, wenn die Anwendung Daten aktualisiert.

Dies ist insbesondere bei laufenden Spielen relevant, deren Daten regelmäßig neu geladen werden.

Der Indicator besitzt keine direkte Benutzerinteraktion.

#### Button: Filter

Der Filter ermöglicht die Auswahl eines Wettbewerbs. Nach Auswahl eines Wettbewerbs werden:

- nur Fixtures des ausgewählten Wettbewerbs angezeigt,
- die standardmäßige Top-5-Tabellenübersicht durch die Tabelle des ausgewählten Wettbewerbs ersetzt.

Der Filter kann wieder zurückgesetzt werden, sodass erneut alle Fixtures und die standardmäßige Tabellenübersicht angezeigt werden.

#### Button: Search

Die Suche ermöglicht eine schnelle Navigation zu relevanten Inhalten innerhalb der Anwendung.

Unterstützte Suchergebnisse:

- Fixture anhand eines Teamnamens → Match Page
- Wettbewerb anhand des Wettbewerbsnamens → Competition Page
- Team anhand des Teamnamens → Team Page

## Content: main

### Fixtures-List

Die Fixture-Liste zeigt alle verfügbaren Spiele des ausgewählten Tages.

Die angezeigten Fixtures können gefiltert werden. Nach Wettbewerb oder ob LIVE oder nicht.

Ein Fixture dient als Navigation zur jeweiligen Match Page.

### Standings-List

Standardmäßig zeigt die Overview Page eine kompakte Übersicht der europäischen Top-5-Ligen.

Für jeden Wettbewerb werden die ersten fünf Tabellenplätze angezeigt.

Ist ein Wettbewerbsfilter aktiv, wird anstelle der Top-5-Übersicht die Tabelle des ausgewählten Wettbewerbs angezeigt.

### Zustände

#### Loading State

Während benötigte Daten geladen oder aktualisiert werden, soll der Nutzer einen geeigneten Ladezustand erkennen können.

Bereits verfügbare Daten sollen nach Möglichkeit weiterhin sichtbar bleiben, wenn lediglich eine Aktualisierung im Hintergrund erfolgt.

#### Empty State

Sind für das ausgewählte Datum keine Fixtures verfügbar, soll dies dem Nutzer verständlich angezeigt werden.

Dasselbe gilt für nicht verfügbare Tabellendaten.

#### Error State

Können Fixtures oder Tabellen nicht geladen werden, soll ein verständlicher Fehlerzustand dargestellt werden.

Ein Fehler in einem Bereich soll nach Möglichkeit nicht verhindern, dass weiterhin verfügbare Daten anderer Bereiche angezeigt werden.

## Footer

### App-Logo

Der Footer zeigt das App-Logo als rein visuelles Element ohne Navigation oder weitere Interaktion.

### Link-Liste

Der Footer bietet Platz für allgemeine und rechtlich relevante Links, beispielsweise:

- Impressum
- Datenschutz

Die Link-Liste kann zukünftig um weitere Einträge erweitert werden.

### App-Description

Eine kurze Beschreibung erläutert den Zweck von reelscore.
