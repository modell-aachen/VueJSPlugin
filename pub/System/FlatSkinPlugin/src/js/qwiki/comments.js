;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.comments = {
    name: 'comments',
    priority: 2,
    comments: [],
    solvedComments: [],
    types: ['idea', 'issue'],

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.load();
      this.bind();
    },

    bind: function() {
      this.unbind();

      var self = this;
      $('[data-commentable="1"]').livequery( appendAdorner );
      $(window).on( 'resize', onWindowResized );
      $('.qw-page').observe({attributes: true, attributeFilter: ['class']}, onWindowResized );

      $('.qw-comment-editbox .cancel').on( 'click', this, onCancel );
      $('.qw-comment-editbox .submit').on( 'click', this, onSave );
      $('input[name="commentType"]').on( 'change', this, onCommentTypeChanged );
      $('.qw-comment-reply .reply-btn').on( 'click', this, showReplyBox );
      $('.qw-comment-reply .resolve-btn').on( 'click', this, resolveComment );
      $('.qw-comment-reply .editor .cancel').on( 'click', this, resetReplyBox );
      $('.qw-comment-reply .editor .submit').on( 'click', this, sendReply );
      $('.qw-commentbar').on( this.namespace + '.offcanvas.closing', this, onCommentBarClosing );
    },

    unbind: function() {
      $('.content > .adorner').empty();

      $(window).off( 'resize', onWindowResized );
      $('.qw-page').disconnect({attributes: true, attributeFilter: ['class']}, onWindowResized );

      $('[data-commentable="1"]').expire( function() {
        var $this = $(this);
        $this.off( 'mouseenter', onCommentableMouseEnter );
        $this.off( 'mouseleave', onCommentableMouseLeave );
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
      var topic = foswiki.getPreference('WEB') + '.' + foswiki.getPreference('TOPIC');
      var url = [
        p.SCRIPTURLPATH,
        '/rest',
        p.SCRIPTSUFFIX,
        '/FlatSkinPlugin/comment'
      ];

      var type = cmt.solved === true ? 'PUT' : 'POST';
      var self = this;
      $.blockUI();
      $.ajax({
        url: url.join(''),
        type: type,
        data: {comment: JSON.stringify( cmt ), topic: topic},
        success: function() {
          var selector = '[data-p-id="' + cmt.pid + '"]';
          var $selector = $(selector);
          if ( cmt.solved ) {
            $selector.data( 'hascomments', '' );
            $selector.removeAttr( 'data-hascomments' );
          } else {
            $selector.attr( 'data-hascomments', cmt.type );
          }

          var id = $selector.data('cmtbl');
          var cls = self.types[parseInt(cmt.type)];
          $('.qw-comment-adorner').each( function() {
            var $adorner = $(this);
            if ( $adorner.data('cmtbl') === id ) {
              if ( cmt.solved ) {
                $adorner.removeClass( self.types.join(' ') );
              } else {
                $adorner.addClass( cls );
              }
            }
          });

          $('.qw-comment-editbox .cancel').click();
          $('.qw-comment-reply .cancel').click();

          cmt.author = foswiki.preferences.WIKINAME;
          cmt.date = (new Date()).getTime();
          self.comments.push( cmt );
          $.unblockUI();

          $('.qw-commentbar [data-scrollcontainer]').slimScroll({ scrollTo: '50000px' });
          $selector.click();
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
      $.each( cmts, function( i, cmt ) {
        if ( cmt.solved === true || /^true$/i.test( cmt.solved ) ) {
          self.solvedComments.push( cmt );
          // TBD. what shall happen with already solved comments???
        } else {
          self.comments.push( cmt );
          var selector = '[data-p-id="' + cmt.pid + '"]';
          $(selector).livequery( function() {
            $(this).attr( 'data-hascomments', cmt.type );
          });
        }
      });
    }
  };

  var resizeTimer;
  var onWindowResized = function() {
    clearTimeout( resizeTimer );
    resizeTimer = setTimeout( realignAdorner, 500 );
  };

  var realignAdorner = function() {
    $('.qw-comment-adorner').each(function() {
      var $adorner = $(this);
      var $container = $adorner.parent();

      var id = $adorner.data( 'p-id' );
      var $cmtbl = $('[data-p-id="' + id + '"][data-commentable="1"]');
      var pos = $cmtbl.position();
      var mt = parseInt( $cmtbl.css('margin-top').replace('px', '') );
      var top = pos.top + mt;
      $container.css('top', top);
    });
  };

  var appendAdorner = function() {
    var self = QWiki.plugins.comments;
    var $this = $(this);

    var id = _.uniqueId( 'cmtbl-' );
    var pid = $this.data( 'p-id' );
    $this.data( 'cmtbl', id );

    $this.on( 'mouseenter', self, onCommentableMouseEnter );
    $this.on( 'mouseleave', self, onCommentableMouseLeave );

    // create comment adorner to add a new comment
    var $adorner = $('.content > .adorner');
    if ( $adorner.length === 0 ) {
      return;
    }

    var $container = $('<div></div>');
    $container.appendTo( $adorner );
    $container.on( 'click', self, onAdornerClick );
    $container.on( 'mouseenter', self, onAdornerMouseEnter );
    $container.on( 'mouseleave', self, onAdornerMouseLeave );

    var $btn = $('<div class="qw-comment-adorner" title="Add comment" data-i18n-title="Add comment" data-i18n-ns="comments" data-tooltip="left"><i class="icon-add"></i></div>');
    $btn.appendTo( $container );
    $btn.data( 'cmtbl', id );
    $btn.data( 'p-id', pid );

    var pos = $this.position();
    var mt = parseInt( $this.css('margin-top').replace('px', '') );
    var top = pos.top + mt;
    $container.css('top', top);

    var hasComments = $this.data('hascomments');
    if ( !_.isUndefined( hasComments ) ) {
      var index = parseInt( hasComments );
      $btn.addClass( self.types[index] );
      $btn.attr('data-i18n-title', 'View comment');
      $btn.attr('title', 'View comment');
    }
  };

  var showReplyBox = function( evt ) {
    var self = evt.data;
    if ( self.Q.options.kvp.hasDiscussion ) {
      $('.qw-modal.deny-comment').modal({show:1});
      return false;
    }

    var $reply = $('.qw-comment-reply');
    var height = $reply.height();
    $reply.data('height', height);

    $('.qw-comment-reply .btn').css('display', 'none');
    $reply.css('height', '280px');

    return false;
  };

  var resetReplyBox = function( evt ) {
    var $tb = $('#qw-reply-textarea');
    $tb.val('');
    $tb.parent().removeClass('error');

    var $reply = $('.qw-comment-reply');
    var height = $reply.data('height');
    $('.qw-comment-reply .btn').css('display', 'block');
    $reply.css('height', height);

    var id = $reply.data('p-id');
    if ( id ) {
      var cmts = _.where( self.comments, {pid: id});
      if ( cmts.length > 0 ) {
        cmts[0].solved = false;
      }
    }

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
      pid: id,
      solved: cmts[0].solved || false
    };

    self.post( cmt );
    return false;
  };

  var resolveComment = function( evt ) {
    var self = evt.data;

    if ( self.Q.options.kvp.hasDiscussion ) {
      $('.qw-modal.deny-comment').modal({show:1});
      return false;
    }

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

    var cmt = cmts[0];
    cmt.solved = true;

    $('.qw-comment-reply .reply-btn').click();
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

    cmt.solved = $(this).hasClass('solve');
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

  var onCommentableMouseEnter = function( evt ) {
    var $this = $(this);

    if ( $('.qw-comment-editbox.active').length > 0 ) {
      var content = $('#qw-comment-textarea').val();
      if ( content.trim() !== '' ) {
        return;
      }
    }

    $('[data-commentable="1"]').removeClass('highlight');

    var height = $this.height();
    var width = $this.width();
    var offset = $this.offset();
    var position = $this.position();

    if ( _.isNumber( $this.data('hascomments') ) ) {
      return;
    } else {
      // hide already visible comment adorner
      if ( timeout ) {
        clearTimeout( timeout );
      }

      var id = $this.data('cmtbl');
      $('.qw-comment-adorner').each( function() {
        var $a = $(this);

        $a.css('display','none');
        $a.css('opacity',0);

        if ( $a.data('cmtbl') === id ) {
          $a.css('display','block');
          $a.css('opacity',1);
        }
      });
    }
  };

  var timeout;
  var onCommentableMouseLeave = function( evt ) {
    var $self = $(this);
    var id = $self.data('cmtbl');
    timeout = setTimeout( function() {
      $('.qw-comment-adorner').each( function() {
        var $item = $(this);
        if ( $item.data('cmtbl') === id ) {
          $item.css('display','none');
          $item.css('opacity',0);
        }
      });
    }, 750);
  };

  var onAdornerMouseLeave = function( evt ) {
    var $a = $(this).find('.qw-comment-adorner');
    timeout = setTimeout( function() {
      $a.css('display','none');
      $a.css('opacity',0);
      $('[data-commentable="1"]').removeClass('highlight');
    }, 750 );
  };

  var onAdornerMouseEnter = function( evt ) {
    var $this = $(this);
    var $child = $this.find('.qw-comment-adorner');

    var isIssueOrIdea = $child.hasClass('issue') || $child.hasClass('idea');
    if ( timeout && !isIssueOrIdea ) {
      clearTimeout( timeout );
    }

    var id = $child.data('cmtbl');
    $('[data-commentable="1"]').removeClass('highlight');
    $('[data-commentable="1"]').each( function() {
      var $item = $(this);
      if ( $item.data('cmtbl') === id ) {
        $item.addClass( 'highlight' );
      }
    });
  };

  var onAdornerClick = function( evt ) {
    var self = evt.data;

    var $edit = $('.qw-comment-editbox');
    var $view = $('.qw-comment-viewbox');
    var $reply = $('.qw-comment-reply');

    var $this = $(this);
    var id = $this.find('.qw-comment-adorner').data('cmtbl');
    $('[data-commentable="1"]').each( function() {
      var $cmtbl = $(this);
      if ( $cmtbl.data('cmtbl') === id ) {
        $this = $cmtbl;
      }
    });

    var hasComment = _.isNumber( $this.data('hascomments') );
    if ( self.Q.options.kvp.hasDiscussion && !hasComment ) {
      $('.qw-modal.deny-comment').modal({show:1});
      return false;
    }

    var $cmtbar = $('.qw-commentbar');
    $cmtbar.offcanvas({action: 'open'});

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
}(jQuery, window._, window.document, window));
