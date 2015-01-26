/*

Markup:

<div class="qw-expander expanded">
  <div class="caption">
    <span>geltung</span>
  </div>
  <div class="content">
    <div>
      <ul>
        <li>
          <span>unternehmensweit</span>
          <label>12<input type="checkbox"></label>
        </li>
        <li>
          <span>global</span>
          <label>12<input type="checkbox"></label>
        </li>
        <li>
          <span>lokal</span>
          <label>12<input type="checkbox"></label>
        </li>
      </ul>
    </div>
  </div>
</div>

<div class="qw-expander expanded">
  <div class="caption">
    <span>wo suchen?</span>
  </div>
  <div class="content">
    <div>
      <ul>
        <li>
          <span>Audits</span>
          <label><input type="radio" name="search-where"></label>
        </li>
        <li>
          <span>Cockpit</span>
          <label><input type="radio" name="search-where"></label>
        </li>
        <li>
          <span>Projekte</span>
          <label><input type="radio" name="search-where"></label>
        </li>
        <li>
          <span>Prozesse</span>
          <label><input type="radio" name="search-where"></label>
        </li>
        <li>
          <span>Sitzungen</span>
          <label><input type="radio" name="search-where"></label>
        </li>
      </ul>
    </div>
  </div>
</div>


 */

;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.expander = {
    name: 'expander',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      $('.qw-expander > .caption').on('click', function() {
        $(this).parent().toggleClass('expanded');
        return false;
      });

      $('.qw-expander li').on('click', function() {
        var $input = $(this).find('input');
        if ( $input.length === 0 ) {
          return false;
        }

        $input.prop( 'checked', !$input.prop( 'checked') );
        return false;
      });
    }
  };
}(jQuery, window._, window.document, window));
