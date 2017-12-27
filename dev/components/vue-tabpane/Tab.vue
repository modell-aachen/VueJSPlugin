<template>
    <div class="vue-tab" :class="{current}">
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
      current: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss">
.vue-tab {
    display: none;
    &.current {
        display: inherit;
    }
}
</style>
