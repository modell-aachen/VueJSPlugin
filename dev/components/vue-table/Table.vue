<template>
    <div>
        <div class="grid-x">
            <div class="cell vue-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <table-head
                                v-for="(column,index) in columns"
                                :key="index"
                                :sorted-column-index="sortedColumnIndex"
                                :sort-order="sortOrder"
                                :column="column"
                                :column-index="index"
                                @sort-changed="onSortChanged" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(dataItem,index) in data"
                            :key="index"
                            :data-test="'row' + index">
                            <td
                                v-for="(column, col_index) in columns"
                                :key="col_index"
                                :data-test="'column' + col_index">
                                <slot
                                    :name="'column' + col_index"
                                    :item="dataItem" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell">
                <vue-pagination
                    v-if="pageCount > 1"
                    :page-count="pageCount"
                    :value="currentPage"
                    @input="onCurrentPageChanged" />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import TableHead from './TableHead.vue';
import { SortOrder } from './SortOrder';
export default Vue.extend({
    components: {
        TableHead,
    },
    props: {
        columns: {
            type: Array,
            default: () => [],
        },
        data: {
            type: Array,
            default: () => [],
        },
        pageCount: {
            type: Number,
            default: () => 1,
        },
        currentPage: {
            type: Number,
            default: () => 1,
        },
        sortedColumnIndex: {
            type: Number,
            default: () => -1,
        },
        sortOrder: {
            type: String,
            default: () => SortOrder.ASC,
        },
    },
    methods: {
        onSortChanged(sortChangedEvent) {
            this.$emit("sort-changed", sortChangedEvent);
        },
        onCurrentPageChanged(currentPage) {
            this.$emit("page-changed", currentPage);
        },
    },
});
</script>
<style lang="scss">
.vue-table-wrapper{
    overflow: auto;
}
</style>
