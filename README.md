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


Anschließend können mit folgenden Befehlen alle *nodejs* und *bower* Abhängigkeiten installiert werden.
Mit _grunt install_ wird der Skin gebaut und das entsprechende Foswiki Plugin installiert.

```bash
npm install && bower install
grunt install
```

## Entwicklung
**Die benötigten Quellen liegen im Verzeichnis */pub/System/FlatSkinPlugin/src*.**

Die Verzeichnisse */pub/System/FlatSkinPlugin/js* und */pub/System/FlatSkinPlugin/css* werden automatisch generiert.
Änderungen an Dateien in diesen Verzeichnissen gehen nach jedem Grunt-Build verloren.

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


# Sammelsurium
ToDo. in Dokumentation verarbeiten.

### Q.Wiki Plugins
Q.Wiki Plugins, min. Layout:
```javascript
;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.MYPLUGINNAME = {
    name: 'MYPLUGINNAME',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      // code goes here
    }
  };
}(jQuery, window._, window.document, window));

```

Registrieren über script-Tag in HEAD oder über `QWiki.registerPlugin( plugin, optionen )`.

Jedes Plugin bekommt eine Referenz auf [JQuery](http://api.jquery.com/) ($) und [Underscore](http://underscorejs.org/) (_). Über `this.Q` wird der Zugriff auf die Q.Wiki Lib. ermöglicht. Globals werden von QWiki "vererbt". Jedem Plugin wird garantiert, dass das DOM vollständig geladen wurde, bevor die plugin-eigene *init* Methode aufgerufen wird.



### accordion
```html
<div data-accordion>
  <section>
    <span class="heading"><i class="fa"></i>TITLE TEXT<i class="fa fa-sitemap"></i></span>
    <ul>...</ul>
  </section>
</div>
```

### offcanvas
Container, der bewegt werden soll:
```html
<div data-offcanvas>
   ...
</div>
```

Container, der eingeblendet werden soll:
```html
<div id="myLeftOffcanvas" class="qw-offcanvas-target-left">
   ...
</div>
...
<div id="myRightOffcanvas" class="qw-offcanvas-target-right">
   ...
</div>
```

Toggle:
```html
<a href="#" class="button" data-offcanvas-toggle data-target="#myLeftOffcanvas">Toggle left</a>
<a href="#" class="button" data-offcanvas-toggle data-target="#myRightOffcanvas" data-right>Toggle right</a>
```

* foo
* bar
* 2000


### ckeditor
In Main- oder WebPreferences:
```
   * Set CKE_CONFIG_TOPIC = System.FlatSkinPlugin
```
