<template>
    <div
        class="flatskin-wrapped">
        <v-popover
            :placement="placement"
            :container="false"
            trigger="hover"
            popover-class="flatskin-wrapped"
            popover-wrapper-class="">
            <i
                :class="icon"
                class="tooltip-icon fa-fw"
                aria-hidden="true" />
            <template slot="popover">
                {{ text }}
            </template>
        </v-popover>
    </div>
</template>

<script>
export default {
    props: {
        'text': {
            type: String,
            default: '',
        },
        'icon':{
            type: [String, Array],
            default: 'far fa-question-circle',
        },
        'placement':{
            type: String,
            default: 'right',
        },
    },
};
</script>

<style lang="scss">
</style>
