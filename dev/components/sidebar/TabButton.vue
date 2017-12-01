<template>
  <button class="sidebar-tab-button" :class="{close: isCloseButton, active: isActive}" :title="tooltip" @click="click">
  <i class="fa fa-2x" :class="icon"></i>
</button>
</template>

<script>
export default {
  name: 'sidebar-tab-button',
  props: ['icon', 'tooltip', 'type', 'isActive'],
  computed: {
    isCloseButton: function() {
      return this.type === 'close';
    }
  },
  methods: {
    click: function() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss">
@import './sass/settings';

.sidebar-container {
  .sidebar-tab-button {
    background-color: transparent;
    border-radius: 0;
    border-width: 0;
    color: $dark-gray;
    cursor: pointer;
    height: calc(#{$sidebar-width} - #{$sidebar-content-width} - #{$sidebar-highlight-border-width});
    width: calc(#{$sidebar-width} - #{$sidebar-content-width} - #{$sidebar-highlight-border-width});
    transition: background-color .3s ease-in;

    &:hover, &:active {
      background-color: darken($gray, 5%);
    }
    &.active {
      background-color: $dark-gray;
      color: $white;
    }

    &.close {
      border-bottom: $sidebar-header-bottom-border solid $light-gray;
      height: $sidebar-header-height;
    }
  }
}

</style>
