;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.attachments = {
    name: 'attachments',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
    },

    unbind: function() {
      // ToDo
    }
  };

  var filter = function( self ) {};
  var reset = function( self ) {};
}(jQuery, window._, window.document, window));
