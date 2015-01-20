;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.documenthead = {
    name: 'documenthead',
    class: 'qw-document-head',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      $('[data-documenthead-toggle').on('click', this, handleClick);
    },

    unbind: function() {
      $('[data-documenthead-toggle').off('click', handleClick);
    }
  };

  var handleClick = function( evt ) {
    var self = evt.data;
    var sel = '.' + self.class;
    $(sel).toggleClass('toggled');
  };
}(jQuery, window._, window.document, window));
