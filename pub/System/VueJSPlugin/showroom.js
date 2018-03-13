Vue.onDocumentReady(function(){
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
        },
        methods: {
            getNewValues: function(newValue) {
               this.values = newValue.value;
            }
        }
    });
    new Vue({
        el: '#input-text-examples',
        template: '#input-text-template',
        data: {
          userInput: ''
        },
        methods: {
          getNewValue: function(newValue) {
            this.userInput = newValue.value;
          }
        }
    });
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
        },
        methods: {
            setNewPage: function(newPage) {
                this.page = newPage;
            }
        }
    });
    new Vue({
        el: '#dad-list-examples',
        template: '#dad-list-template'
    });
});
