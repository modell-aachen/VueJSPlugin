<template>
    <div class="circle-bg-tooltip grid-x align-middle align-center">
        <i
            v-tooltip="{
                content: text,
                placement: 'right',
                html: false,
                classes: 'info-tooltip'}"
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
