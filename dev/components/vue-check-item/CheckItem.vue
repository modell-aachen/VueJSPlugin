<template>
    <div class="ma-switch">
        <input
            :id="id"
            :name="name"
            :value="value"
            :disabled="isDisabled"
            :checked="state"
            :type="type"
            :class="{'switch-input': isSwitch}"
            @change="onChange"
        >
        <label
            :class="{'switch-paddle': isSwitch}"
            :for="id || value">
            <span
                v-if="!isSwitch"
                class="grid-x"
            >
                <component
                    :is="$slots.description !== undefined || description !== undefined ? 'b' : 'span'"
                    class="cell auto"
                >
                    <slot/>
                </component>
                <span
                    v-if="badge"
                    class="cell shrink badge"
                >
                    {{ badge }}
                </span>
            </span>
            <span
                v-if="!isSwitch && ($slots.description || description)"
                class="grid-x"
            >
                <template v-if="description">{{ description }}</template>
                <slot
                    v-if="$slots.description"
                    name="description"
                />
            </span>
        </label><slot v-if="isSwitch"/><br>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'modelValue',
        event: 'input'
    },
    props: {
        id: {
            type: String,
            default: function () {
                return 'checkbox-id-' + Vue.getUniqueId();
            },
        },
        name: {
            type: String,
            default: null,
        },
        value: {
            type: String,
            default: null,
        },
        modelValue: {
            type: [Array, Object, String, Boolean],
            default: undefined,
        },
        checked: {
            type: Boolean,
            default: false,
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        isSwitch: {
            type: Boolean,
            default: false,
        },
        type:{
            type: String,
            default: 'checkbox'
        },
        description: {
            type: String,
            default: undefined,
        },
        badge: {
            type: String,
            default: undefined,
        },
    },
    computed: {
        state: function() {
            if (this.modelValue === undefined) {
                return this.checked;
            }
            if (Array.isArray(this.modelValue)) {
                return this.modelValue.indexOf(this.value) > -1;
            }
            if(this.type === 'radio') {
                return this.modelValue === this.value;
            } else {
                return !!this.modelValue;
            }
        }
    },
    watch: {
        checked(newValue) {
            if (newValue !== this.state) {
                this.toggle();
            }
        }
    },
    mounted() {
        if (this.checked && !this.state) {
            this.toggle();
        }
    },
    methods: {
        onChange() {
            this.toggle();
        },
        toggle() {
            let value;
            if (Array.isArray(this.modelValue)) {
                value = this.modelValue.slice(0);
                if (this.state) {
                    value.splice(value.indexOf(this.value), 1);
                } else {
                    value.push(this.value);
                }
            } else {
                if(this.type === 'radio'){
                    value = this.state ? '': this.value;
                } else {
                    value = !this.state;
                }
            }
            this.$emit('input', value);
        }
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';

.ma-switch {
    .badge {
        background-color: $ma-light-grey;
        border-radius: $ma-border-radius;
        border: 1px solid #B0C0C4;
        color: $ma-secondary-text;
    }
    & > label {
        width: 100%;
    }
}
</style>
