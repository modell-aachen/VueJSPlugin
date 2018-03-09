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
});
