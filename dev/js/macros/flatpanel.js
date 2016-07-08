(function($) {
  var togglePanel = function() {
    var $header = $(this);
    var $panel = $header.closest('.ma-panel');
    var $icon = $header.children('i.fa');

    $panel.toggleClass('collapsed');
    $icon.toggleClass('fa-chevron-right');
    $icon.toggleClass('fa-chevron-down');
  };

  $(document).ready( function() {
    $('body').on('click', '.ma-panel > .header.collapsible', togglePanel);
  });
})(jQuery);
