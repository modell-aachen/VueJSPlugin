;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.scroll = {
    name: 'scroll',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }
      $('[data-scrollcontainer]').each( function() {
        var $this = $(this);
        var data = $this.data('scrollcontainer');
        if ( data === 'parent' ) {
          $this.slimScroll({height: $this.parent().height()});
        } else {
          $this.slimScroll({height: 'auto'});
        }
      });
    }
  };
}(jQuery, window._, window.document, window));
