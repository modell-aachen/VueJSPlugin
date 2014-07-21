(function($) {
  $.fn.extend({});

  var attachCommentHandler = function() {
    $('[data-comment]').livequery(
      function() { $(this).addClass('ma-comment'); },
      function() { $(this).removeClass('ma-comment'); });

    $('[data-comment-brand]').livequery(
      function() { $(this).addClass('ma-comment-' + $(this).attr('data-comment-brand')); },
      function() { unbrand( this ); });
  };

  var findTargetContainer = function() {
    var pos = $('#cmt-target').position();
    var cmts = $('.ma-comment');

    for( var i = 0; i < cmts.length; ++i ) {
      var cmt = cmts[i];
      if ( pos.top == $(cmt).position().top ) {
        return cmt;
      }
    }
  };

  var unbrand = function( container, complete ) {
    $(container).removeClass('ma-comment-primary ma-comment-info ma-comment-warning ma-comment-danger ma-comment-success');
    if ( complete )
      $(container).removeClass('ma-comment');
  };

  $(document).ready( function() {
    attachCommentHandler();

    $('#ma-btn-cancel-cmt').on('click', function() {
      if ( $('#ma-tb-cmt').val() == '' ) {
        var container = findTargetContainer();
        if ( container ) {
          unbrand( container, true );
          $(container).removeAttr('data-comment');
          $(container).removeAttr('data-comment-brand');
        }
      }

      $('#cmt-target').addClass('hidden')
      return false;
    });

    $('.ma-content > p').on('mouseenter', function() {
      if ( $(this).hasClass('ma-comment') && !$('#cmt-target').hasClass('hidden') )
        return;

      var pos = $(this).position();
      var height = $(this).height();

      var cmt = $('#cmt-adorner');
      cmt.removeClass('hidden');
      var offset = height/2 - $(cmt).height()/2;
      cmt.css('top', pos.top + offset);

      $(this).addClass('cursor-hand');
    }).on('mouseleave', function() {
      var cmt = $('#cmt-adorner');
      cmt.addClass('hidden');
      $(this).removeClass('cursor-hand');
    }).on('click', function() {
      $(this).attr('data-comment', 'placeholder');
      $(this).attr('data-comment-brand', 'warning');

      var cmt = $('#cmt-adorner');
      cmt.addClass('hidden');

      var pos = $(this).position();
      $('#cmt-target').css('top', pos.top );
      $('#cmt-target').removeClass('hidden');
    });

    $('#cmt-target .btn-group > .btn').on('click', function() {
      var cmt = findTargetContainer();
      if ( !cmt ) return;
      var $cmt = $(cmt);

      unbrand( $cmt );
      var brand = $(this).data('brand')
      $cmt.addClass('ma-comment-'+brand);
    });
  });
})(jQuery);
