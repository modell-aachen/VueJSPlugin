<template>
    <div
        v-tooltip="{
            content: text,
            placement: 'right',
            html: false,
            classes: 'flatskin-wrapped'}"
        class="circle-bg-tooltip grid-x align-middle align-center">
        <i
            :class="icon"
            class="tooltip-icon fa-fw"
            aria-hidden="true"/>
    </div>
</template>

<script>
export default {
    props: {
        'text': {
            type: String,
            default: ''
        },
        'icon':{
            type: [String, Array],
            default: 'fa-sm fas fa-question'
        },
    },
};
</script>

<style lang="scss">
</style>
