![b.kit logo](./public/Kit_Logo.svg)

# b.kit MODX

This package provides an interface to connect b.kit components with the MODX CMS. To do so it defines slices that can be imported and used inside e.g. in a react nextjs project.

Our ModxCloud is based on **ContentBlocks** that create JSON-Data that then is consumed by our kit-server template, sliced into perfect data then used to render components from b.kit. We use a lot of **Snippets** to adjust data in the CMS so we have to slice less. Additionally, we use **Chunks** to capsule data.

How a Page is structured is typically set in **Templates**. Those **Templates** use **Chunks** and **Snippets** to form and structure the JSON data.

## Local Testing

Inside library project:

-   Install yalc globally: `yarn global add yalc`
-   Run `yalc publish` to publish library into local yalc store.
-   Run `yalc push` to push changes to all installations

Inside project that should use the library:

-   Run `yalc add <repository-name>` in target lokal repository to link library from yalc store.
-   Use `yalc update` or `yalc update <repository-name>` to update all linked packages.
-   use `yalc remove <repository-name>` to remove linked package.
-   use `yarn --check-files` afterwards to install packages from npm

    Before each push to git `yalc check` performs a check to ensure that all linked packages are removed from package.json. To delete package linking from package.json but not from yalc.lock `yalc retreat [--all]` / `yalc restore`

## ModxCloud

### Setup

Zuerst muss ein Backup des Modx-Masters erstellt werden. Anschließend wird bei modxcloud eine neue Cloud eingerichtet mit dem Namen-Des-Projects DEV. Anschließend wird das Backup des Modx-Masters auf die neu erstellte Cloud aufgespielt. Sobald ein Admin Nutzer über ModxCloud erstellt wurde, ist die Cloud erreichbar.
Anschließend muss die URL innerhalb von Modx (mit der die jewiligen Kontexte erreichbar sein werden) angepasst werden, die Cache Url (Systemeinstellungen) angepasst werden, und die MediaSource Url ebenfalls angepasst werden. Sind diese Schritte alle erfolgt, kann die Cloud an den Kit-Server (per .env) angebunden werden.

#### Steps

1. https://dashboard.modxcloud.com öffnen

2. im Suchfeld `b.kit-modx DEV` oder `master` suchen

    1. Cloud öffnen, unter Reiter `Backups` -> `Create New Backup` und Backup starten

3. `New Cloud`

    1. Name vergeben, hostname kann bleiben sofern nichts anderes gewünscht
    2. Location normalerweise Frankfurt
    3. Version: Möglichst identisch mit dem ModxMaster, so können Probleme verhindert werden (ModxMaster älter als neuste Version (außer 3), eventuell updaten)

4. Zurück zu `Modx Master`

    1. `Backups` -> `Neustes Backup suchen` -> `Zahnrad öffnen` -> `Restore Backup into...` -> `Neue Cloud auswählen und beginnen`
    2. Sobald das Backup wiederhergestellt wurde -> `Neu erstellte Cloud öffnen` -> `Create Admin User`
        1. Username Schema `PartnerKürzel-admin`
        2. Password beliebig
        3. Email leer

5. Urls aus der neuen Cloud kopieren (Reiter `Summary`)

6. In der neuen Cloud mit dem **Modx Master Admin** einloggen
    1. `Manage` -> `Users` -> `b.kit-admin` duplizieren -> Sudo aktivieren, Username und Password anpassen
    1. `Systemeinstellungen` -> `site_name` -> Projektname eintragen
    1. `Systemeinstellungen` -> `phpthumbof.cache_url` suchen (oder nach `url`) -> neue Cloudurl eintragen (MIT Trailing / )
    1. `Medien` -> `Medienquellen` -> `MediaManager` -> `baseUrl` => `https://neueCloudUrl/mediamanager/`
    1. `WebDefault rechtsklick` -> `Kontext bearbeiten` -> `http_host` => `url.ohneprotocol.ohnetrailing.de`
    1. Für alle Kontexte wiederholen falls `http_host` vorhanden
    1. `next_url` auf Vercel Url oder anderes Deployment pointen
    1. `Clear Cache` -> `Refresh Urls` -> `Rebuild Contentblocks`

