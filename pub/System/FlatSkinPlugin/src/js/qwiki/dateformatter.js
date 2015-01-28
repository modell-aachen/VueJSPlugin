;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.dateformatter = {
    name: 'dateformat',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('[data-formatdate]').livequery( parseDate );
    },

    unbind: function() {
      $('[data-formatdate]').expire();
    }
  };

  var parseDate = function( el ) {
    var parseFormat = foswiki.getMetaTag('DATEFORMAT') || 'DD MMM YYYY - HH:mm';

    var $this = $(this);
    var format = $this.data('formatdate') || 'l';
    var date = moment( $this.text(), parseFormat, window.navigator.language );
    $this.text( date.format('l') );
  };
}(jQuery, window._, window.document, window));
