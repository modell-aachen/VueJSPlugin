;(function ($, _, document, window, undefined) {
  'use strict';

  window.QWiki = {
    name: 'qwiki',
    plugins: {},
    options: {},
    version: '1.0.0', // ToDo. replace by git?
    global: {
      debug: 0,
      namespace: 'qw',
      priority: 0,
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
      if ( typeof options === 'object' ) {
        _.extend( this.options, options );
      }

      // Collect plugins
      var plugins = [];
      for ( var name in this.plugins ) {
        var plugin = this.plugins[name];
        if ( typeof plugin.name !== 'string' ) {
          plugin.name = name;
        }
        if ( typeof plugin.priority === 'undefined' ) {
          plugin.priority = 0;
        }

        plugins.push( plugin );
      }

      // Sort plugins by priority, then initialize them
      var sorted = _.sortBy( plugins, 'priority' ).reverse();
      for( var i in sorted ) {
        this.registerPlugin( sorted[i], this.options[sorted[i].name] );
      }

      // Intialize Foundation if we're in document scope
      if ( scope === document && typeof window.Foundation === 'object' ) {
        $(scope).foundation();
      }

      // delegate back to caller
      return scope;
    },

    debug: function() {
      if ( !this.global.debug ) {
        return;
      }

      this.log.apply( arguments );
    },

    error: function() {
      if ( console && console.error ) {
        var args = [].slice.apply( arguments );
        for( var i in args ) {
          console.error( args[i] );
        }
      }
    },

    extend: function( source ) {
      if ( typeof source !== 'object' ) {
        this.error( 'Invalid source.' );
        return;
      }

      var blacklist = _.keys( this ).concat( _.keys( this.global ) );
      var src = _.omit( source, blacklist );
      _.extend( this, src );
    },

    log: function() {
      if ( console && console.log ) {
        var args = [].slice.apply( arguments );
        for( var i in args ) {
          console.log( args[i] );
        }
      }
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
        this.error( 'Invalid plugin type: ' + typeof plugin );
        return undefined;
      }

      if ( !_.isString( plugin.name ) ) {
        this.error( 'Invalid or missing property "name"' );
        return undefined;
      }

      if ( !_.isFunction( plugin.init ) ) {
        this.error( 'Missing init function for plugin: ' + plugin.name );
        return undefined;
      }

      _.extend( plugin, this.global );
      return plugin.init( options );
    }
  };
}(jQuery, window._, window.document, window));
