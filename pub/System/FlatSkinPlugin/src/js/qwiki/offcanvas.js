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
      $('[data-offcanvas-toggle]').on( 'click', handleClick );
    },

    unbind: function() {
      $('[data-offcanvas-toggle]').off( 'click', handleClick );
    }
  };

  var handleClick = function() {
    var $this = $(this);
    var target = $this.data('offcanvas-toggle');
    if ( !target ) {
      return;
    }


    var cls = ['leftbar', 'infobar', 'quicksearch', 'kvpoverlay', 'offcanvas'];
    $('[data-offcanvas]').removeClass( _.without(cls, target).join(' ') );
    $('[data-offcanvas]').toggleClass( 'offcanvas ' + target );
    
    var wasActive = false;
    if ( $this.has('[data-offcanvas-sticky-toggle]') ) {
      wasActive = $this.hasClass('active');
    }

    $('[data-offcanvas-sticky-toggle]').removeClass('active');
    if ( !wasActive ) {
      $this.addClass('active');
    }
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
    var action = this.hasClass('offcanvas') ? 'close' : 'toggle';

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

    var cls = ['leftbar', 'infobar', 'quicksearch', 'kvpoverlay', 'offcanvas'];
    var $ocvs = $('[data-offcanvas]');
    $ocvs.removeClass( _.without(cls, target).join(' ') );

    var etype;
    switch (action) {
      case 'open':
        $ocvs.addClass( 'offcanvas ' + target );
        this.addClass('active');
        etype = 'opening';
        break;
      case 'close':
        $ocvs.removeClass( 'offcanvas ' + target );
        this.removeClass('active');
        etype = 'closing';
        break;
      default:
        $ocvs.toggleClass( 'offcanvas ' + target );
        this.toggleClass('active');
        etype = this.hasClass('active') ? 'opening' : 'closing';
        break;
    }

    var sender = QWiki.plugins.offcanvas;
    QWiki.raiseEvent( this, sender, etype );

    return this;
  };
}(jQuery, window._, window.document, window));
