Vue.onDocumentReady(function(){
    new Vue({
        el: '#header-examples',
        template: '#header-template',
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
          payment: ''
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
        template: '#select-template'
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
});
