;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.searchbar = {
    name: 'searchbar',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      // this.bind();
    },

    bind: function() {
      this.unbind();

      var $search = $('.qw-search input[name="search"]');
      $search.on('click', this, onClick);
      // $search.on('focus', this, onFocus);
      // $search.on('blur', this, onBlur);
    },

    unbind: function() {
      var $search = $('.qw-search input[name="search"]');
      // $search.off('focus', onFocus);
      // $search.off('blur', onBlur);
    }
  };

  var onFocus = function() {
    $('.qw-searchbar').addClass('active');
  };

  var onBlur = function() {
    $('.qw-searchbar').removeClass('active');
  };

  var onClick = function() {
    $('.qw-searchbar').toggleClass('active');
  };
}(jQuery, window._, window.document, window));
