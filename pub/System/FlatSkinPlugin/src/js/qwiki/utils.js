;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.utils = {
    name: 'utils',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      $('[data-split-string]').each( function() {
        splitString( this, $(this).data('pattern') );
      });
      $('[data-qtemplate]').qtemplate('compile');
    }
  };

  var splitString = function( elem, pattern ) {
    if ( !pattern ) {
      return;
    }

    var $self = $(elem);
    var text = $self.data( 'origText' );

    if ( !text ) {
      text = $self.text();
      $self.data( 'origText', text );
    }

    var regex = new RegExp( pattern );
    if ( regex.test( text ) === false ) {
      return;
    }

    var parts = text.split( regex );
    $self.text( parts.join( ' ' ) );
  };

  $.fn.qtemplate = function(action, options) {
    this.each(function() {
      var self = $(this);
      var type;
      if (action === 'compile') {
        type = self.data('qtemplate');
        if (!type || type === '' || type === 'data-qtemplate') { type = 'main'; }
        $.data(self.parent()[0], 'qtemplate.'+type, self);
        self.removeData('qtemplate').removeAttr('data-qtemplate').detach();
        return;
      }

      var opts = $.extend({
        _type: 'main'
      }, options);
      var e = self[0];
      type = opts._type;
      delete opts._type;
      var $tmpl = $.data(e, 'qtemplate.'+type);
      if (action === 'get') {
        return $tmpl;
      }
      if (!$tmpl) { return; }

      $tmpl = $tmpl.clone();
      if (action === 'add') {
        var $nodes = $tmpl.find('[qt-bind]').addBack('[qt-bind]');
        $nodes.each(function() {
          var $n = $(this);
          var spec = $n.attr('qt-bind').split(/\s*,\s*/);
          $.each(spec, function() {
            var k = this.split(/\s*:\s*/);
            if (k.length !== 2) {
              throw "Invalid qt-bind spec: not in key:value format: '"+ this +"'";
            }
            if (!k[1].match(/^\w+(\.\w+)*$/)) {
              throw "Invalid qt-bind spec: bad value spec for '"+ k[1] +"'";
            }
            /* jshint evil: true */
            var v = eval("opts."+k[1]);
            /* jshint evil: false */
            if (k[0] === '_text') {
              $n.text(v);
            } else {
              $n.attr(k[0], v);
            }
            $n.removeAttr('qt-bind');
          });
        });
        self.append($tmpl);
        return $tmpl;
      }
    });
  };
}(jQuery, window._, window.document, window));
