<template>
    <div>
        <a
            v-for="(item, index) in splitList()"
            :key="index"
            :href="item.Url">
            {{ item.Title }}<br>
        </a>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
    computed: {
        field(){
            return this.params[0];
        },
        seperateBySpace(){
            return this.params[1];
        }
    },
    methods: {
        splitList: function(){
            let url = this.doc[this.seperateBySpace];
            if(!url){
                return "";
            }

            url = url.split(", ");

            url.forEach(function(element, index){
                if(!element.startsWith("/")){
                    url[index] = "/"+element;
                }
            });

            let topicTitle = this.doc[this.field];
            if(!topicTitle) {
                return '';
            }
            topicTitle = topicTitle.split(/^, /gm);

            let result = new Array();

            for(let i = 0 ; i < url.length ; i++){
                result[i] = {Url:url[i],Title:topicTitle[i]};
            }

            return result;

        }
    }
};
</script>
