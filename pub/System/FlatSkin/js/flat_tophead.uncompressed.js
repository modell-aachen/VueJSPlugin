$('document').ready(function(){
    if($('.documentHead').length != 0){
        new Vue({
            el: '.documentHead',
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
