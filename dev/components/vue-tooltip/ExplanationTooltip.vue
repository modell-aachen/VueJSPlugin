<template>
    <div
        :id="id"
        class="flatskin-wrapped">
        <v-popover
            :container="false"
            placement="right"
            trigger="hover"
            popover-class="flatskin-wrapped"
            popover-wrapper-class="">
            <i
                :class="icon"
                class="tooltip-icon fa-fw"
                aria-hidden="true"/>
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
            default: ''
        },
        'icon':{
            type: [String, Array],
            default: 'far fa-question-circle'
        },
    },
};
</script>

<style lang="scss">
</style>
