<template>
    <component
        :is="wrapperByStatus"
        class="ma-block">
        <div class="ma-collapsible-item">
            <!-- Title Area -->
            <div
                :class="{'ma-collapsed': collapsed}"
                class="ma-collapsible-item-title grid-x align-justify">
                <div class="cell shrink">
                    <div class="grid-x ma-collapsible-item-title-left">
                        <div class="cell shrink align-self-middle handle-container">
                            <vddl-handle
                                v-if="collapsed"
                                :handle-left="0"
                                :handle-top="0"
                                class="fal fa-bars fa-fw handle"/>
                        </div>
                        <div class="cell shrink align-self-middle handle-spacer" />
                        <div
                            v-if="item.icon"
                            class="cell shrink align-self-middle">
                            <i
                                :class="item.icon"
                                class="ma-type-icon"/>
                        </div>
                        <div class="cell shrink">
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
                <div class="cell auto align-self-middle ma-collapsible-header-drop-zone">
                    <!-- Dummy Drop List -->
                    <vue-dad-list
                        v-if="canDropInTitle && collapsed"
                        :allowed-types="allowedTypes"
                        v-model="dummyDropList"
                        item-type="vue-simple-dad-item">
                        <vddl-placeholder slot="placeholder">
                            <div class="ma-simple-dad-item-drop-area">
                                <h3>Feld in diesen Inhaltsblock verschieben</h3>
                            </div>
                        </vddl-placeholder>
                        <div slot="addArea"/>
                    </vue-dad-list>
                </div>
                <div
                    v-if="removeOptions && !collapsed"
                    class="cell shrink align-self-middle ma-remove-cell">
                    <a
                        class="remove-item-handle"
                        @click="removeOptions.onRemove(item, index)">{{ removeOptions.name }}</a>
                </div>
                <div class="cell shrink align-self-middle ma-toggle-cell">
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
    </component>
</template>

<script>
export default {
    name: 'CollapsibleDadItem',
    props: {
        canDropInTitle: {
            type: Boolean,
            default: false
        },
        item:{
            type: Object,
            required: true
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
        return {
            dummyDropList: [],
            collapsed: true
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
        dummyDropList: function(newList) {
            if(this.dummyDropList.length > 0) {
                this.$emit('dropped-item', {dummyList: newList, index: this.index});
                this.dummyDropList = [];
            }
        },
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
            this.collapsed = !this.collapsed;
            if(!this.collapsed) {
                let parentList = this.getListParent();
                parentList.$emit('lastOpened', this.item.id);
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
