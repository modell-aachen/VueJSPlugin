;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.maximize = {
    name: 'maximize',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      $('[data-maximize-toggle]').on('click', this, toggleMaximize );
    },

    unbind: function() {
      $('[data-maximize-toggle]').off('click', toggleMaximize );
    }
  };

  var toggleMaximize = function( evt ) {
    var self = evt.data;
    var targets = $(this).data('maximize-toggle');
    if ( !targets ) {
      self.error( '[Maximize]: Missing target area!' );
      return;
    }

    _.each( targets.split(','), function(elem) {
      $(elem).toggleClass('maximized');
    });

    // ToDo: close (opened) offcanvas areas
    // ToDo: persist state
  };
}(jQuery, window._, window.document, window));
