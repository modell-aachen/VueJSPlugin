Vue.onDocumentReady(function(){
    new Vue({
        el: '#header-examples',
        template: '#header-template',
    });
    new Vue({
        el: '#text-block-examples',
        template: '#text-block-template',
    });
    new Vue({
        el: '#button-examples',
        template: '#button-template',
        methods: {
            atClick: function() {
             alert("Click!");
            }
        }
    });
    new Vue({
        el: '#check-item-examples',
        template: '#check-item-template',
        data: {
          values: [],
          payment: ''
        }
    });
    new Vue({
        el: '#check-item-examples-2',
        template: '#check-item-template-2',
        data: {
          values: [],
          payment: '',
          payment_no_badge: ''
        }
    });
    new Vue({
        el: '#check-item-examples-3',
        template: '#check-item-template-3',
        data: {
          values: [],
        }
    });
    new Vue({
        el: '#input-text-examples',
        template: '#input-text-template',
        data: {
          userInput: ''
        }
    });
    try {
        let pagedSelectorJson = $('#paged-selector-json').text();
        let pagedSelectorOptions = JSON.parse(pagedSelectorJson);
        new Vue({
            el: '#paged-selector-examples',
            template: '#paged-selector-template',
            data: {
                options: pagedSelectorOptions
            }
        });
    } catch(e) {
        window.console && console.log(e);
    }
    new Vue({
        el: '#tabpane-examples',
        template: '#tabpane-template'
    });
    new Vue({
        el: '#select-examples',
        template: '#select-template',
        data: {
            singleSelectValue: [],
            singleSelectAllowClearValue: [],
            multiSelectValue: [],
            singleSelectPreSelectValue: ['darjeeling'],
            singleSelectAllowClearPreSelectValue: ['darjeeling'],
            multiSelectPreSelectValue: ['darjeeling'],
            disabledPreSelectValue: ['darjeeling'],
            jsOptions: [
                {
                    value: 'darjeeling',
                    label: 'Darjeeling'
                },
                {
                    value: 'assam',
                    label: 'Assam'
                },
                {
                    value: 'ceylon',
                    label: 'Ceylon'
                },
                {
                    value: 'dooars',
                    label: 'Dooars'
                },
                {
                    value: 'earlGrey',
                    label: 'Earl Grey'
                },
                {
                    value: 'peppermint',
                    label: 'Peppermint'
                },
                {
                    value: 'camomile',
                    label: 'Camomile'
                },
                {
                    value: 'hibiscus',
                    label: 'Hibiscus'
                },
                {
                    value: 'ginger',
                    label: 'Ginger'
                },
                {
                    value: 'rooibos',
                    label: 'Rooibos'
                },
                {
                    value: 'almond',
                    label: 'Almond'
                },
                {
                    value: 'sage',
                    label: 'Sage'
                },
            ],
        }
    });
    new Vue({
        el: '#pagination-examples',
        template: '#pagination-template',
        data: {
            page: 2,
            pageCount: 30
        }
    });
    new Vue({
        el: '#dad-list-examples',
        template: '#dad-list-template',
        methods: {
            addItemFromDummyList: function({dummyList, index}){
                this.list[index].fields[0].push(dummyList[0]);
            },
            addMetadataBlock: function() {
            this.list.push({
               "id": Vue.getUniqueId(),
               "label": "New Item A1",
               "type": "metadataBlock",
            });
          },
          addStatusField: function() {
            this.list[0].fields[0].push({
               "id": Vue.getUniqueId(),
               "label": "New Status A3",
               "type": "status",
            });
          },
          onRemoveItem: function(item, index) {
            this.list.splice(index, 1);
          }
        },
        data: {
            list: [
                {
                    "id": 1,
                    "type": "metadataBlock",
                    "label": "Item A1",
                    "subLabel": "Caption",
                    "status": 'warning',
                    "icon": 'fas fa-camera-retro',
                    fields: [
                        [
                          {
                            "id": 1,
                            "label": "SubItem 1",
                            "type": "status"
                          },
                          {
                            "id": 2,
                            "label": "SubItem 2",
                            "type": "status"
                          }
                        ],
                        [
                          {
                            "id": 11,
                            "label": "SubItem B",
                            "type": "status"
                          },
                        ]
                    ]
                },
                {
                    "id": 2,
                    "type": "metadataBlock",
                    "label": "Item A2",
                    "status": 'warning',
                    fields: [
                        [
                          {
                            "id": 101,
                            "label": "SubItem 1",
                            "type": "status"
                          },
                          {
                            "id": 102,
                            "label": "SubItem 2",
                            "type": "status"
                          }
                        ],
                        []
                    ]
                }
            ]
        }
    });
    new Vue({
        el: '#splitbutton-examples',
        template: '#splitbutton-template',
        methods: {
            boom: function() {
             alert("Boom!");
            }
        }
    });
    new Vue({
        el: '#alert-examples',
        template: '#alert-template',
        methods: {
            alert: function() {
             this.$showAlert({
              type: "warning",
              title: "Do you really want to destroy everything?",
              text: "This might be dangerous!",
              confirmButtonText: "Destroy!",
              cancelButtonText: "Run"
             }).then(() => {
                //Handle confirm action here
             }).catch(() => {
                //Handle cancel action here
             });
            }
        }
    });
    new Vue({
        el: '#tooltip-examples',
        template: '#tooltip-template',
    });
    new Vue({
        el: '#mixed-input-examples',
        template: '#mixed-input-template',
        data: {
          options:[{
            id: 'option-1',
            label: "Snes"
          },{
            id: 'option-2',
            label: "N64"
          },{
            id: 'option-3',
            label: "Gamecube"
          }],
          value: [{
            type: "text",
            value: "The "
          },{
            type: "option",
            id: "option-2"
          },{
            type: "text",
            value: " is the best console."
          }]
        }
    });
    new Vue({
        el: '#table-examples',
        template: '#table-template',
        data: {
            columns: [{
                headerText: 'First Name',
                enableSort: true
            },{
                headerText: 'Last Name',
                enableSort: true
            },{
                headerText: 'E-Mail'
            },{
                headerText: 'Gender',
                enableSort: true
            }],
            tableData: [{
                "first_name": "Mohammed",
                "last_name": "Beamish",
                "email": "mbeamish0@nyu.edu",
                "gender": "Male"
              }, {
                "first_name": "Teodora",
                "last_name": "Sears",
                "email": "tsears1@weibo.com",
                "gender": "Female"
              }, {
                "first_name": "Julissa",
                "last_name": "Nestoruk",
                "email": "jnestoruk2@joomla.org",
                "gender": "Female"
              }, {
                "first_name": "Karel",
                "last_name": "Sprackling",
                "email": "ksprackling3@marketwatch.com",
                "gender": "Female"
              }, {
                "first_name": "Siobhan",
                "last_name": "Hinrichs",
                "email": "shinrichs4@disqus.com",
                "gender": "Female"
              }, {
                "first_name": "Thurstan",
                "last_name": "Bohling",
                "email": "tbohling5@wiley.com",
                "gender": "Male"
              }, {
                "first_name": "Violette",
                "last_name": "Paulack",
                "email": "vpaulack6@ning.com",
                "gender": "Female"
              }, {
                "first_name": "Jerry",
                "last_name": "Kindley",
                "email": "jkindley7@umich.edu",
                "gender": "Male"
              }, {
                "first_name": "Shauna",
                "last_name": "Justun",
                "email": "sjustun8@deliciousdays.com",
                "gender": "Female"
              }, {
                "first_name": "Elinor",
                "last_name": "Doone",
                "email": "edoone9@a8.net",
                "gender": "Female"
              }],
              currentPage: 1,
              sortedColumnIndex: -1,
              sortOrder: 'asc'
        },
        methods: {
            onSortChanged: function({sortedColumnIndex, sortOrder}) {
                let sortField;
                switch(sortedColumnIndex){
                    case 0:
                        sortField = 'first_name';
                        break;
                    case 1:
                        sortField = 'last_name';
                        break;
                    case 3:
                        sortField = 'gender';
                        break;
                }
                Vue.set(this, 'tableData', this.tableData.sort(function(a,b) {
                    switch(sortOrder){
                        case 'asc':
                            return a[sortField].localeCompare(b[sortField]);
                        case 'desc':
                            return b[sortField].localeCompare(a[sortField]);
                    }
                }));
                this.sortedColumnIndex = sortedColumnIndex;
                this.sortOrder = sortOrder;
            },
            onPageChanged: function(page) {
                this.currentPage = page;
            }
        },
        computed: {
            pageCount: function() {
                return Math.ceil(this.tableData.length / 5);
            },
            tableDataForCurrentPage: function() {
                const begin = (this.currentPage - 1) * 5;
                const end = begin + 5;
                return this.tableData.slice(begin, end);
            }
        }
    });
    new Vue({
        el: '#history-list-examples',
        template: '#history-list-template',
    });
    new Vue({
        el: '#search-grid-examples',
        template: '#search-grid-template',
        data: {
            gridPreferences: {
                "mappings": {},
                "form": "",
                "addons": [],
                "wizardConfig": {},
                "resultsPerPage": "10",
                "filterHeading": "Filter",
                "gridField": {
                    "component": "test-grid-field",
                    "params": ["title", "url", "createdate"]
                },
                "enableExcelExport": true,
                "facets": [{
                    "component": "select-2-facet",
                    "params": ["Bereiche", "web", "10"]
                }, {
                    "params": ["Autor", "author"],
                    "component": "single-select-facet"
                }, {
                    "component": "multi-select-facet",
                    "params": ["Formular", "form"]
                }],
                "initialFacetting": 0,
                "initialFiltering": 1,
                "hasLiveFilter": true,
                "q": "type:topic",
                "initialHideColumn": false,
                "wizardNoResultsConfig": {
                    "params": ["Nothing here", "fa-magic", "Unfortunately we could not find anything for these filters"],
                    "component": "vue-wizard"
                },
                "wizardNoEntriesConfig": {
                    "params": ["Nothing here", "fa-magic", "Unfortunately we could not find anything", "Create some Topic", "ButtonHref"],
                    "component": "vue-wizard"
                },
                "fields": [{
                    "sortField": "title_sort",
                    "params": ["title"],
                    "title": "Titel",
                    "component": "text-field"
                }, {
                    "title": "Url",
                    "sortField": "url",
                    "params": ["url", "url"],
                    "component": "url-field"
                }, {
                    "title": "Datum",
                    "params": ["createdate"],
                    "sortField": "createdate",
                    "component": "date-field"
                }],
                "filters": [{
                    "component": "full-text-filter",
                    "params": ["Titel", "title_search"]
                }, {
                    "params": ["Sprache", "language", "en"],
                    "component": "select-filter"
                }],
                "fieldRestriction": "createdate,title,author,url,language,topic,type,web,form",
                "initialSort": "title_sort desc"
            }
        }
    });
});
