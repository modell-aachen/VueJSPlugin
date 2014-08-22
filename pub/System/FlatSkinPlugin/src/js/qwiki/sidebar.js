;(function ($, _, document, window, undefined) {
  'use strict';

  var initialized = false;
  QWiki.plugins.sidebar = {
    name: 'sidebar',
    autoclose: 0,
    container: {
      left: 'qw-offcanvas-leftbar',
      right: ''
    },
    templates: {
      left: [
        '<section>',
        '<span class="heading"><%= title %><i class="adorner"></i></span>',
        '<%= content %>',
        '</section>'
      ].join('\n'),
      right: {
      }
    },

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bindLeftbar();
      this.bindRightbar();
    },

    bindLeftbar: function() {
      this.unbindLeftbar();
      $('[data-leftbar] > section > .heading').on( 'click', this, handleLeftBarClick );
    },

    unbindLeftbar: function() {
      $('[data-leftbar] > section > .heading').off( 'click', handleLeftBarClick );
    },

    bindRightbar: function() {
      this.unbindRightbar();

      if ( !initialized ) {
        loadRightBarItems( this ).done(function() {
          $('[data-rightbar] .links a').on( 'click', this, handleRightBarClick );
          $('[data-rightbar] .container .close').on( 'click', handleRightBarClose );
          initialized = true;
        });
      } else {
        $('[data-rightbar] .links a').on( 'click', this, handleRightBarClick );
        $('[data-rightbar] .container .close').on( 'click', this, handleRightBarClose );
      }
    },

    unbindRightbar: function() {
      $('[data-rightbar] .links a').off( 'click', handleRightBarClick );
      $('[data-rightbar] .container .close').off( 'click', handleRightBarClose );
    },

    createLeftBarEntry: function() {
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

    registerLeftBarEntry: function( obj ) {
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
          this.bindLeftbar();
        }
      }
    }
  };

  var handleLeftBarClick = function( evt ) {
    var $this = $(this);
    var self = evt.data;

    if ( self.autoclose ) {
      var container = $this.closest('[data-leftbar]');
      container.children('.active').each( function() {
        if ( $(this)[0] === $this.parent()[0] ) {
          return;
        }

        $(this).removeClass('active');
      });
    }

    $this.parent().toggleClass('active');
  };

  var handleRightBarClick = function( evt ) {
    var self = evt.data;

    var target = $(this).data('content');
    var title = $(this).data('title');
    if ( !target || !title ) {
      self.Q.error( 'Missing target or title property.' );
      return;
    }

    $('[data-rightbar] .container .title').text( title );
    $(target).removeClass('hidden');

    $('[data-rightbar] .links').addClass('active');
    $('[data-rightbar] .container').addClass('active');
  };

  var handleRightBarClose = function( evt ) {
    $('[data-rightbar] .links').removeClass('active');
    $('[data-rightbar] .container').removeClass('active');
  };

  var loadRightBarItems = function( self ) {
    var deferred = $.Deferred();

    var container = $('[data-rightbar-item]');
    for( var i = 0; i < container.length; ++i ) {
      var c = container[i];
      var link = container.children('a[data-content]');
      if ( link.length === 0 ) {
        self.Q.error( 'Missing content property.' );
        return;
      }

      link.appendTo('[data-rightbar] .links > ul');
      link.wrap('<li></li>');

      var selector = link.data('content');
      var content = $(selector);
      if ( content.length === 0 ) {
        self.Q.error( 'Missing DOM element: ' + selector );
        return;
      }

      content.appendTo('[data-rightbar] .container > .content');
    }

    deferred.resolve();
    return deferred.promise();
  };
}(jQuery, window._, window.document, window));
