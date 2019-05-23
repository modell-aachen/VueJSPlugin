<template>
    <div class="ma-block">
        <div class="ma-collapsible-item">
            <!-- Title Area -->
            <div
                :class="{'ma-collapsed': collapsed}"
                class="ma-draggable ma-collapsible-item-title grid-x align-justify"
                @click.prevent="toggleCollapsed">
                <div class="cell shrink">
                    <div class="grid-x ma-collapsible-item-title-left">
                        <div
                            v-if="item.icon"
                            class="cell shrink align-self-middle handle-spacer" />
                        <div
                            v-if="item.icon"
                            class="cell shrink align-self-middle">
                            <i
                                :class="item.icon"
                                class="ma-type-icon" />
                        </div>
                        <div class="cell shrink">
                            <vue-spacer
                                :factor-horizontal="(item.icon) ? 2 : 3"
                                factor-vertical="auto" />
                        </div>
                        <div class="cell shrink align-self-middle">
                            <vue-header3
                                :sublabel="item.subLabel"
                                :status="item.status">
                                {{ item.label || item.description }}
                            </vue-header3>
                        </div>
                    </div>
                </div>
                <div class="cell auto align-self-middle ma-collapsible-header-drop-zone">
                    <!-- Dummy Drop List -->
                    <vue-dad-list
                        v-if="canDropInTitle && collapsed"
                        v-model="dummyDropList"
                        :allowed-types="allowedTypes"
                        class="title-dad-list"
                        item-type="vue-simple-dad-item">
                        <vddl-placeholder slot="placeholder">
                            <div class="ma-simple-dad-item-drop-area">
                                <h3>{{ dropTargetDescription !== undefined ? dropTargetDescription : $t('collapsible_dad_item_drop_target') }}</h3>
                            </div>
                        </vddl-placeholder>
                        <div slot="addArea" />
                    </vue-dad-list>
                </div>
                <div
                    v-if="$slots.rightMenu"
                    class="cell shrink align-self-middle ma-right-menu">
                    <slot name="rightMenu" />
                </div>
                <div
                    v-if="removeOptions && !collapsed"
                    class="cell shrink align-self-middle ma-remove-cell">
                    <a
                        class="remove-item-handle"
                        @click="removeOptions.onRemove(item, index)">{{ removeOptions.name }}</a>
                </div>
                <div class="cell shrink align-self-middle ma-toggle-cell">
                    <span><i
                        :class="chevronByCollapsed"
                        class="fas fa-fw" /></span>
                </div>
            </div>
            <vue-slide-up-down
                :active="!collapsed"
                :duration="300">
                <div
                    class="ma-collapsible-item-content"
                    @mouseenter="markItemDraggable(false)"
                    @mouseleave="markItemDraggable(true)">
                    <div class="grid-container fluid">
                        <slot />
                    </div>
                </div>
            </vue-slide-up-down>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CollapsibleDadItem',
    i18nextNamespace: 'VueJSPlugin',
    props: {
        canDropInTitle: {
            type: Boolean,
            default: false,
        },
        dropTargetDescription: {
            type: String,
            default: undefined,
        },
        item:{
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        multiOpen: {
            type: Boolean,
            default: false,
        },
        lastOpenedItemId: {
            type: [String, Number],
            default: null,
        },
        allowedTypes: {
            type: Array,
            default: function() {
                return null;
            },
        },
        removeOptions: {
            type: Object,
            default: null,
        },
        setLastOpenedId: {
            type: Function,
            required: true,
        },
        setDragStatus: {
            type: Function,
            required: true,
        },
    },
    data: function() {
        return {
            dummyDropList: [],
            collapsed: true,
        };
    },
    computed: {
        chevronByCollapsed: function() {
            return this.collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
        },
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
    },
    methods: {
        toggleCollapsed: function() {
            this.collapsed = !this.collapsed;
            if(!this.collapsed) {
                this.setLastOpenedId(this.item.id);
            }
        },
        markItemDraggable( draggable ) {
            this.setDragStatus( {
                id: this.item.id,
                isDraggable: draggable,
            });
        },
    },
};
</script>


<style lang="scss">
.handle {
  cursor: move;
}
.ma-block {
    .ma-collapsible-header-drop-zone,
    .title-dad-list,
    .panel__body--list {
        height: 100%;
    }
}
</style>
