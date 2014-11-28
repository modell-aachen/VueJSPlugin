;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.offcanvas = {
    name: 'offcanvas',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('[data-offcanvas-toggle]').on( 'click', this, handleClick );
    },

    unbind: function() {
      $('[data-offcanvas-toggle]').off( 'click', handleClick );
    }
  };


  var toggleCanvas = function( element, action, sticky ) {
    var sender = QWiki.plugins.offcanvas;
    var bar;
    var target;

    target = element.attr('data-offcanvas-toggle');
    if(target) {
        bar = $('[data-offcanvas][data-target="'+target+'"]');
        if(!bar.length) {
            if(window.console) {
                console.log("Bar not found: " + bar.selector);
            }
            return;
        }
    } else {
        if(element.attr('data-offcanvas') !== undefined) {
            bar = element;
        } else {
            bar = element.closest('[data-offcanvas]');
        }
        target = bar.attr('data-target');
    }

    // close other bars unless we are of the friendly kind
    // Questionably this is also done if we close a bar.
    if(typeof(bar.attr('data-friendly')) === 'undefined') {
        $('.offcanvas-active').each(function(){
            var $this = $(this);

            // don't close our friends
            if(typeof($this.attr('data-friendly')) !== 'undefined') {
                return;
            }

            // don't close ourself, we'll eventually do that later
            // don't do anything if this is not an offcanvas bar
            var thistarget = $this.attr('data-target');
            if(typeof(thistarget) === 'undefined' || thistarget === target) {
                return;
            }

            // check stickies:
            if($('.active[data-offcanvas-toggle="' + thistarget + '"][data-offcanvas-sticky-toggle]').length) {
                return;
            }

            // close the bar
            $('[data-offcanvas]').removeClass(thistarget);
            $('[data-target=' + thistarget + ']').removeClass('offcanvas-active');
            $('[data-offcanvas-toggle="' + thistarget + '"]').removeClass('active');
            QWiki.raiseEvent( $this, sender, 'closing' );
        });
    }

    var open;
    if(action === 'open') {
        open = true;
    } else if (action === 'close' ) {
        open = false;
    } else {
        // toggle
        if(bar.hasClass(target)) {
            open = false;
        } else {
            open = true;
        }
    }

    if(open) {
        $('[data-offcanvas]').addClass( target + ' offcanvas' );
        $('[data-offcanvas-toggle="' + target + '"]').addClass('active');
        if(!bar.hasClass('offcanvas-active')) {
            bar.addClass('offcanvas-active');
            QWiki.raiseEvent( bar, sender, 'opening' );
        }
    } else {
        $('[data-offcanvas]').removeClass( target );
        var wasactive = bar.hasClass('offcanvas-active');
        bar.removeClass( 'offcanvas-active' );
        if(!$('.offcanvas-active').length) {
            $('[data-offcanvas]').removeClass('offcanvas');
        }
        $('[data-offcanvas-toggle="' + target + '"]').removeClass('active');
        if(wasactive) {
            QWiki.raiseEvent( bar, sender, 'closing' );
        }
    }
  };

  var handleClick = function( evt ) {
    var $self = $(this);
    var plugin = evt.data;

    // return unless we got a valid offcanvas target area
    var target = $self.data('offcanvas-toggle');
    if ( !target ) {
      return false;
    }

    // handle sticky toggles (button highlighting)
    var sticky = $self.attr('data-offcanvas-sticky-toggle');
    var isSticky = typeof sticky !== typeof undefined && sticky !== false;

    var activate = !$self.hasClass('active');

    toggleCanvas($self);


    return false;
  };

  /*
    <div class="qw-quicksearch" data-offcanvas data-target="quicksearch">
      <div>
        <span id="foo"></span>
      </div>
    </div>

    (1)
    $('#foo').offcanvas()
     -> toggles 'quicksearch' animation on ALL [data-offcanvas] elements and
        appends/removes class 'active' on element '#foo'.


    (2)
    $('#foo').offcanvas({action: 'open', target: 'leftbar'})
     -> adds class 'active' to element '#foo' and applies 'leftbar' animation
        to all [data-offcanvas] elements

    (3)
    $('#foo').offcanvas({action: 'close'})
     -> removes class 'active' from self and closes all offcanvas areas
   */

  $.fn.offcanvas = function( opts ) {
    var target = null;
    var action;

    if ( _.isObject( opts ) ) {
      if ( opts.target && typeof opts.target === 'string' ) {
        target = opts.target;
      }

      if ( opts.action && typeof opts.action === 'string' ) {
        action = opts.action;
      }
    } 

    if ( target === null ) {
      var container = this.closest('[data-offcanvas]');
      target = $(container).data('target');
    }

    if ( !target || typeof target !== 'string' ) {
      return this;
    }

    toggleCanvas(this, action);

    return this;
  };
}(jQuery, window._, window.document, window));
