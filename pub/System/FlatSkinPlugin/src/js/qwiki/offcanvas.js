;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.offcanvas = {
    name: 'offcanvas',

    // CSS classes which are used to move the target container off canvas
    classes: {
      left: 'qw-offcanvas-left',
      right: 'qw-offcanvas-right'
    },

    // Attributes used within markup
    dataAttributes: {
      autoclose: 'offcanvas-autoclose',
      canvas: 'offcanvas',
      reveal: 'reveal',
      target: 'target',
      toggle: 'offcanvas-toggle',
      direction: {
        left: 'left',
        right: 'right'
      }
    },

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      bind( this );
    }
  };

  var bind = function( self ) {
    // prevent attaching multiple handlers
    unbind( self );

    var attrs = self.dataAttributes;
    var canvas = '[data-' + attrs.canvas + ']';
    self.canvas = $(canvas);
    if ( self.canvas.length === 0 ) {
      return;
    }

    // resize offcanvas area after browser resize
    $(window).on( 'resize', self, handleResize );

    // listen to transitionend event and remove min-width on canvas close.
    $(self.canvas).on( 'transitionend', self, transitionEndListener );

    // click handler, initiates offcanvas animation
    var toggle = '[data-' + attrs.toggle + ']';
    $(toggle).on( 'click', self, handleClick );
    $(toggle).on( 'focus', self, handleClick );
  };

  var handleResize = function( evt ) {
    var $canvas = $(evt.data.canvas);
    if ( /min-width/.test( $canvas.attr('style') ) ) {
      $canvas.css( 'min-width', $(window).width() );
    }
  };

  var handleClick = function( evt ) {
    var self = evt.data;
    var attr = self.dataAttributes;

    // return if target is unknown
    var target = $(this).attr('data-' + attr.target);
    if ( target === undefined ) {
      evt.preventDefault();
      return;
    }

    if ( $(target).hasClass('active') ) {
      var close = $(this).data( attr.autoclose );
      if ( close === 0 ) {
        evt.preventDefault();
        return;
      }
    }

    var $body = $('body');
    var $canvas = $(self.canvas);

    // default to left if no direction is specified
    var direction = attr.direction;
    var isLeft = $(this).attr('data-' + direction.left) !== undefined;
    var isRight = $(this).attr('data-' + direction.right) !== undefined;
    var cls = (isLeft || !isRight) ? self.classes.left : self.classes.right;

    // decide whether to just show the target container without any offcanvas animation
    var isReveal = $(this).attr('data-' + attr.reveal) !== undefined;

    // apply fixed width to supress content alignment
    if ( !isReveal && !$body.hasClass( cls ) ) {
      $canvas.css( 'min-width', $canvas.width() );
    }

    // raise opening/closing event
    var etype = $body.hasClass( cls ) ? 'closing' : 'opening';
    self.Q.raiseEvent( target, self, etype );

    // auto-close all opened offcanvas areas
    if ( etype === 'opening' ) {
      $body.removeClass( self.classes.left + ' ' + self.classes.right );
      $('[data-target]').each( function() {
        var selector = $(this).data('target');
        self.Q.raiseEvent( selector, self, 'closing' );
        $(selector).removeClass('active');
      });
    }

    // start animation
    $(target).toggleClass('active');
    $body.toggleClass( cls );

    // stop propagation
    evt.preventDefault();
  };

  var transitionEndListener = function( evt ) {
    var $body = $('body');
    var clsLeft = evt.data.classes.left;
    var clsRight = evt.data.classes.right;

    if ( $body.hasClass( clsLeft ) || $body.hasClass( clsRight ) ) {
      return;
    }

    $(this).css('min-width', '');
  };

  var unbind = function( self ) {
    $(window).off( 'resize', self, handleResize );
    $(self.canvas).off( 'transitionend', self, transitionEndListener );
    var toggle = '[data-' + self.dataAttributes.toggle + ']';
    $(toggle).off( 'click', self, handleClick );
    $(toggle).off( 'focus', self, handleClick );
  };
}(jQuery, window._, window.document, window));
