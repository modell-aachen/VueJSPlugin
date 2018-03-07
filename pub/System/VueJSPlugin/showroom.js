Vue.onDocumentReady(function(){
    new Vue({
        el: '#buttonExamples',
        template: '#buttonTemplate',
        methods: {
            atClick: function() {
             alert("Click!");
            }
        }
    });
});
