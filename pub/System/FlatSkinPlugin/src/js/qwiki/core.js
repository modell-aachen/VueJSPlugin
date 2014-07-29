;(function ($, _, document, window, undefined) {
  'use strict';

  window.QWiki = {
    name: 'qwiki',
    plugins: {},
    version: '1.0.0', // ToDo. replace by git?
    global: {
      debug: 0,
      namespace: 'qw',
      scope: document,
      Q: undefined
    },

    init: function( scope, options ) {
      if ( typeof scope === 'object' ) {
        this.global.scope = scope;
      }

      // less qq more pew pew
      this.global.Q = this;

      // Merge options but prioritize those which are passed inline.
      var opts = typeof window.QWikiOptions === 'object' ? window.QWikiOptions : {};
      $.extend( opts, options );

      // Initialize each plugin.
      for ( var name in this.plugins ) {
        var plugin = this.plugins[name];
        if ( typeof plugin.name !== 'string' ) {
          plugin.name = name;
        }

        this.registerPlugin( plugin, opts[name] );
      }

      return scope;
    },

    raiseEvent: function( callee, caller, evt, params ) {
      var type = [
        caller.namespace ? caller.namespace : this.global.namespace,
        caller.name,
        evt
      ];

      $(callee).trigger( type.join('.'), params );
    },

    registerPlugin: function( plugin, options ) {
      if ( typeof plugin !== 'object' ) {
        console.error( 'Invalid plugin type: ' + typeof plugin );
        return undefined;
      }

      if ( typeof plugin.name !== 'string' ) {
        console.error( 'Invalid or missing property "name"' );
        return undefined;
      }

      if ( typeof plugin.init !== 'function' ) {
        console.error( 'Missing init function for plugin: ' + plugin.name );
        return undefined;
      }

      $.extend( plugin, this.global );
      return plugin.init( options );
    }
  };
}(jQuery, window._, window.document, window));
