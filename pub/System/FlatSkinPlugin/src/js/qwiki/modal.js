;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.modal = {
    name: 'modal',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      var $modal = $('<div id="qw-modal-bg"></div>');
      $modal.appendTo('body');
    },

    unbind: function() {
      $('#qw-modal-bg').remove();
    }
  };

  $.fn.modal = function( options ) {
    var $modal = $('#qw-modal-bg');
    if ( $modal.length === 0 ) {

      return this;
    }

    var defaults = {
      bgClass: '',
      modal: true,
      useBg: true,
      width: 0,
      height: 0
    };

    var opts = $.extend( defaults, options );
    var wndWidth = $(window).width();
    return this.each(function () {
      var showModal = !_.isUndefined( opts.show ) && opts.show;
      if ( opts.useBg ) {
        if ( opts.bgClass && !$modal.hasClass( opts.bgClass ) ) {
          $modal.addClass( opts.bgClass );
        }

        if ( showModal ) {
          var payload = {target: this, options: opts};
          $modal.addClass('active');

          var $elem = $(this);
          var $clone = $elem.clone();

          $clone.on( 'click', function() {
            var $this = $(this);
            $this.addClass('dismissed');
            var $parent = $this.parent();
            var closeModal = $parent.children().length === 1;
            setTimeout( function() {$this.remove();}, 400 );
            if ( closeModal ) {
               $parent.modal({show: 0});
            } else {
              $this.next().addClass('active');
            }
          });

          setTimeout( function() {
            $clone.appendTo( $modal );
            if ( opts.width ) {
              $clone.css('width', opts.width);
            }

            if ( opts.height ) {
              $clone.css('height', opts.height);
            }

            var width = $clone.width()/2;
            var left = wndWidth/2 - width;
            $clone.css('left', left);
          }, 50 );

          setTimeout( function() {
            if ($('.qw-modal.active').length === 0 ) {
              $clone.addClass('active');
            }
          }, 100 );
        } else {
          $modal.addClass('dismissed');
          setTimeout( function() {
            $modal.removeClass('active dismissed');
            $modal.empty();
          }, 300);
        }
      }

      return this;
    });
  };
}(jQuery, window._, window.document, window));
