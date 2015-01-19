;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.attachments = {
    name: 'attachments',
    origAttachmentsLabel: '',
    uploadContainerTemplate: [
      '<div class="upload">',
      '<div class="progress"></div>',
      '<span class="filename"></span>',
      '<span class="progress" data-i18n-text="Please wait" data-i18n-ns="attachments">Please wait</span>',
      '</div>'
    ].join(''),

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
      $('.qw-attachments-container .list .qw-add-btn').on( 'click', this, showUpload );
      $('[data-attachtable-toggle]').on( 'click', this, showAttachments );
      $('.qw-infobar').on( this.namespace + '.offcanvas.closing', this, closeAll );

      $('<input id="qw-file-input" type="file" style="display: none" multiple>').appendTo('body');
      $('#qw-file-uploader').on( 'click', showFileDialog );
      $('#qw-file-input').on('change', this, onFileInputChanged );

      var text;
      var numAttachments = $('.qw-attachments-container .list ul li').length;
      if ( this.origAttachmentsLabel ) {
        text = this.origAttachmentsLabel + ' (' + numAttachments + ')';
      } else {
        this.origAttachmentsLabel = $('[data-attachtable-toggle]').text();
        text = this.origAttachmentsLabel + ' (' + numAttachments + ')';
      }

      $('[data-attachtable-toggle]').text( text );

      // dnd upload handler
      var self = this;
      var upload = document.getElementById('qw-file-uploader');
      if ( _.isUndefined( upload ) ) {
        return;
      }

      upload.ondragover = function() {
        $(upload).addClass('drag');
        return false;
      };

      upload.ondragleave = function() {
        $(upload).removeClass('drag');
        return false;
      };

      upload.ondrop = function( evt ) {
        $(upload).removeClass('drag');
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        _.each( files, function( file ) {
          self.upload( file );
        });
      };
    },

    unbind: function() {
      $('#qw-file-uploader').off( 'click', showFileDialog );
      $('#qw-file-input').off('change', onFileInputChanged );
      $('.qw-attachments-container li').off( 'click', showDetails );
      $('.qw-attachments-container').off( 'click.qw', closeDetails );
      $('.qw-attachments-container .list .qw-back-btn').off( 'click', closeAttachments );
      $('.qw-attachments-container .list .qw-add-btn').off( 'click', showUpload );
      $('[data-attachtable-toggle]').off( 'click', showAttachments );
      $('.qw-infobar').off( this.namespace + '.offcanvas.closing', closeAll );
      $('#qw-file-input').remove();
    },

    upload: function( file ) {
      enqueue( file );
    }
  };

  var onFileInputChanged = function( evt ) {
    var self = evt.data;
    _.each( this.files, function( file ) {
      self.upload( file );
    });
  };

  var showFileDialog = function() {
    $('#qw-file-input').trigger('click');
  };

  var showAttachments = function( evt ) {
    $('.qw-infobar > div > .content').addClass('offcanvas');
    $('.qw-attachments-container').addClass('active');

    return false;
  };

  var showUpload = function( evt ) {
    var self = evt.data;

    $('.qw-attachments-container > .list').addClass('deactive');
    $('.qw-attachments-container > .attach').addClass('active');
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

    return false;
  };

  var closeAttachments = function( evt ) {
    $('.qw-infobar > div > .content').removeClass('offcanvas');
    $('.qw-attachments-container').removeClass('active');

    return false;
  };

  var closeDetails = function( evt ) {
    if ( !$('.qw-attachments-container > .details').hasClass('active') && !$('.qw-attachments-container > .attach').hasClass('active') ) {
      return false;
    }

    var $src = $(evt.target);
    if ( $src.hasClass('qw-back-btn') ) {
      $('.qw-attachments-container > .list').removeClass('deactive');
      $('.qw-attachments-container > .details').removeClass('active');
      $('.qw-attachments-container > .attach').removeClass('active');
    }

    return false;
  };

  var closeAll = function() {
    $('.qw-attachments-container > .list').removeClass('deactive');
    $('.qw-attachments-container > .details').removeClass('active');
    $('.qw-infobar > div > .content').removeClass('offcanvas');
    $('.qw-attachments-container').removeClass('active');

    return false;
  };

  // uploading...
  var pendingFiles = [];
  var pendingContainer = [];
  var timer = null;

  var enqueue = function( file ) {
    pendingFiles.push( file );

    var $container = $('#qw-file-uploader > div');
    if ( $container.length === 0 ) {
      return;
    }

    var $tmpl = $(QWiki.plugins.attachments.uploadContainerTemplate);
    $tmpl.find('span.filename').text( file.name );
    $tmpl.appendTo( $container );
    pendingContainer.push( $tmpl );

    if ( timer === null ) {
      timer= setTimeout( function() { upload(); }, 100 );
    }
  };

  var dequeue = function() {
    return pendingFiles.shift();
  };

  var upload = function() {
    var file = dequeue();
    if ( !file ) {
      timer = null;
      return;
    }

    var payload = new FormData();
    payload.append("filepath", file);
    payload.append("filename", file.name);
    payload.append("filecomment", '');

    var client = new XMLHttpRequest();
    client.onerror = function( evt ) {
      console.log( 'error' );
      console.log( evt );
    };
    client.onabort = function( evt ) {};

    var $container = pendingContainer.shift();
    client.upload.onprogress = function( evt ) {
      var val = Math.round( 100/evt.total * evt.loaded );
      var percent = val + '%';
      $container.find('div.progress').css('width', percent);
      $container.find('span.progress').text(percent);

      // continue with next file
      if ( val === 100 ) {
        upload();
      }
    };

    var p = foswiki.preferences;
    var keyurl = [
      p.SCRIPTURLPATH,
      '/rest',
      p.SCRIPTTSUFFIX,
      '/FlatSkinPlugin/validation?topic=',
      p.WEB,
      '.',
      p.TOPIC
    ].join('');

    var uploadurl = [
      p.SCRIPTURLPATH,
      '/upload',
      p.SCRIPTTSUFFIX,
      '/',
      p.WEB,
      '.',
      p.TOPIC
    ].join('');

    $.get( keyurl, function( key ) {
      payload.append("validation_key", key);
      client.open( "POST", uploadurl );
      client.send( payload );
    });
  };
}(jQuery, window._, window.document, window));
