;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.dropdown = {
    name: 'dropdown',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      $('[data-dropdown]').each( function() {
        var $self = $(this);
        var selector = $self.data('target');

        var target = $(selector);
        if ( target.length > 0 ) {
          var adorner = $self.find('[data-adorner]');
          if ( adorner.length > 0 ) {
            adorner.on( 'click', this, handleClick );
          }
        }
      });
    },

    unbind: function() {
      $('[data-dropdown]').each( function() {
        var $self = $(this);
        var selector = $self.data('target');

        var target = $(selector);
        if ( target.length > 0 ) {
          var adorner = $self.find('[data-adorner]');
          if ( adorner.length > 0 ) {
            adorner.off( 'click', handleClick );
          }
        }
      });
    }
  };

  var handleClick = function( evt ) {
    var $self = $(evt.data);
    $self.toggleClass( 'active' );

    if ( $self.hasClass( 'active' ) ) {
      var pos = $self.position();
      var height = $self.outerHeight();
      var top = pos.top + height;

      target.css( 'top', top );
      target.css( 'left', pos.left );
    } else {
      target.css('top', '');
      target.css('left', '');
    }

    evt.preventDefault();
  };
}(jQuery, window._, window.document, window));
