<template>
    <transition name="fade">
        <div
            v-show="isLoading"
            class="vue-fullscreen-loader">
            <vue-spinner/>
        </div>
    </transition>
</template>

<script>
export default {
    name: "VueFullscreenLoader",
    computed: {
        isLoading() {
            if(this.$store.state.vueLoaderStore) {
                return this.$store.state.vueLoaderStore.showLoader;
            }
            return false;
        }
    },
    created: function() {
        this.$mount();
    },
    mounted: function() {
        document.body.appendChild(this.$el);
    },
};
</script>

<style lang="scss">
.vue-fullscreen-loader {
    position: fixed;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: white;
    opacity: .7;
    .loader__wrapper{
        height: 100%;
        .loader{
            top: 50%;
        }
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
