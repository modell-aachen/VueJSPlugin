;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.maximize = {
    name: 'maximize',

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
        $(elem).toggleClass('maximized');
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
      }
    });

    self.Q.persistData( self.name, maximized.join(',') );
  };
}(jQuery, window._, window.document, window));
