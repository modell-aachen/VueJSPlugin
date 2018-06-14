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
                                factor-horizontal="2"
                            />
                        </div>
                        <div class="cell shrink align-self-middle">
                            <vue-header3
                                :sublabel="item.subLabel"
                                :status="item.status">{{ item.label || item.description }}</vue-header3>
                        </div>
                    </div>
                </div>
                <div
                    v-if="removeOptions && !collapsed"
                    class="cell shrink align-self-middle ma-remove-cell">
                    <a
                        class="remove-item-handle"
                        @click="removeOptions.onRemove(item, index)">{{ removeOptions.name }}</a>
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
            // item.description
            // item.icon
        },
        collapsible: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            required: true
        },
        multiOpen: {
            type: Boolean,
            default: false
        },
        lastOpenedItemId: {
            type: [String, Number],
            default: null
        },
        allowedTypes: {
            type: Array,
            default: function() {
                return [];
            }
        },
        removeOptions: {
            type: Object,
            default: null
        }
    },
    data: function() {
        let collapsible = this.collapsible ? true : false;
        return {
            dummyDropList: [],
            // collapsed: collapsible ? true : false
            collapsed: collapsible
        };
    },
    computed: {
        chevronByCollapsed: function() {
            return this.collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
        },
        wrapperByStatus: function() {
            return this.collapsed ? 'vddl-nodrag' : 'div';
        }
    },
    watch: {
        lastOpenedItemId: function(lastOpenedItemId) {
            if(this.multiOpen === null || this.multiOpen === false) {
                if(lastOpenedItemId !== this.item.id) {
                    this.collapsed = true;
                } else {
                    this.collapsed = false;
                }
            }
        },
        collapsed() {
            this.getListParent().$emit("drag-status-change", {
                id: this.item.id,
                isDraggable: this.collapsed
            });
        }
    },
    methods: {
        toggleCollapsed: function() {
            if(this.collapsible){
                this.collapsed = !this.collapsed;
                if(!this.collapsed) {
                    let parentList = this.getListParent();
                    parentList.$emit('lastOpened', this.item.id);
                }
            }
        },
        getListParent: function(parent = this.$parent) {
            while(!parent.DaDList && parent.$parent) {
                parent = parent.$parent;
            }
            return parent;
        }
    }
};
</script>


<style lang="scss">
.handle {
  cursor: move;
}

</style>
