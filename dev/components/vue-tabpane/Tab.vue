<template>
    <div
        v-show="current"
        class="vue-tab">
        <div class="vue-tab-contents">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VueTab',
    props: {
        name: {
            type: String,
            required: true,
        },
        hasSub: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: function() {
                return Vue.getUniqueId();
            },
        }
    },
    data: function() {
        return {
            current: false
        };
    }
};
</script>

<style lang="scss">
@import '../../sass/settings';
.flatskin-wrapped .jqTabPaneFlat .vue-tab {
    display: inherit;
    .vue-tab-contents {
        padding: rem(24px) 0;
    }
}
</style>
