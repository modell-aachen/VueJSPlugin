<template>
    <div>
        <div class="grid-x">
            <div class="cell">
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
                                @sort-changed="onSortChanged"/>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(dataItem,index) in data"
                            :key="index">
                            <td
                                v-for="(column,index) in columns"
                                :key="index">
                                <slot
                                    :name="'column' + index"
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
import TableHead from './TableHead.vue';
import SortOrder from './SortOrder.js';
export default {
    components: {
        TableHead
    },
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        data: {
            type: Array,
            default: () => []
        },
        pageCount: {
            type: Number,
            default: () => 1
        },
        currentPage: {
            type: Number,
            default: () => 1
        },
        sortedColumnIndex: {
            type: Number,
            default: () => -1
        },
        sortOrder: {
            type: String,
            default: () => SortOrder.ASC
        }
    },
    methods: {
        onSortChanged({columnIndex, sortOrder}) {
            this.$emit("sort-changed", {
                sortedColumnIndex: columnIndex,
                sortOrder: sortOrder
            });
        },
        onCurrentPageChanged(currentPage) {
            this.$emit("page-changed", currentPage);
        }
    }
};
</script>

<style scoped lang="scss">
table{
    display: block;
    overflow-x: auto;
}
</style>
