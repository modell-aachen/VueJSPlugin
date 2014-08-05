;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.preferences = {
    name: 'preferences',
    foswiki: {},

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      if ( _.isObject( window.foswiki ) && _.isObject( window.foswiki.preferences ) ) {
        $.extend( this.foswiki, window.foswiki.preferences );
        this.Q.extend( this );
      }
    }
  };
}(jQuery, window._, window.document, window));
