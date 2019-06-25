<template>
    <div>
        <vddl-list
            :list="internalValue"
            :allowed-types="allowedTypes"
            :horizontal="false"
            :drop="handleDrop"
            class="panel__body--list">
            <div>
                <template v-for="(item, index) in internalValue">
                    <vddl-draggable
                        :key="item.id"
                        :type="item.type"
                        :draggable="item"
                        :index="index"
                        :wrapper="internalValue"
                        :moved="handleMoved"
                        :disable-if="itemStates.noDrag[item.id]"
                        :dragstart="(data) => { onItemDragStart(item.id); }"
                        class="panel__body--item"
                        effect-allowed="move">
                        <template>
                            <slot
                                v-if="useSlot"
                                :item="item"
                                :index="index"
                                :is-draggable="isDraggable"
                                :set-last-opened-id="setLastOpenedId"
                                :last-opened-item-id="lastOpenedItemId"
                                :set-drag-status="onItemDragStatusChanged" />
                            <div
                                :is="itemType"
                                v-else
                                :item="item"
                                :index="index"
                                :is-draggable="isDraggable"
                                :last-opened-item-id="lastOpenedItemId"
                                @click.native="clickItemEvent(item)" />
                        </template>
                    </vddl-draggable>
                </template>
            </div>
            <slot name="placeholder">
                <vddl-placeholder>
                    <div
                        :is="itemType"
                        :item="dummyItem"
                        :set-last-opened-id="() => {}"
                        :set-drag-status="() => {}"
                        :index="99999" />
                </vddl-placeholder>
            </slot>
        </vddl-list>
        <slot
            :add="addItemEvent"
            name="addArea">
            <vue-button
                :title="buttonTitle"
                :type="buttonType"
                data-test="dadListAddIcon"
                icon="far fa-plus"
                @click.native="addItemEvent" />
        </slot>
    </div>
</template>

<script>
export default {
    name: 'VueDadList',
    props: {
        'value':{
            type: Array,
            required: true,
        },
        'itemType': {
            type: String,
            default: '',
        },
        'allowedTypes': {
            type: Array,
            default: null,
        },
        'buttonTitle': {
            type: String,
            default: 'Add',
        },
        'isDraggable': {
            type: Boolean,
            default: true,
        },
        'useSlot': {
            type: Boolean,
            default: true,
        },
        'buttonType': {
            type: String,
            default: '',
        },
    },
    inject: ['$validator'],
    data: function() {
        return {
            dummyItem: {
                "id": 5,
                "label": "",
            },
            DaDList: true,
            lastOpenedItemId: null,
            hasDropped: false,
            hasDroppedExtern: false,
            droppedIndex: -1,
            listId: Vue.getUniqueId(),
            itemStates: {
                noDrag: {},
            },
        };
    },
    computed: {
        internalValue: {
            get() {
                this.value.forEach((item) => {
                    item.__listId = this.listId;
                });
                return this.value;
            },
            set(newValue) {
                newValue.forEach((item) => {
                    delete item.__listId;
                });
                this.$emit('input', newValue);
            },
        },
    },
    methods: {
        handleDrop: function(data) {
            const { index, item} = data;
            const external = item.__listId !== this.listId;
            if(external){
                const value = this.internalValue.slice();
                value.splice(index, 0, item);
                this.internalValue = value;
                this.hasDropped = false;
            } else {
                this.hasDropped = true;
                this.droppedIndex = index;
            }
        },
        handleMoved: function(data){
            const { index } = data;
            if(this.hasDropped){
                this.hasDropped = false;
                let to = this.droppedIndex;
                const from = index;
                if(from < to){
                    to--;
                }
                const value = this.internalValue.slice();
                //Swap: Delete element at index 'from' and insert on index 'to'.
                value.splice(to, 0, value.splice(from, 1)[0]);
                this.internalValue = value;
            } else {
                const value = this.internalValue.slice();
                value.splice(index, 1);
                this.internalValue = value;
            }
        },
        addItemEvent: function() {
            this.$emit("add-item");
        },
        clickItemEvent(item) {
            this.$emit("click-item", item);
        },
        setLastOpenedId: function(newId) {
            this.lastOpenedItemId = newId;
        },
        onItemDragStatusChanged({id, isDraggable}) {
            if(isDraggable){
                Vue.delete(this.itemStates.noDrag, id);
            } else {
                Vue.set(this.itemStates.noDrag, id, true);
            }
        },
        onItemDragStart: function( itemId ) {
            this.$emit('drag-started', itemId );
        },
    },
};
</script>
<style lang="scss">
.vddl-list {
    min-height: 24px;
    user-select: none;
}
.vddl-list, .vddl-draggable {
    position: relative;
}
.vddl-dragging {
    opacity: .7;
}
.vddl-placeholder{
    opacity: 0.4;
}

.vddl-dragging-source {
    display: none;
}
</style>
