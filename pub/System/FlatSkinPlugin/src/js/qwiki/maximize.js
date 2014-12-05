;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.maximize = {
    name: 'maximize',
    priority: 100,

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
      restore( this );
    },

    bind: function() {
      this.unbind();

      $('[data-maximize-toggle]').on('click', this, toggleMaximize );
    },

    unbind: function() {
      $('[data-maximize-toggle]').off('click', toggleMaximize );
    }
  };

  var restore = function( self ) {
    var data = self.Q.restoreData( self.name );
    if ( data && typeof data === 'string' ) {
      _.each( data.split(','), function(elem) {
        var $elem = $(elem);
        $elem.addClass('no-transition maximized');

        setTimeout( function() {
          $elem.removeClass('no-transition');
        }, 500 );
      });
    }
  };

  var toggleMaximize = function( evt ) {
    var self = evt.data;
    var targets = $(this).data('maximize-toggle');
    if ( !targets ) {
      self.error( '[Maximize]: Missing target area!' );
      return;
    }

    var maximized = [];
    _.each( targets.split(','), function(elem) {
      var $elem = $(elem);
      $elem.toggleClass('maximized');
      if ( $elem.hasClass('maximized') ) {
        maximized.push( elem );

        $('.offcanvas').each( function() {
          $(this).offcanvas({action: 'close'});
        });
      }
    });

    if(maximized.length) {
      QWiki.raiseEvent( document, QWiki.plugins.maximize, 'maximizing' );
    } else {
      QWiki.raiseEvent( document, QWiki.plugins.maximize, 'unmaximizing' );
    }

    self.Q.persistData( self.name, maximized.join(',') );
  };
}(jQuery, window._, window.document, window));
