;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.solrsearch = {
    name: 'solrsearch',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      // code goes here
    }
  };
}(jQuery, window._, window.document, window));
