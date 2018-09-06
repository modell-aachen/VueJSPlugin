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
                    v-model="currentPage" />
            </div>
        </div>
    </div>
</template>

<script>
import TableHead from './TableHead.vue';
import SortStates from './SortStates.js';
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
            default: () => 0
        }
    },
    data() {
        return {
            sortedColumnIndex: -1,
            sortOrder: SortStates.NONE,
            currentPage: 0
        };
    },
    watch: {
        currentPage() {
            this.propagatePageChange();
        }
    },
    methods: {
        onSortChanged({columnIndex, sortOrder}) {
            this.sortedColumnIndex = columnIndex;
            this.sortOrder = sortOrder;
            this.propagateSortChange();
        },
        propagateSortChange() {
            this.$emit("sort-changed", {
                sortedColumnIndex: this.sortedColumnIndex,
                sortOrder: this.sortOrder
            });
        },
        propagatePageChange() {
            this.$emit("page-changed", this.currentPage);
        }
    }
};
</script>
