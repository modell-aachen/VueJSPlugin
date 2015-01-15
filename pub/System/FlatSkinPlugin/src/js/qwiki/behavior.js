;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.behavior = {
    name: 'behavior',
    priority: 10000,
    dataAttribute: 'behavior',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      $('[data-' + this.dataAttribute + ']').on( 'click', this, handleClick );
    },
    unbind: function() {
      $('[data-' + this.dataAttribute + ']').off( 'click', handleClick );
    }
  };

  var handleClick = function( evt ) {
    var self = evt.data;
    var $sender = $(this);

    if ( $(evt.delegateTarget).hasClass( 'active' ) ) {
      evt.preventDefault( true );
      evt.stopImmediatePropagation( true );
      return false;
    }

    // atm radio is the only implemented type
    var type = $sender.data( self.dataAttribute ) || 'radio';
    if ( type !== 'radio' ) {
      evt.preventDefault( true );
      return false;
    }

    var grp  = $sender.data('group');
    var selector = '[data-group="' + grp + '"]';
    var $items = $(selector);
    $items.each( function() {
      $(this).removeClass( 'active' );
    });
  };
}(jQuery, window._, window.document, window));
