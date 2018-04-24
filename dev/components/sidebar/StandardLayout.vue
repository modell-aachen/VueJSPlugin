<template>
  <div class="siderbar grid-y">
    <div class="sidebar-header grid-x">
      <slot name="header"/>
    </div>
    <div class="sidebar-content grid-x">
      <slot name="content"/>
    </div>
    <div class="sidebar-actions grid-x">
      <slot name="actions"/>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['$validator']
};
</script>

<style lang="scss">
@import './sass/settings';

.sidebar-tab-contents {

  .sidebar-header, .sidebar-content, .sidebar-actions{
    padding: $sidebar-content-padding;
  }

  .sidebar-content h2 {
    margin-top: .5rem;
    margin-bottom: 1.5rem;
  }

  .sidebar-content h3 {
    margin-bottom: .5rem;
  }

  .sidebar-header{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    max-height: $sidebar-header-height;
    min-height: $sidebar-header-height;
    width: 100%;
    border-bottom: $sidebar-header-bottom-border solid $light-gray;
  }
}
</style>
