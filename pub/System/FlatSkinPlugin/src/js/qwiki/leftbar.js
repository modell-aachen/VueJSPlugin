;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.leftbar = {
    name: 'leftbar',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      $('.links .button').addClass('invisible');
      this.bind();
    },

    bind: function() {
      this.unbind();
      $('.qw-menutoggle > .toggle').on('click', toggleLeftbar);
      $('.qw-leftbar > .buttons .button').on('click', handleBtnClick);

      $('.qw-leftbar').on('qw.offcanvas.closing', this, onOffcanvasToggled);
      $('.qw-leftbar').on('qw.offcanvas.opening', this, onOffcanvasToggled);
    },

    unbind: function() {
      $('.qw-menutoggle > .toggle').off('click', toggleLeftbar);
      $('.qw-leftbar > .buttons .button').off('click', handleBtnClick);
      $('.qw-leftbar').off('qw.offcanvas.closing', onOffcanvasToggled);
      $('.qw-leftbar').off('qw.offcanvas.opening', onOffcanvasToggled);
    }
  };

  var handleBtnClick = function() {
    $('.qw-leftbar > .buttons .button').removeClass('active');
    $(this).addClass('active');
  };

  var toggleLeftbar = function() {
    var $leftbar = $('.qw-leftbar');
    $leftbar.toggleClass('expanded');
  };

  var onOffcanvasToggled = function(evt) {
    var $leftbar = $('.qw-leftbar');
    var $btns = $('.buttons .button');
    var $links = $('.links .button');

    if ( !$leftbar.hasClass('expanded') ) {
      for( var i = $btns.length - 1; i >= 0; --i ) {
        var $btn = $($btns[i]);
        _.delay( _.bind( $btn.toggleClass, $btn ), ($btns.length - i) * 50, 'invisible' );
      }

      $links.each(function(i) {
        _.delay( _.bind( $(this).toggleClass, $(this) ), i * 75, 'invisible' );
      });
    } else {
      $btns.each(function(i) {
        _.delay( _.bind( $(this).toggleClass, $(this) ), i * 50, 'invisible' );
      });

      for( var j = $links.length - 1; j >= 0; --j ) {
        var $link = $($links[j]);
        _.delay( _.bind( $link.toggleClass, $link ), ($links.length - j) * 50, 'invisible' );
      }
    }
  };
}(jQuery, window._, window.document, window));
