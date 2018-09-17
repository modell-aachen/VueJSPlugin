<template>
    <div>
        <span
            v-for="(item,index) in getList()"
            :key="index"
            class="ma-badge">{{ item }}</span>
    </div>
</template>

<script>
import FieldMixin from './FieldMixin.vue';
export default {
    mixins: [FieldMixin],
    computed: {
        field() {
            return this.params[0];
        }
    },
    methods: {
        getList: function() {
            return this.doc[this.field];
        }
    }
};
</script>
