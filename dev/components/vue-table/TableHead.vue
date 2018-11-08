<template>
    <th
        v-if="column.enableSort"
        class="sortable vue-table-head"
        @click="toggleSort">
        {{ column.headerText }}
        <i
            :class="'fa fa-' + sortingIconClass"
            aria-hidden="true"/>
    </th>
    <th
        v-else
        class="vue-table-head">
        {{ column.headerText }}
    </th>
</template>

<script>
import Vue from "vue";
import { SortOrder } from './SortOrder';

export default Vue.extend({
    props: {
        column: {
            type: Object,
            required: true
        },
        columnIndex: {
            type: Number,
            required: true
        },
        sortedColumnIndex: {
            type: Number,
            required: true
        },
        sortOrder: {
            type: String,
            required: true
        }
    },
    computed: {
        isSorted() {
            return this.sortedColumnIndex === this.columnIndex;
        },
        sortingIconClass: function(){
            if(this.isSorted){
                switch(this.sortOrder){
                    case SortOrder.ASC:
                        return "caret-up";
                    case SortOrder.DESC:
                        return "caret-down";
                }
            } else {
                return 'sort';
            }
        }
    },
    methods: {
        toggleSort() {
            let newSortOrder;
            if(!this.isSorted){
                newSortOrder = SortOrder.ASC;
            } else {
                switch(this.sortOrder) {
                    case SortOrder.DESC:
                        newSortOrder = SortOrder.ASC;
                        break;
                    case SortOrder.ASC:
                        newSortOrder = SortOrder.DESC;
                        break;
                }
            }

            this.$emit("sort-changed", {
                sortedColumnIndex: this.columnIndex,
                sortOrder: newSortOrder
            });
        }
    }
});
</script>

<style lang="scss">
.vue-table-head.sortable {
    cursor: pointer;
}
</style>