### Deployment to LIVE

Zuerst muss eine neue Domain vergeben werden (z.b. meine-modx-cloud.de, Absprache Markus). Anschließend müssen sämtliche Cloud-URLs auf diese neue URL umgestellt werden, siehe Setup Punkt 7. Anschließend muss die neue Adresse im kit-server Projekt eingetragen werden, dann ist das Project **_live_**

1. `Cloud öffnen` -> `Domains` -> `Domain vergeben` -> `Auswählen` -> `Create Subdomain` -> `cms` (Vorlage www)

2. In der neuen Cloud mit dem Admin einloggen
    1. `Systemeinstellungen` -> `phpthumbof.cache_url` suchen (oder nach `url`) -> neue Cloudurl eintragen (MIT Trailing / )
    2. `Medien` -> `Medienquellen` -> `MediaManager` -> `baseUrl` => `https://neueCloudUrl/mediamanager/`
    3. `WebDefault rechtsklick` -> `Kontext bearbeiten` -> `http_host` => `Url eintragen (ohne Protokoll / Trailing Slash)`
    4. Für alle Kontexte wiederholen falls `http_host` vorhanden
    5. `next_url` auf Vercel Url oder anderes Deployment pointen
    6. `Clear Cache` -> `Refresh Urls` -> `Rebuild Contentblocks`

## Modx

! = Ungecached, das Ergebnis von Chunk / Snippet wird nicht gecached
\# = Fastfield, spezielle Methode um schnell Daten abzufragen z.b. [[#123.pageTitle]] frägt Pagetitle von Ressource 123 ab
\$ = Chunk Aufruf
[[+value:snippetName]] = Outputfilter, bearbeitet Input bevor ausgegeben wird

#### Templates

