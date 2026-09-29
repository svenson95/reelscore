# SSE für Live-Updates

## Produktionsbetrieb

Realtime ist im Client-Produktionsbuild über `environment.realtimeEnabled = false`
deaktiviert. Live-Spiele werden über das vorhandene Polling im Abstand von
20 Sekunden aktualisiert. Der bestehende Visibility-Observer stößt bei Rückkehr
in den Browser einen Refresh an; der vorhandene Refresh-Cooldown gilt weiterhin.

Die API beantwortet `/livestream` in Vercel Production mit HTTP 204, auch wenn
`ENABLE_REALTIME=true` gesetzt ist. Außerhalb von Vercel Production bleibt SSE
explizit über `ENABLE_REALTIME=true` aktivierbar. Der Entwicklungsclient erlaubt
Realtime weiterhin.

## Verbindungslebenszyklus

Bei aktivierter Realtime-Verbindung schließt der Client SSE und zugehörige Timer,
sobald das Dokument unsichtbar wird. Bei Rückkehr wird ein aktueller Snapshot
angefordert und eine neue Verbindung ohne Hintergrund-Replay aufgebaut.
Explizites Disconnect und endgültiger Polling-Fallback verhindern automatisches
Wiederverbinden beim Sichtbarkeitswechsel.

Der Watchdog gilt bereits während des Verbindungsaufbaus. Fehler werden zentral
mit maximal drei fehlgeschlagenen Versuchen behandelt, auch wenn EventSource
selbst erneut verbinden würde. Danach übernimmt Polling. Beim Zerstören des
Services werden Verbindungen, Timer und Visibility-Listener entfernt.

Der API-Adapter beobachtet Verbindungsabbrüche bereits vor der Upstream-Anfrage.
Ein Abbruch beendet sowohl ausstehende Leseoperationen als auch das Warten auf
`drain`; Stream-Reader und Listener werden anschließend freigegeben.
