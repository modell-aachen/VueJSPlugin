;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.jsi18n = {
    name: 'jsi18n',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.translate();
    },

    translate: function() {
      var self = this;
      if ( window.jsi18n === undefined ) {
        if ( this.debug ) {
          this.Q.error( 'js18n instance is missing!' );
        }

        return;
      }

      set( 'text' );
      set( 'val' );
    }
  };

  var set = function( mode ) {
    if ( !/^(text|val)$/.test( mode ) ) {
      return;
    }

    $('[data-i18n-' + mode + ']').each( function() {
      var $this = $(this);

      var txt = $this.data('i18n-' + mode );
      var ns = $this.data('i18n-ns');
      if ( !ns ) {
        return;
      }

      var args = [ns, txt];
      var params = txt.match( /(?!\[_)(\d+)(?=\])/g );
      _.each( params, function( p ) {
        var param = $this.data('i18n-param-' + p);
        args.push( param );
      });

      var translated = jsi18n.get.apply( self, args );
      $this[mode].call( $this, translated );
    });
  };
}(jQuery, window._, window.document, window));
