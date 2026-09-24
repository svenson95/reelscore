# Produktvision

## Ausgangssituation

Bestehende Fußball-Livescore-Anwendungen stellen in erster Linie Ergebnisse, Tabellen, Spielstatistiken und grundlegende Informationen zu Mannschaften und Spielern bereit.

Die aktuelle Form einer Mannschaft wird häufig ausschließlich anhand der letzten Spielergebnisse dargestellt:

* Sieg
* Unentschieden
* Niederlage

Das Ergebnis allein beschreibt jedoch nicht immer, wie gut eine Mannschaft tatsächlich gespielt hat. Eine Mannschaft kann trotz schwacher Leistung gewinnen oder trotz guter Leistung verlieren.

Darüber hinaus fehlt bei klassischen Livescore-Anwendungen häufig der Kontext hinter Ergebnissen und Statistiken. Ein Tor kann beispielsweise aus einer gut herausgespielten Situation entstehen oder durch einen individuellen Fehler, einen fragwürdigen Elfmeter oder eine andere besondere Spielsituation begünstigt werden.

## Produktidee

reelscore ist eine Fußball-Livescore-Anwendung mit Fokus auf Statistiken, Leistungsbewertung und zusätzlichen Einblicken rund um Spiele und Mannschaften.

Neben den gewohnten Funktionen einer Livescore-Anwendung sollen vorhandene Daten so aufbereitet und ergänzt werden, dass Nutzer die aktuelle Verfassung einer Mannschaft und den Verlauf vergangener Spiele besser einschätzen können.

Dabei bilden zwei voneinander unabhängige Features einen wichtigen Bestandteil des Produkts.

### Leistungsbasierte Formbewertung

Zusätzlich zur klassischen Ergebnisform besitzt reelscore eine leistungsbasierte Formbewertung.

Diese bewertet nicht ausschließlich, ob eine Mannschaft gewonnen, unentschieden gespielt oder verloren hat, sondern berücksichtigt die tatsächliche Spielleistung anhand relevanter Statistiken.

Eine Mannschaft kann dadurch beispielsweise trotz eines Sieges als schwach oder trotz einer Niederlage als stark bewertet werden.

Die klassische Ergebnisform und die Leistungsform bleiben bewusst getrennt, sodass Nutzer sowohl das Resultat als auch die dahinterliegende Leistung erkennen können.

### Spielanalysen

Spielanalysen ergänzen die statistische Bewertung um den konkreten Kontext eines Spiels.

Dafür können besondere Spielsituationen, individuelle Leistungen und spielentscheidende Ereignisse dokumentiert und eingeordnet werden.

Dazu gehören beispielsweise:

* Tore und die Art ihrer Entstehung, etwa herausgespielte Treffer oder durch Fehler beziehungsweise glückliche Situationen begünstigte Tore,
* Alle Torchancen einer Mannschaft,
* auffällige Leistungen einzelner Spieler,
* Verletzungen oder Sperren wichtiger Spieler,
* besondere Ereignisse wie das erste Tor eines Spielers für einen neuen Verein,
* Elfmeter, Platzverweise oder andere Situationen, die einen wesentlichen Einfluss auf den Spielverlauf hatten.

Die Spielanalyse soll damit erklären, **was hinter einem Ergebnis passiert ist**, während die leistungsbasierte Formbewertung eine kompakte Einschätzung der Mannschaftsleistung liefert.

## Zielgruppe

reelscore richtet sich an Fußballinteressierte, die nicht nur Ergebnisse verfolgen, sondern Spiele und Mannschaften besser einschätzen möchten.

Die Anwendung soll sowohl einen schnellen Überblick ermöglichen als auch weiterführende Informationen für Nutzer bereitstellen, die sich intensiver mit einem Spiel beschäftigen möchten.

## Zentrale Nutzerziele

Nutzer sollen:

* die gewohnten Funktionen einer Livescore-Anwendung nutzen können,
* die aktuelle Form einer Mannschaft anhand von Ergebnissen und tatsächlicher Spielleistung einschätzen können,
* zusätzliche Informationen und Analysen erhalten,
* besondere Spielsituationen und deren Einfluss auf ein Ergebnis nachvollziehen können,
* auf der Startseite einen schnellen Überblick über die Tabellenstände der europäischen Top-5-Ligen erhalten.

## Kernbereiche

### Überblick / Overview

Die Overview Page bildet den Einstieg in die Anwendung.

Sie zeigt:

* die Spiele des ausgewählten Tages,
* relevante Informationen zu den Partien wie Live- und Spielstatus,
* die Tabellenstände der europäischen Top-5-Ligen,
* Suchfunktion um schnell Inhalte zu finden.

Ziel ist ein schneller Überblick über das aktuelle Fußballgeschehen.

### Fußball-Partie / Match

Die Match Page stellt detaillierte Informationen zu einem Spiel bereit.

Dazu gehören unter anderem:

* grundlegende Spieldaten,
* Liga-Tabelle plus Heim- und Auswärtstabellen,
* aktuelle Form der beteiligten Mannschaften -> ergebnis- & leistungsbasierte Formbewertungen,
* letzte Spiele,
* Spielanalysen und zusätzliche Einordnungen,
* Spielbericht,
* Statistiken.

### Wettbewerb / Competition

Die Competition Page bündelt Informationen zu einem einzelnen Wettbewerb.

Dazu gehören insbesondere:

* vergangene Ergebnisse,
* kommende Spiele,
* Tabelle,
* Torjäger,
* Vorlagengeber.

## Produktprinzipien

### Informationen statt reiner Daten

Statistiken sollen nicht ausschließlich dargestellt, sondern sinnvoll eingeordnet und miteinander in Zusammenhang gebracht werden.

### Ergebnis und Leistung getrennt betrachten

Ein Spielergebnis und die tatsächliche Leistung einer Mannschaft sind zwei unterschiedliche Informationen und sollen entsprechend getrennt dargestellt werden.

### Kontext sichtbar machen

Besondere Spielsituationen können ein Ergebnis wesentlich beeinflussen. Spielanalysen sollen diesen Kontext sichtbar machen, ohne die zugrunde liegenden objektiven Spieldaten zu ersetzen.

### Schneller Überblick, Details bei Bedarf

Wichtige Informationen müssen schnell erfassbar sein. Weiterführende Statistiken und Analysen sollen verfügbar sein, ohne die grundlegende Livescore-Nutzung unnötig komplex zu machen.

### Nachvollziehbare Bewertungen

Automatisch erzeugte Leistungsbewertungen müssen reproduzierbar und nachvollziehbar sein. Nutzer sollen erkennen können, was eine Bewertung bedeutet und auf welcher Art von Informationen sie basiert.

## Erfolgskriterien

Das Produkt ist erfolgreich, wenn Nutzer:

* relevante Informationen schnell finden,
* Live-Updates schnell und zuverlässig erhalten,
* durch zusätzliche Informationen und Analysen die tatsächliche Leistung einer Mannschaft besser einschätzen können.

Langfristig soll sich reelscore dadurch von klassischen Livescore-Anwendungen unterscheiden, dass nicht nur gezeigt wird, **was passiert ist**, sondern auch mehr Kontext dazu geliefert wird, **wie und warum ein Spiel so verlaufen ist**.
