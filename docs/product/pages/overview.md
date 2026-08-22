# Overview Page

Die Overview Page ist die zentrale Einstiegsseite von reelscore. Sie bietet eine Übersicht über die Spiele des ausgewählten Tages sowie relevante Tabellenstände und ermöglicht die schnelle Navigation zu Wettbewerben und Spielen.

## Top Bar

Die Top Bar dient zur Auswahl des angezeigten Datums sowie zum Filtern, Suchen und Anzeigen des Aktualisierungsstatus.

### Date Picker

Der Date Picker zeigt das aktuell ausgewählte Datum an.

Initial ist der aktuelle Tag ausgewählt. Über den Date Picker kann ein beliebiges anderes Datum ausgewählt werden.

### Weekday Toggle Bar

Die Weekday Toggle Bar zeigt die Wochentage von Montag bis Sonntag der aktuell ausgewählten Woche.

Der ausgewählte Tag wird hervorgehoben.

Über die Pfeil-Buttons links und rechts kann zur vorherigen beziehungsweise nächsten Woche gewechselt werden.

### Action Buttons

#### Readonly Reload Indicator

Der Reload Indicator zeigt an, wenn die Anwendung Daten aktualisiert.

Dies ist insbesondere bei laufenden Spielen relevant, deren Daten regelmäßig neu geladen werden.

Der Indicator besitzt keine direkte Benutzerinteraktion.

#### Competition Filter

Über den Competition Filter kann die Overview Page auf einen bestimmten Wettbewerb eingeschränkt werden.

Ist ein Wettbewerb ausgewählt:

- werden nur Fixtures dieses Wettbewerbs angezeigt,
- wird die standardmäßige Top-5-Tabellenübersicht durch die Tabelle des ausgewählten Wettbewerbs ersetzt.

Der Filter kann zurückgesetzt werden, sodass erneut alle Fixtures und die standardmäßige Tabellenübersicht angezeigt werden.

#### Live Filter

Über den Live Filter kann die Fixture-Liste auf aktuell laufende Spiele eingeschränkt werden.

Ist der Live Filter aktiv, werden ausschließlich Fixtures angezeigt, die sich aktuell in einem Live-Status befinden.

Der Live Filter beeinflusst ausschließlich die Fixture-Liste und kann wieder deaktiviert werden, um alle Fixtures des ausgewählten Tages anzuzeigen.

#### Search

Die Suche ermöglicht eine schnelle Navigation zu relevanten Inhalten innerhalb der Anwendung.

Unterstützte Suchergebnisse:

- Fixture anhand eines Teamnamens → Match Page
- Wettbewerb anhand des Wettbewerbsnamens → Competition Page
- Team anhand des Teamnamens → Team Page

## Main Content

### Fixtures List

Die Fixture-Liste zeigt alle verfügbaren Spiele des ausgewählten Tages.

Die angezeigten Fixtures können über den Competition Filter nach Wettbewerb und über den Live Filter nach aktuell laufenden Spielen gefiltert werden.

Ein Fixture dient als Navigation zur jeweiligen Match Page.

Der Name des Wettbewerbs innerhalb einer Fixture-Gruppe dient zusätzlich als Navigation zur zugehörigen Competition Page.

### Standings List

Standardmäßig zeigt die Overview Page eine kompakte Tabellenübersicht der europäischen Top-5-Ligen.

Für jeden Wettbewerb werden die ersten fünf Tabellenplätze angezeigt.

Ist ein Competition Filter aktiv, wird anstelle der Top-5-Übersicht die Tabelle des ausgewählten Wettbewerbs angezeigt.

Der Wettbewerbsname oberhalb einer Tabelle dient als Navigation zur zugehörigen Competition Page.

## States

### Loading State

Während benötigte Daten geladen werden, soll ein geeigneter Ladezustand angezeigt werden.

Bereits verfügbare Daten sollen weiterhin sichtbar bleiben, wenn lediglich neue Daten im Hintergrund geladen oder bestehende Daten aktualisiert werden.

### Empty State

Sind für das ausgewählte Datum keine Fixtures verfügbar, wird dies entsprechend angezeigt.

Dasselbe gilt für nicht verfügbare Tabellendaten.

Ein Empty State kann ebenfalls entstehen, wenn durch die aktive Filterung keine passenden Fixtures vorhanden sind.

### Error State

Können Fixtures oder Tabellen nicht geladen werden, wird für den betroffenen Bereich ein verständlicher Fehlerzustand dargestellt.

Ein Fehler in einem Bereich soll nicht verhindern, dass weiterhin verfügbare Daten anderer Bereiche angezeigt werden.
