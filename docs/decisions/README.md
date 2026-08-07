# Architecture Decision Records

Dieses Verzeichnis enthält Architecture Decision Records (ADRs) für wichtige technische und architektonische Entscheidungen innerhalb von reelscore.

ADRs dokumentieren nicht nur, **was** entschieden wurde, sondern auch, **warum** diese Entscheidung getroffen wurde und welche Alternativen betrachtet wurden.

## Wann sollte ein ADR erstellt werden?

Ein ADR sollte erstellt werden, wenn eine Entscheidung:

- mehrere Bereiche der Anwendung beeinflusst,
- langfristige Auswirkungen auf die Architektur hat,
- nur schwer oder mit hohem Aufwand rückgängig gemacht werden kann,
- mehrere sinnvolle Alternativen besitzt,
- eine wichtige Technologie oder ein wesentliches Architektur-Pattern einführt oder ersetzt.

Kleine Implementierungsdetails, einzelne Refactorings, Bugfixes oder reine UI-Entscheidungen benötigen in der Regel kein ADR.

## Status

Ein ADR kann einen der folgenden Status haben:

- **Proposed** — Die Entscheidung wird noch diskutiert.
- **Accepted** — Die Entscheidung wurde getroffen und soll entsprechend umgesetzt werden.
- **Deprecated** — Die Entscheidung soll für neue Implementierungen nicht mehr verwendet werden.
- **Superseded** — Die Entscheidung wurde durch ein neues ADR ersetzt.

## Benennung

ADR-Dateien verwenden eine fortlaufende Nummer und einen kurzen, beschreibenden Namen:

```text
0001-use-nx-monorepo.md
0002-feature-oriented-client-structure.md
0003-use-sse-for-live-updates.md
```

Bereits verwendete ADR-Nummern werden nicht erneut vergeben.

## Aufbau eines ADR

Jedes ADR sollte grundsätzlich dieser Struktur folgen:

```md
# ADR-0001: Titel der Entscheidung

## Status

Accepted

## Kontext

Beschreibung des Problems, der Rahmenbedingungen und relevanter Hintergründe.

## Entscheidung

Beschreibung der gewählten Lösung.

## Betrachtete Alternativen

### Alternative A

Beschreibung der Alternative und warum sie nicht gewählt wurde.

### Alternative B

Beschreibung der Alternative und warum sie nicht gewählt wurde.

## Konsequenzen

### Positiv

- Positive Auswirkung

### Negativ

- Negative Auswirkung
```

Abschnitte können weggelassen werden, wenn sie für die jeweilige Entscheidung keinen Mehrwert bieten.

## Entscheidungen

| ADR                                                             | Entscheidung                                    | Status   |
| --------------------------------------------------------------- | ----------------------------------------------- | -------- |
| [0001](./0001-use-nx-monorepo.md)                               | Nx Monorepo verwenden                           | Accepted |
| [0002](./0002-feature-oriented-client-structure.md)             | Feature-orientierte Client-Struktur verwenden   | Proposed |
| [0003](./0003-use-sse-for-live-updates.md)                      | Server-Sent Events für Live-Updates verwenden   | Accepted |
| [0004](./0004-use-unix-timestamps-for-fixture-time-handling.md) | Unix-Timestamps für Fixture-Zeitlogik verwenden | Accepted |

## Änderungen an bestehenden Entscheidungen

Akzeptierte ADRs sollten grundsätzlich nicht nachträglich so verändert werden, dass sie eine neue Architekturentscheidung darstellen.

Wenn sich eine Entscheidung wesentlich ändert, sollte stattdessen ein neues ADR erstellt und das bisherige ADR als **Superseded** markiert werden.

Beispiel:

```md
## Status

Superseded durch [ADR-0007](./0007-example-new-decision.md)
```
