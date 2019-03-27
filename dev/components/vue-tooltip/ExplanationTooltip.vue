<template>
    <div
        :id="id"
        class="flatskin-wrapped">
        <v-popover
            :container="idSelector"
            placement="right"
            trigger="hover"
            popover-class="flatskin-wrapped proptest"
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
    data () {
        return {
            id: null,
            idSelector: null,
        };
    },
    mounted () {
        this.id = "popover" + this._uid;
        this.idSelector = "#popover" + this._uid;
    },
};
</script>

<style lang="scss">
</style>
