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

    bind: function($e) {
      var self = this;

      if (!$e) {
        $('[data-quicksearch]').each(function() {
          self.bind($(this));
        });
        return;
      }
      this.unbind($e);

      var searcher = new SolrSearcher({
        element: $e
      });
      $.data($e[0], 'quicksearch_searcher', searcher);
      var submit = $e.data('quicksearch-submit'),
        dismaxMain = $e.data('quicksearch-dismax-main'),
        filterToggle = $e.find('[data-quicksearch-filter-toggle]');
      if (submit) {
        submit = $(submit);
        searcher.addSubmitButton(submit);
      }
      if (dismaxMain) {
        dismaxMain = new SearchDismaxFilter({
          element: $(dismaxMain),
          parent: searcher
        });
      }
      if (filterToggle) {
        var toggle = $(filterToggle.data('quicksearch-filter-toggle'));
        toggle.on('click.quicksearch', function() {
          var $t = $(this);
          $t.toggleClass('active');
          filterToggle.toggleClass('active');
          $e.toggleClass('filter-active');
        });
      }
      var filters = $e.find('[data-quicksearch-filter-type]');
      filters.each(function() {
        var $fe = $(this);
        var $p = $fe.parent().closest('[data-quicksearch-filter-type]');
        var p = searcher;
        if ($p.length) {
          p = $.data($p[0], 'quicksearch_filter');
          if (!p) {
            return; // Skip this one; broken parent
          }
        }
        var type = $fe.data('quicksearch-filter-type');
        var filter;
        if (type === 'bool-filter') {
          filter = new SearchBoolFilter({
            element: $fe,
            parent: p,
            filter: $fe.data('quicksearch-filter-query')
          });
        }
        else if (type === 'facet') {
          var vals = $fe.data('quicksearch-filter-values');
          if (!vals) {
            vals = [];
          } else {
            vals = vals.split(/\s*,\s*/);
          }
          var vmap = $fe.data('quicksearch-filter-map');
          if (!vmap) {
            vmap = {};
          } else {
            var mapspec = vmap.split(/\s*\|\s*/);
            vmap = {};
            for (var ms in mapspec) {
              var m = mapspec[ms].split(/\s*=\s*/, 2);
              vmap[m[0]] = m[1].split(/\s*;\s*/);
            }
          }
          filter = new SearchFacet({
            element: $fe,
            parent: p,
            facetField: $fe.data('quicksearch-filter-field'),
            combineMode: $fe.data('quicksearch-filter-combine'),
            selectedValues: vals,
            valueMap: vmap
          });
        } else {
          QWiki.error("Quicksearch: found filter of unknown type '"+ type +"':", this, "  All children will be ignored...");
        }
        $.data($fe[0], 'quicksearch_filter', filter);
      });

      $e.on( 'solrresults.quicksearch', [this, searcher], renderResults );
      $('[data-close-preview]').on( 'click.quicksearch', searcher, closePreview );
    },

    unbind: function($e) {
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
    $('.qw-search-result .preview a').each(function() {
      if (!$(this).data('orig-text')) { return; }
      $(this).text($(this).data('orig-text'));
      $(this).removeClass('close');
    });
  };

  var renderResults = function( evt, data ) {
    var self = evt.data[0], searcher = evt.data[1];

    var list = searcher.$e.find('.results');
    list.empty();

    if ( data.response.numFound === 0 ) {
      list.qtemplate('add', {_type: 'noresults'});
    } else {
      list.qtemplate('add', {_type: 'total', count: data.response.numFound});
      for( var i = 0; i < data.response.docs.length; ++i ) {
        var doc = data.response.docs[i];
        doc.icon = 'qw-ico-approved';
        doc.draft = '';
        if ( doc.workflow_controlled_b && !doc.workflow_isapproved) {
          doc.icon = 'qw-ico-draft';
          doc.draft = 'draft';
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
        // only react on the "preview" button
        var $p = $(this);
        if ( !$(evt.target).is('[data-open-preview]') ) {
          location.assign(location.protocol +'//'+ location.host + $p.data('url'));
          return;
        }

        var $b = $(evt.target);
        if (!$b.is('a')) { $b = $b.find('a'); }

        if ($b.is('.close')) {
          closePreview();
          return;
        }

        closePreview();

        $('.qw-search-result.active').removeClass('active');
        $p.addClass('active');

        var uri = $p.data('url') + ' .qw-page';
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
          $b.data('orig-text', $b.text());
          $b.text($b.data('close-text')); // TODO L10n
          $b.addClass('close');

          $preview.find('> .heading').remove();
          $preview.find('> .title .heading').text($p.find('.title span').text());
          $preview.find('> .title .icon').attr('class', $p.find('.title i').attr('class'));
          var $head = $(this).find('> .qw-page .heading').detach();
          var $content = $(this).find('> .qw-page .content').detach();
          $(this).parent().append($head).append($content).end().detach();
        } );

        evt.preventDefault();
      });
    }
  };
}(jQuery, window._, window.document, window));
