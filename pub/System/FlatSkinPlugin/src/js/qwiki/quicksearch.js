;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.quicksearch = {
    name: 'quicksearch',
    spinner: null,

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      var opts = {
        lines: 15,
        length: 40,
        width: 20,
        radius: 60,
        corners: 1,
        rotate: 0,
        direction: 1,
        color: '#fff',
        speed: 1.4,
        trail: 70,
        shadow: false,
        hwaccel: true,
        className: 'spinner',
        zIndex: 2e9,
        top: '50%',
        left: '50%'
      };

      this.spinner = new Spinner( opts );
      this.bind();
    },

    bind: function() {
      var self = this;
      this.unbind();

      var $e = $('[data-quicksearch]');
      this.searcher = new SolrSearcher({
        element: $e
      });
      this.searcher.addSubmitButton($('.qw-quicksearch-form .submit'));
      var textfield = new SearchDismaxFilter({
        // XXX this hardcodes the current structure and needs reworking in
        // case we ever want two quicksearch elements in a page
        element: $('.qw-quicksearch-form input[name="search"]'),
        parent: this.searcher
      });
      var filters = $e.find('[data-quicksearch-filter-type]');
      filters.each(function() {
        var $fe = $(this);
        var $p = $fe.parent().closest('[data-quicksearch-filter-type]');
        var p = self.searcher;
        if ($p.length) {
          p = $.data($p[0], 'quicksearch_filter');
          if (!p) {
            return; // Skip this one; broken parent
          }
        }
        var type = $fe.data('quicksearch-filter-type');
        var filter;
        if (type === 'group-filter') {
          var target = $fe.data('quicksearch-filter-tab-target');
          filter = new SearchBoolFilter({
            element: $fe,
            parent: p,
            filter: $fe.data('quicksearch-filter-query'),
            tabTarget: target,
            tabTitle: $fe.data('quicksearch-filter-tab-title')
          });
        }
        else if (type === 'facet') {
          var vals = $fe.data('quicksearch-filter-values');
          if (!vals) {
            vals = [];
          } else {
            vals = vals.split(/\s*,\s*/);
          }
          filter = new SearchFacet({
            element: $fe,
            parent: p,
            facetField: $fe.data('quicksearch-filter-field'),
            combineMode: $fe.data('quicksearch-filter-combine'),
            selectedValues: vals
          });
        } else {
          QWiki.error("Quicksearch: found filter of unknown type '"+ type +"':", this, "  All children will be ignored...");
        }
        $.data($fe[0], 'quicksearch_filter', filter);
      });
      $('#qw-searchbar-filters').tabs({
        heightStyle: 'auto'
      });

      $e.on( 'solrresults.quicksearch', this, renderResults );
      $('[data-close-preview]').on( 'click.quicksearch', this, closePreview );
      $e.find('[data-quicksearch-filter-toggle]').on( 'mousedown.quicksearch', function(ev) {
        if ($e.find('.filter').is('.active')) {
          $e.find('.filter').removeClass('active');
          $e.find('.filter-summary').removeClass('active');
          $e.find('.filter-hide').removeClass('active');
          $e.find('.filter-show').addClass('active');
        } else {
          $e.find('.filter').addClass('active');
          $e.find('.filter-summary').addClass('active');
          $e.find('.filter-hide').addClass('active');
          $e.find('.filter-show').removeClass('active');
        }
        ev.preventDefault();
      });
    },

    unbind: function() {
      if (this.searcher) {
        this.searcher.unbind();
        this.searcher.$e.off('.quicksearch');
      }
      $('[data-close-preview]').off( '.quicksearch' );
    }
  };

  var closePreview = function( evt ) {
    $('#qw-search-pageoverlay').removeClass('active');
    $('#qw-searchpreview').removeClass('active');
    $('.qw-search-result.active').removeClass('active');
  };

  var renderResults = function( evt, data ) {
    var self = evt.data;

    var list = self.searcher.$e.find('.results');
    list.empty();

    if ( data.response.numFound === 0 ) {
      list.qtemplate('add', {_type: 'noresults'});
    } else {
      list.qtemplate('add', {_type: 'total', count: data.response.numFound});
      for( var i = 0; i < data.response.docs.length; ++i ) {
        var doc = data.response.docs[i];
        doc.icon = 'qw-ico-approved';
        if ( doc.workflow_controlled_b && !doc.workflow_isapproved) {
          doc.icon = 'qw-ico-draft';
        }

        doc.snippet = doc.text.substr( 0, 160 ) + (doc.text.length > 160 ? "..." : "");
        list.qtemplate('add', doc);
      }

      // in case we found some results, allow to show them all by clicking 'show all'
      // with top row
      $('.qw-total-results > a').on( 'click', function( evt ) {
        alert('TODO: was soll dieser Link genau machen?');
      });

      var $results = $('.qw-search-result');
      $results.each( function() {
        var href = [
          self.Q.foswiki.SCRIPTURL,
          '/view',
          self.Q.foswiki.SCRIPTSUFFIX,
          $(this).data('url')
        ].join('');

        var $link = $(this).find('a');
        $link.attr('href', href);
      });

      $results.on( 'click', function( evt ) {
        // return if the user clicked the 'open' button
        if ( evt.target.localName === 'a' ) {
          return;
        }

        $('.qw-search-result.active').removeClass('active');
        $(this).addClass('active');

        var target = [
          self.Q.foswiki.SCRIPTURL,
          '/view',
          self.Q.foswiki.SCRIPTSUFFIX,
          $(this).data('url')
        ];

        var uri = target.join('') + ' .qw-page > .qw-left article.content';
        var $overlay = $('#qw-search-pageoverlay');
        if ( !$overlay.hasClass('active') ) {
          $overlay.addClass('active');
        }

        if ($overlay.find('.spinner').length === 0) {
          self.spinner.spin( $overlay[0] );
        }

        var $preview = $('#qw-searchpreview');
        $('#qw-searchpreview > .content').load( uri, function() {
          if ( !$preview.hasClass('active') ) {
            $preview.addClass('active');
            self.spinner.stop();
          }
        } );

        evt.preventDefault();
      });
    }
  };
}(jQuery, window._, window.document, window));
