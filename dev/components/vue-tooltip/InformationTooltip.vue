<template>
    <div class="flatskin-wrapped">
        <v-popover
            placement="right"
            trigger="hover"
            popover-class="flatskin-wrapped"
            popover-wrapper-class="">
            <div class="tooltip-description-text grid-x align-middle align-center">
                {{ text }}
            </div>
            <template slot="popover">
                <slot />
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
            default: 'fa-sm fas fa-question'
        },
    },
};
</script>

<style lang="scss">
@import '../../sass/settings.scss';
.tooltip-description-text {
    font-size: 12px;
    font-weight: 600;
    color: $ma-secondary-text;
    text-decoration: underline;
}
</style>
