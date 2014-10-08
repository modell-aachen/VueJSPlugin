;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.comments = {
    name: 'comments',
    comments: [],
    types: ['idea', 'neutral', 'issue'],

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }
    },

    bind: function() {
      this.unbind();

      var $tgt = $('[data-commentable="1"]');
      $tgt.on( 'mouseenter', this, onMouseEnter );
      $tgt.on( 'mouseleave', this, onMouseLeave );
      $tgt.on( 'click', this, onClick );

      $('.qw-comment-box .cancel').on( 'click', this, onCancel );
      $('.qw-comment-box .submit').on( 'click', this, onSave );
      $('input[name="commentType"').on( 'change', this, onCommentTypeChanged );
    },

    unbind: function() {
      var $tgt = $('[data-commentable="1"]');
      $tgt.off( 'mouseenter', onMouseEnter );
      $tgt.off( 'mouseleave', onMouseLeave );
      $tgt.off( 'click', onClick );

      $('.qw-comment-box .cancel').off( 'click', onCancel );
      $('.qw-comment-box .submit').off( 'click', onSave );
      $('input[name="commentType"').off( 'change', onCommentTypeChanged );
    },

    post: function( cmt ) {
      if ( !_.isObject( cmt ) ) {
        this.Q.error( 'Invalid comment!' );
        return;
      }

      var p = foswiki.preferences;
      var url = [
        p.SCRIPTURLPATH,
        '/rest',
        p.SCRIPTSUFFIX,
        '/FlatSkinPlugin/comment'
      ];

      var self = this;
      $.blockUI();
      $.ajax({
        url: url.join(''),
        type: 'POST',
        data: {comment: JSON.stringify( cmt )},
        success: function() {
          var selector = '[data-p-id="' + cmt.pid + '"]';
          $(selector).attr( 'data-hascomments', cmt.type );
          $('.qw-comment-box .cancel').click();

          cmt.author = foswiki.preferences.WIKINAME;
          cmt.date = (new Date()).getTime();
          self.comments.push( cmt );
          $.unblockUI();
        },
        error: function( xhr, status, err ) {
          $.unblockUI();
          self.Q.error( err );
        }
      });
    },

    load: function() {
      var self = this;
      var txt = $('#qw-comment-container').text() || '[]';
      var cmts = $.parseJSON( txt );
      this.comments = [];
      $.each( cmts, function( i, cmt ) {
        self.comments.push( cmt );
        var selector = '[data-p-id="' + cmt.pid + '"]';
        var commentable = $(selector);
        if ( commentable.length > 0 ) {
          commentable.attr( 'data-hascomments', cmt.type );
        }
      });
    }
  };

  var onCommentTypeChanged = function( evt ) {
    var self = evt.data;
    var index = $(this).val();
    var type = self.types[index];

    var pid = $('.qw-comment-box').data('id');
    var sel = '[data-p-id="' + pid + '"]';

    $('[data-commentable="1"].active').removeClass('active issue neutral idea');
    $(sel).addClass('active ' + type);
  };

  var onSave = function( evt ) {
    var $tb = $('#qw-comment-textarea');
    
    var text = $tb.val() || '';
    if ( text.trim() === '' ) {
      $tb.parent().addClass('error');
      return false;
    }

    var self = evt.data;
    var cmt = {
      type: $('input[name="commentType"]:checked').val(),
      text: $tb.val(),
      pid: $('.qw-comment-box').data('id')
    };

    self.post( cmt );
    return false;
  };

  var onCancel = function( evt ) {
    var $box = $('.qw-comment-box');
    $box.find('div').removeClass('error');
    $box.removeClass('active');
    $box.data('id', '');
    $('#qw-comment-textarea').val('');
    $('[data-commentable="1"].active').removeClass('active issue neutral idea');
    return false;
  };

  var onMouseEnter = function( evt ) {
    var $this = $(this);

    if ( $('.qw-comment-box.active').length > 0 ) {
      return;
    }

    if ( _.isNumber( $this.data('hascomments') ) ) {
      return;
    }

    var height = $this.height();
    var width = $this.width();
    var pos = $this.position();

    // pos is relative to the 'left page container'
    var $page = $('.qw-page > .qw-left');
    var offset = $page.offset();

    var $adorner = $('#qw-comment-adorner');
    var top = offset.top + pos.top + height/2 - 25 - window.pageYOffset;
    $adorner.css('top', top);

    var left = offset.left + pos.left + width;
    $adorner.css('left', left);
    $adorner.show();
  };

  var onMouseLeave = function( evt ) {
    $('#qw-comment-adorner').hide();
  };

  var onClick = function( evt ) {
    if ( $('.qw-comment-box.active').length > 0 ) {
      return;
    }

    var $box;
    var $this = $(this);
    if ( _.isNumber( $this.data('hascomments') ) ) {
      return;
    } else {
      $box = $('.qw-comment-box');
    }

    $box.css('top', $this.position().top);
    $box.data('id', $this.data('p-id'));

    $('#qw-cmt-type1').click();
    $box.addClass('active');
    $('#qw-comment-adorner').hide();
    return false;
  };
}(jQuery, window._, window.document, window));

(function($) {
  $(document).ready( function() {
    var plugin = QWiki.plugins.comments;
    plugin.load();
    plugin.bind();
  });
})(jQuery);
