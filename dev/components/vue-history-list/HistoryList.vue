<template>
    <div class="grid-x">
        <div class="cell xxlarge-12">
            <div
                class="grid-x">
                <template v-for="(item, index) in data">
                    <div
                        :key="'1_'+index"
                        class="cell small-1">
                        <div class="grid-y history-list-icon-list">
                            <div class="cell shrink history-list-icon-container">
                                <i
                                    :class="[item.icon]"
                                    class="fa-2x fal" />
                            </div>
                            <div
                                v-if="!isLastItem(index)"
                                class="cell auto history-list-line-container">
                                <div class="history-list-line" />
                            </div>
                        </div>
                    </div>
                    <div
                        :key="'2_'+index"
                        class="cell small-11">
                        <div class="grid-x">
                            <a
                                :href="item.actionUrl"
                                target="_blank">
                                <small
                                    class="link-to-history"> {{ item.date }}
                                    <template v-if="item.action">- </template>
                                    <!-- eslint-disable-next-line vue/no-v-html -->
                                    <span v-html="item.action" />
                                    <i class="history-icon far fa-history" />
                                </small>
                            </a>
                        </div>
                        <div><b>{{ item.actor }}</b> {{ item.description }}</div>
                        <div v-if="item.comment">
                            {{ item.comment }}
                        </div>
                        <vue-spacer factor-vertical="5" />
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
    name: "VueHistoryList",
    props: {
        data: {
            type: Array,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        isLastItem(index) {
            return index === this.data.length - 1;
        },
    },
};
</script>

<style lang="scss">
@import "../../sass/settings.scss";
.history-list-icon-list {
    height: 100%;
    color: $ma-grey;
    font-size: 16px;
    .history-list-icon-container,
    .history-list-line-container {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        padding-top: 4px;
    }
}
.history-list-line {
    height: 100%;
    width: 2px;
    margin-left: auto;
    margin-right: auto;
    background-color: $ma-grey;
}
.link-to-history {
    cursor: pointer;
    color: $ma-secondary-text;
    &:hover {
        text-decoration: underline;
    }

    &:hover .history-icon {
        color: $ma-secondary-text;
    }
    .history-icon {
        margin-left: 16px;
        color: $ma-tertiary-text;

    }
}
</style>
