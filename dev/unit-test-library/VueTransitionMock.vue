<template>
    <div>
        <slot />
    </div>
</template>

<script>
import VueTransition from '../components/vue-transition.vue';
export default {
    extends: VueTransition
};
</script>

