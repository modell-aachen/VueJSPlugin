<template>
    <div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: true
        },
        duration: {
            type: Number,
            default: 500
        }
    }
};
</script>
