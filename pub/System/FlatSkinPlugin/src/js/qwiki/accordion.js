;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.accordion = {
    name: 'accordion',
    autoclose: 0,

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('[data-accordion] > section > .heading').on( 'click', this, handleClick );
    },

    unbind: function() {
      $('[data-accordion] > section > .heading').off( 'click', this, handleClick );
    }
  };

  var handleClick = function( evt ) {
    var $this = $(this);
    var self = evt.data;

    if ( self.autoclose ) {
      var container = $this.closest('[data-accordion]');
      container.children('.active').each( function() {
        if ( $(this)[0] === $this.parent()[0] ) {
          return;
        }

        $(this).removeClass('active');
      });
    }

    $this.parent().toggleClass('active');
  };
}(jQuery, window._, window.document, window));
