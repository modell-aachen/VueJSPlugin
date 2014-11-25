;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.scroll = {
    name: 'scroll',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      $('[data-scrollcontainer]').slimScroll({height: 'auto'});
    }
  };
}(jQuery, window._, window.document, window));