Stellen die Struktur für Ressourcen dar und bestimmen wie und welche Daten ausgegeben werden (ContentBlocks mit [[*content]]

Haben Template Variablen zugordnet, welche das sind kannim Template aufgelistet werden
Haben eine (id) mit welcher sie z.b. für GetRessources gefiltert werden können

#### Template Variablen

Datenfelder die einem Template zugewiesen werden können. Die Daten können in Templates, Snippets und Chunks abgerufen werden
Syntax: [[*TVName]] [(Ausnahme: GetRessource / RenderRessources)](https://docs.modx.com/3.x/en/extras/getresources)

#### Chunks

Funktional ähnlich wie Templates. Die Syntax für Datenabfragen und Snippets ist gleich. Chunks können keinen Ressourcen zugewiesen werden, stattdessen werden sie in Templates aufgerufen und bieten wiederverwendbare Datenstrukturen. (Ähnlich Javascript Klassen)
Syntax: [[\$ChunkName]] oder [[\!$ChunkName]]

#### Snippets

Syntax: [[SnippetName]] oder [[!SnippetName]]
Geschrieben in _PHP_

Kann in Chunks und Templates mit obriger Syntax aufgerufen werden. Ein Snippet in einem Snippet aufzurufen erfolgt über :
[modx->runSnippet('Snippetname',\[Parameter\]);](https://docs.modx.com/3.x/en/extending-modx/modx-class/reference/modx.runsnippet)

#### Output Filter

Sonderform eines Snippets
Syntax: [[+wertEinesFelds:snippetName]] oder [[*wertEinerTV:snippetName]]
Verarbeitet den Input eines Feldes und verändert den Output.
Beispiel: [[+value:encode]] -> json_encode auf den +value anwenden

[**OUTPUT FILTER DOCUMENTATION** ](https://docs.modx.com/3.x/en/building-sites/tag-syntax/output-filters)

#### Wichtige Packages

[**GetRessources**](https://docs.modx.com/3.x/en/extras/getresources), generiere eine Liste aus vorgegebenen Daten mit Filtern aus Ressourcen(Siehe Kit Master)

[**RenderRessources**](https://docs.modx.com/current/en/extras/renderresources/index), siehe GetRessources allerdings werden die Seiten komplett gerendert wie im Template vorgegeben(Siehe Kit Master)

[**Collections**](https://docs.modx.com/current/en/extras/collections/index), spezielle Darstellung von Ressourcenlisten mit eigener Darstellung (Siehe Kit Master)

[**Migx**](https://docs.modx.com/current/en/extras/migx/index), Repeater für Template Variablen mit spezieller Syntax, (Siehe ÜMT)

[**MediaManager**](https://github.com/Sterc/mediamanager), Bildverwaltungstool mit spezieller Oberflöche, eigenen Snippets und eigener Datenbanktabelle. Momentan in Beta, immer die Augen nach **Updates** aufhalten! Neue Packages einfach runterladen und über den Package Manager installieren (Cache Clean, Relog, Hard-Refresh eventuell nötig)

[**ToggleTVSet**](https://jako.github.io/ToggleTVSet/), Erlaubt die bedingte Darstellung von TVs anhand des Werts einer anderen TV (Wenn in Footermenü, dann zeige Indexfeld, siehe KitMaster Footermenu TVs)

### ContentBlocks

Zu finden unter `Extras -> ContentBlocks`
Bieten vorgefertigte Dateneingabemasken für Templates. Dadurch kann eine feste Struktur für unser JSON hergestellt werden. Bietet viele verschiedene Datenfelder die vom User ausgefüllt werden können.

#### Fields

Dateneingabefelder, ähnlich Input-Feldern in HTML. Je nach Auswahl stehen verschiedene Optionen der Datenabfrage zur Verfügung (Hover über Template Feld in Properties)
z.b. Link -> [[+link]] / [[+LinkType]]

#### Layouts

Stellen Struktur für die Anordnung von Fields bereit. Kann theoretisch viele Spalten besitzen in die Felder eingetragen werden können. (Kit benutzt ein einspaltiges Layout mit main als Hauptspalte)
Können Eigenschaften erhalten die fixe Datenfelder für den User zur Verfügung stellen die nicht ausgeblendet werden können. Nützlich für z.b. Sichtbarkeitsmodus

#### Templates

Vorlage die dem User bereitgestellt wird. Hier kann aus Layouts und Feldern eine vorgefertigte Maske erstellt werden. Diese kann bei Benutzung vom User weiter verändert werden, dient aber als Ausgangspunkt.

Templates werden nach 'Template' (Modx) gefiltert, so können z.b. Templates für Newsseiten, Eventseiten und normale Seiten getrennt werden. Zu finden unter _Availability_

## Redactor Icons

Wrden als **Clips** hinterlegt. .svg Icons sind dabei im Filesystem hinterlegt. Clips werden mit einem redactorIcon Snippet aus dem HTML geparsed und anschließend durch ein Inline SVG ersetzt.

Redactor -> OutputFilter -> Einträge durch inline SVG ersetzen (switch case)

## Global Headscripts

Erlaubt es benötigte Scripte für den <head> Bereich eines HTML Documents zu hinterlegen. Wird per HTML Parser im Projekt eingebaut

## Kontext Settings

Settings die für den Kontext der Ressourcen von Relevanz sind. Je nach Kontext können so unterschiedliche Daten hinterlegt werden (z.b. verschiedene Sprachversionen).
Kontextdaten können jederzeit per **[[++kontext_setting_name]]** abgerufen werden

### FAQ

#### View wirft falsches JSON aus

JSON in jsonlint einfügen, zuletzt bearbeitetes Etwas prüfen:

1. Kommasetzung, oftmals zu wenige oder zuviele
2. Anführungszeichen bei Keys und Values
3. Korrekte Field-Bezeichnung für die Daten (z.b. nicht [[+value]] benutzen wenn [[+link]] nötig)
4. Checken ob [[+value:encode]] verwendet werden sollte

#### Feld wirft keine Anfürhungszeichen trotz :encode aus

1. Prüfen ob der Fieldvalue korrekt abgefragt wurde (Über Props hovern und lesen! Manchmal braucht es nicht [[+value]]. Wird der Wert falsch abgefragt wird kein Outputsnippet ausgeführt
