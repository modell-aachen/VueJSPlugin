<template>
    <div
        :class="{'ma-switch': true, 'has-label': label || labelDummy, 'is-small': isSmall, 'has-badge': badge}">
        <label
            v-if="labelDummy && !label"
            class="input-label label-dummy">
            &nbsp;
        </label>
        <label
            v-if="label"
            class="input-label">
            {{ label }}
        </label>
        <div class="input-elements">
            <input
                :id="id"
                :name="name"
                :value="value"
                :disabled="isDisabled"
                :checked="state"
                :type="type"
                :class="{'switch-input': isSwitch}"
                @change="onChange">
            <label
                :class="{'switch-paddle': isSwitch}"
                :for="id || value"
                class="ma-switch-label">
                <span
                    v-if="!isSwitch"
                    class="grid-x">
                    <component
                        :is="$slots.description !== undefined || description !== undefined ? 'b' : 'span'"
                        class="cell auto">
                        <slot />
                    </component>
                    <div
                        v-if="badge"
                        class="cell shrink badge-container">
                        <div class="badge">
                            {{ badge }}
                        </div>
                    </div>
                </span>
                <span
                    v-if="!isSwitch && ($slots.description || description)"
                    class="grid-x ma-margin-top-small">
                    <template v-if="description">
                        {{ description }}
                    </template>
                    <slot
                        v-if="$slots.description"
                        name="description" />
                </span>
            </label><slot v-if="isSwitch" /><br>
        </div>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'modelValue',
        event: 'input',
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
        label: {
            type: String,
            default: undefined,
        },
        labelDummy: { // reserve space for the label, even if we have none
            type: Boolean,
            default: false,
        },
        isSmall: {
            type: Boolean,
            default: false,
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
            default: 'checkbox',
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
        },
    },
    watch: {
        checked(newValue) {
            if (newValue !== this.state) {
                this.toggle();
            }
        },
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
        },
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
@import '../../sass/qwiki/mixins.scss';

.ma-switch {
    &.has-label {
        margin-top: map-get($spacings, medium);
    }
    .input-label {
        @include input-label();
    }
    .ma-switch-label {
        width: 100%;
        margin-top: 0px;
    }
    .input-elements {
        min-height: rem(20px);
    }
    .badge-container {
        height: 20px;
        overflow: show;
    }
    &.is-small { // align with vue-input-text
        margin-top: 0px;
        .input-elements {
            min-height: rem(20px);

            label {
                margin-top: rem(6px);
            }
        }
    }
}
</style>
