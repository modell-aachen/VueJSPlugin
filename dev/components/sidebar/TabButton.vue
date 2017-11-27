<template>
  <button class="sidebar-tab-button" :class="{close: isCloseButton, active: isActiveTab}" :title="tooltip" @click="click">
  <i class="fa fa-2x" :class="icon"></i>
</button>
</template>

<script>
let globalTabs = [];
export default {
  name: 'sidebar-tab-button',
  props: ['icon', 'tooltip', 'type'],
  data: function() {
    return {
      active: false,
      tabs: globalTabs
    };
  },
  computed: {
    isCloseButton: function() {
      return this.type === 'close';
    },
    isActiveTab: function() {
      return this.active && !this.isCloseButton;
    }
  },
  methods: {
    click: function() {
      if (!this.isCloseButton) {
        this.tabs.forEach((tab) => tab.unset());
        this.set();
      }

      this.$emit('click');
    },
    set: function() {
      this.active = true;
    },
    unset: function() {
      this.active = false;
    }
  },
  created() {
    this.tabs.push(this);
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
