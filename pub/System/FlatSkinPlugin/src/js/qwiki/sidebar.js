;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.sidebar = {
    name: 'sidebar',
    autoclose: 0,
    container: {
      left: 'qw-offcanvas-left',
      right: ''
    },
    templates: {
      left: [
        '<section>',
        '<span class="heading"><%= title %><i class="adorner"></i></span>',
        '<%= content %>',
        '</section>'
      ].join('\n'),
      right: [].join('\n')
    },

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('[data-leftbar] > section > .heading').on( 'click', this, handleClickLeft );
    },

    unbind: function() {
      $('[data-leftbar] > section > .heading').off( 'click', handleClickLeft );
    },

    createEntry: function() {
      var entry = {
        collapsed: 1,
        container: '', // left|right, mandatory
        title: '',
        content: '', // html string
        position: 'auto', // not used right now
        priority: 0 // not used right now
      };

      return entry;
    },

    registerEntry: function( obj ) {
      if ( _.isUndefined( obj ) || !_.isObject( obj ) ) {
        this.Q.error( 'Invalid entry type.' );
        return;
      }

      if ( !obj.container || !_.isString( obj.container ) || obj.container.trim() === '' ) {
        this.Q.error( 'Missing target container.' );
        return;
      }

      if ( /(left|right)/i.test( obj.container.toLowerCase() ) ) {
        var cnt = obj.container.toLowerCase();
        var tmpl = _.template( this.templates[cnt] );
        var entry = $(tmpl( obj ));
        entry.appendTo('#' + this.container[cnt]);
        if ( obj.collapsed === 0 ) {
          entry.addClass('active');
        }

        if ( cnt === 'left' ) {
          // rebind event handler
          this.init();
        }
      }
    }
  };

  var handleClickLeft = function( evt ) {
    var $this = $(this);
    var self = evt.data;

    if ( self.autoclose ) {
      var container = $this.closest('[data-accordion]');
      container.children('.active').each( function() {
        if ( $(this)[0] === $this.parent()[0] ) {
          return;
        }

        $(this).removeClass('active');
      });
    }

    $this.parent().toggleClass('active');
  };
}(jQuery, window._, window.document, window));
