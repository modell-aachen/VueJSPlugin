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

      this.load();
      this.bind();
    },

    bind: function() {
      this.unbind();

      var $tgt = $('[data-commentable="1"]');
      $tgt.on( 'mouseenter', this, onMouseEnter );
      $tgt.on( 'mouseleave', this, onMouseLeave );
      $tgt.on( 'click', this, onClick );

      $('.qw-comment-editbox .cancel').on( 'click', this, onCancel );
      $('.qw-comment-editbox .submit').on( 'click', this, onSave );
      $('input[name="commentType"]').on( 'change', this, onCommentTypeChanged );

      $('#qw-comment-more').on( 'click', this, onShowMore );
      $('#qw-comment-less').on( 'click', this, onShowLess );
    },

    unbind: function() {
      var $tgt = $('[data-commentable="1"]');
      $tgt.off( 'mouseenter', onMouseEnter );
      $tgt.off( 'mouseleave', onMouseLeave );
      $tgt.off( 'click', onClick );

      $('.qw-comment-editbox .cancel').off( 'click', onCancel );
      $('.qw-comment-editbox .submit').off( 'click', onSave );
      $('input[name="commentType"]').off( 'change', onCommentTypeChanged );

      $('#qw-comment-more').off( 'click', onShowMore );
      $('#qw-comment-less').off( 'click', onShowLess );
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
          $('.qw-comment-editbox .cancel').click();

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

  var onShowMore = function( evt ) {
    var self = evt.data;
    var $this = $(this);
    var $less = $('#qw-comment-less');

    var $box = $('.qw-comment-viewbox');
    $box.find('.comment > .content').text( $box.data('text') );

    $this.addClass('hidden');
    $less.removeClass('hidden');

    return false;
  };

  var onShowLess = function( evt ) {
    var self = evt.data;
    var $this = $(this);
    var $more = $('#qw-comment-more');

    var $box = $('.qw-comment-viewbox');
    $box.find('.comment > .content').text( $box.data('abbr') );

    $this.addClass('hidden');
    $more.removeClass('hidden');

    return false;
  };

  var onCommentTypeChanged = function( evt ) {
    var self = evt.data;
    var index = $(this).val();
    var type = self.types[index];

    var pid = $('.qw-comment-editbox').data('id');
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
      pid: $('.qw-comment-editbox').data('id')
    };

    self.post( cmt );
    return false;
  };

  var onCancel = function( evt ) {
    var $box = $('.qw-comment-editbox');
    $box.find('div').removeClass('error');
    $box.removeClass('active');
    $box.data('id', '');
    $('#qw-comment-textarea').val('');
    $('[data-commentable="1"].active').removeClass('active issue neutral idea');
    return false;
  };

  var onMouseEnter = function( evt ) {
    var $this = $(this);

    if ( $('.qw-comment-editbox.active').length > 0 ) {
      var content = $('#qw-comment-textarea').val();
      if ( content.trim() !== '' ) {
        return;
      }
    }

    var height = $this.height();
    var width = $this.width();
    var pos = $this.position();

    // pos is relative to the 'left page container'
    var $page = $('.qw-page > .content');
    var offset = $page.offset();

    if ( _.isNumber( $this.data('hascomments') ) ) {
      return;
    } else {
      var $adorner = $('#qw-comment-adorner');
      var top = offset.top + pos.top + height/2 - 25 - window.pageYOffset;
      $adorner.css('top', top);

      var left = pos.left + width;
      $adorner.css('left', left);
      $adorner.show();
    }
  };

  var onMouseLeave = function( evt ) {
    $('#qw-comment-adorner').hide();
  };

  var onClick = function( evt ) {
    $('.qw-comment-viewbox.active').removeClass('active');
    if ( $('.qw-comment-editbox.active').length > 0 ) {
      var content = $('#qw-comment-textarea').val();
      if ( content.trim() !== '' ) {
        return;
      } else {
        onCancel();
      }
    }

    var $box;
    var $this = $(this);

    $('[data-commentable="1"]').removeClass('active idea issue');
    $this.addClass('active');
    var ctype = parseInt( $this.data('hascomments') );
    switch (ctype) {
      case 0:
        $this.addClass('idea');
        break;
      case 2:
        $this.addClass('issue');
        break;
      default:
        $this.addClass('idea');
        break;
    }

    var self = evt.data;
    var hasComments = _.isNumber( $this.data('hascomments') );
    if ( hasComments ) {
      $box = $('.qw-comment-viewbox');
    } else {
      $box = $('.qw-comment-editbox');
    }

    // 15 = $qw-content-padding/2
    $box.css('top', $this.position().top - 15);
    $box.data('id', $this.data('p-id'));

    if ( hasComments ) {
      var pid = $(this).data('p-id');
      var arr = _.where(self.comments, {pid: pid});
      var comments = _.sortBy(arr, function( cmt ) { return Math.min( parseInt(cmt.date) ); });
      if ( !comments || comments.length === 0 ) {
        return false;
      }

      var first = comments[0];
      var d = new Date(0);
      d.setUTCSeconds( first.date );
      var date = [
        d.toLocaleTimeString(),
        '|',
        d.toLocaleDateString()
      ];
      $box.find('.user').text( first.author );
      $box.find('.date').text( date.join(' ') );

      // trim text
      var text = first.text;
      $box.data('text', text);
      if ( text.length > 200 ) {
        for ( var i = 160; i < text.length; ++i ) {
          if ( text.charAt( i ) === ' ' ) {
            text = text.substr(0, i) + '...';
          }
        }

        $box.data('abbr', text);
        $box.find('.more').removeClass('hidden');
      } else {
        $box.find('.more').addClass('hidden');
      }

      $box.find('.comment > .content').text( text );
    } else {
      $('#qw-cmt-type0').click();
      $('#qw-comment-adorner').hide();
    }
    
    $box.addClass('active');
    return false;
  };
}(jQuery, window._, window.document, window));
