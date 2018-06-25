$('document').ready(function(){
    if($('.ma-documenthead').length != 0){
        new Vue({
            el: '.ma-documenthead',
            data: function(){
                return {
                    show: false
                }
            },
            methods: {
                toggle: function(){
                    this.show = !this.show;
                }
            }
        })
    }
});
