;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.webdav = {
    name: 'webdav',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('[data-webdav-link]').livequery( attachDAVHAndler );
    },

    unbind: function() {
      $('[data-webdav-link]').expire();
      $('[data-webdav-link]').off( 'click', handleLinkClick );
    }
  };

  var attachDAVHAndler = function( i, link ) {
    var $link = $(this);
    var href = $link.attr('href');

    var hasHandler = false;
    var component, componentName, extension;
    var apps = QWiki.plugins.webdav.settings.apps;

    for ( var app in apps ) {
      var exts = new RegExp( "\\.(" + apps[app] + ")$", 'i' );
      if ( exts.test( href ) ) {
        hasHandler = true;
        componentName = app.split('.')[0];
        component = app;

        try {
          extension = href.match(exts)[1];
        } catch ( err ) {
          extension = null;
        }

        break;
      }
    }

    if ( !hasHandler ) {
      $link.addClass('hidden');
      return;
    }

    $link.removeClass('hidden');
    $link.data( 'component', component );
    $link.data( 'componentName', componentName );
    $link.data( 'extension', extension );
    $link.on( 'click', handleLinkClick );
  };

  var handleLinkClick = function() {
    var plugin = QWiki.plugins.webdav;
    var opts = plugin.settings;
    
    if ( window.kvpDiscussionConfirmation && !window.kvpDiscussionConfirmation() ) {
      return false;
    }

    var $link = $(this);
    var href = $link.attr('href');

    var component = $link.data('component');
    var componentName = $link.data('componentName');
    var extension = $link.data('extension');

    var filename = getFilename( href );
    var p = foswiki.preferences;
    var tokenUrl = [
      p.SCRIPTURLPATH,
      '/rest',
      p.SCRIPTSUFFIX,
      '/FlatSkinPlugin/webdavtoken?w=',
      p.WEB,
      '&t=',
      p.TOPIC,
      '&a=',
      filename
    ].join('');

    $.ajax({url: tokenUrl, cache: false}).done( function( data, status, xhr ) {
      var token = xhr.getResponseHeader('X-MA-TOKEN');
      if (!token) {
        QWiki.error( 'Missing token!' );
        return;
      }

      var newTopic = topic + '_files'; // hard corded in FilesysVirtual
      var davHref = href.replace( topic, newTopic ).replace( pubPath, opts.location + '/' + token );
      davHref = decodeURI( davHref );

      var isChrome = /Chrome/.test(navigator.userAgent);
      var isFirefox = /Firefox/.test(navigator.userAgent);
      var isIE = /MSIE|Trident/.test(navigator.userAgent);

      if (isIE) {
        return webdavInvokeIE( component, davHref, false );
      }

      if ( isFirefox || isChrome ) {
        if ( isFirefox && !foswiki.hasFFAddon ) {
          // createFirefoxAddonDialog();
          // ToDo.
          return;
        }

        var $cnt = $('<div id="qw-webdav-container" class="hidden"></div>');
        $cnt.appendTo('body');

        var a = document.createElement('a');
        a.setAttribute('href', davHref);
        a.onclick = function(e) {return webdavInvoke(e);};
        $(a).appendTo( $cnt );

        a.click();
      }
    }).fail( function( xhr, status, err ) {
      if (window.console && window.console.error) {
        QWiki.error( 'Acquiring token failed!' );
        QWiki.error( err );
      }
    }).always( function() {
      $('#qw-webdav-container').remove();
    });

    return false;
  };

  var getFilename = function( href ) {
    var pattern = /.*\/(.+)$/;
    var filename;
    var match = pattern.exec(href);
    if (match != null && match.length > 1) {
        return match[1];
    } else {
        // will produce HTTP 500 -> error dialog
        return '#';
    }
  };

  var webdavInvoke = function(e) {
    var ev = document.createEvent('Events');
    ev.initEvent('webdav_open', true, true);
    e.currentTarget.dispatchEvent(ev);
    return false;
  };

  // Start Office app by using ActiveX
  // see http://msdn.microsoft.com/de-de/library/ie/7sw4ddf8(v=vs.94).aspx
  // IE only
  var webdavInvokeIE = function(officeComponent, url, isTemplate) {
    var parts = officeComponent.split('.');

    // Fix object class for MS Project
    // DO NOT CHANGE the term 'Project' to 'MSProject' within Config.spec!
    // The context menu action strings are built from the object class
    // identifiers (e.g. Open in Word/Excel/Visio/Project...)
    if (parts[0] === 'Project') {
      parts[0] = 'MSProject';
    }

    var launcher = new ActiveXObject(parts[0] + '.Application');
    switch (parts[0]) {
      case 'Access':
        launcher.Visible = true;
        launcher.OpenCurrentDatabase(url, false);
        break;
      case 'MSProject':
        launcher.Visible = true;
        launcher.Application.FileOpen(url, false);
        break;
      case 'Publisher':
        launcher.ActiveWindow.Visible = true;
        launcher.Open(url, false);
        break;
      default:
        var docType = null;
        if (launcher !== null) {
          docType = launcher[parts[1]];
        }

        if (docType !== null) {
          launcher.Visible = true;

          if (isTemplate) {
            docType.Add(url);
          } else {
            docType.Open(url);
          }
        }
    }

    return event.preventDefault;
  };
}(jQuery, window._, window.document, window));
