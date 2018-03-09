<template>
    <div class="vue-tab" v-show="visibleState">
        <div class="vue-tab-contents">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'vue-tab',
    props: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        default: function() {
          return this.$foswiki.getUniqueID();
        },
      },
    },
    data() {
      return {
        visibleState: false,
      };
    },
    methods: {
      setVisible(isVisible) {
        this.visibleState = isVisible;
      },
      isVisible() { // needs to be a 'method', so we can call it from outside (TabPane)
        return this.visibleState;
      },
    },
  };
</script>

<style lang="scss">
.vue-tab {
    display: inherit;
}
</style>
