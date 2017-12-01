<template>
<div>
  <div class="sidebar-header">
    <slot name="header"></slot>
  </div>
  <div class="sidebar-content">
   <slot name="content"></slot>
  </div>
</div>
</template>

<style lang="scss">
@import './sass/settings';

.sidebar-tab-contents {
  .sidebar-header{
    padding: $sidebar-content-padding;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    max-height: $sidebar-header-height;
    min-height: $sidebar-header-height;
    width: 100%;
    border-bottom: $sidebar-header-bottom-border solid $light-gray;
  }

  .sidebar-content{
    padding: $sidebar-content-padding;
  }
}
</style>
