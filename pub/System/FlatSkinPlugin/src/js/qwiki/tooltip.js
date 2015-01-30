;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.tooltip = {
    name: 'tooltip',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      $('[data-tooltip]').each( attachTooltipster );
      $('body').observe('added', '[data-tooltip]', attachTooltipster );
    },

    unbind: function() {
      $('[data-tooltip]').expire();
      $('body').disconnect('added', '[data-tooltip]', attachTooltipster );
    }
  };

  var attachTooltipster = function() {
    var $this = $(this);
    var position = $this.data('tooltip') || 'bottom';
    $this.tooltipster({
      theme: 'tooltipster-qwiki',
      animation: 'fade',
      delay: 200,
      touchDevices: false,
      position: position,
      trigger: 'hover'
    });
  };

}(jQuery, window._, window.document, window));
