<template>
    <div class="ma-block">
        <div class="ma-collapsible-item">
            <!-- Title Area -->
            <div
                :class="{'ma-collapsed': collapsed}"
                class="ma-collapsible-item-title grid-x align-justify">
                <div class="cell shrink">
                    <div class="grid-x ma-collapsible-item-title-left">
                        <div class="cell shrink align-self-middle handle-spacer" />
                        <div
                            v-if="item.icon"
                            class="cell shrink align-self-middle">
                            <i
                                :class="item.icon"
                                class="ma-type-icon"/>
                        </div>
                        <div
                            v-if="item.icon"
                            class="cell shrink">
                            <vue-spacer
                                factor-vertical="auto"
                                factor-horizontal="2"/>
                        </div>
                        <div class="cell shrink align-self-middle">
                            <vue-header3
                                :sublabel="item.subLabel"
                                :status="item.status">{{ item.label || item.description }}</vue-header3>
                        </div>
                    </div>
                </div>
                <div
                    v-if="collapsible"
                    class="cell shrink align-self-middle ma-toggle-cell">
                    <span @click.prevent="toggleCollapsed"><i
                        :class="chevronByCollapsed"
                        class="fas fa-fw"/></span>
                </div>
            </div>
            <vue-slide-up-down
                :active="!collapsed"
                :duration="300">
                <div class="ma-collapsible-item-content">
                    <div class="grid-container fluid">
                        <slot/>
                    </div>
                </div>
            </vue-slide-up-down>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CollapsibleFrame',
    props: {
        item:{
            type: Object,
            required: true
        },
        collapsible: {
            type: Boolean,
            default: true
        },
        allowedTypes: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data: function() {
        let collapsible = this.collapsible ? true : false;
        return {
            dummyDropList: [],
            collapsed: collapsible
        };
    },
    computed: {
        chevronByCollapsed: function() {
            return this.collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
        }
    },
    methods: {
        toggleCollapsed: function() {
            if(this.collapsible){
                this.collapsed = !this.collapsed;
            }
        }
    }
};
</script>


<style lang="scss">
</style>
