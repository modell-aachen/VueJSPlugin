;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.comments = {
    name: 'comments',
    comments: [],
    types: ['idea', 'issue'],

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }
// if(true){return;}
      this.load();
      this.bind();
    },

    bind: function() {
      this.unbind();

      var self = this;
      $('[data-commentable="1"]').livequery( function() {
        var $this = $(this);
        $this.on( 'mouseenter', self, onMouseEnter );
        $this.on( 'mouseleave', self, onMouseLeave );
        $this.on( 'click', self, onClick );
      });

      $('.qw-comment-editbox .cancel').on( 'click', this, onCancel );
      $('.qw-comment-editbox .submit').on( 'click', this, onSave );
      $('input[name="commentType"]').on( 'change', this, onCommentTypeChanged );
      $('.qw-comment-reply .reply-btn').on( 'click', this, showReplyBox );
      $('.qw-comment-reply .editor .cancel').on( 'click', this, resetReplyBox );
      $('.qw-comment-reply .editor .submit').on( 'click', this, sendReply );

      $('.qw-commentbar').on( this.namespace + '.offcanvas.closing', this, onCommentBarClosing );
    },

    unbind: function() {
      $('[data-commentable="1"]').expire( function() {
        var $this = $(this);
        $this.off( 'mouseenter', onMouseEnter );
        $this.off( 'mouseleave', onMouseLeave );
        $this.off( 'click', onClick );
      });

      $('.qw-comment-editbox .cancel').off( 'click', onCancel );
      $('.qw-comment-editbox .submit').off( 'click', onSave );
      $('input[name="commentType"]').off( 'change', onCommentTypeChanged );
      $('.qw-comment-reply .reply-btn').off( 'click', showReplyBox );
      $('.qw-comment-reply .editor .cancel').off( 'click', resetReplyBox );
      $('.qw-comment-reply .editor .submit').off( 'click', sendReply );

      $('.qw-commentbar').on( this.namespace + '.offcanvas.closing', onCommentBarClosing );
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
          $('.qw-comment-reply .cancel').click();

          cmt.author = foswiki.preferences.WIKINAME;
          cmt.date = (new Date()).getTime();
          self.comments.push( cmt );
          $.unblockUI();

          $('.qw-commentbar [data-scrollcontainer]').slimScroll({ scrollTo: '50000px' });

          $(selector).click();
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
        $(selector).livequery( function() {
          $(this).attr( 'data-hascomments', cmt.type );
        });
      });
    }
  };

  var showReplyBox = function( evt ) {
    var $reply = $('.qw-comment-reply');
    var height = $reply.height();
    $reply.data('height', height);

    $('.qw-comment-reply .btn').css('display', 'none');
    $reply.css('height', '280px');
  };

  var resetReplyBox = function( evt ) {
    var $tb = $('#qw-reply-textarea');
    $tb.val('');
    $tb.parent().removeClass('error');

    var $reply = $('.qw-comment-reply');
    var height = $reply.data('height');
    $('.qw-comment-reply .btn').css('display', 'block');
    $reply.css('height', height);

    return false;
  };

  var sendReply = function( evt ) {
    var $tb = $('#qw-reply-textarea');
    
    var text = $tb.val() || '';
    if ( text.trim() === '' ) {
      $tb.parent().addClass('error');
      return false;
    }

    var self = evt.data;
    var id = $('.qw-comment-reply').data('p-id');
    if ( !id ) {
      self.Q.error( 'Invalid comment ID!' );
      return false;
    }

    var cmts = _.where( self.comments, {pid: id});
    if ( cmts.length === 0 ) {
      self.Q.error( 'Unable to determine comment type!' );
      return false;
    }

    var cmt = {
      type: cmts[0].type,
      text: $tb.val(),
      pid: id
    };

    self.post( cmt );
    return false;
  };

  var onCommentBarClosing = function( evt ) {
    var self = evt.data;
    $('.qw-comment-editbox').data('id', '');
    $('[data-commentable="1"]').removeClass('active idea issue');
    $('.qw-commentbar').removeClass('idea issue');
    $('.qw-commentbar .header .default').css('display', 'block');
    $('.qw-commentbar .header .idea').css('display', 'none');
    $('.qw-commentbar .header .issue').css('display', 'none');
    $('.qw-comment-reply').data('p-id', '');
  };

  var onCommentTypeChanged = function( evt ) {
    var self = evt.data;
    var index = $(this).val();
    var type = self.types[index];

    var pid = $('.qw-comment-editbox').data('id');
    var selector = '[data-p-id="' + pid + '"]';

    $('[data-commentable="1"].active').removeClass('active issue idea');
    $(selector).addClass('active ' + type);
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
    $('[data-commentable="1"].active').removeClass('active issue idea');
    $('.qw-commentbar').offcanvas({action: 'close'});
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
      var padding = 30;
      var top = offset.top/2 + pos.top + height/2 - padding/2 - window.pageYOffset;
      $adorner.css('top', top);

      var left = pos.left + width + padding;
      $adorner.css('left', left);
      $adorner.show();
    }
  };

  var onMouseLeave = function( evt ) {
    $('#qw-comment-adorner').hide();
  };

  var setHeader = function( header ) {
    var $bar = $('.qw-commentbar .header');
    var $idea = $bar.find('.idea');
    var $issue = $bar.find('.issue');
    var $default = $bar.find('.default');

    switch (header) {
      case 'idea':
        $idea.css('display', 'block');
        $issue.css('display', 'none');
        $default.css('display', 'none');
        break;

      case 'issue':
        $idea.css('display', 'none');
        $issue.css('display', 'block');
        $default.css('display', 'none');
        break;

      default:
        $idea.css('display', 'none');
        $issue.css('display', 'none');
        $default.css('display', 'block');
    }
  };

  var onClick = function( evt ) {
    var self = evt.data;

    var $this = $(this);
    var $cmtbar = $('.qw-commentbar');
    $cmtbar.offcanvas({action: 'open'});

    var $edit = $('.qw-comment-editbox');
    var $view = $('.qw-comment-viewbox');
    var $reply = $('.qw-comment-reply');
    var hasComment = _.isNumber( $this.data('hascomments') );
    if ( hasComment ) {
      var cmts = _.where( self.comments, {pid: $this.data('p-id')});
      $('.qw-comment-reply').data('p-id', $this.data('p-id') );
      var $cnt = $('.qw-comment-viewbox > div:not(.reply)').empty();

      var header = parseInt( $this.data('hascomments') ) === 0 ? 'idea' : 'issue';
      $cmtbar.removeClass('idea issue').addClass(header);
      setHeader( header );

      _.each( cmts, function(cmt) {
        var d = new Date();
        d.setTime( cmt.date );
        cmt.dateString = d.toLocaleString();
        $cnt.qtemplate('add', $.extend({_type: 'qw.comments'}, cmt ));
      });

      $edit.css('display', 'none');
      $view.css('display', 'block');
      $reply.css('display', 'block');
    } else {
      $edit.css('display', 'block');
      $view.css('display', 'none');
      $reply.css('display', 'none');

      setHeader('default');
      $cmtbar.removeClass('idea issue');
    }

    if ( !$this.hasClass('active') ) {
      $('[data-commentable="1"]').removeClass('active idea issue');
      $this.addClass('active');
    }

    var ctype = parseInt( $this.data('hascomments') );
    switch (ctype) {
      case 0:
        $this.addClass('idea');
        break;
      case 1:
        $this.addClass('issue');
        break;
      default:
        $this.addClass('idea');
        break;
    }

    var pid = $this.data('p-id');
    if ( pid !== $edit.data('id') ) {
      $edit.data('id', pid);
      if ( !hasComment ) {
        $('#qw-cmt-type-idea').click();
      }
    }

    return false;
  };
}(jQuery, window._, window.document, window));
