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

      $('[data-dropdown]').each( function() {
        var $this = $(this);
        $this.on( 'click', function() {return false;} );

        var target = $this.data('dropdown');
        if ( !target ) {
          return;
        }

        $this.on( 'mouseenter', this, handleDropdownMouseEnter );
        var $target = $(target);
        if ( $target.length === 0 ) {
          return;
        }

        if ( !$target.hasClass( 'qw-dropdown' ) ) {
          $target.addClass( 'qw-dropdown' );
        }

        $target.on( 'mouseleave', this, handleDropdownMouseLeave );
        $target.detach().appendTo('body');
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

      $('[data-dropdown]').each( function() {
        var $this = $(this);

        var target = $this.data('dropdown');
        if ( !target ) {
          return;
        }

        $this.off( 'mouseenter', handleDropdownMouseEnter );
        var $target = $(target);
        if ( $target.length === 0 ) {
          return;
        }

        $target.off( 'mouseleave', handleDropdownMouseLeave );
      });

      $('[data-dropdown]').off( 'mouseleave', handleDropdownMouseLeave );
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

  var handleDropdownMouseEnter = function( evt ) {
    var self = evt.data;
    var $this = $(this);
    var target = $this.data('dropdown');

    if ( !target ) {
      return;
    }

    var $target = $(target);
    if ( $target.length === 0 ) {
      return;
    }

    $this.addClass('active');

    var pos = $this.offset();
    var top = pos.top + $this.height();
    $target.css('top', top);
    $target.css('left', pos.left);
    $target.css('display', 'block');
  };

  var handleDropdownMouseLeave = function( evt ) {
    $(this).attr('style', '');
    $('.active[data-dropdown]').removeClass('active');
  };
}(jQuery, window._, window.document, window));
