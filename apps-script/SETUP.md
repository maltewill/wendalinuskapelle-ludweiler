# Einrichtung „Virtuelle Kerze"

Backend für das Kerzen-Formular auf der Mitwirken-Seite. Läuft komplett kostenlos über ein Google Sheet + Apps Script, ohne eigenen Server.

## 1. Google Sheet anlegen

1. Neues Google Sheet erstellen (sheets.google.com → Leer), z. B. benannt „Wendalinuskapelle – Kerzen".
2. Menü **Erweiterungen → Apps Script** öffnen.

## 2. Skript einfügen

1. Den kompletten Inhalt von [`Code.gs`](Code.gs) in den Apps-Script-Editor kopieren (vorhandenen Beispielcode ersetzen).
2. Mit dem Diskettensymbol speichern.

## 3. Als Web-App veröffentlichen

1. Oben rechts auf **Bereitstellen → Neue Bereitstellung**.
2. Typ auswählen: **Web-App**.
3. Einstellungen:
   - Ausführen als: **Ich (deine E-Mail-Adresse)**
   - Zugriff: **Jeder**
4. Auf **Bereitstellen** klicken. Google fragt nach Berechtigung — das ist normal, da es dein eigenes Skript ist ("Nicht überprüfte App" → **Erweitert** → **Zu [Projektname] (unsicher) wechseln**).
5. Die angezeigte **Web-App-URL** kopieren (endet auf `/exec`).

## 4. URL in die Website eintragen

In [`js/candle.js`](../js/candle.js) die Zeile

```js
const ENDPOINT_URL = "PASTE_DEINE_APPS_SCRIPT_WEB_APP_URL_HIER_EIN";
```

durch die kopierte URL ersetzen, dann committen/pushen und auf das Webhosting hochladen.

## Moderation

Jede Kerze landet als neue Zeile im Sheet-Tab „Kerzen" (Zeitstempel, Name, Nachricht). Um einen Eintrag von der Website zu entfernen, einfach die entsprechende Zeile im Sheet löschen — die Änderung ist beim nächsten Laden der Seite sichtbar.

## Bei künftigen Codeänderungen

Wird `Code.gs` später angepasst, im Apps-Script-Editor erneut **Bereitstellen → Bereitstellungen verwalten → Bearbeiten (Stift-Symbol) → Neue Version → Bereitstellen** wählen — die Web-App-URL bleibt dabei gleich.
