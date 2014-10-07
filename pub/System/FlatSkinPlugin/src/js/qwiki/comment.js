;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.comment = {
    name: 'comment',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      var $tgt = $('[data-commentable="1"]');
      $tgt.on( 'mouseenter', showAdorner );
      $tgt.on( 'mouseleave', hideAdorner );
    },

    unbind: function() {
      var $tgt = $('[data-commentable="1"]');
      $tgt.off( 'mouseenter', showAdorner );
      $tgt.off( 'mouseleave', hideAdorner );
    }
  };

  var showAdorner = function( evt ) {
    var $this = $(this);
    var height = $this.height();
    var width = $this.width();
    var pos = $this.position();

    var $adorner = $('#qw-comment-adorner');
    var top = 105 + pos.top + height/2 - 25;
    $adorner.css('top', top);

    var left = pos.left + width;
    $adorner.css('left', left);
    $adorner.show();

    console.log(pos);
    console.log('top: ' + top);
    console.log('left: ' + left);
  };

  var hideAdorner = function( evt ) {
    $('#qw-comment-adorner').hide();
  };
}(jQuery, window._, window.document, window));
