<template>
    <div class="grid-x ma-text-block">
        <div
            :class="[{'large-8 medium-12': !isFullWidth}, textClass]"
            class="cell">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isFullWidth: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'primary',
            validator: function(value) {
                let types = [
                    'primary',
                    'secondary',
                    'disabled',
                    'akzent'];
                return types.includes(value);
            }
        }
    },
    computed: {
        textClass() {
            return `ma-${this.type}-text`;
        }
    },
};
</script>

