(function ($) {
  $.fn.qwiki = function() {
    var args = Array.prototype.slice.call( arguments, 0 );
    return this.each( function() {
      if ( typeof QWiki === 'undefined' ) {
        if ( typeof console === 'object' && typeof console.error === 'function' ) {
          console.error( 'QWiki is undefined!' );
        }

        return this;
      }

      var scope = QWiki.init.apply( QWiki, [this].concat( args ) );
      return scope;
    });
  };
})(jQuery);
