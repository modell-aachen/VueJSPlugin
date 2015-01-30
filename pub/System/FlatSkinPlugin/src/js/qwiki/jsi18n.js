;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.jsi18n = {
    name: 'jsi18n',
    priority: 1,

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      if ( window.jsi18n === undefined ) {
        if ( this.debug ) {
          this.Q.error( 'js18n instance is missing!' );
        }

        return;
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      ['text', 'val', 'title'].forEach( translateExisting );
      $('body').observe( 'added', '[data-i18n-text]', translateNewText );
      $('body').observe( 'added', '[data-i18n-val]', translateNewVal );
      $('body').observe( 'added', '[data-i18n-title]', translateNewTitle );
    },

    unbind: function() {
      $('body').disconnect( 'added', '[data-i18n-text]', translateNewText );
      $('body').disconnect( 'added', '[data-i18n-val]', translateNewVal );
      $('body').disconnect( 'added', '[data-i18n-title]', translateNewTitle );
    }
  };

  var translateExisting = function( mode ) {
    if ( !/^(text|val|title)$/.test( mode ) ) {
      return;
    }

    $('[data-i18n-' + mode + ']').each( function() {
      var $node = $(this);
      translate( $node, mode );
    });
  };

  var translateNewText = function( node ) {
    _.each( node.addedNodes, function( n ) {
      translate( n, 'text' );
    });
  };

  var translateNewVal = function( node ) {
    _.each( node.addedNodes, function( n ) {
      translate( n, 'val' );
    });
  };

  var translateNewTitle = function( node ) {
    _.each( node.addedNodes, function( n ) {
      translate( n, 'title' );
    });
  };

  var translate = function( node, mode ) {
    var $node = $(node);
    var txt = $node.attr('data-i18n-' + mode );
    var ns = $node.attr('data-i18n-ns');
    if ( !ns ) {
      return;
    }

    var args = [ns, txt];
    var params = txt.match( /(?!\[_)(\d+)(?=\])/g );
    _.each( params, function( p ) {
      var param = $node.attr('data-i18n-param-' + p);
      args.push( param );
    });

    var translated = jsi18n.get.apply( QWiki.plugins.jsi18n, args );
    if ( mode === 'title') {
      $node.attr( 'title', translated );
    } else {
      $node[mode].call( $node, translated );
    }
  };
}(jQuery, window._, window.document, window));
