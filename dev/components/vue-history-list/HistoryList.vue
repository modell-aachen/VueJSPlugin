<template>
    <div class="grid-x">
        <div class="cell xxlarge-12">
            <div
                class="grid-x">
                <template v-for="(item, index) in data">
                    <div
                        :key="'1_'+index"
                        class="cell small-1"
                        style="font-size: 16px">
                        <div class="grid-y history-list-icon-list">
                            <div class="cell shrink history-list-icon-container">
                                <i
                                    :class="[item.icon]"
                                    class="fa-2x fal" />
                            </div>
                            <div
                                v-if="!isLastItem(index)"
                                class="cell auto history-list-line-container">
                                <div class="history-list-line"/>
                            </div>
                        </div>
                    </div>
                    <div
                        :key="'2_'+index"
                        class="cell small-11">
                        <div>
                            <small>{{ item.date }}
                                <template v-if="item.action">- </template>
                                <div
                                    class="inline"
                                    v-html="item.action" />
                            </small>
                        </div>
                        <div><b>{{ item.actor }}</b> {{ item.description }}</div>
                        <div v-if="item.comment">{{ item.comment }}</div>
                        <vue-spacer factor-vertical="5"/>
                    </div>
                </template>
            </div>
            <vue-spinner
                v-show="isLoading" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'VueHistoryList',
    props: {
        data: {
            type: Array,
            required: true
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        isLastItem(index) {
            return index === this.data.length - 1;
        }
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
.inline {
    display: inline;
}
.history-list-icon-list {
    height: 100%;
    color: $ma-grey;
    .history-list-icon-container,
    .history-list-line-container {
        margin-left: auto;
        margin-right: auto;
        padding-top: 4px;
    }
}
.history-list-line {
    height: 100%;
    width: 2px;
    background-color: $ma-grey;
}
</style>
