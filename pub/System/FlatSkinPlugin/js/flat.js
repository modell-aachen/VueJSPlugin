(function($) {
  $.fn.extend({});

  $(document).ready( function() {
    // enable caching
    $.ajaxSetup({ cache: true });

    $(this).on( 'affixed.bs.affix', function() {
      $('#foobar').slimScroll( {height: 'calc(100% - 150px)'} );
    });
  });
})(jQuery);
