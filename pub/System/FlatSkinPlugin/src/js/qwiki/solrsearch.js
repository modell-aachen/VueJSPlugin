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

  function SearchFacet(params) {
    var self = this;
    this.combineMode = params.combineMode || 'AND';
    this.facetField = params.facetField;
    this.$e = params.element;
    this.selectedValues = params.selectedValues || {};
    this.radioMode = params.radioMode;
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
  }
  $.extend(SearchFacet.prototype, {
    isApplicable: function(results) {
      if (results && results.facet_counts && results.facet_counts.facet_fields &&
          results.facet_counts.facet_fields[this.facetField]) {
        return true;
      }
      return false;
    },
    select: function(value) {
      if (!value) { return; }
      if (this.radioMode) {
        this.selectedValues = {};
      }
      this.selectedValues[value] = true;
      this.parent.update();
    },
    deselect: function(value) {
      if (!value) { return; }
      if (this.radioMode) { return; }
      delete this.selectedValues[value];
      this.parent.update();
    },
    render: function(results) {
      this.$e.hide();
      if (!this.isApplicable(results)) { return; }
      var $c = this.$e.find('[data-facet-values]');
      if (!$c.length) {
        $c = this.$e;
      }
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
        var $v = $c.qtemplate('add', {
          id: fe,
          title: fe,
          count: facetElems[fe]
        });
        if (this.selectedValues[fe]) {
          $v.addClass('active');
          $v.find('input').prop('checked', true);
        }
      }
    },
    getQueryParts: function() {
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
      if (this.combineMode === 'AND') {
        return ['fq', filters.join(' ') ];
      } else {
        return [
          ['fq', '{!tag=f_'+ this.facetField +'}'+ this.facetField +':('+ filters.join(' OR ') +')']
        ];
      }
    },
    getFacetParts: function() {
      var flt = '';
      if (this.combineMode === 'OR') {
        flt = '{!ex=f_'+ this.facetField +'}';
      }
      return [
        ['facet.field', flt + this.facetField]
      ];
    }
  });

  var sfq_id = 0;
  window.SearchFacetQueries = function(params) {
    SearchFacet.call(this, params);
    delete this.valueMap;
    this.queries = params.queries || {};
    this.tag = sfq_id++;
  };
  $.extend(SearchFacetQueries.prototype, Object.create(SearchFacet.prototype), {
    isApplicable: function(results) {
      if (!results || !results.facet_counts || !results.facet_counts.facet_queries) { return false; }
      var appl = false, self = this;
      $.each(results.facet_counts.facet_queries, function(q, _lbl) {
        q = q.replace(/^\{!ex=\w+\}/, '');
        if (self.queries[q]) { appl = true; return false; }
      });
      return appl;
    },
    render: function(results) {
      this.$e.hide();
      if (!this.isApplicable(results)) { return; }
      var $c = this.$e.find('[data-facet-values]');
      if (!$c.length) {
        $c = this.$e;
      }
      var qs = [], self = this;
      $.each(results.facet_counts.facet_queries, function(q, val) {
        var norm_q = q.replace(/^\{!ex=\w+\}/, '');
        if (!self.queries[norm_q]) { return; }
        if (val === 0 && !self.selectedValues[norm_q]) { return; }
        qs.push({norm: norm_q, raw: q});
      });
      if (!qs.length) { return; }
      $c.empty();
      this.$e.show();

      $.each(qs, function(_idx, q) {
        var $v = $c.qtemplate('add', {
          id: q.norm,
          title: self.queries[q.norm],
          count: results.facet_counts.facet_queries[q.raw]
        });
        if (self.selectedValues[q.norm]) {
          $v.addClass('active');
          $v.find('input').prop('checked', true);
        }
      });
    },
    getQueryParts: function() {
      var filters = $.map(this.selectedValues, function(_v, k) {
        return [k];
      });
      if (!filters.length) { return []; }
      if (this.combineMode === 'AND') {
        return filters.map(function(v) {
          return ['fq', v];
        });
      } else {
        return [
          ['fq', '{!tag=fq_'+ this.tag +'}'+ filters.map(function(v) { return '('+v+')'; }).join(' OR ') ]
        ];
      }
    },
    getFacetParts: function() {
      var flt = '';
      if (this.combineMode === 'OR') {
        flt = '{!ex=fq_'+ this.tag +'}';
      }
      return $.map(this.queries, function(_v, k) {
        return [['facet.query', flt + k]];
      });
    }
  });

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
