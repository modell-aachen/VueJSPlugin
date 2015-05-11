;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.leftbar = {
    name: 'leftbar',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      $('.qw-leftbar-toggle > a').on( 'click', this, toggleLeftbar );
    },

    unbind: function() {
      $('.qw-leftbar-toggle > a').off( 'click', toggleLeftbar );
    }
  };

  var toggleLeftbar = function( evt ) {
    $('.qw-top').toggleClass('leftbar-active');
    $('.qw-page').toggleClass('leftbar-active');

    return false;
  };
}(jQuery, window._, window.document, window));
