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
      $('body').observe( 'added', '[data-tooltip]', attachTooltipster );
    },

    unbind: function() {
      $('body').disconnect( 'added', '[data-tooltip]', attachTooltipster ).disconnect(  );
    }
  };

  var attachTooltipster = function() {
    var $this = $(this);
    $this.disconnect( {attributes: true, attributeFilter: ['title']}, attachTooltipster );
    $this.observe( {attributes: true, attributeFilter: ['title']}, attachTooltipster );

    if ( $this.data('tooltipster') === true ) {
      $this.tooltipster( 'content', $this.attr('title') );
      return;
    }

    var position = $this.data('tooltip') || 'bottom';
    $this.tooltipster({
      theme: 'tooltipster-qwiki',
      animation: 'fade',
      delay: 200,
      touchDevices: false,
      position: position,
      trigger: 'hover'
    });

    $this.data('tooltipster', true);
  };

}(jQuery, window._, window.document, window));
