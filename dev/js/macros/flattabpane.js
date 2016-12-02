(function($) {
  var changeTab = function() {
    var $li = $(this).closest('li');
    var $ul = $li.parent();
    var $pane = $ul.closest('.ma-tabpane');
    var $content = $pane.children('.content');
    var $chevron = $pane.find('> .chevron .fa');

    var $divs = $content.children('div');
    var $lis = $ul.children('li');

    var wasActive = $li.is('.active');
    $ul.children('.active').removeClass('active');
    $divs.removeClass('active');

    if (wasActive) {
      $chevron.addClass('fa-chevron-right').removeClass('fa-chevron-down');
      return false;
    }

    var index = $lis.index($li[0]);
    $pane.data('index', index);
    $pane.removeClass('collapsed');

    $lis[index].classList.add('active');
    $divs[index].classList.add('active');
    $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');

    return false;
  };

  var toggleCollapse = function() {
    var $header = $(this);
    var $pane = $header.closest('.ma-tabpane');

    if (!$pane.is('.collapsible')) return false;

    var collapsed = $pane.is('.collapsed');
    var $content = $pane.children('.content');
    var $divs = $content.children('div');
    var $lis = $header.find('> ul > li');

    $pane.toggleClass('collapsed');
    if (collapsed) {
      var index = $pane.data('index') || 0;
      $divs[index].classList.add('active');
      $lis[index].classList.add('active');
    } else {
      $content.children('.active').removeClass('active');
      $header.find('> ul > .active').removeClass('active');
    }
  };

  $(document).ready( function() {
    $('body').on('click', '.ma-tabpane > .header li > a', changeTab);
    $('body').on('click', '.ma-tabpane > .header', toggleCollapse);
  });
})(jQuery);
