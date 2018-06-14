<template>
    <div
        :style="styleObject"
        class="ma-spacer" />
</template>

<script>
export default {
    props: {
        'factorVertical':{
            type: String,
            default: '1'
        },
        'factorHorizontal': {
            type: String,
            default: '1'
        }
    },
    computed: {
        styleObject: function () {
            let factorVertical = this.getStyleValue(this.factorVertical);
            let factorHorizontal = this.getStyleValue(this.factorHorizontal);
            return {
                height: factorVertical,
                width: factorHorizontal,
            };
        }
    },
    methods: {
        getStyleValue: function (value){
            if ( value === 'full' ) {
                return '100%';
            } else if ( value === 'auto' ) {
                return 'auto';
            }
            return value*8+"px";
        }
    }
};
</script>

<style lang="scss">
</style>
