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

      $('[data-splitbutton]').each( function() {
        var $self = $(this);
        var selector = $self.data('target');

        var target = $(selector);
        if ( target.length > 0 ) {
          var adorner = $self.find('[data-adorner]');
          if ( adorner.length > 0 ) {
            adorner.on( 'click', this, handleSplitbtnClick );
          }
        }
      });
    },

    unbind: function() {
      $('[data-splitbutton]').each( function() {
        var $self = $(this);
        var selector = $self.data('target');

        var target = $(selector);
        if ( target.length > 0 ) {
          var adorner = $self.find('[data-adorner]');
          if ( adorner.length > 0 ) {
            adorner.off( 'click', handleSplitbtnClick );
          }
        }
      });
    }
  };

  var handleSplitbtnClick = function( evt ) {
    var $self = $(evt.data);
    $self.toggleClass( 'active' );

    var selector = $self.data('target');
    var target = $(selector);

    if ( $self.hasClass( 'active' ) ) {
      var height = $self.outerHeight();
      var width = $self.outerWidth();

      var pos = $self.position();
      var top = pos.top + height;

      target.css( 'top', top );
      target.css( 'left', pos.left );
      target.css( 'width', width );
    } else {
      target.css('top', '');
      target.css('left', '');
      target.css('width', '');
    }

    return false;
  };
}(jQuery, window._, window.document, window));
