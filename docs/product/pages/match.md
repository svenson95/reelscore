# Match Page

Die Match Page zeigt alle verfügbaren Informationen zu einem einzelnen Spiel. Sie bündelt den aktuellen Spielstand, Spielinformationen, Analysen und wichtige Spielereignisse, den chronologischen Spielbericht sowie Statistiken.

Die Inhalte sind in die Tabs **Details**, **Analysen**, **Bericht** und **Statistiken** aufgeteilt.

## Match Navigation

Oberhalb des Match Headers befindet sich die Navigation für das ausgewählte Spiel.

### Button: Zurück

Der Zurück-Button führt zur vorherigen Seite zurück.

### Datum

Das Datum zeigt den Spieltag des ausgewählten Spiels.

### Readonly Reload Indicator

Der Reload Indicator zeigt an, wenn die Anwendung Daten aktualisiert.

Dies ist insbesondere bei laufenden Spielen relevant, deren Daten regelmäßig neu geladen werden.

Der Indicator besitzt keine direkte Benutzerinteraktion.

### Wochentag und Uhrzeit

Auf der rechten Seite werden der Wochentag und die Anstoßzeit des Spiels angezeigt.

## Match Header

Der Match Header zeigt die wichtigsten Informationen des Spiels auf einen Blick.

Dazu gehören:

- Heimteam mit Team-Logo und Team-Name
- Auswärtsteam mit Team-Logo und Team-Name
- aktueller bzw. finaler Spielstand
- Spielstatus
- wichtige Spielereignisse in Kurzform

Je nach Spielstatus zeigt der Header beispielsweise den aktuellen Spielstand oder bei einem beendeten Spiel das Endergebnis.

### Match Highlights

Unterhalb des Spielstands werden wichtige Spielereignisse kompakt dargestellt.

Dazu gehören insbesondere:

- Tore
- Rote Karten
- Spielabschnitte

Die Highlights ermöglichen einen schnellen Überblick über die wichtigsten Ereignisse, ohne den vollständigen Spielbericht öffnen zu müssen.

### Button: Match Highlights ein-/ausblenden

Am unteren mittleren Rand des Match Headers befindet sich ein Arrow-Button.

Über diesen Button können die Match Highlights ein- beziehungsweise ausgeblendet werden.

Dadurch kann der Match Header kompakter dargestellt werden, wenn die zusätzlichen Spielereignisse nicht benötigt werden.

### Sticky und kompakter Match Header

Der Match Header bleibt beim Scrollen der Match Page am oberen Rand sichtbar.

Beim Scrollen nach unten wechselt der Header schrittweise von seiner vollständigen Darstellung in eine kompaktere Ansicht. Das Verhalten orientiert sich an bekannten Collapsing-Header-Patterns aus mobilen Anwendungen.

Dabei gilt:

- Am oberen Seitenrand wird der vollständige Match Header angezeigt.
- Beim Scrollen nach unten wird der Header verkleinert.
- Die kompakte Variante bleibt anschließend sticky am oberen Rand der Seite.
- Beim Scrollen zurück nach oben wird der Header wieder auf seine vollständige Größe erweitert.
- Der Übergang zwischen beiden Zuständen soll flüssig erfolgen.
- Das Verhalten soll auch auf Seiten mit wenig scrollbarem Content stabil bleiben.
- Durch das Verkleinern oder Vergrößern des Headers dürfen keine sichtbaren Layout-Sprünge entstehen.

Die kompakte Darstellung soll weiterhin die wichtigsten Match-Informationen enthalten, ohne unnötig viel vertikalen Platz einzunehmen.

## Match Tabs

Unterhalb des Match Headers befinden sich vier Tabs:

- Details
- Analysen
- Bericht
- Statistiken

Der aktuell ausgewählte Tab wird hervorgehoben.

## Details

Der Tab **Details** enthält allgemeine Informationen zum Spiel sowie zusätzliche Informationen zu den beteiligten Teams.

### Spiel-Details

Die Spiel-Details zeigen grundlegende Informationen zur Begegnung.

Dazu können gehören:

- Spieltag
- Stadion
- Austragungsort
- Schiedsrichter

### Trainer

Die Section **Trainer** zeigt die Trainer der beiden beteiligten Teams.

Für jeden Trainer werden folgende Informationen dargestellt:

- Bild
- Name
- Alter
- Herkunftsland

### Tabellen

Die Section **Tabellen** zeigt die für das Spiel relevanten Tabellenstände der beiden Teams.

Je nach verfügbaren Daten können mehrere Tabellen angezeigt werden.

Dazu gehören:

- Gesamttabelle
- Heimtabelle
- Auswärtstabelle

Die Tabellen werden auf die für die beiden beteiligten Teams relevanten Einträge reduziert.

