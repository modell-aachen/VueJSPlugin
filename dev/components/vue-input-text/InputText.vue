<template>
    <div
        :class="{'ma-failure': hasError, 'has-label': (label!=undefined)}"
        class="ma-input ma-input-group">
        <label
            v-if="label"
            class="input-label">{{ label }}
        </label>
        <div class="ma-input--wrapper">
            <i
                v-if="icon"
                :class="icon"
                class="ma-input-text-icon"
                aria-hidden="true"/>

            <input
                v-validate="validate"
                :name="name"
                v-model="data"
                :placeholder="placeholder"
                :class="{'ma-small': isSmall, 'ma-input-text-indent': (icon!=undefined)}"
                :disabled="isDisabled"
                :maxlength="maxLength"
                data-test="inputElement"
                type="text"
                @blur="$emit('blur')">

            <template v-if="hasError">
                <i
                    class="fas fa-exclamation-circle"
                    aria-hidden="true"/>
                <small>{{ definedErrorMessage }}</small>
            </template>

        </div>
    </div>
</template>

<script>
export default {
    props: {
        'label':{
            type: String,
            default: undefined
        },
        'name': {
            type: String,
            default: 'noname'
        },
        'validate': {
            type: String,
            default: ''
        },
        'placeholder':{
            type: String,
            default: undefined
        },
        'icon':{
            type: [String, Array],
            default: undefined
        },
        'isSmall':{
            type: Boolean,
            default: false
        },
        'isDisabled':{
            type: Boolean,
            default: false
        },
        'value':{
            type: String,
            default: ''
        },
        'maxLength':{
            type: Number,
            default: 524288,
        },
        'showError':{
            type: Boolean,
            default: false,
        },
        'errorMessage': {
            type: String,
            default: undefined,
        }
    },
    inject: ['$validator'],
    computed: {
        data: {
            get: function() {
                return this.value;
            },
            set: function(newValue) {
                this.$emit('input', newValue);
            }
        },
        hasError: function(){
            return this.validationErrors.has(this.name) || this.showError;
        },
        definedErrorMessage: function() {
            return this.validationErrors.first(this.name) || this.errorMessage;
        }
    },
    watch: {
        data: function(value){
            if( this.name ) {
                this.$validator.validate(this.name, value);
            }
        }
    },
    mounted() {
        if( this.validate.length > 0 && this.name.length<= 0) {
            window.console.warn("[vue-input-text] validation requires the name attribute to be set. Currently no validation is performed. Input label '" + this.label + "'");
        }
    }
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
@import '../../sass/qwiki/mixins.scss';
.ma-input.ma-input-group {
    .input-label {
        @include input-label();
    }

    .ma-input--wrapper {
        position: relative;
    }

    .ma-input-text-icon {
        position: absolute;
        left: 1px; // border-width
        pointer-events: none;
    }

    .ma-input-text-indent {
        text-indent: map-get($spacings, 'small') + 20px + 1px; // margin-left + icon-width + border-width
    }
}
</style>
