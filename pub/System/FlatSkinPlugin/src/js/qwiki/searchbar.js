;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.searchbar = {
    name: 'searchbar',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      var $search = $('.qw-quicksearch-form input[name="search"]');
      $search.on('click.qw-searchbar', this, onShowOffCanvas);

      $('#hotfix-close-search').on('click', function() {
        $('.qw-quicksearch').offcanvas({action: 'close'});
        return false;
      });
    },

    unbind: function() {
      var $search = $('.qw-quicksearch-form input[name="search"]');
      $search.off('.qw-searchbar');
    }
  };

  var onShowOffCanvas = function() {
    $('.qw-quicksearch').offcanvas({action: 'open'});
  };
}(jQuery, window._, window.document, window));
