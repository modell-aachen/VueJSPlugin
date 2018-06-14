<template>
    <div
        :class="{open}"
        class="dropdown v-select">
        <label v-if="label">{{ label }}</label>
        <div
            ref="input-root"
            :class="{multi: true, open: open}"
            class="dropdown-toggle multi"
            type="text"
            @click="toggleDropdown">
            <div
                class="input-area">
                <div
                    ref="selectedList"
                    class="selected-list">
                    <template v-for="(item,index) in internalSelectedItems">
                        <span
                            v-if="item.type === 'option'"
                            :key="item.id"
                            class="selected-tag option-item"
                            @click.stop="onSelectedOptionClick(index)">
                            <a>{{ item.label }}</a>
                        </span>
                        <span
                            v-else
                            :key="item.id"
                            class="text-item">
                            <a
                                class="text-placeholder">{{ item.value }}</a>
                            <input
                                ref="inputs"
                                v-model="item.value"
                                class="text-input"
                                type="text"
                                @keydown="onTextInput(index, $event)"
                                @click.stop="() => {}"
                                @focus="onItemFocus(index)"
                                @blur="onItemBlur">
                        </span>
                    </template>
                    <span
                        class="form-control__wrapper vertical-spacer">
                        <input
                            type="text"
                            class="form-control-multi">
                    </span>
                </div>
            </div>
        </div>
        <div
            v-show="open"
            ref="dropdown"
            class="dropdown-menu"
            style="max-height:40vh">
            <ul
                v-show="open"
                ref="dropdownMenu"
                class="dropdown-menu-list">
                <li
                    v-for="option in options"
                    ref="option-clickers"
                    :key="option.id"
                    class="list-item"
                    @mousedown.prevent="select(option)">
                    <a>
                        <span ref="option-labels">{{ option.label }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

</template>


<script>
const KEY_CODES = {
    "Backspace": 8,
    "Delete": 46,
    "ArrowLeft": 37,
    "ArrowRight": 39
};

export default {
    props: {
        value: {
            type: Array,
            default: () => []
        },
        label: {
            type: String,
            default: undefined
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            internalSelectedItems: this.toInternalValue([]),
            focusedItemIndex: null
        };
    },
    computed: {
        open() {
            return this.focusedItemIndex !== null;
        }
    },
    watch: {
        value: {
            handler(newValue) {
                const currentValue = this.toValue(this.internalSelectedItems);
                if(!Vue.isEqual(currentValue, newValue)){
                    this.internalSelectedItems = this.toInternalValue(newValue);
                }
            },
            deep: true,
            immediate: true
        },
        internalSelectedItems: {
            handler(newInternalValue) {
                const newValue = this.toValue(newInternalValue);
                this.$emit('input', newValue);
            },
            deep: true
        }
    },
    methods: {
        onSelectedOptionClick(index) {
            this.focusItem(index + 1);
        },
        onTextInput(index, event) {
            switch(event.keyCode) {
                case KEY_CODES.Backspace:
                case KEY_CODES.Delete:
                    this.onDeleteCurrentInput(index, event);
                    break;
                case KEY_CODES.ArrowLeft:
                case KEY_CODES.ArrowRight:
                    this.onKeyNavigation(index, event);
                    break;
            }
        },
        toInternalValue(value) {
            const internalValue = [];
            value.forEach((item) => {
                const currentInternalValueIndex = internalValue.length;
                if(currentInternalValueIndex % 2 === 0 && item.type !== 'text') {
                    internalValue.push(this.getInternalTextItem());
                }
                switch(item.type){
                    case "text":
                        const textItem = this.getInternalTextItem();
                        textItem.value = item.value;
                        internalValue.push(textItem);
                        break;
                    case "option":
                        internalValue.push({
                            type: "option",
                            id: item.id,
                            label: this.options.find(element => element.id === item.id).label
                        });
                        break;
                }
            });
            if(internalValue.length === 0){
                internalValue.unshift(this.getInternalTextItem());
            }
            if(internalValue[internalValue.length - 1].type !== "text") {
                internalValue.push(this.getInternalTextItem());
            }
            return internalValue;
        },
        toValue(internalValue) {
            const nonEmptyValues = internalValue.filter((item) => {
                if(item.type === "text" && !item.value){
                    return false;
                }
                return true;
            });
            return nonEmptyValues.map((item) => {
                switch(item.type) {
                    case "text":
                        return {
                            type: "text",
                            value: item.value
                        };
                    case "option": {
                        return {
                            type: "option",
                            id: item.id
                        };
                    }
                }
            });
        },
        onKeyNavigation(index, event) {
            const element = this.getTextItemRef(index);
            const item = this.internalSelectedItems[index];
            if(event.keyCode === KEY_CODES.ArrowLeft && index > 0 && element.selectionStart === 0) {
                const prevIndex = index - 2;
                const prevItem = this.internalSelectedItems[prevIndex];
                this.focusItem(prevIndex, prevItem.value.length);
                event.preventDefault();
            } else if(event.keyCode === KEY_CODES.ArrowRight && index < this.internalSelectedItems.length - 1 && element.selectionStart === item.value.length) {
                this.focusItem(index + 2);
                event.preventDefault();
            }
        },
        onItemBlur() {
            this.focusedItemIndex = null;
        },
        onItemFocus(index) {
            this.focusedItemIndex = index;
        },
        focusItem(index, cursorPosition = 0) {
            Vue.nextTick(() => {
                const itemRef = this.getTextItemRef(index);
                itemRef.focus();
                itemRef.setSelectionRange(cursorPosition, cursorPosition);
                this.focusedItemIndex = index;
            });
        },
        select(option) {
            let newSelectedIndex = null;
            let newCursorPosition = 0;
            const newOptionItem = {
                id: option.id,
                type: "option"
            };
            if(this.hasFocusOnStringStart(this.focusedItemIndex)) {
                this.internalSelectedItems.splice(this.focusedItemIndex, 0, this.getInternalTextItem(), newOptionItem);
                newSelectedIndex = this.focusedItemIndex + 2;
            } else if(this.hasFocusOnStringEnd(this.focusedItemIndex)) {
                this.internalSelectedItems.splice(this.focusedItemIndex + 1, 0, newOptionItem, this.getInternalTextItem());
                newSelectedIndex = this.focusedItemIndex + 2;
            } else {
                const splitItems = this.splitTextItem(this.focusedItemIndex);
                this.internalSelectedItems.splice(this.focusedItemIndex, 1, splitItems[0], newOptionItem, splitItems[1]);
                newSelectedIndex = this.focusedItemIndex + 2;
            }
            this.focusItem(newSelectedIndex, newCursorPosition);
        },
        splitTextItem(index) {
            const item = this.internalSelectedItems[index];
            const element = this.getTextItemRef(index);
            const splitPosition = element.selectionStart;
            return [{
                type: "text",
                value: item.value.substring(0, splitPosition)
            }, {
                type: "text",
                value: item.value.substring(splitPosition)
            }];
        },
        getTextItemRef(index) {
            index = Math.ceil(index / 2);
            return this.$refs["inputs"][index];
        },
        getInternalTextItem() {
            return {
                value: "",
                type: "text",
                id: Vue.getUniqueId()
            };
        },
        hasFocusOnStringStart(index) {
            const element = this.getTextItemRef(index);
            return element.selectionStart === 0;
        },
        hasFocusOnStringEnd(index) {
            const item = this.internalSelectedItems[index];
            const element = this.getTextItemRef(index);
            return (item.value.length === element.selectionStart);
        },

        toggleDropdown() {
            const lastItemIndex = this.internalSelectedItems.length - 1;
            const lastItem = this.internalSelectedItems[lastItemIndex];
            this.focusItem(lastItemIndex, lastItem.value.length);
        },
        onDeleteCurrentInput(index, event) {
            const item = this.internalSelectedItems[index];
            const input = this.getTextItemRef(index);
            if(index > 0 && input.selectionStart === 0 && event.keyCode === KEY_CODES.Backspace) {
                const prevItem = this.internalSelectedItems[index -2];
                const prevItemLength = prevItem.value.length;
                item.value = prevItem.value + item.value;
                this.internalSelectedItems.splice(index - 2, 2);
                this.focusItem(index - 2, prevItemLength);
                event.preventDefault();
            } else if(event.keyCode === KEY_CODES.Delete && input.selectionStart === item.value.length && this.internalSelectedItems[index + 1]) {
                const nextItem = this.internalSelectedItems[index + 2];
                const itemLength = item.value.length;
                item.value = item.value + nextItem.value;
                this.internalSelectedItems.splice(index + 1, 2);
                this.focusItem(index, itemLength);
                event.preventDefault();
            }
        }
    }
};
</script>

<style lang="scss">
$inputMinWidth: 2px;
$spacing: 3px;
.v-select {
    .option-item {
        padding: 2px 4px;
        background-color: #e5e8eb;
        border-radius: 4px;
        border: 1px solid #b0c0c4;
        height: 20px;
        margin-top: 10px;
    }
    .text-item {
        height: 20px;
        margin: 0 $spacing;
        margin-top: 10px;
        position: relative;
        padding: 0 $inputMinWidth;
    }
    .text-placeholder {
        visibility: hidden;
        white-space: pre;
    }
    .text-input {
        position: absolute;
        width: 100%;
        left: $inputMinWidth;
        top: -2px;
        height: auto;
        padding: 0;
        margin: 0;
    }
    .vertical-spacer {
        visibility: hidden;
        width: 0px;
    }
}
</style>

