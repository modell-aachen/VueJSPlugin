<template>
  <div
    class="vue-tab"
    v-show="current">
    <div class="vue-tab-contents">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueTab',
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
    }
  },
  data: function() {
    return {
      current: false
    };
  }
};
</script>

<style lang="scss">
.vue-tab {
    display: inherit;
}
</style>
