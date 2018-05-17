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
            let factorVertical = this.factorVertical === 'auto' ? 'auto' : this.factorVertical*8+"px";
            let factorHorizontal = this.factorHorizontal === 'auto' ? 'auto' : this.factorHorizontal*8+"px";

            return {
                height: factorVertical,
                width: factorHorizontal,
            };
        }
    }
};
</script>

<style lang="scss">
</style>
