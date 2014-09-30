;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.offcanvas = {
    name: 'offcanvas',

    // CSS classes which are used to move the target container off canvas
    classes: {
      leftbar: 'ocvs-leftbar',
      rightbar: 'ocvs-rightbar',
      search: 'ocvs-search'
    },

    // Attributes used within markup
    dataAttributes: {
      autoclose: 'offcanvas-autoclose',
      canvas: 'offcanvas',
      reveal: 'reveal',
      target: 'target',
      toggle: 'offcanvas-toggle',
      trigger: 'trigger',
      type: 'type'
    },

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      bind( this );
    },

    toggleOffcanvas: function( target, type ) {
      toggleOffcanvas( this, target, type );
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
    $(toggle).each( function() {
      var $this = $(this);
      var trigger = $this.data(attrs.trigger);
      if ( trigger ) {
        $this.on( trigger, self, handleClick );
      } else {
        $this.on( 'click', self, handleClick );
      }
    });
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

    // default to left if no direction is specified
    var type = $(this).attr('data-' + attr.type);
    toggleOffcanvas( self, target, type, this );

    // stop propagation
    return false;
  };

  var toggleOffcanvas = function( self, target, type, elem ) {
    var $body = $('body');
    var $canvas = $(self.canvas);

    if ( type === undefined || !/(leftbar|rightbar|search)/i.test( type ) ) {
      self.Q.error( 'Invalid offcanvas type!' );
      return;
    }

    var cls = self.classes[type];
    // apply fixed width to supress content alignment
    if ( !$body.hasClass( cls ) ) {
      $canvas.css( 'min-width', $canvas.width() );
    }

    // raise opening/closing event
    var etype = $body.hasClass( cls ) ? 'closing' : 'opening';
    self.Q.raiseEvent( target, self, etype );

    // start animation
    $(target).toggleClass('active');
    var set = $body.toggleClass( cls ).hasClass( cls );

    // auto-close all opened offcanvas areas
    if ( etype === 'opening' ) {
      var toRemove = [];
      for( var c in self.classes ) {
        if ( self.classes[c] !== cls ) {
          toRemove.push( self.classes[c] );
        }
      }

      $body.removeClass( toRemove.join(' ') );
      $('[data-target]').each( function() {
        var $this = $(this);
        var selector = $this.data('target');

        if ( selector !== target ) {
          self.Q.raiseEvent( selector, self, 'closing' );
          $(selector).removeClass('active');

           var deactivate = $this.attr('data-activate');
           if ( deactivate ) {
            var arr = deactivate.split(',');
            for( var i = 0; i < arr.length; ++i ) {
              $(arr[i]).removeClass('active');
            }
           }
        }
      });
    }

    if ( _.isObject( elem ) ) {
      // toggle class active for annotated selectors
      var activateSelector = $(elem).data('activate');
      if ( activateSelector ) {
        var activations = activateSelector.split(',');
        for ( var i = 0; i < activations.length; ++i ) {
          var activate = activations[i];
          var $a = $(activate);
          $a.toggleClass('active');
        }
      }
    }
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
