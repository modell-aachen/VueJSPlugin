# Kurzanleitung

## Installation
**WICHTIG**
Bevor *grunt install* ausgeführt werden kann, **MUSS** die Datei *Gruntfile.js* angepasst werden:

```
var foswikiBase = grunt.option('foswiki') || '/opt/qwiki';
var checkoutBase = grunt.option('git') || '/opt/git';
```

Hier müssen die Pfade korrekt gesetzt sein. Alternative kann _grunt_ auch wie folgt aufgerufen werden:
```
grunt install --foswiki=/PFAD --git=/PFAD
```


Anschließend können mir folgenden Befehlen alle *nodejs* und *bower* Abhängigkeiten installiert werden.
Mit _grunt install_ wird der Skin gebaut und das entsprechende Foswiki Plugin installiert.

```bash
npm install && bower install
grunt install
```

## Entwicklung
Nach Änderungen an *.js* oder *.scss* Dateien muss
`grunt build`
ausgeführt werden.
Alternativ kann Grunt das Pluginverzeichnis auch überwachen und die nötigen Tasks automatisch ausführen:
`grunt watch`


### Anmerkung
*Grunt* kann von einem beliebigen Unterverzeichnis aufgerufen werden.



# ToDo. detaillierter

Voraussetzung ist eine funktionierende *node.js* Umgebung, inklusive *npm*.
Siehe [node.js](http://www.nodejs.org).

Unter Debian:
`aptitude install npm`


## Grunt

Als Task-Runner wird [Grunt](http://www.gruntjs.com) verwendet. Die entsprechenden Pakete (Grunt + Contribs) können über *npm* installiert werden. Dieser Schritt kann übersprungen werden, sollten diese Pakete global installiert sein.
`npm install`

Oder global:
`npm install -g`


## Bower

Zur Verwaltung aller Abhängigkeiten (z.B. foundation, font-awesome, etc) wird der Frontend-Manager [Bower](http://www.bower.io) verwendet.

...