### Aktuelle Form

Die Section **Aktuelle Form** vergleicht die Form der beiden Teams anhand ihrer vergangenen Spiele.

Dabei werden zwei voneinander unabhängige Bewertungen dargestellt:

- Ergebnisform
- Leistungsform

#### Ergebnisse

Die Ergebnisform zeigt ausschließlich das Resultat der vergangenen Spiele.

Dabei wird zwischen folgenden Ergebnissen unterschieden:

- Sieg
- Unentschieden
- Niederlage

Die Darstellung ermöglicht einen schnellen Überblick darüber, welche Ergebnisse ein Team zuletzt erzielt hat.

#### Performance

Die Performance bewertet zusätzlich, wie gut ein Team in den vergangenen Spielen tatsächlich gespielt hat.

Dabei wird zwischen folgenden Leistungsstufen unterschieden:

- Gut
- Mittelmäßig
- Schlecht

Die Leistungsbewertung ist unabhängig vom eigentlichen Spielergebnis. Dadurch kann beispielsweise ein Team trotz eines Sieges als schlecht bewertet werden, wenn die zugrunde liegende Spielleistung schwach war. Ebenso kann ein Team trotz einer Niederlage eine gute Bewertung erhalten.

Für die Bewertung können verschiedene Spielstatistiken und weitere Faktoren berücksichtigt werden, beispielsweise:

- Schüsse
- Torschüsse
- Ballbesitz
- Spielergebnis
- Platzverweise
- Stärke des Gegners

Die Ergebnisform und die Leistungsform werden getrennt dargestellt, damit sowohl das tatsächliche Resultat als auch die zugrunde liegende Leistung eines Teams erkennbar bleiben.

Die Leistungsstufen werden visuell unterschieden. Ihre Bedeutung wird zusätzlich über Text beziehungsweise ein zugängliches Label vermittelt und nicht ausschließlich über Farben.

### Letzte Spiele

Die Section **Letzte Spiele** zeigt die zuletzt absolvierten Spiele beider Teams.

Für jedes Spiel werden unter anderem angezeigt:

- Datum
- beteiligte Teams
- Ergebnis

Die Spiele des Heim- und Auswärtsteams werden getrennt dargestellt.

## Analysen

Der Tab **Analysen** enthält Auswertungen und Vergleiche auf Basis vergangener Spiele der beiden Teams.

### Torjäger

Die Torjäger-Anzeige vergleicht relevante Torschützen der beiden Teams.

Zusätzlich könnte angezeigt werden, wie viele Spiele ein Spieler in Folge getroffen hat.

### Heimstark / Auswärtsstark

Die Analyse zeigt, ob das Heimteam beziehungsweise das Auswärtsteam auf Basis der zugrunde liegenden Daten als besonders heim- oder auswärtsstark eingestuft wird.

### Spielanalysen

Die Section **Spielanalysen** zeigt weitere Auswertungen für beide Teams getrennt voneinander.

Sind keine Analysen verfügbar, wird für das jeweilige Team ein Empty State angezeigt.

## Bericht

Der Tab **Bericht** zeigt den chronologischen Verlauf des Spiels.

Die Spielereignisse werden entlang des zeitlichen Spielverlaufs dargestellt.

### Spielphasen

Der Bericht wird durch wichtige Spielphasen strukturiert.

Dazu gehören beispielsweise:

- Anpfiff
- Halbzeit
- Ende

### Spielereignisse

Innerhalb der Spielphasen werden die einzelnen Ereignisse mit der jeweiligen Spielminute dargestellt.

Dazu können gehören:

- Tore
- Gelbe Karten
- Rote Karten
- Spielerwechsel
- weitere relevante Spielereignisse

Bei Toren können zusätzliche Informationen wie der Vorlagengeber angezeigt werden.

Bei Karten oder anderen Ereignissen können ebenfalls zusätzliche Informationen zum jeweiligen Ereignis dargestellt werden.

### Spielerwechsel

Bei einem Spielerwechsel werden der ausgewechselte und der eingewechselte Spieler dargestellt.

Die Darstellung unterscheidet die beiden beteiligten Spieler visuell voneinander.

## Statistiken

Der Tab **Statistiken** zeigt die verfügbaren Spielstatistiken beider Teams im direkten Vergleich.

Dazu können unter anderem gehören:

- Schüsse
- Torschüsse
- Ballbesitz
- Eckstöße
- Fouls
- Abseits
- Pässe insgesamt
- Passquote
- Gelbe Karten
- Rote Karten

Die Werte des Heim- und Auswärtsteams werden jeweils gegenübergestellt.

Sind für eine Statistik keine Daten verfügbar, wird sie entsprechend nicht beziehungsweise ohne Wert dargestellt.
