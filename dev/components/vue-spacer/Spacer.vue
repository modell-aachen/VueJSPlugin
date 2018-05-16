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
    data() {
        let factorVertical = this.factorVertical === 'auto' ? 'auto' : this.factorVertical*8+"px";
        let factorHorizontal = this.factorHorizontal === 'auto' ? 'auto' : this.factorHorizontal*8+"px";

        let styleObject = {
            height: factorVertical,
            width: factorHorizontal,
        };
        return {
            styleObject
        };
    }
};
</script>

<style lang="scss">
</style>
