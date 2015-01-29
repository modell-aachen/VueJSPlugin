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
        } else if ( /^\d+$/.test( data ) || /^\d+px$/i.test( data ) ) {
          var height = data.replace( 'px', '' ) + 'px';
          $this.slimScroll({height: height});
        } else if ( data ) {
          // data is selector
          // if this is child of selector, adjust height
          // else use selector height
          var $data = $(data);
          if ( $data.find( this ).length > 0 ) {
            var h = $data.height() - $this.position().top - 10;
            $this.slimScroll({height: h});
          } else {
            $this.slimScroll({height: $data.height()});
          }
        } else {
          $this.slimScroll({height: 'auto'});
        }
      });
    }
  };
}(jQuery, window._, window.document, window));
