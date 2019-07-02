<template>
    <div>
        <draggable
            v-model="internalValue"
            :group="allowedGroup"
            class="dad-list-drop-area"
            :disabled="!isDraggable"
            handle=".ma-draggable"
            :animation="1">
            <template v-for="(item, index) in internalValue">
                <div :key="item.id">
                    <slot
                        v-if="useSlot"
                        :item="item"
                        :index="index"
                        :set-last-opened-id="setLastOpenedId"
                        :last-opened-item-id="lastOpenedItemId" />
                    <div
                        :is="itemType"
                        v-else
                        :item="item"
                        :index="index"
                        :last-opened-item-id="lastOpenedItemId"
                        @click.native="$emit('click-item', item)" />
                </div>
            </template>
        </draggable>
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
import draggable from 'vuedraggable';
export default {
    name: 'DadList',
    components: {
        draggable,
    },
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
            lastOpenedItemId: null,
        };
    },
    computed: {
        allowedGroup() {
            return this.allowedTypes.length > 0 ? this.allowedTypes[0] : '';
        },
        internalValue: {
            get() {
                return this.value;
            },
            set(newValue) {
                this.$emit('input', newValue);
            },
        },
    },
    methods: {
        addItemEvent: function() {
            this.$emit("add-item");
        },
        setLastOpenedId: function(newId) {
            this.lastOpenedItemId = newId;
        },
    },
};
</script>
<style scoped lang="scss">
.dad-list-drop-area {
    min-height: 24px;
    user-select: none;
}
</style>
