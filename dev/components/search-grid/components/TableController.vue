<template>
    <vue-table
        :columns="columns"
        :data="results"
        :page-count="pageCount"
        :current-page="currentPage"
        :sorted-column-index="sortedColumnIndex"
        :sort-order="sortOrder"
        @sort-changed="onSortChanged"
        @page-changed="onPageChanged">
        <template
            v-for="(field,index) in filteredFields"
            :slot="'column' + index"
            slot-scope="{item}">
            <component
                :is="field.component"
                :key="index"
                :doc="item"
                :params="field.params"
                :api="api" />
        </template>
    </vue-table>
</template>

<script>
import GridComponentMixin from './GridComponentMixin.vue';
import * as mutations from "../store/mutation-types";

import StandardFields from "./StandardFields.js";

export default {
    components: StandardFields,
    mixins: [GridComponentMixin],
    props: {
        results: {
            type: Array,
            required: true,
        },
        filteredFields: {
            type: Array,
            required: true,
        },
        api: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            pageCount: 1,
            currentPage: 1,
        };
    },
    computed: {
        columns() {
            return this.filteredFields.map((field) => {
                return {
                    headerText: field.title,
                    enableSort: field.sortField !== 'none',
                };
            });
        },
        sortedColumnIndex() {
            if(this.gridState.sortCrits.length !== 1){
                return -1;
            } else {
                const sortField = this.gridState.sortCrits[0].field;
                return this.filteredFields.findIndex((field) => {
                    return field.sortField === sortField;
                });
            }
        },
        sortOrder(){
            if(this.gridState.sortCrits.length !== 1) {
                return 'asc';
            }
            let sortCrits = this.gridState.sortCrits[0];
            return sortCrits.order;
        },
    },
    methods: {
        onSortChanged({sortedColumnIndex, sortOrder}) {
            const sortField = this.filteredFields[sortedColumnIndex].sortField;
            this.$store.commit("searchGrid/" + mutations.CHANGE_SORT, {gridState: this.gridState, sortCrits: [{field: sortField, order: sortOrder}]});
        },
        onPageChanged() {

        },
    },
};
</script>
