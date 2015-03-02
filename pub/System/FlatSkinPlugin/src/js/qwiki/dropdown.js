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

      $('[data-splitbutton]:not(.inited)').each( function() {
        var $self = $(this);
        $self.addClass('inited');
        var selector = $self.data('target');

        var target = $(selector);
        if ( target.length > 0 ) {
          var adorner = $self.find('[data-adorner]');
          if ( adorner.length > 0 ) {
            adorner.on( 'click', this, handleSplitbtnClick );
          } else {
            if(target.length !== 1 && window.console) {
              console.log('Splitbutton could not find adorner');
            }
          }

          target.mouseenter(this, handleDropdownMouseEnter);
          target.mouseleave(this, handleDropdownMouseLeave);
          $self.mouseenter(this, handleDropdownMouseEnter);
          $self.mouseleave(this, handleDropdownMouseLeave);

          $self.click( $self, handleLinkClick );
          target.find('a').click( $self, handleLinkClick );
        } else {
          if(window.console) {
            console.log('Splitbutton could not find target: ' + selector);
          }
        }
      });
    },

    unbind: function() {
      $('[data-splitbutton]').each( function() {
        var $self = $(this);
        $self.removeClass('inited');
        var selector = $self.data('target');
        var target = $(selector);
        if ( target.length > 0 ) {
          var adorner = $self.find('[data-adorner]');
          if ( adorner.length > 0 ) {
            adorner.off( 'click', handleSplitbtnClick );
          }

        $self.off('click', handleLinkClick );
        target.find('a').off('click', handleLinkClick );

        target.off( 'mouseleave', handleDropdownMouseLeave );
        target.off( 'mouseenter', handleDropdownMouseEnter );
        $self.off( 'mouseleave', handleDropdownMouseLeave );
        $self.off( 'mouseenter', handleDropdownMouseEnter );
        }
      });
    }
  };

  var handleLinkClick = function(evt) {
    var $this = $(this);
    if(!evt && evt.data) {
      if(window.console) {
        console.log('Splitbutton: Missing data for click-event');
      }
      return;
    }
    var $self = $(evt.data);
    $self.removeClass('active');
    hideMenue($self);
    $this.trigger('clickDone');
    return false;
  };

  var showMenue = function($self) {
    var height = $self.outerHeight();
    var width = $self.outerWidth();

    var target = getTarget($self);

    if ( !target.hasClass( 'inited' ) ) {
      target.addClass( 'inited' );
      if ( $self.hasClass( 'attachToBody' ) ) {
        target.css( 'z-index', 500 );
        target.css( 'position', 'fixed' );
        target.appendTo( 'body' );
      } else {
        target.css( 'position', 'absolute' );
      }
    }

    var top, left;
    if( $self.hasClass( 'attachToBody' ) ) {
      // this gets the correct position, regardless of scroll/zoom
      var rect = $self[0].getBoundingClientRect();
      top = rect.y;
      left = rect.x;
    } else {
      var pos = $self.position();
      top = pos.top;
      left = pos.left;
    }
    top += height;

    target.css( 'top', top );
    target.css( 'left', left );
    target.css( 'width', width );
    target.show();
  };

  var hideMenue = function($self) {
    getTarget($self).hide();
  };

  var getTarget = function($self) {
    var selector = $self.data('target');
    return $(selector);
  };

  var handleSplitbtnClick = function( evt ) {
    var $self = $(evt.data);
    $self.toggleClass( 'active' );

    if ( $self.hasClass( 'active' ) ) {
      showMenue($self);
    } else {
      hideMenue($self);
    }

    return false;
  };

  var handleDropdownClick = function( evt ) {
    var self = evt.data;
    var $this = $(this);
    var target = $this.data('dropdown');

    if ( !target ) {
      return false;
    }

    var $target = $(target);
    if ( $target.length === 0 ) {
      return false;
    }

    if ( $this.hasClass('active') ) {
      $this.removeClass('active');
      $target.attr('style', '');

      var selector = $this.data('target');
      alert(selector);
      var $menue = $(selector);
      $menue.hide();

      return false;
    }

    $this.addClass('active');
    var pos = $this.position();
    var off = $this.offset();
    var top = pos.top + $this.height();
    var left = off.left;
    $target.css('top', top);
    $target.css('left', left);
    $target.css('display', 'block');

    return false;
  };

  var timeouts = [];

  var handleDropdownMouseEnter = function( evt ) {
    var timeout = timeouts.pop();
    if ( !_.isUndefined( timeout ) ) {
      clearTimeout( timeout );
    }
  };

  var handleDropdownMouseLeave = function( evt ) {
    if(!evt && evt.data) {
        return;
    }
    var $this = $(evt.data);

    var timeout = setTimeout( function() {
        $this.removeClass('active');
        hideMenue($this);
    }, 750 );

    timeouts.push( timeout );
  };
}(jQuery, window._, window.document, window));
