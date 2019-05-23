<template>
    <div>
        <a
            :href="formatLink(params[1], doc)"
            :title="params[0]">
            <div v-if="!params[2]">{{ params[0] }}</div>
            <img
                v-if="params[2]"
                :src="params[2]">
        </a>
    </div>
</template>

<script>
import FieldMixin from "./FieldMixin.vue";

export default {
    mixins: [FieldMixin],
    methods: {
        formatLink : function(linkText, doc){
            return linkText.replace(/\$([a-z-_]+)/g, function(a,b) {
                return doc[b];
            });
        },
    },
};
</script>
