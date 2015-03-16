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

  // This block is required, because the z-index of the topic is above the
  // z-index of the action-buttons (otherwise this could be done with a few
  // lines of css).
  // The Submenu will be attached to the body and a script makes sure it will
  // be shown and hidden when appropriate.
  $(function() {
      var dropTimeoutCounter = {}; // only use addCounter to access this

      // Increases the counter for the submenue
      // Parameters:
      //    * $dropdown: jQuery object of the dropdown, for which the counter
      //       shall be increased
      //    * addend: the amount, the counter shall be increased (omit to just
      //       retrieve the value)
      //
      // Return: The new value of the counter
      var addCounter = function($dropdown, addend) {
          var id = $dropdown.attr('id');
          if(!id) {
              id = 'dropdown' + foswikiUniqueId();
              $dropdown.attr('id', id);
          }
          if(!dropTimeoutCounter[id]) {
              dropTimeoutCounter[id] = 0;
          }
          var sum = dropTimeoutCounter[id] += addend;
          return sum;
      };

      // Sets a timeout for the this-object. After the timeout expires and the
      // counter for the corresponding submenue did not change, the submenue
      // will be hidden.
      var doSetTimeout = function() {
          var $this = $(this);
          var $dropdown;

          var dropdown = $this.data('dropdown');
          if(dropdown) {
              $dropdown = $(dropdown);
              if(!$dropdown.length) {
                  if(window.console) {
                      console.log("Could not find dropdown: " + dropdown);
                  }
                  return;
              }
          } else {
              $dropdown = $this;
          }
          var count = addCounter($dropdown, 1);
          setTimeout( function() {
            if(count === addCounter($dropdown, 0)) {
                closeSubMenu($dropdown);
            }
          }, 750 );
      };

      // Opens the submenue (dropdown).
      // Sets an 'active' class to anything having a data-dropdown set to the
      // dropdown's id.
      // Parameters:
      //     $dropdown: jQuery-object of the dropdown's ul, or any child of it.
      var openSubMenu = function($dropdown) {
        if(!$dropdown || !$dropdown.length) {
            return;
        }
        if(!$dropdown.is('ul')) {
            $dropdown = $dropdown.closest('ul');
        }
        addCounter($dropdown, 1);
        $dropdown.addClass('showing');
        var id = $dropdown.attr('id');
        if(id) {
            $('[data-dropdown="#' + id + '"]').addClass('active'); // XXX works only with ids
        }
      };

      // Closes the submenue (dropdown).
      // Removes the 'active' class from anything having a data-dropdown set to
      // the dropdown's id.
      // Parameters:
      //     $dropdown: jQuery-object of the dropdown's ul, or any child of it.
      var closeSubMenu = function($dropdown) {
        if(!$dropdown || !$dropdown.length) {
            return;
        }
        if(!$dropdown.is('ul')) {
            $dropdown = $dropdown.closest('ul');
        }
        $dropdown.removeClass('showing');
        var id = $dropdown.attr('id');
        if(id) {
            $('[data-dropdown="#' + id + '"]').removeClass('active'); // XXX works only with ids
        }
      };

      // Initializes all qw-dropdowns.
      //    * Moves the submenue to the body.
      //    * Sets the position of the submenue below (the last) element having
      //       it as its 'data-dropdown' attribute.
      //    * Handle mouseovers
      $('[data-dropdown]').each(function() {
          var $this = $(this);
          var $dropdown = $($this.data('dropdown'));
          var offset = $this.offset(); // XXX arguably this should be updated when the menue is being shown
          var top = offset.top + $this.height();
          var left = offset.left;
          $dropdown.appendTo('body');
          $dropdown.css('position', 'fixed').css('top', top + 'px').css('left', left + 'px').css('z-index', 250);
      });
      $('#qw-more-menu').mouseover(function() {
        openSubMenu($(this));
      }).mouseleave(doSetTimeout);
      $('[data-dropdown]').mouseover(function(){
        var dropdown = $(this).data('dropdown');
        openSubMenu($(dropdown));
      }).mouseleave(doSetTimeout);
  });


}(jQuery, window._, window.document, window));
