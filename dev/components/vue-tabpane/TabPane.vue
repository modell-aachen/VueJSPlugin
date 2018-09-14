<template>
    <div class="flatskin-wrapped vue-tabpane">
        <div :class="'jqTabPaneFlat'+type">
            <ul class="vue-tabpane-group">
                <li
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :class="{current: tab.current}">
                    <a
                        :class="{'hasSubMenu': tab.hasSub}"
                        href="#"
                        @click.prevent="selectTab(tab.id)"
                        v-html="tab.name"/>
                </li>
            </ul>
            <span class="clearfix"/>
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VueTabpane',
    props: {
        type: {
            type: String,
            default: ''
        },
    },
    data: () => ({
        tabs: [],
    }),
    mounted() {
        if(this.$children.length) {
            this.tabs = this.$children;
            this.selectTab(this.tabs[0].id);
        }
    },
    methods: {
        selectTab(selectedTabId) {
            this.$children.forEach(tab => {
                tab.current = (tab.id === selectedTabId);
            });
        },
    },
};
</script>

<style lang="scss">
@import '../../sass/settings';
.flatskin-wrapped .jqTabPaneFlat>.vue-tabpane-group li.current a.hasSubMenu {
    background: #eff3f4;
    border-bottom: 2px solid #eff3f4;
}
ul.vue-tabpane-group,
#modacWrapper ul.vue-tabpane-group {
    list-style: none;
    display: block;
    float: left;
    overflow: visible !important;
    border-bottom: 2px solid $light-gray;
    width: 100%;

    li {
        float: left;
        list-style: none;
    }

    a:hover,
    a {
        text-decoration: none;
        white-space: nowrap;
        float: left;
        display: block;
        text-shadow: 0 1px #fff;
    }
    a:focus {
        outline: none;
    }
}
</style>
