<template>
    <a
        :disabled="isDisabled"
        :href="href"
        :class="[type, color, textAligment, {noMargins}]"
        class="button vue-button"
        @click="handleClick">
        <div
            v-if="icon"
            class="icon-wrapper">
            <i
                :class="icon"
                class="button-icon"
                aria-hidden="true" />
        </div>
        <span
            v-if="title && title.length"
            class="button-text">
            {{ title }}
        </span>
    </a>
</template>

<script>
export default {
    props: {
        'title':{
            type: String,
            default: '',
        },
        'href': {
            type: String,
            default: '',
        },
        'type':{
            type: String,
            default: '',
            validator: function(value) {
                let types = [
                    '',
                    'primary',
                    'ghost',
                    'delete',
                    'icon'];
                return types.includes(value);
            },
        },
        'onClick': {
            type: Function,
            default: undefined,
        },
        'color': {
            type: String,
            default: '',
            validator: function(value) {
                let colors = [
                    '',
                    'ma-warning-color',
                ];
                return colors.includes(value);
            },
        },
        'icon':{
            type: [String, Array],
            default: undefined,
        },
        'alignment': {
            type: String,
            default: 'center',
            validator: function(value) {
                let types = [
                    'center',
                    'left',
                    'right',
                ];
                return types.includes(value);
            },
        },
        'noMargins':{
            type: Boolean,
            default: false,
        },
        'isDisabled':{
            type: Boolean,
            default: false,
        },
    },
    data: function(){
        return { textAligment: 'text-' + this.alignment };
    },
    methods: {
        handleClick: function( event ) {
            if( this.isDisabled || this.href.length <= 0 ) {
                event.preventDefault();
            }
            if(!this.isDisabled && this.onClick){
                this.onClick();
            }
        },
    },
};
</script>

<style lang="scss">
.flatskin-wrapped .button.vue-button {
    &.noMargins {
        margin: 0;
    }
}
</style>
