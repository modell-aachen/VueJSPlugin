<template>
    <div>
        {{ date }}
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
    computed: {
        date: function(){
            let date = this.doc[this.params[0]];
            if(typeof date === 'undefined' || date === '1970-01-01T00:00:00Z') {
                return "";
            }
            if(this.params[1]) {
                return this.$moment(date, this.$moment.ISO_8601).fromNow(true);
            }
            return this.$moment(date, this.$moment.ISO_8601).toDate().toLocaleDateString();
        },
    },
};
</script>
