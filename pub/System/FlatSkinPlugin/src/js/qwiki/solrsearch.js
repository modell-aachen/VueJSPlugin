;(function ($, _, document, window, undefined) {
  'use strict';

  var escapeUnquotedFilter = function(f) {
    return f.
      replace(/[+!(){}\[\]^"~*?:\\-]/g, '\\$&').
      replace(/&&/g, '\\&\\&').
      replace(/\|\|/g, '\\|\\|');
  };

  var escapeQuotedFilter = function(f) {
    return '"'+ f.replace(/"/g, '\\"') +'"';
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

  window.SolrSearcher = function(params) {
    var self = this;
    this.$e = params.element;
    this.filters = [];
    this.elems = [];
    this.addFilter = function(f) {
      this.filters.push(f);
    };
    this.addSubmitButton = function($e) {
      this.elems.push($e);
      $e.on('click.solrsearch', function() { self.update(); });
    };
    this.update = function() {
      var queryParts = [ ["facet", "true"], ["wt", "json"] ],
        self = this;
      $.each(this.filters, function() {
        queryParts = queryParts.concat(this.getQueryParts()).concat(this.getFacetParts());
      });
      queryParts = queryParts.map(function(v) {
        return v[0] +'='+ encodeURIComponent(v[1]);
      }).join('&');

      var results = this.$e.find('.results').empty().addClass('searching');
      this.$e.find('.search-fail').hide();


      var f = window.QWiki.foswiki;
      var restUrl = f.SCRIPTURLPATH +'/rest'+ f.SCRIPTSUFFIX +'/SolrPlugin/proxy?'+ queryParts;
      $.get(restUrl, {}, 'json').
      done(function(data, textStatus, xhr) {
        $.each(self.filters, function() {
          if (!this.render) { return; }
          this.render(data);
        });
        var result = self.$e.triggerHandler('solrresults', data);
        results.removeClass('searching');
        if (result === false) { return; }
        // TODO Generic results renderer here
      }).
      fail(function(xhr, textStatus, errorThrown) {
        results.removeClass('searching');
        self.$e.find('.search-fail').find('.search-fail-error').text(textStatus).end().show();
      });
    };
    this.unbind = function() {
      $.each(this.filters, function() {
        var res;
        if (typeof this.unbind === 'function') {
          res = this.unbind();
        }
        if (res !== false && this.$e) {
          this.$e.off('.solrsearch');
        }
      });
      $.each(this.elems, function() {
        this.off('.solrsearch');
      });
    };
    this.collapseFilters = function() {
      $.each(this.filters, function() {
        if (typeof this.collapse === 'function') { this.collapse(); }
      });
    };
  };

  window.SearchDismaxFilter = function(params) {
    var self = this;
    this.$e = params.element;
    this.query = this.$e.val();
    this.parent = params.parent;
    this.parent.addFilter(this);

    this.getQueryParts = function() {
      if (!this.query) { return []; }
      return [
        ['q', '{!dismax}'+ this.query]
      ];
    };
    this.getFacetParts = function() {
      return [];
    };

    // Override custom source handler from MD's init script in order to
    // disable the undesired caching behaviour and allow us to properly
    // abort requests
    var xhrAbort = function(){}, xhr;
    if (typeof self.$e.autocomplete('option', 'source') !== 'object') {
      var src = self.$e.metadata().source;
      self.$e.autocomplete('option', {
        source: function(req, resp) {
          var term = req.term;

          xhrAbort();
          xhr = $.ajax({
            url: src,
            dataType: 'json',
            data: req,
          }).done(function(data, textStatus, xhr) {
            resp(data);
          }).fail(function(xhr, testStatus, err) {
            resp([]);
          });
          xhrAbort = function() {
            xhr.abort();
            resp([]);
            xhrAbort = function(){};
          };
        }
      });
    }
    var handleSearchTrigger = function(ev) {
      ev.preventDefault();
      self.query = self.$e.val();
      xhrAbort();
      self.$e.autocomplete('close');
      self.$e.blur();
      self.parent.update();
    };
    var handleAutocompleteTrigger = function(ev, ui) {
      self.$e.val(ui.item.value);
      handleSearchTrigger(ev);
    };
    this.$e.on('autocompleteselect.solrsearch', handleAutocompleteTrigger);
    this.$e.on('change.solrsearch', function() {
      self.query = self.$e.val();
    });
    this.$e.on('keydown.solrsearch', function(ev) {
      if (ev.which !== 13) { return; }
      ev.preventDefault();
      handleSearchTrigger(ev);
    });
  };

  var tabId = 0;
  window.SearchBoolFilter = function(params) {
    var self = this;
    this.$e = params.element;
    this.filter = params.filter;
    this.parent = params.parent;
    this.tabTarget = params.tabTarget;
    this.tabTitle = params.tabTitle;
    this.children = [];
    this.enabled = false;

    this.parent.addFilter(this);

    this.update = function() {
      this.parent.update();
    };

    this.addFilter = function(f) {
      this.children.push(f);
    };
    this.render = function(data) {
      $.each(this.children, function() {
        this.render(data);
      });
    };

    this.getQueryParts = function() {
      var res = [];
      if (this.enabled) {
        $.each(this.children, function() {
          res = res.concat(this.getQueryParts());
        });
        res.push(['fq', this.filter]);
        res.push(['facet.query', this.filter]);
      }
      return res;
    };
    this.getFacetParts = function() {
      var res = [];
      $.each(this.children, function() {
        res = res.concat(this.getFacetParts());
      });
      return res;
    };

    var $cb = this.$e.find(this.$e.data('check-target'));
    $cb.change(function() {
      self.enabled = $cb.is(':checked');
      self.update();
    });
  };

  window.SearchFacet = function(params) {
    var self = this;
    this.combineMode = params.combineMode || 'AND';
    this.facetField = params.facetField;
    this.$e = params.element;
    this.selectedValues = params.selectedValues || [];
    this.valueMap = params.valueMap || {};
    /* valueMap example:
     * {
     *   "Word documents": ["doc", "docx"],
     *   "Excel documents": ["xls", "xlsx"]
     * }
     */
    this.parent = params.parent;
    this.parent.addFilter(this);

    this.visible = true;
    this.isApplicable = function(results) {
      if (results && results.facet_counts && results.facet_counts.facet_fields &&
          results.facet_counts.facet_fields[this.facetField]) {
        return true;
      }
      return false;
    };
    this.select = function(value) {
      if (!value) { return; }
      this.selectedValues[value] = true;
      this.parent.update();
    };
    this.deselect = function(value) {
      if (!value) { return; }
      this.selectedValues[value] = false;
      this.parent.update();
    };
    this.render = function(results) {
      this.$e.hide();
      if (!this.isApplicable(results)) { return; }
      var $c = this.$e.find('[data-facet-values]');
      if (!$c.length) {
        $c = this.$e;
      }
      if (!results || !results.facet_counts || !results.facet_counts.facet_fields) { return; }
      var ff = results.facet_counts.facet_fields[this.facetField];
      if (!ff || !ff.length) { return; }
      $c.empty();
      this.$e.show();
      var facetElems = {};
      while (ff.length) {
        var title = ff.shift();
        var num = ff.shift();
        for (var synFacet in this.valueMap) {
          if (this.valueMap[synFacet].indexOf(title) !== -1) {
            title = synFacet;
          }
        }
        if (typeof facetElems[title] !== 'undefined') {
          facetElems[title] = 0;
        }
        facetElems[title] += num;
      }
      for (var fe in facetElems) {
        var $v = this.$e.qtemplate('add', {
          id: fe,
          title: fe,
          count: facetElems[fe]
        });
        if (this.selectedValues[fe]) {
          $v.addClass('active');
        }
      }
    };

    this.getQueryParts = function() {
      var filters = [];
      for (var k in this.selectedValues) {
        if (k in this.valueMap) {
          filters.push('('+ this.valueMap[k].map(escapeQuotedFilter).join(' OR ') +')');
        } else {
          filters.push(escapeQuotedFilter(k));
        }
      }
      if (!filters.length) {
        return [];
      }
      if (self.combineMode === 'AND') {
        return filters.map(function(v) {
          return ['fq', v];
        });
      } else {
        return [
          ['fq', self.facetField +':('+ filters.join(' OR ') +')']
        ];
      }
    };
    this.getFacetParts = function() {
      return [
        ['facet.field', this.facetField]
      ];
    };

    this.$e.on('click.solrsearch', '[data-facet-value]', function(ev) {
      var $v = $(this);
      var id = $v.data('facet-value-id');
      if (self.selectedValues[id]) {
        self.deselect(id);
        $v.removeClass('active');
      } else {
        self.select(id);
        $v.addClass('active');
      }
    });
  };

  QWiki.plugins.solrsearch = {
    name: 'solrsearch',
    priority: 100,

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function(e) {
      var self = this;
      if (e) {
        e.data('solrsearch-widget-inited', 1);
//        var f = e.data('facets').split(/\s*,\s*/);
        return;
      }

      // Bind all unbound widgets
      $('[data-solrsearch-widget]:not([data-solrsearch-widget-inited])').each(function() {
        self.bind($(this));
      });
    },

    unbind: function(e) {
      var self = this;
      if (e) {
        e.removeData('solrsearch-widget-inited');
        e.off('.solrsearch');
      }

      // Unbind all bound widgets
      $('[data-solrsearch-widget-inited]').each(function() {
        self.unbind($(this));
      });
    }
  };

}(jQuery, window._, window.document, window));
