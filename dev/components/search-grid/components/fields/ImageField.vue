<template>
    <div>
        <a
            :href="url"
            :class="classObject">
            <img :src="doc[params[0]]">
        </a>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
    data: function() {
        let dataObject = {
            classObject: {
                "inactive-link": true
            }
        };
        if(this.params.length >= 3 && this.params[2] !== "") {
            dataObject.classObject[this.params[2]] = true;
        }

        return dataObject;
    },
    computed: {
        url(){
            if(this.params.length < 2) {
                return "";
            }
            return this.doc[this.params[1]];
        }
    },
    mounted: function(){
        if(this.url !== "") {
            this.classObject["inactive-link"] = false;
        }
    }
};
</script>

<style lang="scss">
.inactive-link {
    pointer-events: none;
    cursor: default;
}

</style>
