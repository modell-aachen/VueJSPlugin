<template>
    <span>
        <vue-input-real-number
            :value="internalValue"
            :label="label"
            :name="necessaryNameForValidate"
            :validate="validate"
            :placeholder="placeholder"
            :icon="icon"
            :is-small="isSmall"
            :is-disabled="isDisabled"
            :max-length="maxLength"
            :show-error="showError"
            :error-message="errorMessage"
            @input="input" />

        <input
            :name="name"
            :value="internalValue"
            :class="{foswikiInputField: true, foswikiMandatory: isMandatory}"
            type="hidden">
    </span>
</template>

<script>

import InputRealNumber from './InputRealNumber';

export default {
    props: Object.assign(
        {
            isMandatory: {
                type: Boolean,
                default: false,
            },
        },
        InputRealNumber.props,
    ),
    data() {
        return {
            internalValue: this.value,
        };
    },
    computed: {
        necessaryNameForValidate(){
            return `${this.name}NumberInput`;
        },
    },
    methods: {
        input(value) {
            this.internalValue = value;
        },
    },
};
</script>

<style lang="scss">
</style>


