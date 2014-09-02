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

      $('[data-quicksearch-toggle] + label').on( 'click', this, handleClick );
      $('[data-quicksearch-toggle]').on( 'keydown', this, handleKeydown );
      $('[data-quicksearch-toggle]').on( 'autocompleteselect', this, handleSelect );
      $('[data-close-preview]').on( 'click', this, closePreview );
    },

    unbind: function() {
      $('[data-quicksearch-toggle] + label').off( 'click', handleClick );
      $('[data-quicksearch-toggle]').off( 'keydown', handleKeydown );
      $('[data-quicksearch-toggle]').off( 'autocompleteselect', handleSelect );
      $('[data-close-preview]').off( 'click', closePreview );
    }
  };

  var handleClick = function( evt ) {
    evt.preventDefault();
    var input = $(this).parent().find('input');
    doSearch( input, evt.data );
  };

  var handleKeydown = function( evt ) {
    if ( evt.which !== 13 ) {
      return;
    }

    // don't submit form on enter key down
    evt.preventDefault();
    doSearch( this, evt.data );
  };

  var handleSelect = function( evt, ui ) {
    evt.preventDefault();
    doSearch( evt.delegateTarget, evt.data );
  };

  var closePreview = function( evt ) {
    $('#qw-searchpreview').removeClass('active');
    $('.qw-search-result.active').removeClass('active');
  };

  var doSearch = function( input, self ) {
    var selector = $(input).data('target');
    var target = {};
    if ( !selector ) {
      target = $(input).closest('[data-quicksearch]');
    } else {
      target = $(selector);
    }
    
    var results = $(target).find('.results');
    var query = $(input).val();
    if ( _.isUndefined( query ) || query.trim() === "" ) {
      return;
    }

    // clear results container, activate spinner (loading animation)
    results.empty();
    results.addClass('searching');

    // disable jQuery UI autocomplete
    toggleAutocomplete( input );

    // call solr
    var f = self.Q.foswiki;
    var url = f.SCRIPTURLPATH + '/rest' + f.SCRIPTSUFFIX + '/SolrPlugin/search?rows=50&q=';
    $.get( url + query, function( data ) {
      results.removeClass('searching');

      if ( data.response.numFound === 0 ) {
        var noResults = tmplNoResults();
        $(noResults()).appendTo( results );
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

        // in case we found some results, allow to show them all by clicking 'show all'
        // with top row
        $('.qw-total-results > a').on( 'click', input, function( evt ) {
          var form = $(evt.data).closest('form');
          form.submit();
          evt.preventDefault();
        });

        $('.qw-search-result > .open').on( 'click', function( evt ) {
          var target = [
            self.Q.foswiki.SCRIPTURL,
            '/view',
            self.Q.foswiki.SCRIPTSUFFIX,
            $(this).data('url')
          ];

          evt.preventDefault();
          window.location = target.join('');
        });

        $('.qw-search-result').on( 'click', function( evt ) {
          $('.qw-search-result.active').removeClass('active');
          $(this).addClass('active');

          var target = [
            self.Q.foswiki.SCRIPTURL,
            '/view',
            self.Q.foswiki.SCRIPTSUFFIX,
            $(this).data('url')
          ];

          var uri = target.join('') + ' .qw-page > .qw-left article.content';
          $('#qw-searchpreview > .content').load( uri, function() {
            if ( !$('#qw-searchpreview').hasClass('active') ) {
              $('#qw-searchpreview').toggleClass('active');
            }

            $('.qw-preview-open-button').attr( 'href', target.join('') );
          } );

          evt.preventDefault();
        });
      }

      // re-enable autocomplete
      var ctrl = toggleAutocomplete( input );
      if ( ctrl ) {
        ctrl.autocomplete( 'close' );
      }
    });
  };

  var toggleAutocomplete = function( input ) {
    try {
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
    } catch ( err ) {
      // ToDo
    }
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
      '<div class="qw-search-result" data-url="<%= url %>">',
      '<div class="inner">',
      '<h5><%= title %></h5>',
      '<span><%= text.substr( 0, 100 ) %></span>',
      '</div>',
      '<div class="open">',
      '<a href="#" class="button primary tiny">öffnen</a>',
      '</div>',
      '</div>'
    ];

    return _.template( tmpl.join( '\n' ) );
  };

  var tmplLastRow = function() {
    // ToDo
  };

  var tmplNoResults = function() {
    var tmpl = [
      '<div class="qw-total-results">',
      '<h3 class="left">TBD. No results...</h3>',
      '</div>'
    ];

    return _.template( tmpl.join( '\n' ) );
  };
}(jQuery, window._, window.document, window));
