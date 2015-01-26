;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.attachments = {
    name: 'attachments',
    origAttachmentsLabel: '',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('.qw-attachments-container li').on( 'click', this, showDetails );
      $('.qw-attachments-container').on( 'click.qw', this, closeDetails );
      $('.qw-attachments-container .list .qw-back-btn').on( 'click', this, closeAttachments );
      $('[data-attachtable-toggle]').on( 'click', this, showAttachments );
      $('.qw-infobar').on( this.namespace + '.offcanvas.closing', this, closeAll );

      var text;
      var numAttachments = $('.qw-attachments-container .list ul li').length;
      if ( this.origAttachmentsLabel ) {
        text = this.origAttachmentsLabel + ' (' + numAttachments + ')';
      } else {
        this.origAttachmentsLabel = $('[data-attachtable-toggle]').text();
        text = this.origAttachmentsLabel + ' (' + numAttachments + ')';
      }

      $('[data-attachtable-toggle]').text( text );
    },

    unbind: function() {
      $('.qw-attachments-container li').off( 'click', showDetails );
      $('.qw-attachments-container').off( 'click.qw', closeDetails );
      $('.qw-attachments-container .list .qw-back-btn').off( 'click', closeAttachments );
      $('[data-attachtable-toggle]').off( 'click', showAttachments );
      $('.qw-infobar').off( this.namespace + '.offcanvas.closing', closeAll );
    }
  };

  var showAttachments = function( evt ) {
    $('.qw-infobar > div > .content').addClass('offcanvas');
    $('.qw-attachments-container').addClass('active');
  };

  var showDetails = function( evt ) {
    var raw = $(this).find('.raw').text();
    var json = $.parseJSON(raw);
    if ( !json.comment ) {
      json.comment = 'ToDo: i18n "no comment"';
    }

    var $cnt = $('.qw-attachments-container > .details');
    $cnt.empty().qtemplate('add', $.extend({_type: 'qw.attachment.details'}, json));

    $('.qw-attachments-container > .list').addClass('deactive');
    $('.qw-attachments-container > .details').addClass('active');
  };

  var closeAttachments = function( evt ) {
    $('.qw-infobar > div > .content').removeClass('offcanvas');
    $('.qw-attachments-container').removeClass('active');
  };

  var closeDetails = function( evt ) {
    if ( !$('.qw-attachments-container > .details').hasClass('active') ) {
      return false;
    }

    var $src = $(evt.srcElement);
    if ( $src.hasClass('qw-back-btn') ) {
      $('.qw-attachments-container > .list').removeClass('deactive');
      $('.qw-attachments-container > .details').removeClass('active');
    }
  };

  var closeAll = function() {
    $('.qw-attachments-container > .list').removeClass('deactive');
    $('.qw-attachments-container > .details').removeClass('active');
    $('.qw-infobar > div > .content').removeClass('offcanvas');
    $('.qw-attachments-container').removeClass('active');
  };
}(jQuery, window._, window.document, window));
