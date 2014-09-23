;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.breadcrumbs = {
    name: 'breadcrumbs',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }
      this._origElems = null;
      this._prevSize = null;
      this.bind();
    },

    bind: function() {
      this.unbind();

      var $self = $('[data-breadcrumb]');
      if (!$self.length) {
        // This one-statement block required by jshint
        return;
      }
      this._origElems = $self.children();
      var data = {elem: $self, o: this};
      $(window).on('resize', data, handleResize);
      handleResize({"data": data});
    },

    unbind: function() {
      if (!this._origElems) {
        // This one-statement block required by jshint
        return;
      }
      var $self = $('[data-breadcrumb]');
      $self.empty().append(this._origElems);
      $(window).off('resize', handleResize);
      this._origElems = null;
      this._prevSize = null;
    }
  };

  var sizeClass = function(s) {
    if ((typeof s) !== 'number') {
      // This one-statement block required by jshint
      return -1;
    }
    if (s <= 640) {
      // This one-statement block required by jshint
      return 640;
    }
    if (s <= 1024) {
      // This one-statement block required by jshint
      return 1024;
    }
    if (s <= 1440) {
      // This one-statement block required by jshint
      return 1440;
    }
    if (s <= 1920) {
      // This one-statement block required by jshint
      return 1920;
    }
    return 9001; // over 9000!
  };

  var handleResize = function(evt) {
    // Reliable in all browsers we care about, Bugzilla #156388 c14
    var winWidth = document.documentElement.clientWidth;
    var c = sizeClass(winWidth);
    var $self = evt.data.elem;
    var o = evt.data.o;
    if (o._prevSize === c) {
      // This one-statement block required by jshint
      return;
    }
    o._prevSize = c;

    $self.empty();
    $self.append(o._origElems.filter('.qw-breadcrumb-home'));
    var abbrev = $('<li class="qw-breadcrumb-ellipsis"><a>⋯</a><ul class="qw-breadcrumb-sublist"></ul></li>');
    abbrev.find('a').click(function() { return false; });
    var sublist = abbrev.find('.qw-breadcrumb-sublist');

    if (c === 640 || c === 1024) {
      // Abbreviated webs, abbreviated parents
      sublist.append(o._origElems.filter('.qw-breadcrumb-web, .qw-breadcrumb-parent'));
      if (sublist.children().length > 0) {
        // This one-statement block required by jshint
        $self.append(abbrev);
      }
    } else if (c === 1440) {
      // Full webs, abbreviated parents
      $self.append(o._origElems.filter('.qw-breadcrumb-web'));
      sublist.append(o._origElems.filter('.qw-breadcrumb-parent'));
      if (sublist.children().length > 0) {
        // This one-statement block required by jshint
        $self.append(abbrev);
      }
    } else {
      // Full webs, full parents
      $self.append(o._origElems.filter('.qw-breadcrumb-web, .qw-breadcrumb-parent'));
    }
    $self.append(o._origElems.filter('.qw-breadcrumb-topic'));
  };
}(jQuery, window._, window.document, window));
