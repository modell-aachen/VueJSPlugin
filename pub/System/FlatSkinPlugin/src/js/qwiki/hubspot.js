;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.hubspot = {
    name: 'hubspot',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      if ( window.Pace && window.Offline ) {
        var fav = $('link[rel="icon"]').attr('href');
        Pace.options = {ajax: {ignoreURLs: [fav]}};
        Offline.options = {checks: {xhr: {url: fav}}};
      }
    }
  };
}(jQuery, window._, window.document, window));
