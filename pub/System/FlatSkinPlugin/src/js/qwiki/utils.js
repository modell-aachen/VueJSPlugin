;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.utils = {
    name: 'utils',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      $('[data-split-string]').each( function() {
        splitString( this, $(this).data('pattern') );
      });
    }
  };

  var splitString = function( elem, pattern ) {
    if ( !pattern ) {
      return;
    }

    var $self = $(elem);
    var text = $self.data( 'origText' );

    if ( !text ) {
      text = $self.text();
      $self.data( 'origText', text );
    }

    var regex = new RegExp( pattern );
    if ( regex.test( text ) === false ) {
      return;
    }

    var parts = text.split( regex );
    $self.text( parts.join( ' ' ) );
  };
}(jQuery, window._, window.document, window));
