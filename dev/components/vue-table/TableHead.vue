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
import SortStates from './SortStates.js';

export default {
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
        }
    },
    data() {
        return {
            sortState: SortStates.NONE
        };
    },
    computed: {
        isSorted() {
            return this.sortState !== SortStates.NONE;
        },
        sortingIconClass: function(){
            switch(this.sortState){
                case SortStates["NONE"]:
                    return 'sort';
                case SortStates["ASC"]:
                    return "caret-up";
                case SortStates["DESC"]:
                    return "caret-down";
            }
        }
    },
    watch: {
        sortedColumnIndex(index) {
            if(index !== this.columnIndex){
                this.sortState = SortStates.NONE;
            }
        }
    },
    methods: {
        toggleSort() {
            switch(this.sortState) {
                case SortStates.NONE:
                case SortStates.DESC:
                    this.sortState = SortStates.ASC;
                    break;
                case SortStates.ASC:
                    this.sortState = SortStates.DESC;
                    break;
            }
            this.$emit("sort-changed", {
                columnIndex: this.columnIndex,
                sortOrder: this.sortState
            });
        }
    }
};
</script>

<style lang="scss">
.vue-table-head.sortable {
    cursor: pointer;
}
</style>
