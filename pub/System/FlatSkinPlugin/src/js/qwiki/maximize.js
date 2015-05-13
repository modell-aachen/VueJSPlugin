;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.maximize = {
    name: 'maximize',
    priority: 100,
    cssClass: 'maximized',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
      restore( this );
    },

    bind: function() {
      this.unbind();

      $('[data-maximize-toggle]').on('click', this, handleClick);
    },

    unbind: function() {
      $('[data-maximize-toggle]').off('click', handleClick);
    },

    maximizeOnce: function() {
      var self = this;
      var $toggle = $('[data-maximize-toggle]');

      var maximized = [];
      $toggle.each( function() {
        var $this = $(this);
        $this.addClass( 'active' );
        var targets = $this.data('maximize-toggle');
        if ( typeof targets !== 'string' ) {
          return;
        }

        _.each( targets.split(','), function(elem) {
          var $elem = $(elem);
          $elem.addClass( self.cssClass );
        });

        $('.offcanvas').each( function() {
          $(this).offcanvas({action: 'close'});
        });
      });

      QWiki.raiseEvent( document, this, 'maximizing' );
      self.Q.persistData( this.name, maximized.join(',') );
    },

    minimizeOnce: function() {
      var self = this;
      var $toggle = $('[data-maximize-toggle]');
      $toggle.each( function() {
        var $this = $(this);
        $this.removeClass( 'active' );
        var targets = $this.data('maximize-toggle');
        if ( typeof targets !== 'string' ) {
          this.Q.persistData( this.name, '' );
          return;
        }

        var maximized = [];

        _.each( targets.split(','), function(elem) {
          var $elem = $(elem);
          $elem.removeClass( self.cssClass );
        });
      });

      QWiki.raiseEvent( document, this, 'minimizing' );
      this.Q.persistData( this.name, '' );
    }
  };

  var restore = function( self ) {
    var data = self.Q.restoreData( self.name );
    if ( data && typeof data === 'string' ) {
      var arr = data.split(',');
      if ( arr.length > 0 ) {
        $('[data-maximize-toggle]').addClass('active');
        _.each( arr, function(elem) {
          var $elem = $(elem);
          $elem.addClass('no-transition');
          $elem.addClass(self.cssClass);

          setTimeout( function() {
            $elem.removeClass('no-transition');
          }, 500 );
        });
      }
    }
  };

  var handleClick = function( evt ) {
    var $toggle = $(this).find('i');
    var $topic = $('.qw-topic');
    var $sidebar = $('.qw-sidebar');
    var $top = $('.qw-top-two > .wrapper');
    var maximized = $topic.hasClass('maximized');

    if ( maximized ) {
      $toggle.removeClass('icon-arrow-left');
      $toggle.addClass('icon-arrow-right');

      $topic.removeClass('maximized');
      $top.removeClass('maximized');
      $sidebar.removeClass('minimized');
    } else {
      $toggle.addClass('icon-arrow-left');
      $toggle.removeClass('icon-arrow-right');

      $topic.addClass('maximized');
      $top.addClass('maximized');
      $sidebar.addClass('minimized');
    }

    return false;

    // ToDo
    // var self = evt.data;
    // var $this = $(this);
    // if ( $this.hasClass('qw-close-btn') ) {
    //   self.maximizeOnce();
    //   var data = $(this).data('maximize-toggle');
    //   if ( data ) {
    //     self.Q.persistData( self.name, data );
    //   }

    //   return;
    // }

    // $(this).toggleClass('active');
    // var targets = $(this).data('maximize-toggle');
    // if ( !targets ) {
    //   return;
    // }

    // var maximized = [];
    // _.each( targets.split(','), function(elem) {
    //   var $elem = $(elem);
    //   $elem.toggleClass(self.cssClass);
    //   if ( $elem.hasClass(self.cssClass) ) {
    //     maximized.push( elem );

    //     $('.offcanvas').each( function() {
    //       $(this).offcanvas({action: 'close'});
    //     });
    //   }
    // });

    // if(maximized.length) {
    //   QWiki.raiseEvent( document, QWiki.plugins.maximize, 'maximizing' );
    // } else {
    //   QWiki.raiseEvent( document, QWiki.plugins.maximize, 'minimizing' );
    // }

    // self.Q.persistData( self.name, maximized.join(',') );
  };
}(jQuery, window._, window.document, window));
