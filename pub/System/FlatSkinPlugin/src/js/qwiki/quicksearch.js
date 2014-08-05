;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.quicksearch = {
    name: 'quicksearch',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();
      $('[data-quicksearch] input').on( 'keydown', this, handleKeydown );
      $('[data-quicksearch] input + label').on( 'click', this, handleClick );
    },

    unbind: function() {
      $('[data-quicksearch] input').off( 'keydown', this, handleKeydown );
      $('[data-quicksearch] input + label').off( 'click', this, handleClick );
    }
  };

  var handleClick = function( evt ) {
    evt.preventDefault();
    doSearch( $(this).closest('input'), evt.data );
  };

  var handleKeydown = function( evt ) {
    if ( evt.which !== 13 ) {
      return;
    }

    // don't submit form on enter key down
    evt.preventDefault();
    doSearch( this, evt.data );
  };

  var doSearch = function( input, self ) {
    var parent = $(input).closest('[data-quicksearch]');
    var results = $(parent).find('.results');

    var query = $(input).val();
    if ( query.trim() === "" ) {
      return;
    }

    // clear results container, activate spinner (loading animation)
    results.empty();
    results.addClass('searching');

    // disable jQuery UI autocomplete
    toggleAutocomplete( input );

    // call solr
    var f = self.Q.foswiki;
    var url = f.SCRIPTURLPATH + '/rest' + f.SCRIPTSUFFIX + '/SolrPlugin/search?rows=5&q=';
    $.get( url + query, function( data ) {
      results.removeClass('searching');

      if ( data.response.numFound === 0 ) {
        var noResults = tmplNoResults();
        $(noResults).appendTo( results );
      } else {
        var total = tmplFirstRow();
        var firstRow = total( data.response );
        $(firstRow).appendTo( results );

        var tmpl = tmplEntry();
        for( var i = 0; i < data.response.docs.length; ++i ) {
          var doc = data.response.docs[i];
          var entry = tmpl( doc );
          $(entry).appendTo( results );
        }
      }

      // re-enable autocomplete
      var ctrl = toggleAutocomplete( input );
      ctrl.autocomplete( 'close' );
    });
  };

  var toggleAutocomplete = function( input ) {
    var ctrl = $(input).autocomplete('instance');
    if ( _.isUndefined( ctrl ) ) {
      return;
    }

    var $ctrl = $(ctrl);
    if ( $ctrl.autocomplete( 'option', 'disabled' ) ) {
      $ctrl.autocomplete( 'enable' );
    } else {
      $ctrl.autocomplete( 'disable' );
    }

    return $ctrl;
  };

  var tmplFirstRow = function() {
    var tmpl = [
      '<div class="qw-total-results">',
      '<span class="left"><%= numFound %> results</span>',
      '<a href="#" class="right">alle anzeigen</span>',
      '</div>'
    ];

    return _.template( tmpl.join( '\n' ) );
  };

  var tmplEntry = function() {
    var tmpl = [
      '<div class="qw-search-result">',
      '<div class="inner">',
      '<h5><%= title %></h5>',
      '<span><%= text.substr( 0, 100 ) %></span>',
      '</div>',
      '</div>'
    ];

    return _.template( tmpl.join( '\n' ) );
  };

  var tmplLastRow = function() {};

  var tmplNoResults = function() {};
}(jQuery, window._, window.document, window));
