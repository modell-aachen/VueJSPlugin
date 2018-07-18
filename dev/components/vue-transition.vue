<template>
    <transition :name="name">
        <slot />
    </transition>
</template>

<script>
export default {
    inject: ['$validator'],
    props: {
        name: {
            type: String
        }
    }
}
</script>

