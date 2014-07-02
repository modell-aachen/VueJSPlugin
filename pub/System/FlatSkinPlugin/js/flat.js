(function($) {
  $.fn.extend({});

  var isLeftBarAnimating = false;

  var setupUsermenu = function() {
    $('#ma-btn-usermenu').click(function() {
      var $this = $(this);
      var $menu = $('#ma-usermenu');
      $this.toggleClass('active');

      var isActive = $this.hasClass('active');
      if ( isActive ) {
        $menu.removeClass('hidden');
      }

      var width = isActive ? '300px' : '0px';
      $menu.animate({'width': width}, 500, function() {
        if ( !isActive ) {
          $menu.addClass('hidden');
        } else {
          $('#ma-usermenu-close').fadeIn();
        }
      });

      return false;
    });

    $('#ma-usermenu-close').click(function() {
      $(this).fadeOut();
      $('#ma-btn-usermenu').click();
      return false;
    });
  };

  $(document).ready( function() {
    setupUsermenu();

    $('.popover-dismiss').popover({
      trigger: 'focus',
      html: true
    });
  });
})(jQuery);


