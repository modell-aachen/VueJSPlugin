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

    if ( !isSticky ) {
      var $toggles = $('[data-offcanvas-toggle="' + target + '"]');
      $toggles.each( function() {
        var $this = $(this);
        sticky = $this.attr('data-offcanvas-sticky-toggle');
        if ( typeof sticky !== typeof undefined && sticky !== false ) {
          $this.toggleClass('active');
        }
      });
    } else {
      $self.toggleClass('active');

      // remove highlighting for active sticky toggles
      $('.active[data-offcanvas-sticky-toggle][data-offcanvas-toggle!="' + target + '"]').removeClass('active');
    }

    var cls = ['leftbar', 'infobar', 'quicksearch', 'kvpbar', 'kvpoverlay', 'offcanvas'];
    cls = _.without(cls, target);

    // get a collection of currently active stickies
    var $active = $('.active[data-offcanvas-sticky-toggle]');

    var remove = [target];
    $active.each( function() {
      var tgt = $(this).data('offcanvas-toggle');
      if ( tgt ) {
        remove.push(tgt);
      }
    });

    var toRemove = _.difference(cls, remove);

    // fire closing event for auto-closed offcanvas areas.
    _.each( _.without( toRemove, 'offcanvas' ), function( e ) {
      if ( $('[data-offcanvas]').hasClass(e) ) {
        plugin.Q.raiseEvent( '.qw-' + e, plugin, 'closing' );
      }
    });

    $('[data-offcanvas]').removeClass( toRemove.join(' ') );
    $('[data-offcanvas]').toggleClass( 'offcanvas ' + target );

    // fire opening/closing event for currently selected target
    plugin.Q.raiseEvent( '.qw-' + target, plugin, $('[data-offcanvas]').hasClass(target) ? 'opening' : 'closing' );

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

    var cls = ['leftbar', 'infobar', 'quicksearch', 'kvpbar', 'kvpoverlay', 'offcanvas'];
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
