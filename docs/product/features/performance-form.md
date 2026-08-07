# Leistungsbasierte Formbewertung

## Ziel

Zusätzlich zur klassischen Ergebnisform soll eine Formbewertung angezeigt werden, die beschreibt, wie gut eine Mannschaft in einem Spiel tatsächlich gespielt hat.

Die klassische Ergebnisform bleibt weiterhin bestehen und zeigt:

- Sieg
- Unentschieden
- Niederlage

Die leistungsbasierte Form ergänzt diese Information durch:

- Gut gespielt
- Mittelmäßig gespielt
- Schlecht gespielt

## Motivation

Das Spielergebnis bildet die Leistung einer Mannschaft nicht immer korrekt ab.

Eine Mannschaft kann ein Spiel gewinnen, obwohl sie deutlich weniger Torchancen hatte und über weite Teile unterlegen war. Umgekehrt kann eine Mannschaft trotz guter Leistung verlieren.

Die zusätzliche Bewertung soll Nutzern helfen, das Ergebnis in einen sportlichen Kontext einzuordnen.

## Beispielszenario

Team A steht auf Tabellenplatz 1.

Team B steht auf Tabellenplatz 18.

Team A gewinnt das Spiel mit 1:0.

Team B hatte jedoch:

- mehr Ballbesitz,
- mehr Schüsse,
- mehr Schüsse auf das Tor,
- bessere Torchancen,
- und insgesamt die stärkere Spielleistung.

In diesem Fall kann die Bewertung lauten:

- Team A: Schlecht gespielt
- Team B: Gut gespielt

Die Ergebnisform bleibt davon unabhängig:

- Team A: Sieg
- Team B: Niederlage

## Darstellung

Die Bewertung soll visuell eindeutig dargestellt werden:

- Gut gespielt: grün
- Neutral gespielt: grau
- Schlecht gespielt: rot

Die Darstellung muss zusätzlich zur Farbe einen Text, ein Symbol oder ein zugängliches Label verwenden. Die Bedeutung darf nicht ausschließlich durch Farbe vermittelt werden.

## Offene fachliche Fragen

Vor der Implementierung muss festgelegt werden:

- Welche Statistiken fließen in die Bewertung ein?
- Wie stark werden einzelne Statistiken gewichtet?
- Wird die Stärke des Gegners berücksichtigt?
- Wird das Heimrecht berücksichtigt?
- Wie werden Spiele mit fehlenden Statistiken behandelt?
- Wird die Bewertung regelbasiert oder über einen berechneten Score erzeugt?
- Kann sich der Bewertungsalgorithmus zwischen Wettbewerben unterscheiden?

## Vorgeschlagener erster Ansatz

Für eine erste Version sollte ein nachvollziehbarer, regelbasierter Score verwendet werden.

Mögliche Faktoren:

- Torschüsse
- Schüsse auf das Tor
- Ballbesitz
- Ergebnis
- Platzverweis
- Stärke des Gegners

Die genaue Berechnung wird separat spezifiziert und getestet.

## Akzeptanzkriterien

- Ergebnisform und Leistungsform werden getrennt dargestellt.
- Eine Mannschaft kann trotz Sieg als schlecht bewertet werden.
- Eine Mannschaft kann trotz Niederlage als gut bewertet werden.
- Für identische Eingabedaten entsteht immer dieselbe Bewertung.
- Fehlende Statistiken führen nicht zu einem technischen Fehler.
- Die Bewertungslogik wird unabhängig von der UI getestet.
- Die UI ist ohne alleinige Abhängigkeit von Farben verständlich.
- Die Herkunft beziehungsweise Bedeutung der Bewertung wird Nutzern erklärt.

## Nicht Bestandteil der ersten Version

- maschinelles Lernen
