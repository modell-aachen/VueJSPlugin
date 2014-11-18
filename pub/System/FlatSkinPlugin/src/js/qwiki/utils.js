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

  /* qtemplate: one-way bind system resistant against code injection
   *
   * Core tenets:
   * (1) For customization, having to put HTML snippet template inside
   *     JavaScript code is infeasible, ruling out Underscore's template
   *     system
   *
   * (2) Having to bind event handlers and the like inside the HTML is dirty
   *     and violates separation of concerns. Frameworks like Angular don't
   *     easily support binding events from within scripts, and make it hard
   *     to access the model from vanilla JS events.
   *
   * (3) Two-way binding helps with a very small class of use cases and does
   *     not provide any notable benefits for more transaction-oriented user
   *     interfaces, but adds significant complexity to the code.
   *
   * Our minimalistic approach:
   *
   * * Templates are defined inline, in the place where they will be used
   *   later. A mechanism to reuse a template in multiple places in the DOM
   *   could be added later.
   *
   * * The templates are detached from the document in a "compile" step, and
   *   instead associated with the parent element in an out-of-band fashion.
   *   The parent element is called the "container".
   *
   * * A node can contain multiple different templates; each template's
   * "data-qtemplate" attribute specifies an ID for that template. IDs are not
   * global; they only serve to distinguish sibling template.
   *
   * * An "add" step spawns a new instance of the template, applies value
   *   bindings, and appends it to the container. This can be used both for
   *   rendering a single thing or a collection of things (by calling "add"
   *   multiple times).
   *
   * * Bindings are specified within the template, using the "qt-bind"
   *   attribute. It contains a comma-separated list of bindings. Each binding
   *   specification (called bindspec) is of the form
   *   "[CSS selector //][attribute:]variable", "[]" meaning "optional". If a
   *   CSS selector is given, the binding is applied to all matching child
   *   elements; if it is omitted, the binding is applied to the element the
   *   qt-bind attribute is set on. If an attribute name is given, the
   *   bindings sets the value of that attribute in the node; otherwise the
   *   text content of the node is set.
   *
   * * The variables given in bindspecs refer to properties of an object
   *   passed to "add" calls as an argument. Let's call this object
   *   "parameters".
   *
   * Usage example:
   * (HTML)
   * <ul class="searchresults">
   *   <li data-qtemplate="result"><a qt-bind="href: url, title"></a>
   *     <div class="summary" qt-bind="summary">
   *   </li>
   *   <li data-qtemplate="noresult" class="noresult">No results found</li>
   * </ul>
   *
   * (Script)
   * var $container = $('[data-qtemplate]').qtemplate('compile');
   * // ...
   * $container.empty();
   * // ...
   * $.each(results, function() {
   *   $container.qtemplate('add', $.extend({
   *     _type: 'result'
   *   }, this));
   *   // (_type is not necessary if not specified in the template)
   * });
   *
   *
   * Future plans:
   *
   * * Support for arrays in the params object for "add", to automatically add
   *   instances of nested templates. Also, API for traversing a nested
   *   structure of templates, and support for nesting templates in the first
   *   place.
   *
   * * API for binding events to children of a container and passing the
   *   associated parameters to the event handler, so that the template nodes
   *   don't need to be littered with data attributes
   *
   * * Note to self: passing the parameters to the event handler needs to go
   *   through some kind of smart object so we can insert an API and provide
   *   access to parent templates etc.
   *
   * * Better interfacing with widget-based UI updaters, e.g. for quicksearch
   */
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
            var bindspec = this,
              $target = $n,
              selector = this.match(/^(.*)\s*\/\/\s*(.*)$/);
            if (selector) {
              bindspec = selector[2];
              $target = $n.find(selector[1]);
            }
            var k = bindspec.match(/^(.*)\s*:\s*(.*)$/);
            if (!k) {
              k = [null, '_text', bindspec];
            }
            if (!k[2].match(/^\w+(\.\w+)*$/)) {
              throw "Invalid qt-bind spec: bad value spec for '"+ k[2] +"'";
            }
            if (k[1].match(/^on/)) {
              throw "Refusing to qt-bind to an on* attribute ('"+ k[1] +"')";
            }
            if ($target.is('script')) {
              throw "Refusing to qt-bind into a script tag";
            }
            /* jshint evil: true */
            var v = eval("opts."+k[2]);
            /* jshint evil: false */
            if (k[1] === '_text') {
              $target.text(v);
            } else {
              $target.attr(k[1], v);
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
